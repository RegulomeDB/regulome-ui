// node_modules
import PropTypes from "prop-types";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
// components
import SortableGrid from "./sortable-grid";
import { sanitizedString } from "../lib/general";
import { useState } from "react";

const initialSort = {
  columnId: "score",
  direction: "desc",
};

const variantLDColumns = [
  {
    id: "location",
    title: "Location",
    display: ({ source }) => {
      const url = `/search?regions=${source.location}&genome=${source.assembly}`;
      return <Link href={url}>{source.location}</Link>;
    },
  },
  {
    id: "rsid",
    title: "rsID",
    display: ({ source }) => `${source.rsid.join(", ")}`,
  },
  {
    id: "ref",
    title: "Ref",
  },
  {
    id: "alt",
    title: "Alt",
  },
  {
    id: "ancestry",
    title: "Ancestry",
  },
  {
    id: "r2",
    title: "r2",
  },
  {
    id: "rank",
    title: "Global rank",
  },
  {
    id: "score",
    title: "Global score",
  },
];

/**
 * Display a sortable table of the given data.
 */ export default function VariantLDTable({ data }) {
  const [textInput, setTextInput] = useState("");
  data =
    textInput === ""
      ? data
      : data.filter((dataset) =>
          sanitizedString(dataset.ancestry).includes(sanitizedString(textInput))
        );
  return (
    <div className="grid gap-y-2">
      <label className="relative text-gray-400 focus-within:text-gray-600 block">
        <MagnifyingGlassIcon className="absolute top-1/3 left-1 w-6 h-4" />
        <input
          className="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-7 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-brand"
          type="search"
          aria-label="search by filtering ancestry"
          placeholder="Search for the ancestry"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          name="ancestry"
        />
      </label>
      <SortableGrid
        data={data}
        columns={variantLDColumns}
        initialSort={initialSort}
        pager={{}}
      />
    </div>
  );
}

VariantLDTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
