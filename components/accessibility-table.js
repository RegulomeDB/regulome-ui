// node_modules
import PropTypes from "prop-types";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
// components
import SortableGrid from "./sortable-grid";
import { useState } from "react";
import { sanitizedString } from "../lib/general";

const initialSort = {
  columnId: "tissue_specific_score",
  direction: "desc",
};

const accessibilityDataColumns = [
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
      source.biosample_ontology?.organ_slims?.length > 0
        ? source.biosample_ontology.organ_slims.join(", ")
        : "",
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
  {
    id: "value",
    title: "Average accessibility",
  },
];

/**
 * Display a sortable table of the given accessibility data.
 * The data can be filtered by biosample term name.
 */
export default function AccessibilityDataTable({ data }) {
  const [textInput, setTextInput] = useState("");
  data =
    textInput === ""
      ? data
      : data.filter(
          (dataset) =>
            sanitizedString(dataset.biosample_ontology.term_name).includes(
              sanitizedString(textInput)
            ) ||
            sanitizedString(
              dataset.biosample_ontology.organ_slims.join(", ")
            ).includes(sanitizedString(textInput))
        );
  return (
    <div className="grid gap-y-2">
      <label className="relative text-gray-400 focus-within:text-gray-600 block">
        <MagnifyingGlassIcon className="absolute top-1/3 left-1 w-6 h-4" />
        <input
          className="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-7 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-brand"
          type="search"
          aria-label="search to filter biosample results"
          placeholder="Search for a biosample name or an organ name"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          name="biosampleOrOrgan"
        />
      </label>
      <SortableGrid
        data={data}
        columns={accessibilityDataColumns}
        initialSort={initialSort}
        pager={{}}
      />
    </div>
  );
}

AccessibilityDataTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
