import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CaQTLDataTable from "./caqtl-table";
import { DataAreaTitle, DataPanel } from "./data-area";
import EQTLDataTable from "./eqtl-table";

/**
 * This is the view for display QTL data for a variant.
 */
export function QTLDataView({ data }) {
  const [showQtlData, setShowQtlData] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const isQTL = router.asPath.endsWith(`#!qtl`);
    setShowQtlData(isQTL);
  }, [router]);
  const eQTLData = data.filter((d) => d.method === "eQTLs");
  const caQTLData = data.filter((d) => d.method === "caQTLs");

  return (
    showQtlData && (
      <>
        {data.length > 0 ? (
          <>
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
};
