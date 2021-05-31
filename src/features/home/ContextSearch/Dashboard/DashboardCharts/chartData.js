import moment from "moment";

const colors = ['#d96f6f', '#add8e6', '#35F58F', '#BE35F5', '#F5F535', '#35E7F5']

export const getChartData = ({type, data}) => {
  switch (type) {
    case 'applications': return dataApplicationChart(data);
    default: return dataDefaultChart(data);
  }
}

const dataDefaultChart = ({data, daysNumber, title}) => {
  if (!data) {
    return null;
  }

  let pointsY = [];
  let labels = [];
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

  //test data
  //if (title === 'Actions') {
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
  //}


  return {
        labels: labels,
        datasets: [{
          label: `Number of ${title.toLowerCase()}`,
          borderColor: '#d96f6f',
          backgroundColor: '#d96f6f',
          data: pointsY,
        }]
      }
}


const dataApplicationChart = ({data, daysNumber, title}) => {
  if (!data) {
    return null;
  }

  let pointsY = [];
  let labels = [];
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

  return {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16],
        datasets: [{
          label: `DForm-1`,
          borderColor: colors[0],
          backgroundColor: colors[0],
          data: [{x: 1, y: 4, r: 1}, {x: 2, y: 3, r: 1}, {x: 3, y: 8, r: 1}, {x: 4, y: 10, r: 1},
                   {x: 5, y: 6, r: 1}, {x: 6, y: 7, r: 1}, {x: 7, y: 5, r: 1}, ],

        },
          {
            label: `DForm-2`,
            borderColor: colors[1],
            backgroundColor: colors[1],
            data: [{x: 1, y: 2, r: 1}, {x: 1.5, y: 2, r: 1}, {x: 2, y: 1, r: 1}, {x: 3, y: 5, r: 1}, {x: 4, y: 4, r: 1},
                   {x: 5, y: 2, r: 1}, {x: 6, y: 3, r: 1}, {x: 7, y: 10, r: 1}, ],
          }]
      }
}
