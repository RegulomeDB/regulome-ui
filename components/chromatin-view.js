import _ from "lodash";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  ASSOCIATED_ORGAN_MAP,
  getFillColorHex,
  getFillColorTailwind,
  getFilteredChromatinData,
  getOrganFacets,
} from "../lib/chromatin-data";
import { BodyMapThumbnailAndModal } from "./body-map";
import ChromatinTable from "./chromatin-table";
import ChromatinStateFacets from "./chromatin-state-facets";
import ChromatinBiosampleFacets from "./chromatin-biosample-facets";
import { DataAreaTitle, DataPanel } from "./data-area";
import { Button } from "./form-elements";

/**
 *  Display selected filters and allow user to de-select them.
 */
function Selections({ filters, clearFilterFunc }) {
  return (
    <div>
      <span>Selected filters:</span>
      {filters.map((filter) => {
        return (
          <button
            key={`${filter}-selected-filter`}
            onClick={() => clearFilterFunc(filter)}
            className="flex text-data-label text-sm"
          >
            <XCircleIcon className="h-5" />
            {filter}
          </button>
        );
      })}
    </div>
  );
}

Selections.propTypes = {
  filters: PropTypes.array.isRequired,
  clearFilterFunc: PropTypes.func.isRequired,
};

/**
 * This is the view for display chromatin state data for a variant.
 * It contains three facets group: Organ slim facets, biosample facets and chromatin state facets
 * and a cortable table to display the chromatin state datasets
 */
export function ChromatinView({ data, assembly }) {
  const router = useRouter();
  useEffect(() => {
    const isChromatin = router.asPath.endsWith(`#!chromatin`);
    setShowChromatinData(isChromatin);
  }, [router]);
  const [showChromatinData, setShowChromatinData] = useState(false);
  const [organFilters, setOrganFilters] = useState([]);
  const [stateFilters, setStateFilters] = useState([]);
  const [biosampleFilters, setBiosampleFilters] = useState([]);
  const filteredData = getFilteredChromatinData(
    data,
    stateFilters,
    organFilters,
    biosampleFilters
  );
  const filteredDataForState = getFilteredChromatinData(
    data,
    [],
    organFilters,
    biosampleFilters
  );
  const filteredDataForBiosample = getFilteredChromatinData(
    data,
    stateFilters,
    organFilters,
    []
  );
  const filteredDataForBodyMap = getFilteredChromatinData(
    data,
    stateFilters,
    [],
    biosampleFilters
  );

  function handleClickOrgan(organ, organList, enabledOrganList) {
    let filters = [...organFilters];
    if (organList && enabledOrganList) {
      if (organList.includes(organ) && enabledOrganList.includes(organ)) {
        if (filters.includes(organ)) {
          if (organ in ASSOCIATED_ORGAN_MAP) {
            ASSOCIATED_ORGAN_MAP[organ].forEach((associatedOrgan) => {
              if (enabledOrganList.includes(associatedOrgan)) {
                filters = _.without(filters, associatedOrgan);
              }
            });
          }
          filters = _.without(filters, organ);
        } else {
          filters.push(organ);
          if (organ in ASSOCIATED_ORGAN_MAP) {
            ASSOCIATED_ORGAN_MAP[organ].forEach((associatedOrgan) => {
              if (
                enabledOrganList.includes(associatedOrgan) &&
                !filters.includes(associatedOrgan)
              ) {
                filters.push(associatedOrgan);
              }
            });
          }
        }
        setOrganFilters(filters);
      }
    } else {
      filters = _.without(filters, organ);
      setOrganFilters(filters);
    }
  }

  function handleClickState(d) {
    let filters = [...stateFilters];
    if (filters.includes(d)) {
      filters = _.without(filters, d);
    } else {
      filters.push(d);
    }
    setStateFilters(filters);
  }

  function handleClickBiosample(biosample) {
    let filters = [...biosampleFilters];
    if (filters.includes(biosample)) {
      filters = _.without(filters, biosample);
    } else {
      filters.push(biosample);
    }
    setBiosampleFilters(filters);
  }

  function clearAllFilters() {
    setBiosampleFilters([]);
    setOrganFilters([]);
    setStateFilters([]);
  }

  return (
    showChromatinData && (
      <>
        {data.length > 0 ? (
          <>
            <DataAreaTitle>Chromatin State</DataAreaTitle>
            <DataPanel>
              <div className="@container">
                <div className="grid @5xl:grid-cols-5 @5xl:grid-rows-1 @md:grid-cols-2  grid-cols-1 grid-rows-2 gap-1 mb-2 @md:justify-items-center">
                  <div className="@5xl:col-span-1 @5xl:row-start-1 w-56">
                    <BodyMapThumbnailAndModal
                      data={filteredDataForBodyMap}
                      assembly={assembly}
                      organFilters={organFilters}
                      handleClickOrgan={handleClickOrgan}
                      getOrganFacets={getOrganFacets}
                      getFillColorTailwind={getFillColorTailwind}
                      getFillColorHex={getFillColorHex}
                      colorBy={"Colored by most active state"}
                    />
                    {organFilters.length > 0 && (
                      <Selections
                        filters={organFilters}
                        clearFilterFunc={handleClickOrgan}
                      />
                    )}
                  </div>
                  <div className="@5xl:col-span-3 @5xl:row-start-1 @md:row-start-2 @md:col-span-2 ">
                    <ChromatinBiosampleFacets
                      data={filteredDataForBiosample}
                      assembly={assembly}
                      biosampleFilters={biosampleFilters}
                      handleClickBiosample={handleClickBiosample}
                    />
                    {biosampleFilters.length > 0 && (
                      <Selections
                        filters={biosampleFilters}
                        clearFilterFunc={handleClickBiosample}
                      />
                    )}
                  </div>
                  <div className="@5xl:col-span-1 @5xl:row-start-1 @md:rol-start-1 w-56">
                    <ChromatinStateFacets
                      data={filteredDataForState}
                      assembly={assembly}
                      stateFilters={stateFilters}
                      handleClickState={handleClickState}
                    />
                    {stateFilters.length > 0 && (
                      <Selections
                        filters={stateFilters}
                        clearFilterFunc={handleClickState}
                      />
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={clearAllFilters}>Clear all filters </Button>
            </DataPanel>
            <DataPanel>
              <ChromatinTable data={filteredData} />
            </DataPanel>
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
