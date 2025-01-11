import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BINANCE_BASE_URL } from '../../API/API';

function LiveData({ selectedSymbol }) {
  const [liveData, setLiveData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchLiveData = useCallback(async (symbol) => {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/ticker/price`, {
        params: { symbol },
      });
      const livePrice = parseFloat(response.data.price);
      setLiveData((prevData) => 
        prevData && prevData.price === livePrice ? prevData : { price: livePrice }
      );
    } catch (error) {
      console.error('Error fetching live data:', error);
    }
  }, []);

  useEffect(() => {
    const liveDataInterval = setInterval(() => {
      fetchLiveData(selectedSymbol);
    }, 1000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(liveDataInterval);
      clearInterval(timeInterval);
    };
  }, [selectedSymbol, fetchLiveData]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  return (
    <div>
      <h2>Live Data</h2>
      {liveData && (
        <div>
          <p>
            Time: {currentTime.toLocaleString()},
            Current Price(USD): {formatPrice(liveData.price)}
          </p>
        </div>
      )}
    </div>
  );
}

export default LiveData;
