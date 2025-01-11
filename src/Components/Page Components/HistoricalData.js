import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BINANCE_BASE_URL } from '../../API/API';
import ChartContainer from '../Elements/ChartContainer';

function HistoricalData({ theme, selectedSymbol, selectedInterval, symbols, onChange, onIntervalChange }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uniqueTimestamps = useRef(new Set());

  useEffect(() => {
    setHistoricalData([]);
    uniqueTimestamps.current.clear();
  }, [selectedSymbol, selectedInterval]);

  const filterUniqueData = useCallback((data) => {
    return data.filter(item => {
      const timestamp = item[0];
      return uniqueTimestamps.current.has(timestamp) ? false : uniqueTimestamps.current.add(timestamp);
    });
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async (endTime) => {
      return await axios.get(`${BINANCE_BASE_URL}/klines`, {
        cancelToken: source.token,
        params: {
          symbol: selectedSymbol,
          interval: selectedInterval,
          limit: 1000,
          endTime: endTime,
        },
      });
    };

    const fetchRecursive = async (endTime = Date.now()) => {
      try {
        const response = await fetchData(endTime);
        const filteredData = filterUniqueData(response.data);

        setHistoricalData(prevData => [...filteredData, ...prevData]);

        if (filteredData.length === 1000) {
          const nextEndTime = filteredData[0][0] - 1;
          await fetchRecursive(nextEndTime);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching historical data:', error);
        }
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchRecursive();

    return () => {
      source.cancel();
    };
  }, [selectedSymbol, selectedInterval, filterUniqueData]);

  return (
    <div>
      <p>{historicalData.length}</p>
      <ChartContainer 
        theme={theme}
        isLoading={isLoading}
        historicalData={historicalData}
        selectedSymbol={selectedSymbol}
        symbols={symbols}
        onChange={onChange} 
        onIntervalChange={onIntervalChange} 
      />
      <br />        
      <br />        
      <br />        
      <br />        
    </div>
  );
}

export default HistoricalData;
