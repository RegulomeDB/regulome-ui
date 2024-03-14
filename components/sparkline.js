import PropTypes from "prop-types";

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

// opstions for tissue specific scores sparkline
const optionsThumbnail = {
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
export default function Sparkline({ scores, maxBarThickness, thumbnail }) {
  return thumbnail ? (
    <Bar
      options={optionsThumbnail}
      data={getSparklineData(scores, maxBarThickness)}
    />
  ) : (
    <Bar options={options} data={getSparklineData(scores, maxBarThickness)} />
  );
}
Sparkline.propTypes = {
  scores: PropTypes.object.isRequired,
  // the max thickness of each bar
  maxBarThickness: PropTypes.number,
  // whether this chart is a small thumbnail
  thumbnail: PropTypes.bool,
};
