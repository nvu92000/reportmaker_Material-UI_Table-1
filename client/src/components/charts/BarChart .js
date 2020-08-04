import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const BarChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: "bar",
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

export default BarChart;
