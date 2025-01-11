import React, { useState, useMemo } from 'react';
import './ChartContainer.css';

import Bars from '../Charts/Bars';
import Candles from '../Charts/Candles';
import HollowCandles from '../Charts/HollowCandles';
import Line from '../Charts/Line';
import SelectChart from '../Page Components/SelectChart';
import LineWithMarker from '../Charts/LineWithMarker';
import StepLine from '../Charts/StepLine';
import Area from '../Charts/Area';
import HLCArea from '../Charts/HLCArea';

import SelectedInterval from '../Page Components/SelectInterval';
import SelectedSymbol from '../Page Components/SelectedSymbol';

import LoadingAnimation from './LoadingAnimation';

function ChartContainer({ theme, isLoading, historicalData, selectedSymbol, symbols, onChange, onIntervalChange }) {
  const [selectedChart, setSelectedChart] = useState('Bars');
  const [isChangingChart, setIsChangingChart] = useState(false);

  const handleChartChange = (chartType) => {
    setIsChangingChart(true);
    setTimeout(() => {
      setSelectedChart(chartType);
      setIsChangingChart(false);
    }, 0);
  };

  const ChartComponents = useMemo(() => ({
    'Bars': Bars,
    'Candles': Candles,
    'Hollow Candles': HollowCandles,
    'Line': Line,
    'Line with markers': LineWithMarker,
    'Step Line': StepLine,
    'Area': Area,
    'HLC Area': HLCArea
  }), []);

  const SelectedChartComponent = ChartComponents[selectedChart];

  return (
    <div className='chartContainer' style={{border: `1px solid ${theme === 'light' ? '#000' : '#fff'}`}}>
      <div className='dropdowns'>
        <SelectedSymbol
          theme={theme}
          selectedSymbol={selectedSymbol}
          symbols={symbols}
          onChange={onChange}
        />
        <SelectedInterval onIntervalChange={onIntervalChange} />
        <SelectChart onChartChange={handleChartChange} />
      </div>
      {isLoading || isChangingChart ? (
        <LoadingAnimation />
      ) : (
        <SelectedChartComponent 
          theme={theme}
          data={historicalData}   
        />
      )}
    </div>
  );
}

export default ChartContainer;