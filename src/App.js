import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

// Assume csvData is imported from './data.js'
import { csvData } from './data';

// Parse the CSV data
const parsedData = csvData.split('\n').slice(1).map(row => {
  const [manufacturer, chipset, model, socket, formFactor, dimms, color, supportUrl, hasLatestMicrocode] = row.split(',');
  return {
    manufacturer: manufacturer?.trim() || '',
    chipset: chipset?.trim() || '',
    model: model?.trim() || '',
    socket: socket?.trim() || '',
    formFactor: formFactor?.trim() || '',
    dimms: parseInt(dimms) || 0,
    color: color?.trim() || '',
    supportUrl: supportUrl?.trim() || '',
    hasLatestMicrocode: hasLatestMicrocode?.trim().toUpperCase() === 'TRUE'
  };
}).filter(mb => mb.manufacturer !== '');

const App = () => {
  const [search, setSearch] = useState('');
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [error, setError] = useState(null);
  const [selectedChipsets, setSelectedChipsets] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  const uniqueChipsets = useMemo(() => {
    return [...new Set(parsedData.map(mb => mb.chipset))].sort();
  }, []);

  const filteredMotherboards = useMemo(() => {
    if (!search.trim()) return [];
    
    const searchTerms = search.toLowerCase().split(/\s+/);
    
    try {
      return parsedData.filter(mb => {
        const modelText = `${mb.manufacturer} ${mb.chipset} ${mb.model}`.toLowerCase();
        return searchTerms.every(term => modelText.includes(term));
      });
    } catch (err) {
      console.error('Error in filtering:', err);
      setError(err.message);
      return [];
    }
  }, [search]);

  const statistics = useMemo(() => {
    const filteredData = selectedChipsets.length > 0
      ? parsedData.filter(mb => selectedChipsets.includes(mb.chipset))
      : parsedData;

    const manufacturerStats = {};
    filteredData.forEach(mb => {
      if (!manufacturerStats[mb.manufacturer]) {
        manufacturerStats[mb.manufacturer] = { total: 0, withLatestMicrocode: 0 };
      }
      manufacturerStats[mb.manufacturer].total++;
      if (mb.hasLatestMicrocode) {
        manufacturerStats[mb.manufacturer].withLatestMicrocode++;
      }
    });

    return Object.entries(manufacturerStats)
      .map(([manufacturer, stats]) => ({
        manufacturer,
        supported: Math.round((stats.withLatestMicrocode / stats.total) * 100),
        unsupported: Math.round(((stats.total - stats.withLatestMicrocode) / stats.total) * 100),
        totalCount: stats.total,
        supportedCount: stats.withLatestMicrocode,
        unsupportedCount: stats.total - stats.withLatestMicrocode
      }))
      .sort((a, b) => b.supported - a.supported);
  }, [selectedChipsets]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleChipset = (chipset) => {
    setSelectedChipsets(prev => 
      prev.includes(chipset)
        ? prev.filter(c => c !== chipset)
        : [...prev, chipset]
    );
  };

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

  const renderHelpPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">How to Find Your Motherboard Model</h2>
        <ol className="space-y-2">
          <li className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
            <span>Press Win + R to open the Run dialog</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
            <span>Type "msinfo32" and press Enter</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
            <span>In the System Information window, look for "BaseBoard Manufacturer" and "BaseBoard Product"</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">4</span>
            <span>These will give you the manufacturer and model of your motherboard</span>
          </li>
        </ol>
        <button
          onClick={() => setShowHelpPopup(false)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="relative">
      <div className="sticky top-0 z-20 bg-white pb-4" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowResults(true)}
            placeholder="Search for a motherboard..."
            className="w-full p-2 border rounded-md pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
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
          Not sure about your motherboard?
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
            Visit Support Page
          </a>
        </div>
      )}
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{label}</p>
          <p>Total Motherboards: {data.totalCount}</p>
          <p className="text-green-600">Supported: {data.supportedCount} ({data.supported}%)</p>
          <p className="text-red-600">Unsupported: {data.unsupportedCount} ({data.unsupported}%)</p>
        </div>
      );
    }
    return null;
  };

  const renderStatistics = () => (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold mb-4">Microcode Update Availability by Manufacturer</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Filter by Chipset:</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueChipsets.map(chipset => (
            <button
              key={chipset}
              onClick={() => toggleChipset(chipset)}
              className={`px-3 py-1 rounded ${
                selectedChipsets.includes(chipset) ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {chipset}
            </button>
          ))}
        </div>
      </div>
      <BarChart width={600} height={400} data={statistics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="manufacturer" interval={0} angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="supported" stackId="a" fill="#4CAF50" name="Latest Microcode Available" />
        <Bar dataKey="unsupported" stackId="a" fill="#F44336" name="Latest Microcode Not Available" />
      </BarChart>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Motherboard Information</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'statistics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
      </div>
      {activeTab === 'search' ? renderSearch() : renderStatistics()}
      {showHelpPopup && renderHelpPopup()}
    </div>
  );
};

export default App;