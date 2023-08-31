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
  Legend,
  zoomPlugin
);

export default function ChipDataBarChart({ chipData }) {
  const counts = chipData.reduce((groupCountBytarget, dataset) => {
    const target = dataset.targets;
    if (target in groupCountBytarget) {
      groupCountBytarget[target] += 1;
    } else {
      groupCountBytarget[target] = 1;
    }
    return groupCountBytarget;
  }, {});
  console.log(counts);
  const labels = Object.keys(counts).sort((a, b) => {
    return counts[b] - counts[a];
  });
  const values = labels.map((label) => {
    return counts[label];
  });
  const data = {
    labels,
    datasets: [
      {
        label: "Number of ChIP-seq datasets",
        data: values,
        backgroundColor: "#276A8E",
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: (val) => {
            return Number.isInteger(val) ? val : "";
          },
        },
      },
      // x:
      //   {
      //       ticks: {
      //           autoSkip: false,
      //     },
      // },
    },
    plugins: {
      legend: {
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

  return <Bar options={options} data={data} />;
}

ChipDataBarChart.propTypes = {
  chipData: PropTypes.array.isRequired,
};
