import React, { useState, useEffect } from 'react';

function BaseAsset({ selectedSymbol, exchangeInfo }) {
  const [baseAsset, setBaseAsset] = useState('BTC');

  useEffect(() => {
    if (exchangeInfo) {
      const selectedSymbolInfo = exchangeInfo.find((symbol) =>
        selectedSymbol.startsWith(symbol.baseAsset)
      );
      if (selectedSymbolInfo) {
        setBaseAsset(selectedSymbolInfo.baseAsset);
      }
    }
  }, [selectedSymbol, exchangeInfo]);

  if (!baseAsset) {
    return null; 
  }

  return (
    <div>
      <span>Base Asset: {baseAsset}</span>
    </div>
  );
}

export default BaseAsset;
