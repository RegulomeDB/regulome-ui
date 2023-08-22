// node_modules
import PropTypes from "prop-types";
import Link from "next/link";
// components
import { DataGridContainer } from "./data-grid";
import SortableGrid from "./sortable-grid";

/**
 * Display a sortable table of the given data.
 */
export default function SummaryTable({ data, assembly }) {
  const summaryColumns = [
    {
      id: "chrom_location",
      title: "Chromosome location",
      display: ({ source }) => {
        const url = `/search?regions=${source.chrom_location}&genome=${assembly}`;
        return <Link href={url}>{source.chrom_location}</Link>;
      },
    },
    {
      id: "rsids",
      title: "dbSNP IDs",
      display: ({ source }) => `${source.rsids.join(", ")}`,
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
  const initialSort = {
    columnId: "rank",
  };
  return (
    <DataGridContainer>
      <SortableGrid
        data={data}
        columns={summaryColumns}
        keyProp="chrom_location"
        initialSort={initialSort}
      />
    </DataGridContainer>
  );
}

SummaryTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  assembly: PropTypes.string.isRequired,
};
