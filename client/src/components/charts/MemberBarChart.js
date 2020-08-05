import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const MemberBarChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    console.log(props.dataSource);
    const myChart = new Chart(chartRef.current, {
      type: "bar",
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [{ stacked: true }],
        },
      },
      data: {
        labels: props.uniqueName,
        datasets: props.dataSource,
      },
    });
  }, [props.dataSource, props.uniqueName]);

  return <canvas ref={chartRef} />;
};

export default MemberBarChart;
