import React, { useState } from 'react';
import DropDown from '../Elements/DropDown';
import './SelectChart.css'; // Assuming you've moved the styles to a separate CSS file

function SelectChart({ onChartChange }) {
  const [selectedChart, setSelectedChart] = useState('Bars');

  const chartOptions = [
    'Bars', 'Candles', 'Hollow Candles', 'Line', 'Line with markers', 'Step Line', 'Area', 'HLC Area'
    // , 'Baseline', 'Columns', 'High-Low', 'Heikin Ashi', 'Renko', 'Line break', 'Kagi', 'Point & figure'
  ];

  const handleChartChange = (event) => {
    const newChart = event.target.value;
    setSelectedChart(newChart);
    onChartChange(newChart); 
  };

  return (
    <div className="select-chart-container">
      <DropDown data={chartOptions} selectedValue={selectedChart} onValueChange={handleChartChange}  />
    </div>
  );
}

export default SelectChart;
