// node_modules
import PropTypes from "prop-types";
import Link from "next/link";
// components
import SortableGrid from "./sortable-grid";

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
  return (
    <SortableGrid
      data={data}
      columns={variantLDColumns}
      initialSort={initialSort}
      pager={{}}
    />
  );
}

VariantLDTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
