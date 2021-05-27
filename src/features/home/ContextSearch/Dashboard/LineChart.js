import React, {useEffect, useState} from 'react'
import Chart from 'chart.js/auto';
import moment from "moment";


const LineChart = ({ data, chartId, aspectRatio, daysNumber, title}) => {
  const [chartIsCreated, setChartIsCreated] = useState(false);
  const [currChart, setCurrChart] = useState(null);
  let pointsY = [];
  let labels = [];
  let isSmall = aspectRatio === 1.46;

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
  //labels = ['inProgress', '', '', '']

  //test data
  if (title === 'Actions') {
    switch (daysNumber) {
      case 7: {
        pointsY = [5, 3, 4, 4, 7, 5, 6]
        break;
      }
      case 28: {
        pointsY = [5, 12, 9, 22, 21, 19, 28]
        break;
      }
      default: {
        pointsY = [18, 24, 35, 30, 59, 66, 49, 51, 122, 132, 96, 85]
      }
    }
  }

  const dataToShow = title === 'Actions'
    ? {
        labels: labels,
        datasets: [{
          label: `Number of ${title.toLowerCase()}`,
          borderColor: '#d96f6f',
          backgroundColor: '#d96f6f',
          data: pointsY,
        }]
      }
    : {
        labels: labels,
      datasets: [
        {
          label: `DForm-1`,
          borderColor: '#d96f6f',
          backgroundColor: '#d96f6f',
          data: pointsY[0],
        },
        {
          label: `DForm-2`,
          borderColor: 'grey',
          backgroundColor: 'grey',
          data: pointsY[1],
        }
      ]
    }

const config = {
  type: 'line',
  data: dataToShow,
  options: {
    animated: true,
    responsive: true,
    aspectRatio: aspectRatio,
    plugins: {
      legend: {
        title: {
          color: '#1FF204',
          text: 'TITLE'
        },
        position: 'bottom',
        align: isSmall ? 'end' : 'center',
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        padding: {
          bottom: 25
        },
        font: {
          size: 18
        },
        color: '#707070',
        display: true,
        text: `     ${title}`,
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
    },
    layout: {
      padding: {
        left: 5,
        top: 10,
        right: 20
      }
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

