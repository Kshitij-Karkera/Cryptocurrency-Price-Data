import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DropDown from '../Elements/DropDown';
import './SelectInterval.css'; 

function SelectInterval({ onIntervalChange }) {
  const [selectedInterval, setSelectedInterval] = useState('1d');

  const intervalOptions = [
    '1s', '1m', '3m', '5m', '30m', '1h', '2h', '4h', '8h', '12h', '1d', '3d', '1w', '1M'
  ];

  const handleIntervalChange = (event) => {
    const newInterval = event.target.value;
    setSelectedInterval(newInterval);
    onIntervalChange(newInterval); 
  };

  return (
    <div className="select-interval-container">
      <DropDown data={intervalOptions} selectedValue={selectedInterval} onValueChange={handleIntervalChange}  />
    </div>
  );
}

SelectInterval.propTypes = {
  onIntervalChange: PropTypes.func.isRequired,
};

export default SelectInterval;
