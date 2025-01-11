import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import HistoricalData from './Components/Page Components/HistoricalData';
import LiveData from './Components/Page Components/LiveData';
import BaseAsset from './Components/Page Components/BaseAsset';
import { BINANCE_BASE_URL } from './API/API';

function useSymbols() {
  const [symbols, setSymbols] = useState([]);
  const [exchangeInfo, setExchangeInfo] = useState([]);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get(`${BINANCE_BASE_URL}/exchangeInfo`);
        setExchangeInfo(response.data.symbols);
        const symbolList = response.data.symbols.map((symbol) => symbol.symbol);
        symbolList.sort();
        setSymbols(symbolList);
      } catch (error) {
        console.error('Error fetching symbols:', error);
      }
    };

    fetchSymbols();
  }, []);

  return { symbols, exchangeInfo };
}

function BlockchainData({ theme }) {
  const { symbols, exchangeInfo } = useSymbols();
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedInterval, setSelectedInterval] = useState('1d');

  const handleSymbolChange = useCallback((event) => {
    setSelectedSymbol(event.target.value);
  }, []);

  const handleIntervalChange = useCallback((newInterval) => {
    setSelectedInterval(newInterval); 
  }, []);

  return (
    <div>
      <h1>BlockChain Data</h1>
      <BaseAsset selectedSymbol={selectedSymbol} exchangeInfo={exchangeInfo} />
      <LiveData selectedSymbol={selectedSymbol} />
      <HistoricalData 
        theme={theme}
        selectedSymbol={selectedSymbol} 
        selectedInterval={selectedInterval} 
        symbols={symbols} 
        onChange={handleSymbolChange} 
        onIntervalChange={handleIntervalChange} 
      />
    </div>
  );
}

export default BlockchainData;
