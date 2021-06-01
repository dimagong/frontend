import moment from "moment";

export const getChartConfig = ({ type, data }) => {
  return configApplicationChart(data);
  switch (type) {
    case 'applications': return configApplicationChart(data);
    default: return configDefaultChart(data);
  }
}

const configDefaultChart = ({dataToShow, isSmall, title}) => {
  if (!dataToShow) {
    return null;
  }

  return {
    type: 'line',
    data: dataToShow,
    options: {
      animated: true,
      responsive: true,
      aspectRatio: isSmall ? 1.46 : 3,
      plugins: {
        legend: {
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
          ticks: {
            stepSize: 2
          },
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
}

const getDate = (index) => {
  return moment().subtract(7 - index, 'days').format('ddd');
}

const configApplicationChart = ({dataToShow, isSmall, title, daysNumber}) => {
  if (!dataToShow) {
    return null;
  }

  const getTicks = (val, index) => {
    switch (daysNumber) {
      case 7: {
        return moment().subtract(daysNumber - index, 'days').format('ddd');
      }
      case 28: {
        if (val?.show || index % 4 === 2) {
          return moment().subtract(daysNumber - index, 'days').format('MMM DD');
        } else return;
      }
      case 365: {
        let format = val?.show ? 'MMM DD' : 'MMM';
        if (val?.show || index % 15 === 2) {
          return moment().subtract(daysNumber - index * 2, 'days').format(format);
        }
      }
    }
  }

  return {
    type: 'line',
    data: dataToShow,
    options: {
      animated: true,
      responsive: true,
      aspectRatio: isSmall ? 1.46 : 3,
      plugins: {
        legend: {
          position: 'bottom',
          align: isSmall ? 'end' : 'center',
          labels: {
            usePointStyle: true,
            padding: 15
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
        },

        tooltip: {
          callbacks: {
            title: (info) => title === 'Applications' ? 'Number of users' : getTicks({show: true}, info[0].dataIndex)
          }
        },
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          ticks: {
            callback: getTicks,
            align: 'end',
        },
          grid: {
            display: null,
          }
        },
        y: {
          max: 12,
          ticks: {
            stepSize: title === 'Applications' ? undefined : 2
          },
          title: {
            display: true,
          },
          //type: 'category',
          //labels: ['Approved', 'Rejected', 'Submitted', 'Unsubmitted', 'In progress'],
          grid: {
            display: null,
          }
        },
      },
      layout: {
        padding: {
          top: 10,
          right: 20
        }
      }
    },

  };
}
