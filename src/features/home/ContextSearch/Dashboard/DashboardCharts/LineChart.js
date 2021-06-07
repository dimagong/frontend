import React, {useEffect, useState} from 'react'
import Chart from 'chart.js/auto';
import {getChartConfig} from "./chartConfigs";
import {getChartData} from "./chartData";


const LineChart = ({ settings, data, chartId, isSmall, daysNumber, title}) => {
  const [chartIsCreated, setChartIsCreated] = useState(false);
  const [currChart, setCurrChart] = useState(null);

  const dataToShow = getChartData({
    data: {
      data: data,
      title: title,
      daysNumber: daysNumber,
      isSmall: isSmall,
      dForm: settings.dForm?.name
    },
    type: title.toLowerCase()
  });

  const config = getChartConfig({
    data: {
      dataToShow: dataToShow,
      isSmall: isSmall,
      title: title,
      daysNumber: daysNumber,
      dForm: settings.dForm?.name
    },
    type: title.toLowerCase()
  });


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
  }, [daysNumber, isSmall, data, settings])

  return ( <div style={{width: '100%', height: "auto", position: 'relative', zIndex: 10}}>
    <canvas
      id={chartId}
      className={'dashboard-chart'}
    />
  </div>
  )
}

export default LineChart;
