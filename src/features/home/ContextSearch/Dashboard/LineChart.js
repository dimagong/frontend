import React, {Fragment, useEffect} from 'react'
import {Row} from "react-bootstrap";
import Chart from 'chart.js/auto';


const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];
const data = {
  labels: labels,
  datasets: [{
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  },
};

const LineChart = ({ data, chartId}) => {

  useEffect(() => {

    //if (typeof myChart !== "undefined") myChart.destroy();

    let myChart = new Chart(
      document.getElementById(chartId),
      config
    );
  }, [data]);

  return (
    <canvas
      id={chartId}
      className={'dashboard-chart'}
    />
  )
}

export default LineChart

