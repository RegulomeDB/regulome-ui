import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import ChipDataTable from "./chip-data-table";
import { DataAreaTitle, DataPanel } from "./data-area";

// To dynamically load component ChipDataBarChart on the client side,
// use the ssr option to disable server-rendering since ChipDataBarChart relies on browser APIs like window.
const ChipDataBarChart = dynamic(() => import("./chip-data-bar-chart"), {
  ssr: false,
});

/**
 * This is the view for display ChIP-seq data for a variant.
 */
export function ChipDataView({ chipData }) {
  return (
    <>
      {chipData.length > 0 ? (
        <>
          <DataAreaTitle>ChIP Data</DataAreaTitle>
          <DataPanel>
            <ChipDataBarChart chipData={chipData}></ChipDataBarChart>
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
  );
}

ChipDataView.propTypes = {
  chipData: PropTypes.array.isRequired,
};
