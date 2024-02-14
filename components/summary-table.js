// node_modules
import PropTypes from "prop-types";
import Link from "next/link";
// components
import { DataGridContainer } from "./data-grid";
import SortableGrid from "./sortable-grid";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const initialSort = {
  columnId: "rank",
};

// opstions for tissue specific scores sparkline
const options = {
  // Resizes the chart canvas when its container does
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
    x: {
      display: false,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
  plugins: {
    datalabels: {
      display: false,
    },
    legend: {
      display: false,
    },
  },
};

/**
 * @param {*} scores to generate data for chart
 * @returns data used to draw tissue specific scores sparkline
 */
function getSparklineData(scores) {
  const labels = Object.keys(scores);
  const data = Object.values(scores);
  return {
    labels,
    datasets: [
      {
        label: "Score",
        data,
        backgroundColor: "#276A8E",
        maxBarThickness: 3,
      },
    ],
  };
}

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
    title: "Generic rank",
  },
  {
    id: "score",
    title: "Generic score",
  },
  {
    id: "top_organs",
    title: "Top organs",
    display: ({ source }) => `${source.top_organs.join(", ")}`,
  },
  {
    id: "sparkline",
    title: "Tissue specific scores sparkline",
    display: ({ source }) => {
      return (
        <Bar
          options={options}
          data={getSparklineData(source.tissue_specific_scores)}
          height={5}
          width={30}
        />
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
    <DataGridContainer>
      <SortableGrid
        data={data}
        columns={columns}
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
