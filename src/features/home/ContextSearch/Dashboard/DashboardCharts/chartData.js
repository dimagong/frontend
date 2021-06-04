import moment from "moment";

const colors = ['#d96f6f', '#add8e6', '#6FD98D', '#F0D46E', '#F5F535', '#35E7F5']

export const getChartData = ({type, data}) => {
  switch (type) {
    case 'applications': return dataApplicationChart(data);
    default: return dataDefaultChart(data);
  }
}

const dataDefaultChart = ({data, daysNumber, title}) => {
  if (!data || daysNumber === -1) {
    return null;
  }
  let pointsY = [];
  for (let i = 1; i < daysNumber + 1; ++i) {
    let currDay = moment().subtract(daysNumber - i, 'days').format('YYYY-MM-DD')
    pointsY.push({x: i, y: data[currDay] ? data[currDay].total : 0});
  }
  /*
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
        for (let i = 0; i < 91 - 28; ++i) {
          pointsY.push({x: i + 1, y : 0})
        }
        let last = [{x:63 + 1, y: 5}, {x:63 + 2,y:3}, {x:63 + 3,y:4}, {x:63 + 4,y:4}, {x:63 + 5,y:7}, {x:63 + 6,y:5}, {x:63 + 7,y:6},
                   {x:63 + 8, y: 5}, {x:63 + 9,y:3}, {x:63 + 10,y:4}, {x:63 + 11,y:4}, {x:63 + 12,y:7}, {x:63 + 13,y:5}, {x:63 + 14,y:6},
                   {x:63 + 15, y: 5}, {x:63 + 16,y:3}, {x:63 + 17,y:4}, {x:63 + 18,y:4}, {x:63 + 19,y:7}, {x:63 + 20,y:5}, {x:63 + 21,y:6},
                   {x:63 + 22, y: 5}, {x:63 + 23,y:3}, {x:63 + 24,y:4}, {x:63 + 25,y:4}, {x:63 + 26,y:7}, {x:63 + 27,y:5}, {x:63 + 28,y:6}]
        pointsY = pointsY.concat(last);
      }
    }
  //}
*/

  return {
        //labels: daysNumber === 365 ? new Array(92) : new Array(daysNumber),
        labels: new Array(daysNumber),
        datasets: [{
          label: `Number of ${title.toLowerCase()}`,
          borderColor: colors[1],
          backgroundColor: colors[1],
          radius: 0,
          hoverRadius: 0,
          data: pointsY,
        }]
      }
}


const dataApplicationChart = ({data, daysNumber, title, isSmall}) => {
  if (!data || daysNumber === -1) {
    return null;
  }
  let pointsY = {'in-progress': [],  'submitted': [], 'approved': [], "rejected": [] };
  let currDForm = undefined;
  for (let i = 1; i < daysNumber + 1; ++i) {
    let currDay = moment().subtract(daysNumber - i, 'days').format('YYYY-MM-DD')
    if (data[currDay]) {
      let currInfo = {'in-progress': 0,  'submitted': 0, 'approved': 0, "rejected": 0};
      Object.values(data[currDay]).forEach(item => {
        if (!currDForm) {
          currDForm = item.application_name;
        }
        if (currDForm === item.application_name) {
          if (item.application_status === 'unsubmitted') {
            ++currInfo['in-progress'];
          } else {
            ++currInfo[item.application_status];
          }
        }
      });
      Object.keys(pointsY).forEach(item => pointsY[item].push({x: i, y: currInfo[item]}));
    } else {
      Object.values(pointsY).forEach(item => {item.push({x: i, y: 0})});
    }
  }

  /*
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
        for (let i = 0; i < 91 - 28; ++i) {
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
        for (let i = 1; i < 91; ++i) {
          start[i - 1].x = i;
          //if (!pointsY[i - 1].hasOwnProperty('y')) pointsY[i - 1].y = 0;
          start2[i - 1].x = i;
          //if (!pointsY2[i - 1].hasOwnProperty('y')) pointsY2[i - 1].y = 0;
        }
        pointsY = start;
        pointsY2 = start2
      }
    }
  }*/

  let datasets= [{
          label: 'In progress',
          borderColor: colors[1],
          backgroundColor: colors[1],
          radius: 0,
          hoverRadius: 0,
          data: pointsY['in-progress'],
        },
          {
          label: 'Submitted',
          borderColor: colors[3],
          backgroundColor: colors[3],
          radius: 0,
          hoverRadius: 0,
          data: pointsY['submitted'],
        },
        {
          label: 'Approved',
          borderColor: colors[2],
          backgroundColor: colors[2],
          radius: 0,
          hoverRadius: 0,
          data: pointsY['approved'],
        },
        {
          label: 'Rejected',
          borderColor: colors[0],
          backgroundColor: colors[0],
          radius: 0,
          hoverRadius: 0,
          data: pointsY['rejected'],
        },]
  if (isSmall) {
    datasets.splice(1, 1);
  }
  return {
        //labels: daysNumber === 365 ? new Array(91) : new Array(daysNumber),
        labels: new Array(daysNumber),
        datasets: datasets
      }
}
