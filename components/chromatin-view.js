import _ from "lodash";
import { XCircleIcon } from "@heroicons/react/20/solid";
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
  getFilteredChromatinData,
} from "../lib/chromatin-data";
import ChromatinBiosampleFacets from "./chromatin-biosample-facets";

// Display selected filters and allow user to de-select them
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
 */
export function ChromatinView({ data, assembly }) {
  const router = useRouter();
  useEffect(() => {
    const isQTL = router.asPath.endsWith(`#!chromatin`);
    setShowChromatinData(isQTL);
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
  const organList =
    assembly === "hg19" ? COMPLETE_ORGAN_LIST_HG19 : COMPLETE_ORGAN_LIST_GRCH38;
  const cellList =
    assembly === "hg19" ? COMPLETE_CELLS_LIST_HG19 : COMPLETE_CELLS_LIST_GRCH38;

  function handleClickOrgan(organ) {
    if (organList.includes(organ) | cellList.includes(organ)) {
      let filters = [...organFilters];
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

  return (
    showChromatinData && (
      <>
        {data.length > 0 ? (
          <>
            <>
              <DataAreaTitle>Chromatin State</DataAreaTitle>
              <DataPanel>
                <div className="grid grid-cols-5 gap-1 h-100">
                  <div>
                    <BodyMapThumbnailAndModal
                      data={filteredDataForBodyMap}
                      assembly={assembly}
                      organList={organList}
                      cellList={cellList}
                      organFilters={organFilters}
                      handleClickOrgan={handleClickOrgan}
                    />
                    {organFilters.length > 0 && (
                      <Selections
                        filters={organFilters}
                        clearFilterFunc={handleClickOrgan}
                      />
                    )}
                  </div>
                  <div className="col-span-3">
                    <ChromatinBiosampleFacets
                      data={filteredDataForBiosample}
                      assembly={assembly}
                      biosampleFilters={biosampleFilters}
                      handleClickBiosample={handleClickBiosample}
                    />
                  </div>
                  <div>
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
