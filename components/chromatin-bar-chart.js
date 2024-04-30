import React, { useContext } from "react";
import PropTypes from "prop-types";
import colors from "tailwindcss/colors";
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
import GlobalContext from "./global-context";
import {
  getBarChartOptions,
  getBarChartThumbnailOptions,
} from "../lib/chart-options";

export default function ChromatinBarChart({
  chromatinData,
  assembly,
  height = 600,
  thumbnail,
}) {
  const { darkMode } = useContext(GlobalContext);
  const labelColor = darkMode.enabled ? colors.white : colors.gray[800];
  const gridColor = darkMode.enabled ? colors.gray[700] : colors.gray[200];
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
  const colorsForDatasets = sortedStates.map(
    (state) => ChromatinStateColor[state].color
  );
  const data = {
    labels: sortedStates,
    datasets: [
      {
        label: "Number of chromatin state datasets",
        data: groupCounts,
        backgroundColor: colorsForDatasets,
        maxBarThickness: 50,
      },
    ],
  };
  return thumbnail ? (
    <Bar
      options={getBarChartThumbnailOptions(labelColor, gridColor)}
      data={data}
      height={height}
    />
  ) : (
    <Bar
      options={getBarChartOptions(labelColor, gridColor)}
      data={data}
      height={height}
    />
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
