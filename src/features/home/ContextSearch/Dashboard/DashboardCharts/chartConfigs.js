import moment from "moment";

export const getChartConfig = ({ type, data }) => {
  if (type === 'applications' && data?.dForm === 'Applications Snapshot') {
    return configApplicationSnapshotChart(data);
  }
  return configApplicationChart(data);
}

const configApplicationChart = ({dataToShow, isSmall, title, daysNumber, dForm, titleName}) => {
  if (!dataToShow || daysNumber === -1) {
    return null;
  }

  const getTicks = (val, index) => {
    // eslint-disable-next-line default-case
    switch (daysNumber) {
      case 7: {
        return moment().subtract(daysNumber - index - 1, 'days').format('ddd');
      }
      case 28: {
        if (val?.show || index % 4 === 2) {
          return moment().subtract(daysNumber - index - 1, 'days').format('MMM DD');
        } else return;
      }
      case 365: {
        let format = val?.show ? 'MMM DD' : 'MMM';
        if (val?.show || index % 30 === 1) {
          return moment().subtract(daysNumber - index - 1, 'days').format(format);
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
          display: title === 'Activities' || !isSmall,
          position: 'bottom',
          align: isSmall ? 'end' : 'center',
          labels: {
            usePointStyle: true,
            padding: 15,
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
          text: `     ${titleName ? titleName : title === 'Activities' ? title : dForm ? dForm : 'Unselected application'}`,
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
          ticks: {
            stepSize: title === 'Applications' ? 1 : 2
          },
          title: {
            display: true,
          },
          grid: {
            display: null,
          }
        },
      },
      layout: {
        padding: {
          top: 15,
          right: 20,
          left: -11,
          bottom: !(title === 'Activities' || !isSmall) ? 30 : 0
        }
      }
    },

  };
}

const configApplicationSnapshotChart = ({dataToShow, isSmall, title, daysNumber, dForm, titleName}) => {
  if (!dataToShow || daysNumber === -1) {
    return null;
  }

  const getTicks = (val, index) => {
    // eslint-disable-next-line default-case
    switch (daysNumber) {
      case 7: {
        return moment().subtract(daysNumber - index - 1, 'days').format('ddd');
      }
      case 28: {
        if (val?.show || index % 4 === 2) {
          return moment().subtract(daysNumber - index - 1, 'days').format('MMM DD');
        } else return;
      }
      case 365: {
        let format = val?.show ? 'MMM DD' : 'MMM';
        if (val?.show || index % 30 === 1) {
          return moment().subtract(daysNumber - index - 1, 'days').format(format);
        }
      }
    }
  }

  return {
    type: 'bar',
    data: dataToShow,
    options: {
      animated: true,
      responsive: true,
      aspectRatio: isSmall ? 1.46 : 3,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 15,
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
          text: `     ${titleName ? titleName : title === 'Activities' ? title : dForm ? dForm : 'Unselected application'}`,
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
          type: 'category',
          stacked: true,
          grid: {
            display: null,
          }
        },
        y: {
          stacked: true,
          ticks: {
            stepSize: title === 'Applications' ? undefined : 2
          },
          title: {
            display: true,
          },
          grid: {
            display: null,
          }
        },
      },
      layout: {
        padding: {
          top: 15,
          right: 20,
          left: -11,
          bottom: 40,
        }
      }
    },

  };
}
