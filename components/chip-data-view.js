import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ChipDataTable from "./chip-data-table";
import { DataAreaTitle, DataPanel } from "./data-area";

// To dynamically load component ChipDataBar on the client side,
// use the ssr option to disable server-rendering since ChipDataBar relies on browser APIs like window.
const ChipDataBar = dynamic(() => import("./chip-data-bar-chart"), {
  ssr: false,
});

/**
 * This is the view for diasplay ChIP-seq data for a variant.
 */
export function ChipDataView({ chipData }) {
  const [showChipData, setShowChipData] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const isChip = router.asPath.endsWith(`#!chip`);
    setShowChipData(isChip);
  }, [router]);

  return (
    showChipData && (
      <>
        {chipData.length > 0 ? (
          <>
            <DataAreaTitle>ChIP Data</DataAreaTitle>
            <DataPanel>
              <ChipDataBar chipData={chipData}></ChipDataBar>
            </DataPanel>
            <DataAreaTitle>Datasets Table</DataAreaTitle>
            <DataPanel>
              <ChipDataTable data={chipData} />
            </DataPanel>
          </>
        ) : (
          <DataPanel>
            <DataAreaTitle>
              No ChIP data available to display, please choose a different SNP.
            </DataAreaTitle>
          </DataPanel>
        )}
      </>
    )
  );
}

ChipDataView.propTypes = {
  chipData: PropTypes.array.isRequired,
};
