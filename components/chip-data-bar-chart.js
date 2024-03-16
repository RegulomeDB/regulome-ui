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

export default function ChipDataBarChart({
  chipData,
  height = 600,
  thumbnail,
}) {
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

  const optionsThumbnail = {
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
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  return thumbnail ? (
    <Bar options={optionsThumbnail} data={data} height={height} />
  ) : (
    <Bar options={options} data={data} plugins={[zoomPlugin]} height={height} />
  );
}

ChipDataBarChart.propTypes = {
  chipData: PropTypes.array.isRequired,
  // the height of the chart
  height: PropTypes.number,
  // whether this chart is a small thumbnail
  thumbnail: PropTypes.bool,
};
