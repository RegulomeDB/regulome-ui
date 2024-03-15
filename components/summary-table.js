// node_modules
import PropTypes from "prop-types";
import Link from "next/link";
import { Tooltip, Button } from "@nextui-org/react";

// components
import SortableGrid from "./sortable-grid";
import Sparkline from "./sparkline";

const initialSort = {
  columnId: "score",
  direction: "desc",
};

const summaryColumnsGRCh38 = [
  {
    id: "chrom_location",
    title: "Chromosome location",
    display: ({ source }) => {
      const url = `/search?regions=${source.chrom_location}&genome=${source.assembly}&r2=0.8&ld=true`;
      return <Link href={url}>{source.chrom_location}</Link>;
    },
  },
  {
    id: "ref",
    title: "Ref",
    display: ({ source }) => `${source.ref.join(", ")}`,
  },
  {
    id: "alt",
    title: "Alt",
    display: ({ source }) => `${source.alt.join(", ")}`,
  },
  {
    id: "rsids",
    title: "dbSNP IDs",
    display: ({ source }) => `${source.rsids.join(", ")}`,
  },
  {
    id: "rank",
    title: "Global rank",
  },
  {
    id: "score",
    title: "Global score",
  },
  {
    id: "top_organs",
    title: "Top scoring organs",
    display: ({ source }) => `${source.top_organs.join(", ")}`,
  },
  {
    id: "sparkline",
    title: "Tissue specific scores",
    display: ({ source }) => {
      return (
        <div className="h-12">
          <Tooltip
            content={
              <div className="w-[600px] h-72 bg-gray-100">
                <Sparkline
                  scores={source.tissue_specific_scores}
                  maxBarThickness={10}
                />
              </div>
            }
            placement={"left-start"}
          >
            <Button className="h-12">
              <Sparkline
                scores={source.tissue_specific_scores}
                maxBarThickness={3}
                min={0}
                max={1}
                thumbnail
              />
            </Button>
          </Tooltip>
        </div>
      );
    },
  },
];

const summaryColumnsHg19 = [
  {
    id: "chrom_location",
    title: "Chromosome location",
    display: ({ source }) => {
      const url = `/search?regions=${source.chrom_location}&genome=${source.assembly}&r2=0.8&ld=true`;
      return <Link href={url}>{source.chrom_location}</Link>;
    },
  },
  {
    id: "ref",
    title: "Ref",
    display: ({ source }) => `${source.ref.join(", ")}`,
  },
  {
    id: "alt",
    title: "Alt",
    display: ({ source }) => `${source.alt.join(", ")}`,
  },
  {
    id: "rsids",
    title: "dbSNP IDs",
    display: ({ source }) => `${source.rsids.join(", ")}`,
  },
  {
    id: "rank",
    title: "Generic rank",
  },
  {
    id: "score",
    title: "Generic score",
  },
];

/**
 * Display a sortable table of the given data.
 */ export default function SummaryTable({ data, assembly }) {
  const columns =
    assembly === "GRCh38" ? summaryColumnsGRCh38 : summaryColumnsHg19;
  return (
    <SortableGrid
      data={data}
      columns={columns}
      keyProp="chrom_location"
      initialSort={initialSort}
      pager={{}}
    />
  );
}

SummaryTable.propTypes = {
  // data to display
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  assembly: PropTypes.string.isRequired,
};
