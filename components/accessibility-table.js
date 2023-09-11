// node_modules
import PropTypes from "prop-types";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
// components
import { DataGridContainer } from "./data-grid";
import SortableGrid from "./sortable-grid";
import { useState } from "react";
import { sanitizedString } from "../lib/general";

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
    id: "biosample_ontology",
    title: "Biosample",
    display: ({ source }) =>
      source.biosample_ontology ? source.biosample_ontology.term_name : "",
  },
  {
    id: "organ_slims",
    title: "Organ",
    display: ({ source }) =>
      source.biosample_ontology?.organ_slims?.length > 0
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
 * Display a sortable table of the given accessibility data.
 * The data can be filtered by biosample term name.
 */
export default function AccessibilityDataTable({ data }) {
  const [textInput, setTextInput] = useState("");
  data =
    textInput === ""
      ? data
      : data.filter((dataset) =>
          sanitizedString(dataset.biosample_ontology.term_name).includes(
            sanitizedString(textInput)
          )
        );
  return (
    <div className="grid gap-y-2">
      <label
        htmlFor="email"
        className="relative text-gray-400 focus-within:text-gray-600 block"
      >
        <MagnifyingGlassIcon className="absolute top-1/3 left-1 w-6 h-4" />
        <input
          className="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-7 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-brand"
          type="search"
          aria-label="search to filter biosample results"
          placeholder="Search for a biosample name"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
      </label>
      <DataGridContainer>
        <SortableGrid data={data} columns={accessibilityDataColumns} />
      </DataGridContainer>
    </div>
  );
}

AccessibilityDataTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
