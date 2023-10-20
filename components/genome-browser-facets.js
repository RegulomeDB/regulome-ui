import React from "react";
import PropTypes from "prop-types";
import { sanitizedString } from "../lib/general";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Button } from "./form-elements";
import _ from "lodash";

// Define facets parameters
const facetParameters = [
  {
    type: "file_format",
    title: "File format",
    typeahead: false,
  },
  {
    type: "organ",
    title: "Organ / cell type",
    typeahead: true,
  },
  {
    type: "biosample",
    title: "Biosample",
    typeahead: true,
  },
  {
    type: "assay",
    title: "Method",
    typeahead: false,
  },
  {
    type: "target",
    title: "Target",
    typeahead: true,
  },
];

export class GenomeBrowserFacets extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedFacets: [],
      unsanitizedSearchTerms: {},
    };
    this.addGenomeFilter = this.addGenomeFilter.bind(this);
    this.toggleFacetDisplay = this.toggleFacetDisplay.bind(this);
    this.clearGenomeFilters = this.clearGenomeFilters.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.setState({ selectedFacets: this.props.selectedFilters });
  }

  addGenomeFilter(item, category) {
    const itemFacet = `${item}AND${category}`;
    if (this.state.selectedFacets.includes(itemFacet)) {
      this.setState(
        (prevState) => ({
          selectedFacets: prevState.selectedFacets.filter(
            (facet) => facet !== itemFacet
          ),
        }),
        () => {
          this.props.handleFacetList(this.state.selectedFacets);
        }
      );
    } else {
      this.setState(
        (prevState) => ({
          selectedFacets: [...prevState.selectedFacets, itemFacet],
        }),
        () => {
          this.props.handleFacetList(this.state.selectedFacets);
        }
      );
    }
  }

  clearGenomeFilters() {
    this.setState({ selectedFacets: [] }, () => {
      this.props.handleFacetList(this.state.selectedFacets);
    });
  }

  toggleFacetDisplay() {
    this.setState((prevState) => ({
      facetDisplay: !prevState.facetDisplay,
    }));
  }

  handleSearch(e, typeaheadIdentifier) {
    const targetValue = e.target.value;
    this.setState((prevState) => {
      const unsanitizedSearchTerms = { ...prevState.unsanitizedSearchTerms };
      unsanitizedSearchTerms[typeaheadIdentifier] = targetValue;
      return {
        unsanitizedSearchTerms,
      };
    });
  }

  render() {
    // Generate sanitized search terms
    const searchTerms = {};
    Object.keys(this.state.unsanitizedSearchTerms).forEach((facet) => {
      searchTerms[facet] = String(
        sanitizedString(this.state.unsanitizedSearchTerms[facet])
      );
    });
    // Create facet object filtered by appropriate search terms
    const facetObject = createFacets(
      this.props.files,
      this.props.filteredFiles,
      searchTerms,
      this.state.selectedFacets
    );

    return (
      <React.Fragment>
        {this.state.selectedFacets.length > 0 ? (
          <React.Fragment>
            <div className="flex flex-wrap space-x-1 mb-4">
              <span>Selected filters:</span>
              {this.state.selectedFacets.map((f) => {
                const fsplit = f.split("AND");
                return (
                  <FilterButton
                    key={f}
                    buttonLabel={fsplit[0]}
                    facetLabel={fsplit[1]}
                    facetKey={f}
                    addGenomeFilter={this.addGenomeFilter}
                  />
                );
              })}
              <button
                className="flex"
                onClick={() => this.clearGenomeFilters()}
              >
                <XCircleIcon className="h5 w-5" />
                Clear all filters
              </button>
            </div>
            {this.props.filteredFiles.length === 0 ? (
              <div>
                No files match the selected filters. Try different filters to
                visualize results.
              </div>
            ) : null}
          </React.Fragment>
        ) : (
          <div className="mb-4">
            To select a filter, make a selection from &quot;Refine your
            search&quot; below.
          </div>
        )}
        <Button className="flex mb-1" onClick={this.toggleFacetDisplay}>
          {this.state.facetDisplay ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
          <span>Refine your search</span>
        </Button>
        {this.state.facetDisplay ? (
          <div className="grid grid-cols-5 border bg-gray-100 rounded-md gap-2 mb-4">
            {facetParameters.map((facet, facetIndex) => {
              if (facet.typeahead) {
                return (
                  <Facet
                    typeahead
                    key={facetIndex}
                    facetTitle={facet.title}
                    facetName={facet.type}
                    facetArray={facetObject[facet.type]}
                    handleSearch={this.handleSearch}
                    addGenomeFilter={this.addGenomeFilter}
                    selectedFacets={this.state.selectedFacets}
                    unsanitizedSearchTerm={
                      this.state.unsanitizedSearchTerms[facet.type]
                    }
                  />
                );
              }
              return (
                <Facet
                  typeahead={false}
                  key={facetIndex}
                  facetTitle={facet.title}
                  facetName={facet.type}
                  facetArray={facetObject[facet.type]}
                  addGenomeFilter={this.addGenomeFilter}
                  selectedFacets={this.state.selectedFacets}
                />
              );
            })}
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

GenomeBrowserFacets.propTypes = {
  files: PropTypes.array.isRequired,
  handleFacetList: PropTypes.func.isRequired,
  filteredFiles: PropTypes.array.isRequired,
  selectedFilters: PropTypes.array.isRequired,
};

// Generate facets for the genome browser view
export function createFacets(
  files,
  filteredFiles,
  searchTerms,
  selectedFilters
) {
  // initialize facet object
  const facetObject = {};
  facetParameters.forEach((facet) => {
    facetObject[facet.type] = [];
  });

  // compile term names for each facet from possible results
  files.forEach((file) => {
    facetParameters.forEach((param) => {
      const facet = param.type;
      // generating facets based on file parameters
      // for every facet except organ, each file matches exactly 1 facet term
      // for the organ facet, each file can have multiple organ slims and we are listing them individually
      // so each file can match multiple organ facet terms whereas for other facets, each file matches exactly 1 term
      // we will probably keep it but we are not sure if it is confusing (the counts don't add up to the number of results for the organ facet) so this may change in a future update
      let slims = [];
      if (facet === "organ" && file[facet] && file[facet].indexOf(",") > -1) {
        slims = file[facet].split(", ");
      } else if (facet === "organ_slims" && file[facet]) {
        slims = [...file[facet]];
      } else if (file[facet] && facet !== "organ") {
        slims = [file[facet]];
      }
      slims.forEach((slim) => {
        // if the facet has a typeahead, check that term matches typed search, if so, add if the term is not already present in facet list
        if (searchTerms[facet]) {
          if (
            searchTerms[facet] === "" ||
            sanitizedString(slim).match(searchTerms[facet])
          ) {
            if (!facetObject[facet][slim]) {
              facetObject[facet][slim] = 0;
            }
          }
          // if the file has a term, add term to facet object if it does not exist yet
        } else if (!facetObject[facet][slim]) {
          facetObject[facet][slim] = 0;
        }
      });
    });
  });

  Object.keys(facetObject).forEach((f) => {
    Object.keys(facetObject[f]).forEach((p) => {
      facetObject[f][p] = lookupFilterCount(
        p,
        f,
        selectedFilters,
        files,
        filteredFiles
      );
    });
  });

  const newFacetObject = {};
  // sort facet term names by counts with zeros at the end
  facetParameters.forEach((facet) => {
    newFacetObject[facet.type] = placeZerosAtEnd(facetObject[facet.type]);
  });
  return newFacetObject;
}

export function Facet(props) {
  const {
    typeahead,
    facetTitle,
    facetName,
    facetArray,
    addGenomeFilter,
    selectedFacets,
    handleSearch,
    unsanitizedSearchTerm,
  } = props;
  return (
    <div className="ml-2">
      <h4 className="text-left underline">{facetTitle}</h4>
      {typeahead ? (
        <div className="flex" role="search">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <div>
            <input
              style={{
                "border-radius": "5px",
                padding: "6px 2px 2px",
                width: "100%",
                "font-size": "0.9rem",
              }}
              type="search"
              aria-label={`Search to filter list of terms for ${facetName} facet`}
              placeholder="Search"
              value={unsanitizedSearchTerm}
              onChange={(e) => handleSearch(e, facetName)}
              name={`Search ${facetName} facet`}
            />
          </div>
        </div>
      ) : null}
      <div className="overflow-y-auto h-80">
        <div className="grid">
          {Object.keys(facetArray).map((d) => {
            if (d === "") {
              // eslint-disable-next-line react/jsx-key
              return <hr />;
            }
            return (
              <FacetButton
                selectedFacets={selectedFacets}
                buttonLabel={`${d} (${facetArray[d]})`}
                buttonName={d}
                facetLabel={facetName}
                addGenomeFilter={addGenomeFilter}
                key={d}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

Facet.propTypes = {
  typeahead: PropTypes.bool.isRequired,
  facetTitle: PropTypes.string.isRequired,
  facetName: PropTypes.string.isRequired,
  facetArray: PropTypes.object.isRequired,
  addGenomeFilter: PropTypes.func.isRequired,
  selectedFacets: PropTypes.array.isRequired,
  handleSearch: PropTypes.func,
  unsanitizedSearchTerm: PropTypes.string,
};

class FacetButton extends React.Component {
  constructor() {
    super();
    this._addGenomeFilter = this._addGenomeFilter.bind(this);
  }

  _addGenomeFilter() {
    this.props.addGenomeFilter(this.props.buttonName, this.props.facetLabel);
  }

  render() {
    const { buttonLabel, buttonName, selectedFacets, facetLabel } = this.props;
    const isDisabled =
      buttonLabel.indexOf("(0)") > -1 &&
      !selectedFacets.includes(`${buttonName}AND${facetLabel}`);
    const isSelected = selectedFacets.includes(`${buttonName}AND${facetLabel}`);
    const textColor = isDisabled ? "text-gray-400" : "hover:bg-gray-200";
    const borderStyle = isSelected ? "border-solid border-2 border-brand" : "";
    return (
      <button
        className={`text-left ${textColor} ${borderStyle}`}
        onClick={this._addGenomeFilter}
        disabled={isDisabled}
      >
        {buttonLabel}
      </button>
    );
  }
}

FacetButton.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  facetLabel: PropTypes.string.isRequired,
  selectedFacets: PropTypes.array.isRequired,
  addGenomeFilter: PropTypes.func.isRequired,
};

class FilterButton extends React.Component {
  constructor() {
    super();
    this._addGenomeFilter = this._addGenomeFilter.bind(this);
  }

  _addGenomeFilter() {
    this.props.addGenomeFilter(this.props.buttonLabel, this.props.facetLabel);
  }

  render() {
    return (
      <button
        className="flex"
        onClick={this._addGenomeFilter}
        key={this.props.facetKey}
      >
        <XCircleIcon className="h-5 w-5" />
        {this.props.buttonLabel}
      </button>
    );
  }
}

FilterButton.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  facetLabel: PropTypes.string.isRequired,
  facetKey: PropTypes.string.isRequired,
  addGenomeFilter: PropTypes.func.isRequired,
};

// Compute how many results would correspond to a facet term given current filter selections
function lookupFilterCount(
  filter,
  category,
  selectedFacets,
  files,
  filteredFiles
) {
  const fakeFilter = `${filter}AND${category}`;
  // for filters that are not selected, we want to display how many new results would be added if that filter were selected
  if (!selectedFacets.includes(fakeFilter)) {
    // if we add this filter to our selected filters, we need to know how many results there will be
    const fakeFacets = [...selectedFacets, fakeFilter];
    const fakeFilteredFiles = filterByAllSelectedFilters(files, fakeFacets);
    // if a filter has already been selected in this category, we do not want to include results for those in our count
    if (selectedFacets.filter((d) => d.includes(category)).length > 0) {
      if (category === "organ") {
        const alreadyMatchingFiles = filterByOneFilter(
          filteredFiles,
          fakeFilter
        );
        return (
          fakeFilteredFiles.length -
          filteredFiles.length +
          alreadyMatchingFiles.length
        );
      }
      return fakeFilteredFiles.length - filteredFiles.length;
    }
    return fakeFilteredFiles.length;
  }
  // for filters that are already selected, we want to display how many results that are displayed match this filter
  const matchingFiles = filterByOneFilter(filteredFiles, fakeFilter);
  return matchingFiles.length;
}

// Compute how many results correspond to one filter
function filterByOneFilter(files, facet) {
  const facetFilter = facet.split("AND")[0];
  const facetName = facet.split("AND")[1];
  let newFiles;
  if (facetName === "organ") {
    newFiles = files.filter((d) => {
      if (d[facetName] && d[facetName].indexOf(",") > -1) {
        return d[facetName].split(", ").some((f) => facetFilter.includes(f));
      }
      return null;
    });
    // for non-organ facets, just check if the term matches the facet
  } else {
    newFiles = files.filter((d) => facetFilter === d[facetName]);
  }
  return newFiles;
}

// Arrange facet entries for genome browser view
// Entries with 0 corresponding results are separated from results with results
// Entries in each group are sorted, and then the groups are re-combined
function placeZerosAtEnd(unorderedObject) {
  const entriesWithResults = _.pickBy(unorderedObject, function (value) {
    return value > 0;
  });
  const entriesWithoutResults = _.pickBy(unorderedObject, function (value) {
    return value === 0;
  });

  const sortedEntriesWithResults = Object.keys(entriesWithResults)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .reduce((obj, key) => {
      obj[key] = entriesWithResults[key];
      return obj;
    }, {});

  const sortedEntriesWithoutResults = Object.keys(entriesWithoutResults)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .reduce((obj, key) => {
      obj[key] = entriesWithoutResults[key];
      return obj;
    }, {});

  return { ...sortedEntriesWithResults, ...sortedEntriesWithoutResults };
}

// Handles filter selections for genome browser filters
// Genome browser filters have the format "B cellANDorgan" where "B cell" is the term and "organ" is the facet
export function filterByAllSelectedFilters(files, facets) {
  let newFiles = files;
  facetParameters.forEach((param) => {
    const facetName = param.type;
    const facetFilters = facets
      .filter((d) => d.includes(`AND${facetName}`))
      .map((d) => d.split("AND")[0]);
    if (facetFilters.length > 0) {
      // for organ facet, need to check if any of the listed organ terms match any of the organ filters
      if (facetName === "organ") {
        newFiles = newFiles.filter((d) => {
          if (d[facetName] && d[facetName].indexOf(",") > -1) {
            return d[facetName]
              .split(", ")
              .some((f) => facetFilters.includes(f));
          }
          return null;
        });
        // for non-organ facets, just check if the term matches any of the facet filters
      } else {
        newFiles = newFiles.filter((d) => facetFilters.includes(d[facetName]));
      }
    }
  });
  return newFiles;
}
