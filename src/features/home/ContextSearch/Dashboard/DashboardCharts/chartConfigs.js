import moment from "moment";

export const getChartConfig = ({ type, data }) => {
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

const configApplicationChart = ({dataToShow, isSmall, title}) => {
  if (!dataToShow) {
    return null;
  }

  return {
    type: 'scatter',
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
          ticks: {
          // For a category axis, the val is the index so the lookup via getLabelForValue is needed
          callback: function(val, index) {
            // Hide the label of every 2nd dataset
            return getDate(index);
          },
        },
          grid: {
            display: null,
          }
        },
        y: {
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
          left: 5,
          top: 10,
          right: 20
        }
      }
    },

  };
}
