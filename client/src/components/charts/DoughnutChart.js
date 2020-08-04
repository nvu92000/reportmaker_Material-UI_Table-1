import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const DoughnutChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: "doughnut",
      options: {
        maintainAspectRatio: false,
      },
      data: {
        labels: props.data.map((d) => d.label),
        datasets: [
          {
            label: props.title,
            data: props.data.map((d) => d.value),
            backgroundColor: props.color,
          },
        ],
      },
    });
  }, []);

  return <canvas ref={chartRef} />;
};

export default DoughnutChart;
