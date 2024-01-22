// node_modules
import PropTypes from "prop-types";
// components
import { DataGridContainer } from "./data-grid";
import SortableGrid from "./sortable-grid";

const initialSort = {
  columnId: "tissue_specific_score",
  direction: "desc",
};

const caqtlDataColumns = [
  {
    id: "method",
    title: "Method",
  },
  {
    id: "peak",
    title: "QTL location",
    display: ({ source }) => `${source.chrom}:${source.start}-${source.end}`,
    sorter: (source) => Number(source.start),
  },
  {
    id: "biosample_ontology.term_name",
    title: "Biosample",
    display: ({ source }) =>
      source.biosample_ontology ? source.biosample_ontology.term_name : "",
  },
  {
    id: "biosample_ontology.classification",
    title: "Classification",
    display: ({ source }) =>
      source.biosample_ontology?.classification
        ? source.biosample_ontology.classification
        : "",
  },
  {
    id: "biosample_ontology.organ_slims",
    title: "Organ",
    display: ({ source }) =>
      source.biosample_ontology?.organ_slims
        ? source.biosample_ontology.organ_slims.join(", ")
        : "",
  },
  {
    id: "tissue_specific_score",
    title: "Tissue specific score",
  },
  {
    id: "ancestry",
    title: "Population",
    display: ({ source }) => source.ancestry || "N/A",
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
 * Display a sortable table of the given data.
 */ export default function CaQTLDataTable({ data }) {
  return (
    <DataGridContainer>
      <SortableGrid
        data={data}
        columns={caqtlDataColumns}
        initialSort={initialSort}
      />
    </DataGridContainer>
  );
}

CaQTLDataTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
