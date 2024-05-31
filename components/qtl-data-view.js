import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { BodyMapThumbnailAndModal } from "./body-map";
import CaQTLDataTable from "./caqtl-table";
import { DataAreaTitle, DataPanel } from "./data-area";
import EQTLDataTable from "./eqtl-table";
import { TissueScoreBar } from "./tissue-score-bar";
import {
  getOrganFacetsForTissueScore,
  getOrganFilter,
} from "../lib/tissue-specific-score";
import { Button, ButtonLink } from "./form-elements";

// To dynamically load component QTLChart on the client side,
// use the ssr option to disable server-rendering since QTLChart relies on browser APIs like window.
const QTLChart = dynamic(() => import("./bar-chart"), {
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
export function QTLDataView({
  data,
  normalizedTissueSpecificScore,
  assembly,
  organFilters,
  setOrganFilters,
}) {
  const eQTLData = data.filter((d) => d.method === "eQTLs");
  const caQTLData = data.filter((d) => d.method === "caQTLs");

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
                          getOrganFacetsForTissue={getOrganFacetsForTissueScore}
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
                      <QTLChart
                        data={data}
                        datasetsLabel="Number of QTL datasets"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DataPanel>
          ) : (
            <DataPanel>
              <QTLChart data={data} datasetsLabel="Number of QTL datasets" />
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
            <div className=" space-x-2 mb-4 flex">
              <div>No QTL data available to display, please</div>
              <Button
                label="filter reset"
                type="secondary"
                size="lg"
                onClick={() => setOrganFilters([])}
              >
                reset the tissue filter on the body map
              </Button>
              <div>or</div>

              <ButtonLink
                label="query link"
                href="/query"
                type="secondary"
                size="lg"
              >
                choose a different SNP.
              </ButtonLink>
            </div>
          </DataAreaTitle>
        </DataPanel>
      )}
    </>
  );
}

QTLDataView.propTypes = {
  data: PropTypes.array.isRequired,
  normalizedTissueSpecificScore: PropTypes.object.isRequired,
  assembly: PropTypes.string.isRequired,
  // selected organs in a list
  organFilters: PropTypes.array.isRequired,
  // function to set organFilters
  setOrganFilters: PropTypes.func.isRequired,
};
