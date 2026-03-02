import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Search...', onClear }) => {
    return (
        <div className="search-bar-container">
            <Search className="search-icon-inner" size={18} />
            <input
                type="text"
                className="search-input-inner"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button className="clear-search-btn" onClick={onClear}>
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
