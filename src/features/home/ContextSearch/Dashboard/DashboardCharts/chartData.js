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
        pointsY = [{x:1, y: 5}, {x:2,y:3}, {x:3,y:4}, {x:4,y:4}, {x:5,y:7}, {x:6,y:5}, {x:7,y:6}]
        break;
      }
      case 28: {
        //pointsY = [5, 12, 9, 22, 21, 19, 28]
        pointsY = [{x:1, y: 5}, {x:2,y:3}, {x:3,y:4}, {x:4,y:4}, {x:5,y:7}, {x:6,y:5}, {x:7,y:6},
                   {x:8, y: 5}, {x:9,y:3}, {x:10,y:4}, {x:11,y:4}, {x:12,y:7}, {x:13,y:5}, {x:14,y:6},
                   {x:15, y: 5}, {x:16,y:3}, {x:17,y:4}, {x:18,y:4}, {x:19,y:7}, {x:20,y:5}, {x:21,y:6},
                   {x:22, y: 5}, {x:23,y:3}, {x:24,y:4}, {x:25,y:4}, {x:26,y:7}, {x:27,y:5}, {x:28,y:6}]
        break;
      }
      default: {
        pointsY = []
        for (let i = 0; i < 182 - 28; ++i) {
          pointsY.push({x: i + 1, y : 0})
        }
        let last = [{x:153 + 1, y: 5}, {x:153 + 2,y:3}, {x:153 + 3,y:4}, {x:153 + 4,y:4}, {x:153 + 5,y:7}, {x:153 + 6,y:5}, {x:153 + 7,y:6},
                   {x:153 + 8, y: 5}, {x:153 + 9,y:3}, {x:153 + 10,y:4}, {x:153 + 11,y:4}, {x:153 + 12,y:7}, {x:153 + 13,y:5}, {x:153 + 14,y:6},
                   {x:153 + 15, y: 5}, {x:153 + 16,y:3}, {x:153 + 17,y:4}, {x:153 + 18,y:4}, {x:153 + 19,y:7}, {x:153 + 20,y:5}, {x:153 + 21,y:6},
                   {x:153 + 22, y: 5}, {x:153 + 23,y:3}, {x:153 + 24,y:4}, {x:153 + 25,y:4}, {x:153 + 26,y:7}, {x:153 + 27,y:5}, {x:153 + 28,y:6}]
        pointsY = pointsY.concat(last);
      }
    }
  //}


  return {
        labels: daysNumber === 365 ? new Array(182) : new Array(daysNumber),
        datasets: [{
          label: `Number of ${title.toLowerCase()}`,
          borderColor: '#d96f6f',
          backgroundColor: '#d96f6f',
          radius: 0,
          hoverRadius: 0,
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
  pointsY = [{x: 1, y: 4}, {x: 2, y: 3}, {x: 3, y: 8}, {x: 4, y: 10},
                   {x: 5, y: 6}, {x: 6, y: 7}, {x: 7, y: 5}]

  let pointsY2 = [{x: 1, y: 2}, {x: 2, y: 1}, {x: 3, y: 5}, {x: 4, y: 4},
                   {x: 5, y: 2}, {x: 6, y: 3}, {x: 7, y: 10} ];
  if (title === 'Applications') {
    switch (daysNumber) {
      case 7: {
        pointsY = [{x: 1, y: 4}, {x: 2, y: 3}, {x: 3, y: 8}, {x: 4, y: 10},
                   {x: 5, y: 6}, {x: 6, y: 7}, {x: 7, y: 5}]
        break;
      }
      case 28: {
        for (let i = 0; i < 21; ++i) {
          pointsY.push(pointsY[i % 7]);
          pointsY2.push(pointsY2[i % 7]);
        }
        pointsY2 = pointsY2.concat(pointsY2.concat(pointsY2.concat(pointsY2)));
        for (let i = 1; i < 29; ++i) {
          pointsY[i - 1].x = i;
          pointsY2[i - 1].x = i;
        }
        break;
      }
      default: {
        let start = [];
        for (let i = 0; i < 182 - 28; ++i) {
          start.push({x: i + 1, y : 0})
        }
        for (let i = 0; i < 21; ++i) {
          pointsY.push(pointsY[i % 7]);
          pointsY2.push(pointsY2[i % 7]);
        }
        pointsY2 = pointsY2.concat(pointsY2.concat(pointsY2.concat(pointsY2)));
        for (let i = 1; i < 29; ++i) {
          pointsY[i - 1].x = i;
          pointsY2[i - 1].x = i;
        }
        let start2 = start.concat(pointsY2)
        start = start.concat(pointsY)
        for (let i = 1; i < 183; ++i) {
          start[i - 1].x = i;
          //if (!pointsY[i - 1].hasOwnProperty('y')) pointsY[i - 1].y = 0;
          start2[i - 1].x = i;
          //if (!pointsY2[i - 1].hasOwnProperty('y')) pointsY2[i - 1].y = 0;
        }
        pointsY = start;
        pointsY2 = start2
      }
    }
  }

  return {
        labels: daysNumber === 365 ? new Array(182) : new Array(daysNumber),
        datasets: [{
          label: `DForm-1`,
          borderColor: colors[0],
          backgroundColor: colors[0],
          radius: 0,
          hoverRadius: 0,
          data: pointsY,

        },
          {
            label: `DForm-2`,
            borderColor: colors[1],
            backgroundColor: colors[1],
            radius: 0,
            hoverRadius: 0,
            data: pointsY2,
          }]
      }
}
