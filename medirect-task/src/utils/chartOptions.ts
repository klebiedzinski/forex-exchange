export const initialChartOptions = {
  stroke: { curve: "straight", width: 2 },
  xaxis: {
    labels: {
      show: false,
      enabled: false,
    },
  },

  yaxis: {
    labels: {
      show: false,
      enabled: false,
    },
  },
  noData: {
    text: "No data available.",
    align: "center",
    verticalAlign: "middle",
    offsetX: 0,
    offsetY: 0,
  },
  tooltip: {
    enabled: false,
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    legend: { show: false },
    categories: [],
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.4,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
};
