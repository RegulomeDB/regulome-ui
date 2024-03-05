import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { BodyMapThumbnailAndModal } from "./body-map";
import CaQTLDataTable from "./caqtl-table";
import { DataAreaTitle, DataPanel } from "./data-area";
import EQTLDataTable from "./eqtl-table";
import { TissueScoreBar } from "./tissue-score-bar";
import {
  getFilteredData,
  getOrganFacetsForTissueScore,
  getOrganFilter,
} from "../lib/tissue-specific-score";

// To dynamically load component QTLChart on the client side,
// use the ssr option to disable server-rendering since QTLChart relies on browser APIs like window.
const QTLChart = dynamic(() => import("./qtl-chart"), {
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
 * This is the view for display QTL data for a variant.
 */
export function QTLDataView({ data, normalizedTissueSpecificScore, assembly }) {
  const [showQtlData, setShowQtlData] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const isQTL = router.asPath.endsWith(`#!qtl`);
    setShowQtlData(isQTL);
  }, [router]);
  const [organFilters, setOrganFilters] = useState([]);
  const filteredData = getFilteredData(data, organFilters);
  const eQTLData = filteredData.filter((d) => d.method === "eQTLs");
  const caQTLData = filteredData.filter((d) => d.method === "caQTLs");

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
    showQtlData && (
      <>
        {data.length > 0 ? (
          <>
            <DataAreaTitle>QTL</DataAreaTitle>
            {assembly === "GRCh38" ? (
              <DataPanel>
                <div className="@container">
                  <div className="grid @5xl:grid-cols-7  @5xl:grid-rows-1 grid-cols-1 grid-rows-2 gap-1 mb-2 justify-items-center">
                    <div className="@5xl:col-span-2">
                      <div className="relative">
                        <div className="w-64">
                          <BodyMapThumbnailAndModal
                            data={data}
                            assembly={assembly}
                            organFilters={organFilters}
                            handleClickOrgan={handleClickOrgan}
                            getOrganFacetsForTissue={
                              getOrganFacetsForTissueScore
                            }
                            normalizedTissueSpecificScore={
                              normalizedTissueSpecificScore
                            }
                            colorBy={"Colored by tissue specific score"}
                            width={"w-10/12"}
                          />
                          {organFilters.length > 0 && (
                            <Selections
                              filters={organFilters}
                              clearFilterFunc={handleClickOrgan}
                            />
                          )}
                        </div>
                        <div className="absolute top-12 right-3 h-48">
                          <TissueScoreBar
                            normalizedTissueSpecificScore={
                              normalizedTissueSpecificScore
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="@5xl:col-span-5 w-full">
                      <div>Number of QTL datasets </div>
                      <div className="text-data-label text-sm italic">
                        Grouped by biosamples
                      </div>
                      <div className="h-80 border-2 border-panel p-1">
                        <QTLChart qtlData={filteredData} />
                      </div>
                    </div>
                  </div>
                </div>
              </DataPanel>
            ) : (
              <DataPanel>
                <QTLChart qtlData={filteredData} />
              </DataPanel>
            )}
            {caQTLData.length > 0 && (
              <>
                <DataAreaTitle>caQTL Data</DataAreaTitle>
                <DataPanel>
                  <CaQTLDataTable data={caQTLData} />
                </DataPanel>
              </>
            )}
            {eQTLData.length > 0 && (
              <>
                <DataAreaTitle>eQTL Data</DataAreaTitle>
                <DataPanel>
                  <EQTLDataTable data={eQTLData} />
                </DataPanel>
              </>
            )}
          </>
        ) : (
          <DataPanel>
            <DataAreaTitle>
              No QTL data available to display, please choose a different SNP.
            </DataAreaTitle>
          </DataPanel>
        )}
      </>
    )
  );
}

QTLDataView.propTypes = {
  data: PropTypes.array.isRequired,
  normalizedTissueSpecificScore: PropTypes.object.isRequired,
  assembly: PropTypes.string.isRequired,
};
