import React, { useState } from 'react';
import SearchComponent from './components/SearchComponent';
import StatisticsComponent from './components/StatisticsComponent';
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
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Motherboard BIOS Search</h1>
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
      {activeTab === 'search' 
        ? <SearchComponent parsedData={parsedData} /> 
        : <StatisticsComponent parsedData={parsedData} />
      }
    </div>
  );
};

export default App;