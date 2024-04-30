import React, { useContext } from "react";
import PropTypes from "prop-types";
import zoomPlugin from "chartjs-plugin-zoom";
import colors from "tailwindcss/colors";
import GlobalContext from "./global-context";

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
import {
  getBarChartOptions,
  getBarChartThumbnailOptions,
} from "../lib/chart-options";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChipDataBarChart({
  chipData,
  height = 600,
  thumbnail,
}) {
  const { darkMode } = useContext(GlobalContext);
  const labelColor = darkMode.enabled ? colors.white : colors.gray[800];
  const gridColor = darkMode.enabled ? colors.gray[700] : colors.gray[200];
  /**
   * Group datasets by dataset.targets and get a count for each group.
   * the counts looks like this:
   * {
   *   ARID3A: 4,
   *   ARID4A: 1,
   *   ARID4B: 1,
   * }
   *
   **/
  const counts = chipData.reduce((groupCountBytarget, dataset) => {
    const target = dataset.targets;
    if (target in groupCountBytarget) {
      groupCountBytarget[target] += 1;
    } else {
      groupCountBytarget[target] = 1;
    }
    return groupCountBytarget;
  }, {});
  // targets are target names for bar chart x labels, and are sorted by its group count
  let targets = Object.keys(counts).sort((a, b) => {
    return counts[b] - counts[a];
  });
  let groupCounts = targets.map((label) => {
    return counts[label];
  });
  if (thumbnail && groupCounts.length > 10) {
    groupCounts = groupCounts.slice(0, 10);
    targets = targets.slice(0, 10);
  }
  const data = {
    labels: targets,
    datasets: [
      {
        label: "Number of ChIP-seq datasets",
        data: groupCounts,
        backgroundColor: colors.cyan[700],
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
      plugins={[zoomPlugin]}
      height={height}
    />
  );
}

ChipDataBarChart.propTypes = {
  chipData: PropTypes.array.isRequired,
  // the height of the chart
  height: PropTypes.number,
  // whether this chart is a small thumbnail
  thumbnail: PropTypes.bool,
};
