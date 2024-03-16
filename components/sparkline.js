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

// options for tissue specific scores sparkline
const optionsThumbnail = {
  // Resizes the chart canvas when its container does
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
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
export default function Sparkline({
  scores,
  maxBarThickness,
  min,
  max,
  thumbnail,
}) {
  const appliedOptions = thumbnail ? optionsThumbnail : options;
  if ((min || min === 0) && max) {
    appliedOptions.scales.y.min = min;
    appliedOptions.scales.y.max = max;
  }
  return thumbnail ? (
    <Bar
      options={appliedOptions}
      data={getSparklineData(scores, maxBarThickness)}
    />
  ) : (
    <Bar
      options={appliedOptions}
      data={getSparklineData(scores, maxBarThickness)}
    />
  );
}
Sparkline.propTypes = {
  scores: PropTypes.object.isRequired,
  // the max thickness of each bar
  maxBarThickness: PropTypes.number,
  // whether this chart is a small thumbnail
  thumbnail: PropTypes.bool,
  // the min value of y-axis
  min: PropTypes.number,
  // the max value of y-axis
  max: PropTypes.number,
};
