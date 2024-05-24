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
import { GtexColor } from "../lib/tissue-specific-score";

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
      groupCountByBiosample[biosample].count += 1;
    } else {
      groupCountByBiosample[biosample] = {};
      groupCountByBiosample[biosample].count = 1;
      const organs = dataset.biosample_ontology.organ_slims;
      organs.sort((a, b) => {
        const scoreA = GtexColor[a] ? GtexColor[a].priority : 99;
        const scoreB = GtexColor[b] ? GtexColor[b].priority : 99;
        return scoreA - scoreB;
      });
      groupCountByBiosample[biosample].color =
        organs[0] && GtexColor[organs[0]]
          ? GtexColor[organs[0]].hex
          : "#808080";
      const organsScore = organs.map((organ) =>
        GtexColor[organ] ? GtexColor[organ].priority : 99
      );
      if (organs.length >= 2 && organsScore[0] === organsScore[1]) {
        console.log(organs.join(", "), organsScore.join(", "));
      }
    }
    return groupCountByBiosample;
  }, {});
  // biosamples are sorted by its group count
  let biosamples = Object.keys(counts).sort((a, b) => {
    return counts[b].count - counts[a].count;
  });
  let groupCounts = biosamples.map((label) => {
    return counts[label].count;
  });
  let organColors = biosamples.map((label) => {
    return counts[label].color;
  });
  if (thumbnail && groupCounts.length > 10) {
    groupCounts = groupCounts.slice(0, 10);
    biosamples = biosamples.slice(0, 10);
    organColors = organColors.slice(0, 10);
  }
  const data = {
    labels: biosamples,
    datasets: [
      {
        label: "Number of accessibility datasets",
        data: groupCounts,
        backgroundColor: organColors,
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
