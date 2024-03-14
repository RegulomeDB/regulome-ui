// node_modules
import PropTypes from "prop-types";
// components
import SortableGrid from "./sortable-grid";

const chipDataColumns = [
  {
    id: "method",
    title: "Method",
  },
  {
    id: "peak",
    title: "Peak",
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
    id: "targets",
    title: "Targets",
    display: ({ source }) =>
      source.targets && source.targets.length > 0
        ? source.targets.join(", ")
        : "",
  },
  {
    id: "biosample_ontology.organ_slims",
    title: "Organ",
    display: ({ source }) =>
      source.biosample_ontology
        ? source.biosample_ontology.organ_slims.join(", ")
        : "",
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
  {
    id: "value",
    title: "Value",
  },
];

/**
 * Display a sortable table of the given data.
 */ export default function ChipDataTable({ data }) {
  return <SortableGrid data={data} columns={chipDataColumns} pager={{}} />;
}

ChipDataTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
