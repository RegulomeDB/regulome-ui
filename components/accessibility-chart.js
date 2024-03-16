import React from "react";
import PropTypes from "prop-types";
import zoomPlugin from "chartjs-plugin-zoom";

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

export default function AccessibilityChart({
  accessibilityData,
  height = 600,
  thumbnail,
}) {
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
        backgroundColor: "#276A8E",
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
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          pinch: {
            enabled: true, // Enable pinch zooming
          },
          wheel: {
            enabled: true, // Enable wheel zooming
          },
          mode: "x",
        },
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
    <Bar options={options} data={data} plugins={[zoomPlugin]} height={height} />
  );
}

AccessibilityChart.propTypes = {
  accessibilityData: PropTypes.array.isRequired,
  // the height of the chart
  height: PropTypes.number,
  // whether this chart is a small thumbnail
  thumbnail: PropTypes.bool,
};
