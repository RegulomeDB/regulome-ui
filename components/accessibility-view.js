import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { DataAreaTitle, DataPanel } from "./data-area";
import AccessibilityDataTable from "./accessibility-table";
import { BodyMapThumbnailAndModal } from "./body-map";
import {
  getFillColorHex,
  getFillColorTailwind,
  getFilteredData,
  getOrganFacets,
  getOrganFilter,
} from "../lib/tissue-specific-score";

// To dynamically load component ChipDataBarChart on the client side,
// use the ssr option to disable server-rendering since AccessibilityChart relies on browser APIs like window.
const AccessibilityChart = dynamic(() => import("./accessibility-chart"), {
  ssr: false,
});

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
 * This is the view for display accessibility data for a variant.
 */
export function AccessibilityDataView({
  data,
  normalizedTissueSpecificScore,
  assembly,
}) {
  const [showAccessibilityData, setShowAccessibilityData] = useState(false);
  const [organFilters, setOrganFilters] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const isChip = router.asPath.endsWith(`#!accessibility`);
    setShowAccessibilityData(isChip);
  }, [router]);

  const filteredData = getFilteredData(data, organFilters);

  function handleClickOrgan(organ, organList, enabledOrganList) {
    const filters = getOrganFilter(
      organFilters,
      organ,
      organList,
      enabledOrganList
    );
    setOrganFilters(filters);
  }
  return (
    showAccessibilityData && (
      <>
        {data.length > 0 ? (
          <>
            <DataAreaTitle>Accessibility Data</DataAreaTitle>
            <DataPanel>
              <div className="@container">
                <div className="grid @5xl:grid-cols-5  @5xl:grid-rows-1 grid-cols-1 grid-rows-2 gap-1 mb-2 justify-items-center">
                  <div className="@5xl:col-span-1 w-56">
                    <BodyMapThumbnailAndModal
                      data={data}
                      assembly={assembly}
                      organFilters={organFilters}
                      handleClickOrgan={handleClickOrgan}
                      getOrganFacets={getOrganFacets}
                      getFillColorTailwind={getFillColorTailwind}
                      getFillColorHex={getFillColorHex}
                      normalizedTissueSpecificScore={
                        normalizedTissueSpecificScore
                      }
                    />
                    {organFilters.length > 0 && (
                      <Selections
                        filters={organFilters}
                        clearFilterFunc={handleClickOrgan}
                      />
                    )}
                  </div>
                  <div className="@5xl:col-span-4  w-11/12	">
                    <AccessibilityChart accessibilityData={filteredData} />
                  </div>
                </div>
              </div>
            </DataPanel>
            <DataAreaTitle>Datasets Table</DataAreaTitle>
            <DataPanel>
              <AccessibilityDataTable data={filteredData} />
            </DataPanel>
          </>
        ) : (
          <DataPanel>
            <DataAreaTitle>
              No accessibility data available to display, please choose a
              different SNP.
            </DataAreaTitle>
          </DataPanel>
        )}
      </>
    )
  );
}

AccessibilityDataView.propTypes = {
  data: PropTypes.array.isRequired,
  normalizedTissueSpecificScore: PropTypes.object.isRequired,
  assembly: PropTypes.string.isRequired,
};
