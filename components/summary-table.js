// node_modules
import PropTypes from "prop-types";
import Link from "next/link";
import { Tooltip, Button } from "@nextui-org/react";

// components
import { DataGridContainer } from "./data-grid";
import SortableGrid from "./sortable-grid";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const initialSort = {
  columnId: "score",
  direction: "desc",
};

// opstions for tissue specific scores sparkline
const options = {
  // Resizes the chart canvas when its container does
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
      min: 0,
      max: 1,
      grid: {
        display: true,
      },
      border: {
        display: false,
      },
      ticks: {
        stepSize: 1,
        display: true,
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
    legend: {
      display: false,
    },
  },
};

const optionsForPopup = {
  // Resizes the chart canvas when its container does
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
      min: 0,
      max: 1,
      grid: {
        display: true,
      },
      border: {
        display: false,
      },
      ticks: {
        stepSize: 0.2,
        display: true,
      },
    },
    x: {
      display: true,
      grid: {
        display: false,
      },
      border: {
        display: true,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
  },
};

/**
 * @param {object} scores to generate data for chart
 * @param {number} maxBarThickness to set the max bar thickness
 * @returns data used to draw tissue specific scores sparkline
 */
function getSparklineData(scores, maxBarThickness) {
  const labels = Object.keys(scores);
  const data = Object.values(scores).map((score) => parseFloat(score));
  return {
    labels,
    datasets: [
      {
        label: "Score",
        data,
        backgroundColor: "#276A8E",
        maxBarThickness,
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
                <Bar
                  options={optionsForPopup}
                  data={getSparklineData(source.tissue_specific_scores, 10)}
                />
              </div>
            }
            placement={"left-start"}
          >
            <Button className="h-12">
              <Bar
                options={options}
                data={getSparklineData(source.tissue_specific_scores, 3)}
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
