// node_modules
import PropTypes from "prop-types";
import Link from "next/link";
// components
import { DataGridContainer } from "./data-grid";
import SortableGrid from "./sortable-grid";

const initialSort = {
  columnId: "rank",
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
    title: "Rank",
  },
  {
    id: "score",
    title: "Score",
  },
];

/**
 * Display a sortable table of the given data.
 */ export default function VariantLDTable({ data }) {
  return (
    <DataGridContainer>
      <SortableGrid
        data={data}
        columns={variantLDColumns}
        initialSort={initialSort}
      />
    </DataGridContainer>
  );
}

VariantLDTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
