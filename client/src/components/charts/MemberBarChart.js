import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const MemberBarChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: "bar",
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }],
        },
      },
      data: {
        labels: [
          "Adven", // member name
          "Akiyama",
          "Allen",
          "Christos",
          "Eric",
          "Fuji",
          "Funajun",
          "George",
          "Hirado",
        ],
        datasets: [
          {
            label: "200031", // project id
            backgroundColor: "#caf270",
            data: [21, 0, 0, 0, 0, 0, 0, 0, 0], // worktime
          },
          {
            label: "200042",
            backgroundColor: "#45c490",
            data: [8, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            label: "999999",
            backgroundColor: "#008d93",
            data: [3, 20, 0, 0, 0, 0, 2, 24, 0],
          },
          {
            label: "200006",
            backgroundColor: "#2e5468",
            data: [0, 0, 34, 0, 0, 0, 0, 0, 0],
          },
          {
            label: "200045",
            backgroundColor: "#2e5468",
            data: [0, 5, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            label: "200034",
            backgroundColor: "#2e5468",
            data: [0, 1, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
    });
  }, []);

  return <canvas ref={chartRef} />;
};

export default MemberBarChart;
