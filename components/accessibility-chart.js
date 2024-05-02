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

export default function AccessibilityChart({
  accessibilityData,
  height = 600,
  thumbnail,
}) {
  const { darkMode } = useContext(GlobalContext);
  const labelColor = darkMode.enabled ? colors.white : colors.gray[800];
  const gridColor = darkMode.enabled ? colors.gray[700] : colors.gray[200];
  /**
   * Group datasets by dataset.biosample_ontology.term_name and get a count for each group.
   * the counts looks like this:
   * {
   *   spleen: 4,
   *   ovary: 1,
   *   pancreas: 1,
   * }
   *
   **/
  const counts = accessibilityData.reduce((groupCountByBiosample, dataset) => {
    const biosample = dataset.biosample_ontology.term_name;
    if (biosample in groupCountByBiosample) {
      groupCountByBiosample[biosample] += 1;
    } else {
      groupCountByBiosample[biosample] = 1;
    }
    return groupCountByBiosample;
  }, {});
  // biosamples are sorted by its group count
  let biosamples = Object.keys(counts).sort((a, b) => {
    return counts[b] - counts[a];
  });
  let groupCounts = biosamples.map((label) => {
    return counts[label];
  });
  if (thumbnail && groupCounts.length > 10) {
    groupCounts = groupCounts.slice(0, 10);
    biosamples = biosamples.slice(0, 10);
  }
  const data = {
    labels: biosamples,
    datasets: [
      {
        label: "Number of accessibility datasets",
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

AccessibilityChart.propTypes = {
  accessibilityData: PropTypes.array.isRequired,
  // the height of the chart
  height: PropTypes.number,
  // whether this chart is a small thumbnail
  thumbnail: PropTypes.bool,
};
