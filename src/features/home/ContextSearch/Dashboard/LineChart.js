import React, {useEffect, useState} from 'react'
import Chart from 'chart.js/auto';
import moment from "moment";


const LineChart = ({ data, chartId, aspectRatio, daysNumber}) => {
  const [chartIsCreated, setChartIsCreated] = useState(false);
  const [currChart, setCurrChart] = useState(null);
  let pointsY = [];
  let labels = [];
  let isSmall = aspectRatio === 1.5;

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
          if (currMonth === moment().format('MMM') && labels.length === 0) {
            break;
          }
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
    responsive: true,
    aspectRatio: aspectRatio,
    plugins: {
      legend: {
        position: 'bottom',
        align: isSmall ? 'end' : 'center',
        labels: {
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: '       Activities',
        align: 'start',
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        grid: {
          display: null,
        }
      },
      y: {
        grid: {
          display: null,
        }
      },
    }
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
  }, [daysNumber, aspectRatio])

  return ( <div style={{width: '100%', height: "auto", position: 'relative', zIndex: 10}}>
    <canvas
      id={chartId}
      className={'dashboard-chart'}
    /></div>
  )
}

export default LineChart

