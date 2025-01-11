import React, { useState, useRef, useEffect, useCallback } from 'react';
import './DropDown.css';

function DropDown({ theme, data, selectedValue, onValueChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(selectedValue);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setSelected(selectedValue);
    }, [selectedValue]);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen, handleClickOutside]);

    const handleSelectClick = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const handleOptionClick = useCallback((value) => {
        setSelected(value);
        setIsOpen(false);
        if (onValueChange) {
            const syntheticEvent = {
                target: { value }
            };
            onValueChange(syntheticEvent);
        }
    }, [onValueChange]);

    return (
        <div className='dropdown' ref={dropdownRef} >
            <div className='select' onClick={handleSelectClick}>
                <span className='selected'>{selected}</span>
                <div className={`caret ${isOpen ? 'caret-rotate' : ''}`}></div>
            </div>
            <ul className={`menu ${isOpen ? 'menu-open' : ''}`}>
                {data.map((item) => (
                    <li 
                        key={item} 
                        className={item === selected ? 'active' : ''} 
                        onClick={() => handleOptionClick(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DropDown;
