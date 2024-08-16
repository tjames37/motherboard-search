import React, { useState, useRef } from 'react';
import { Search, X, HelpCircle } from 'lucide-react';
import HelpPopup from './HelpPopup';

const SearchComponent = ({ parsedData }) => {
  const [search, setSearch] = useState('');
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  const filteredMotherboards = parsedData.filter(mb => {
    if (!search.trim()) return false;
    const searchTerms = search.toLowerCase().split(/\s+/);
    const modelText = `${mb.manufacturer} ${mb.chipset} ${mb.model}`.toLowerCase();
    return searchTerms.every(term => modelText.includes(term));
  });

  const handleMotherboardSelect = (mb) => {
    setSelectedMotherboard(mb);
    setSearch(mb.model);
    setShowResults(false);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowResults(true);
    if (e.target.value === '') {
      setSelectedMotherboard(null);
    }
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 bg-white pb-4" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowResults(true)}
            placeholder="Search for a motherboard..."
            className="w-full p-2 pl-10 pr-4 rounded-md bg-white border border-blue-400 focus:outline-none focus:border-blue-400 border-2"
          />
          <Search className="absolute left-3 top-2.5 text-blue-400" size={20} />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedMotherboard(null);
                setShowResults(false);
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowHelpPopup(true)}
          className="mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center"
        >
          <HelpCircle size={16} className="mr-1" />
          Don't know your motherboard model?
        </button>
      </div>
      {showResults && search && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg" ref={resultsRef}>
          <ul className="max-h-60 overflow-y-auto">
            {filteredMotherboards.map((mb, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleMotherboardSelect(mb)}
              >
                {mb.model}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedMotherboard && (
        <div className="mt-4 p-4 border rounded-md">
          <h2 className="text-2xl font-semibold mb-2">{selectedMotherboard.model}</h2>
          <p><strong>Manufacturer:</strong> {selectedMotherboard.manufacturer}</p>
          <p><strong>Chipset:</strong> {selectedMotherboard.chipset}</p>
          <p><strong>Socket:</strong> {selectedMotherboard.socket}</p>
          <p><strong>Form Factor:</strong> {selectedMotherboard.formFactor}</p>
          <p><strong>DIMM Slots:</strong> {selectedMotherboard.dimms}</p>
          <p><strong>Color:</strong> {selectedMotherboard.color}</p>
          <p>
            <strong>Latest Microcode Update: </strong>
            <span className={`font-bold ${selectedMotherboard.hasLatestMicrocode ? 'text-green-600' : 'text-red-600'}`}>
              {selectedMotherboard.hasLatestMicrocode ? 'Available' : 'Not Available'}
            </span>
          </p>
          <a
            href={selectedMotherboard.supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            BIOS Download Page
          </a>
        </div>
      )}
      {showHelpPopup && <HelpPopup onClose={() => setShowHelpPopup(false)} />}
    </div>
  );
};

export default SearchComponent;