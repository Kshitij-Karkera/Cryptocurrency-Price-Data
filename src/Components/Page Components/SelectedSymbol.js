import React from 'react';
import PropTypes from 'prop-types';
import DropDown from '../Elements/DropDown';
import './SelectedSymbol.css'; 

function SelectedSymbol({ selectedSymbol, symbols, onChange }) {
  return (
    <div className="selected-symbol-container">
      <DropDown data={symbols} selectedValue={selectedSymbol} onValueChange={onChange}  />
    </div>
  );
}

SelectedSymbol.propTypes = {
  selectedSymbol: PropTypes.string.isRequired,
  symbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SelectedSymbol;
