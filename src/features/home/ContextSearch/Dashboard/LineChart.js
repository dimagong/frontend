import React, {useEffect, useState} from 'react'
import Chart from 'chart.js/auto';
import moment from "moment";


const LineChart = ({ data, chartId, aspectRatio, width, daysNumber}) => {
  const [chartIsCreated, setChartIsCreated] = useState(false);
  const [currChart, setCurrChart] = useState(null);
  let pointsY = [];
  let labels = [];

  if (data) {
    for (let i = 1; i <= daysNumber; ++i) {
      let currDate = moment().subtract(daysNumber - i, 'days').format('YYYY-MM-DD');
      switch (daysNumber) {
        case 7: {
          labels.push(moment().add(i, 'days').format('ddd'));
          if (data[currDate]) {
            pointsY.push(data[currDate]?.total)
          } else {
            pointsY.push(0)
          }
          break;
        }
        case 28: {
          if (i % 4 === 1) {
            labels.push(moment().subtract(daysNumber - i, 'days').format('DD/MM')
              + ' - '
              + moment().subtract(daysNumber - i - 3, 'days').format('DD/MM'));
            if (data[currDate]) {
              pointsY.push(data[currDate]?.total)
            } else {
              pointsY.push(0)
            }
          } else {
            if (data[currDate]) pointsY[pointsY.length - 1] += data[currDate]?.total
          }
          break;
        }
        default: {
          let currMonth = moment().subtract(daysNumber - i, 'days').format('MMM');
          if (labels.length ===0 || currMonth !== labels[labels.length - 1]) {
           labels.push(currMonth);
           if (data[currDate]) {
              pointsY.push(data[currDate]?.total)
            } else {
              pointsY.push(0)
            }
          } else {
            if (data[currDate]) pointsY[pointsY.length - 1] += data[currDate]?.total
          }
        }
      }
    }

  }

  const dataToShow = {
  labels: labels,
  datasets: [{
    label: 'Number of activities',
    borderColor: 'red',
    backgroundColor: 'red',
    data: pointsY,
  }]
};

const config = {
  type: 'line',
  data: dataToShow,
  options: {
    animated: true,
    responsive: false,
    aspectRatio: aspectRatio,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Activities'
      }
    },
  },
};


  useEffect(() => {

    if (!chartIsCreated && data) {

      let myChart = new Chart(
        document.getElementById(chartId),
        config
      );
      setCurrChart(myChart)
      setChartIsCreated(true)
    }
  }, [data]);

  useEffect(() => {
    if (currChart) {
      currChart.destroy()
      let myChart = new Chart(
        document.getElementById(chartId),
        config
      );
      setCurrChart(myChart)
    }
  }, [daysNumber])

  return (
    <canvas
      height='250'
      width={width}
      style={{margin: 'auto'}}
      id={chartId}
      className={'dashboard-chart'}
    />
  )
}

export default LineChart

