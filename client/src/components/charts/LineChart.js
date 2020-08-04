import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const LineChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: "line",
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "week",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
      },
      data: {
        labels: props.data.map((d) => d.time),
        datasets: [
          {
            label: props.title,
            data: props.data.map((d) => d.value),
            fill: "none",
            backgroundColor: props.color,
            pointRadius: 2,
            borderColor: props.color,
            borderWidth: 1,
            lineTension: 0,
          },
        ],
      },
    });
  }, []);

  return <canvas ref={chartRef} />;
};

export default LineChart;
