import moment from "moment";

const colors = ['#d96f6f', '#add8e6', '#6FD98D', '#F0D46E', '#F5F535', '#35E7F5']

export const getChartData = ({type, data}) => {
  if (type === 'applications' && data?.dForm === 'Applications Snapshot') {
    return dataApplicationSnapshotChart(data)
  }
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

  return {
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


const dataApplicationChart = ({data, daysNumber, title, isSmall, dForm}) => {
  if (!data || daysNumber === -1) {
    return null;
  }
  let pointsY = {'in-progress': [],  'submitted': [], 'approved': [], "rejected": [] };
  for (let i = 1; i < daysNumber + 1; ++i) {
    let currDay = moment().subtract(daysNumber - i, 'days').format('YYYY-MM-DD')
    if (data[currDay]) {
      let currInfo = {'in-progress': 0,  'submitted': 0, 'approved': 0, "rejected": 0};
      if (data[currDay][dForm]) {
        Object.values(data[currDay][dForm]).forEach(item => {
          Object.keys(item).forEach(key => {
            if (key === 'unsubmitted') {
              currInfo['in-progress'] += item[key]
            } else {
              currInfo[key] += item[key]
            }
          })
        })
      }
      Object.keys(pointsY).forEach(item => pointsY[item].push({x: i, y: currInfo[item]}));
    } else {
      Object.values(pointsY).forEach(item => {item.push({x: i, y: 0})});
    }
  }

  if (!dForm || dForm === 'Unselected application') {
    pointsY = {'in-progress' : [], 'submitted' : [], 'approved': [], 'rejected': []}
  }

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
  return {
        labels: new Array(daysNumber),
        datasets: datasets
      }
};

const dataApplicationSnapshotChart = ({data, daysNumber, title, isSmall, dForm, dFormIds, dashboardDForms}) => {
  if (!dFormIds) {
    return {
        labels: ['in-progress', 'submitted', 'approved', "rejected"],
        datasets: []
      }
  }
  if (!data || daysNumber === -1) {
    return null;
  }
  let results = {};
  if (data) {
    data.forEach(application => {
      if (!results[application.name]) {
         results[application.name] = {'in-progress': 0, 'submitted': 0, 'approved': 0,  "rejected": 0};
      }
      ++results[application.name][application.status === 'unsubmitted' ? 'in-progress' : application.status];
    })
  }


  let datasets = []
  Object.keys(results).forEach((item, key) => {
    datasets.push({
      label: item,
      borderColor: colors[(key + 1) % 6],
      backgroundColor: colors[(key + 1) % 6],
      radius: 0,
      hoverRadius: 0,
      data: results[item],
    })
  })

  if (!dFormIds) {
    datasets = []
  }

  let chosenDForms = [];
  if (dFormIds && dashboardDForms) {
      // dFormIds (array of dForms) was changed to dFormTemplate id
      Object.keys(dashboardDForms).forEach(key => {
        if (Object.values(dashboardDForms).indexOf(dFormIds) !== -1) {
          if (chosenDForms.findIndex(chosen => chosen.name === key) === -1) {
            chosenDForms.push({name: key, id: dashboardDForms[key]})
          }
        }
      })
  }

  chosenDForms.forEach(dForm => {
    if (datasets.findIndex(set => set.label === dForm.name) === -1) {
      datasets.push({
      label: dForm.name,
      borderColor: colors[(datasets.length + 1) % 6],
      backgroundColor: colors[(datasets.length + 1) % 6],
      radius: 0,
      hoverRadius: 0,
      data: [{x: 'in-progress', y: 0}, {x: 'submitted', y: 0}, {x: 'approved', y: 0},  {x: 'rejected', y: 0}],
    });
    }
  });

  return {
        labels: ['in-progress', 'submitted', 'approved', "rejected"],
        datasets: datasets
      }
}
