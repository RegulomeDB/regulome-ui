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
  Legend
);

export function TissueScoreBar({ normalizedTissueSpecificScore }) {
  const organs = Object.keys(normalizedTissueSpecificScore);
  let MIN_SCORE = parseFloat(normalizedTissueSpecificScore[organs[0]][0]);
  let MAX_SCORE = parseFloat(normalizedTissueSpecificScore[organs[0]][0]);
  organs.forEach((organ) => {
    if (normalizedTissueSpecificScore[organ][1] === 1) {
      MIN_SCORE = parseFloat(normalizedTissueSpecificScore[organ][0]);
    } else if (normalizedTissueSpecificScore[organ][1] === 10) {
      MAX_SCORE = parseFloat(normalizedTissueSpecificScore[organ][0]);
    }
  });
  const unitValue = (MAX_SCORE - MIN_SCORE) / 10;
  const datasets = TissueScoreHexColor.map((color, i) => {
    return {
      data: [i],
      backgroundColor: color,
      barPercentage: 0.2,
      categoryPercentage: 1,
      // barThickness: 20,
      borderColor: color,
      borderSkipped: false,
      borderRadius: [
        { topLeft: 0, topRight: 0, bottomLeft: 10, bottomRight: 10 },
      ],
    };
  });

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
        offset: 6,
        align: "right",
        formatter: (value) => {
          if (value % 2 === 0) {
            return (value * unitValue + MIN_SCORE).toFixed(2);
          }
          return "";
        },
      },
    },
  };
  return <Bar options={options} data={data} plugins={[Datalabels]} />;
}

TissueScoreBar.propTypes = {
  normalizedTissueSpecificScore: PropTypes.object.isRequired,
};
