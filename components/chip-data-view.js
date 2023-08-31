import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ChipDataTable from "./chip-data-table";
import { DataAreaTitle, DataPanel } from "./data-area";

const ChipDataBar = dynamic(() => import("./chip-data-bar-chart"), {
  ssr: false,
});

export function useChipData() {
  const [showChipData, setShowChipData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isChip = router.asPath.endsWith(`#!chip`);
    setShowChipData(isChip);
  }, [router]);
  return showChipData;
}

/**
 * This is the view for diasplay ChIP-seq data for a variant.
 */
export function ChipDataView({ chipData }) {
  const showChipData = useChipData();
  return showChipData ? (
    <React.Fragment>
      {chipData.length > 0 ? (
        <>
          <DataAreaTitle>ChIP Data</DataAreaTitle>
          <DataPanel>
            <ChipDataBar chipData={chipData}></ChipDataBar>
          </DataPanel>
          <DataAreaTitle>Datasets Table</DataAreaTitle>
          <DataPanel>
            <ChipDataTable
              data={chipData}
              displayTitle={"ChIP data"}
              dataFilter="chip"
              errorMessage={"No result table is available for this SNP."}
            />
          </DataPanel>
        </>
      ) : (
        <React.Fragment>
          <DataPanel>
            <DataAreaTitle>
              No ChIP data available to display, please choose a different SNP.
            </DataAreaTitle>
          </DataPanel>
        </React.Fragment>
      )}
    </React.Fragment>
  ) : null;
}

ChipDataView.propTypes = {
  chipData: PropTypes.array.isRequired,
};
