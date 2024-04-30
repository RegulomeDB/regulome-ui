/**
 * this function returns the options for the bar chart.
 * Check here for options setting detail: https://react-chartjs-2.js.org/components/bar
 * @param {*} labelColor the color of the label
 * @param {*} gridColor the color of the grid
 * @returns the options for the bar chart
 */
export function getBarChartOptions(labelColor, gridColor) {
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
          color: labelColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          //autoSkip to prevent over crowded ticks
          autoSkip: true,
          color: labelColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
    plugins: {
      legend: {
        //put legend on top
        position: "top",
        labels: {
          color: labelColor,
        },
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
  return options;
}

export function getBarChartThumbnailOptions(labelColor, gridColor) {
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
          color: labelColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          //autoSkip to prevent over crowded ticks
          autoSkip: true,
          maxRotation: 90,
          minRotation: 0,
          color: labelColor,
        },
        grid: {
          color: gridColor,
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
  return optionForThumbnail;
}
