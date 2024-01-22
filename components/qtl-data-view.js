import _ from "lodash";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/20/solid";
import CaQTLDataTable from "./caqtl-table";
import { DataAreaTitle, DataPanel } from "./data-area";
import EQTLDataTable from "./eqtl-table";
import { ASSOCIATED_ORGAN_MAP } from "../lib/chromatin-data";
import { BodyMapThumbnailAndModal } from "./body-map";
import {
  getFillColorHex,
  getFillColorTailwind,
  getFilteredQtlData,
  getOrganFacets,
} from "../lib/qtl-data";

// To dynamically load component ChipDataBarChart on the client side,
// use the ssr option to disable server-rendering since AccessibilityChart relies on browser APIs like window.
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
export function QTLDataView({ data, assembly }) {
  const [showQtlData, setShowQtlData] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const isQTL = router.asPath.endsWith(`#!qtl`);
    setShowQtlData(isQTL);
  }, [router]);
  const [organFilters, setOrganFilters] = useState([]);
  const filteredData = getFilteredQtlData(data, organFilters);
  const eQTLData = filteredData.filter((d) => d.method === "eQTLs");
  const caQTLData = filteredData.filter((d) => d.method === "caQTLs");

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

  return (
    showQtlData && (
      <>
        {data.length > 0 ? (
          <>
            <DataPanel>
              <div className="@5xl:col-span-1 @5xl:row-start-1 w-56">
                <BodyMapThumbnailAndModal
                  data={data}
                  assembly={assembly}
                  organFilters={organFilters}
                  handleClickOrgan={handleClickOrgan}
                  getOrganFacets={getOrganFacets}
                  getFillColorTailwind={getFillColorTailwind}
                  getFillColorHex={getFillColorHex}
                />
                {organFilters.length > 0 && (
                  <Selections
                    filters={organFilters}
                    clearFilterFunc={handleClickOrgan}
                  />
                )}
              </div>
            </DataPanel>
            <DataAreaTitle>QTL Data</DataAreaTitle>
            <DataPanel>
              <QTLChart qtlData={filteredData} />
            </DataPanel>
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
  assembly: PropTypes.string.isRequired,
};
