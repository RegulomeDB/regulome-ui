import React from "react";
import PropTypes from "prop-types";

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
import {
  SORTED_CHROMATIN_STATES_HG19,
  SORTED_CHROMATIN_STATES_GRCH38,
  ChromatinStateColor,
} from "../lib/chromatin-data";

export default function ChromatinBarChart({
  chromatinData,
  assembly,
  height = 600,
  thumbnail,
}) {
  /**
   * Group datasets by dataset.chromatin_state and get a count for each group.
   * the counts looks like this:
   * {
   *   "Quiescent/Low": 4,
   *   "Weak enhancer": 1,
   *   "Strong transcription": 1,
   * }
   *
   **/
  const counts = chromatinData.reduce((groupCountByState, dataset) => {
    const state = dataset.chromatin_state;
    if (state in groupCountByState) {
      groupCountByState[state] += 1;
    } else {
      groupCountByState[state] = 1;
    }
    return groupCountByState;
  }, {});
  // chromatin states are sorted by most active state
  const order =
    assembly === "hg19"
      ? SORTED_CHROMATIN_STATES_HG19
      : SORTED_CHROMATIN_STATES_GRCH38;
  const states = Object.keys(counts);
  let sortedStates = [];
  order.forEach((state) => {
    if (states.includes(state)) {
      sortedStates.push(state);
    }
  });
  let groupCounts = sortedStates.map((label) => {
    return counts[label];
  });
  if (thumbnail && groupCounts.length > 7) {
    groupCounts = groupCounts.slice(0, 7);
    sortedStates = sortedStates.slice(0, 7);
  }
  const colors = sortedStates.map((state) => ChromatinStateColor[state].hex);
  const data = {
    labels: sortedStates,
    datasets: [
      {
        label: "Number of chromatin state datasets",
        data: groupCounts,
        backgroundColor: colors,
        maxBarThickness: 50,
      },
    ],
  };
  // Check here for options setting detail: https://react-chartjs-2.js.org/components/bar
  const options = {
    // Resizes the chart canvas when its container does
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        // only display tick when it is a integer
        ticks: {
          callback: (val) => {
            return Number.isInteger(val) ? val : "";
          },
        },
      },
      x: {
        ticks: {
          //autoSkip to prevent over crowded ticks
          autoSkip: true,
        },
      },
    },
    plugins: {
      legend: {
        //put legend on top
        position: "top",
      },
    },
  };
  const optionForThumbnail = {
    // Resizes the chart canvas when its container does
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        // only display tick when it is a integer
        ticks: {
          callback: (val) => {
            return Number.isInteger(val) ? val : "";
          },
        },
      },
      x: {
        ticks: {
          //autoSkip to prevent over crowded ticks
          autoSkip: true,

          maxRotation: 90,
          minRotation: 90,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  return thumbnail ? (
    <Bar options={optionForThumbnail} data={data} height={height} />
  ) : (
    <Bar options={options} data={data} height={height} />
  );
}

ChromatinBarChart.propTypes = {
  assembly: PropTypes.string.isRequired,
  chromatinData: PropTypes.array.isRequired,
  // the height of the chart
  height: PropTypes.number,
  // whether this chart is a small thumbnail
  thumbnail: PropTypes.bool,
};
