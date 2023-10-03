import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataAreaTitle, DataPanel } from "./data-area";
import ChromatinTable from "./chromatin-table";
import { BodyMapThumbnailAndModal } from "./body-map";
import ChromatinStateFacets from "./chromatin-state-facets";
import {
  ASSOCIATED_ORGAN_MAP,
  COMPLETE_CELLS_LIST_GRCH38,
  COMPLETE_CELLS_LIST_HG19,
  COMPLETE_ORGAN_LIST_GRCH38,
  COMPLETE_ORGAN_LIST_HG19,
  filterDataByStateAndOrgan,
  getBiosampleFacets,
  getOrganFacets,
  getOrgansByStates,
  getStateFacets,
  getStatesbyOrgans,
} from "../lib/chromatin-data";
import ChromatinBiosampleFacets from "./chromatin-biosample-facets";

// Display selected filters and allow user to de-select them
function Selections({ filters, clearFilterFunc }) {
  return (
    <div className="selections">
      <span className="selections-hed">Selected filters:</span>
      {filters.map((f) => {
        let label = f;
        // if (filterType === 'biosample') {
        //     label = keyArray.find(k => sanitizedString(k) === f);
        // } else if (filterType === 'state') {
        //     label = keyArray.find(k => (!isLetter(k[0]) ? (classString(sanitizedString(k)) === f) : (sanitizedString(k) === f)));
        // }
        let clearInput = f;
        // if (filterType === 'biosample') {
        //     clearInput = sanitizedString(f);
        // } else if (filterType === 'chromatin') {
        //     clearInput = classString(sanitizedString(f));
        // }
        return (
          <button
            key={`${f}-selected-filter`}
            onClick={() => clearFilterFunc(clearInput)}
          >
            <i className="icon icon-times-circle" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

Selections.propTypes = {
  filters: PropTypes.array.isRequired,
  filterType: PropTypes.string.isRequired, // filterType can be "bodymap", "biosample", or "state"
  clearFilterFunc: PropTypes.func.isRequired,
  keyArray: PropTypes.array,
};

/**
 * This is the view for display chromatin state data for a variant.
 */
export function ChromatinView({ data, assembly }) {
  const [showChromatinData, setShowChromatinData] = useState(false);
  const [organFilters, setOrganFilters] = useState([]);
  const [stateFilters, setStateFilters] = useState([]);
  const [biosampleFilters, setBiosampleFilters] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const router = useRouter();
  useEffect(() => {
    const isQTL = router.asPath.endsWith(`#!chromatin`);
    setShowChromatinData(isQTL);
  }, [router]);

  const stateFacets = getStateFacets(data, assembly);
  const organFacets = getOrganFacets(data, assembly);
  const biosampleFacet = getBiosampleFacets(data);
  const [displayedStateFacet, setDisplayedStateFacet] = useState(stateFacets);
  const organList =
    assembly === "hg19" ? COMPLETE_ORGAN_LIST_HG19 : COMPLETE_ORGAN_LIST_GRCH38;
  const cellList =
    assembly === "hg19" ? COMPLETE_CELLS_LIST_HG19 : COMPLETE_CELLS_LIST_GRCH38;
  const [enabledBodyMapFilters, setEnabledBodyMapFilters] = useState(
    organList.concat(cellList)
  );

  function handleClickOrgan(organ) {
    let filters = organFilters;
    if (filters.includes(organ)) {
      if (organ in ASSOCIATED_ORGAN_MAP) {
        ASSOCIATED_ORGAN_MAP[organ].forEach((element) => {
          filters = _.without(filters, element);
        });
      }
      filters = _.without(filters, organ);
    } else {
      filters.push(organ);
      if (organ in ASSOCIATED_ORGAN_MAP) {
        ASSOCIATED_ORGAN_MAP[organ].forEach((element) => {
          filters.push(element);
        });
      }
    }
    if (filters.length === 0) {
      setDisplayedStateFacet(stateFacets);
    } else {
      setDisplayedStateFacet(getStatesbyOrgans(filters, data, assembly));
    }
    setOrganFilters(filters);
    setFilteredData(filterDataByStateAndOrgan(data, stateFilters, filters));
  }

  function handleClickState(d) {
    let filters = stateFilters;
    if (filters.includes(d)) {
      filters = _.without(filters, d);
    } else {
      filters.push(d);
    }
    if (filters.length === 0) {
      setEnabledBodyMapFilters(organList);
    } else {
      setEnabledBodyMapFilters(getOrgansByStates(filters, data, assembly));
    }
    setStateFilters(filters);
    setFilteredData(filterDataByStateAndOrgan(data, filters, organFilters));
  }

  function handleClickBiosample(biosample) {
    alert(biosample);
  }

  return (
    showChromatinData && (
      <>
        {data.length > 0 ? (
          <>
            <>
              <DataAreaTitle>Chromatin State</DataAreaTitle>
              <DataPanel>
                <div className="grid grid-cols-5 gap-1 h-100">
                  <div className="border-2 border-black">
                    <BodyMapThumbnailAndModal
                      facet={organFacets}
                      organism={"Homo sapiens"}
                      organList={organList}
                      enabledBodyMapFilters={enabledBodyMapFilters}
                      originalFilters={organFilters}
                      organFilters={organFilters}
                      stateFilters={stateFilters}
                      handleClickOrgan={handleClickOrgan}
                    />
                    {organFilters.length > 0 && (
                      <Selections filters={organFilters} />
                    )}
                  </div>
                  <div className="col-span-3 border-2 border-black">
                    <div className="col-span-3 border-2 ">
                      <ChromatinBiosampleFacets
                        facets={biosampleFacet}
                        biosampleFilters={biosampleFilters}
                        stateFilters={stateFilters}
                        handleClickBiosample={handleClickBiosample}
                      />
                    </div>
                  </div>
                  <div className="border-2 border-black">
                    <ChromatinStateFacets
                      facets={displayedStateFacet}
                      filters={stateFilters}
                      handleClickState={handleClickState}
                    />
                    {stateFilters.length > 0 && (
                      <Selections filters={stateFilters} />
                    )}
                  </div>
                </div>
              </DataPanel>
              <DataPanel>
                <ChromatinTable data={filteredData} />
              </DataPanel>
            </>
          </>
        ) : (
          <DataPanel>
            <DataAreaTitle>
              No chromatin state data available to display, please choose a
              different SNP.
            </DataAreaTitle>
          </DataPanel>
        )}
      </>
    )
  );
}

ChromatinView.propTypes = {
  data: PropTypes.array.isRequired,
  assembly: PropTypes.string.isRequired,
};
