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
import {
  TissueScoreHexColor,
  getScoreRange,
} from "../lib/tissue-specific-score";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Datalabels
);

export function TissueScoreBar({ tissueSpecificScores, showLabel }) {
  const [min, max] = getScoreRange(tissueSpecificScores);

  const unitValue = (max - min) / 10;

  const datasets = [];
  const colors = TissueScoreHexColor;
  colors[11] = "transparent";
  for (let i = 0; i <= 10; i++) {
    datasets.push({
      data: [0.1 * i],
      backgroundColor: colors[i],
      barPercentage: 0.2,
      // maxBarThickness: 30,
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

  // Check here for options setting detail: https://react-chartjs-2.js.org/components/bar
  const options = {
    // Resizes the chart canvas when its container does
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
        display: showLabel,
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
        formatter: (value, context) => {
          console.log(context);
          if (showLabel) {
            return (value * 10 * unitValue + min).toFixed(3);
          }
          return null;
        },
      },
    },
  };
  return <Bar options={options} data={data} redraw={true} />;
}

TissueScoreBar.propTypes = {
  tissueSpecificScores: PropTypes.array.isRequired,
  showLabel: PropTypes.bool.isRequired,
};
