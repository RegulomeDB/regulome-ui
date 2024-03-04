// node_modules
import PropTypes from "prop-types";
// components
import { DataGridContainer } from "./data-grid";
import SortableGrid from "./sortable-grid";

const chromatinDataColumns = [
  {
    id: "chromatin_state",
    title: "Chromatin state",
  },

  {
    id: "biosample",
    title: "Biosample",
  },
  {
    id: "biosample_classification",
    title: "Classification",
  },
  {
    id: "organ",
    title: "Organ",
  },
  {
    id: "tissue_specific_score",
    title: "Tissue specific score",
  },
  {
    id: "dataset",
    title: "Dataset",
    display: ({ source }) => (
      <a href={source.dataset}>{source.dataset.split("/")[4]}</a>
    ),
  },
  {
    id: "file",
    title: "File",
    display: ({ source }) => (
      <a href={`https://encodeproject.org/files/${source.file}/`}>
        {source.file}
      </a>
    ),
  },
];

/**
 * Display a sortable table of the given chromatin data.
 */
export default function ChromatinTable({ data }) {
  return (
    <DataGridContainer>
      <SortableGrid data={data} columns={chromatinDataColumns} />
    </DataGridContainer>
  );
}

ChromatinTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
