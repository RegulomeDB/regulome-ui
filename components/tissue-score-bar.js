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
import Datalabels from "chartjs-plugin-datalabels";
import { TissueScoreHexColor } from "../lib/tissue-specific-score";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Datalabels
);

export function TissueScoreBar({ normalizedTissueSpecificScore }) {
  const organs = Object.keys(normalizedTissueSpecificScore);
  let min = parseFloat(normalizedTissueSpecificScore[organs[0]][0]);
  let max = parseFloat(normalizedTissueSpecificScore[organs[0]][0]);
  organs.forEach((organ) => {
    if (normalizedTissueSpecificScore[organ][1] === 1) {
      min = parseFloat(normalizedTissueSpecificScore[organ][0]);
    } else if (normalizedTissueSpecificScore[organ][1] === 10) {
      max = parseFloat(normalizedTissueSpecificScore[organ][0]);
    }
  });
  const unitValue = (max - min) / 10;
  const datasets = [];
  const colors = TissueScoreHexColor;
  for (let i = 0; i <= 10; i++) {
    datasets.push({
      data: [0.1 * i],
      backgroundColor: colors[i],
      barPercentage: 0.2,
      borderColor: colors[i],
      borderSkipped: false,
      borderRadius: [
        { topLeft: 0, topRight: 0, bottomLeft: 10, bottomRight: 10 },
      ],
    });
  }
  datasets[10].borderRadius = [
    { topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 },
  ];

  const data = {
    labels: ["Score"],
    datasets,
  };

  const options = {
    animation: false,
    responsive: true,
    aspectRatio: 0.5,
    scales: {
      y: {
        stacked: false,
        beginAtZero: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: true,
          color: "transparent",
        },
      },
      x: {
        display: true,
        stacked: true,
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
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: true,
        anchor: "end",
        offset: 15,
        align: "right",
        formatter: (value) => {
          return (value * 10 * unitValue + min).toFixed(3);
        },
      },
    },
  };
  return <Bar options={options} data={data} redraw={true} />;
}

TissueScoreBar.propTypes = {
  normalizedTissueSpecificScore: PropTypes.object.isRequired,
};
