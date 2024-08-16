import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import SearchComponent from './components/SearchComponent';
import BiosUpdateInstructions from './components/BiosUpdateInstructions';
import StatisticsComponent from './components/StatisticsComponent';
import LicenseInfo from './components/LicenseInfo';
import { csvData } from './data';

// Initialize Google Analytics
ReactGA.initialize('G-VK1PHNS0J0'); 

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

  useEffect(() => {
    // Record a pageview for the active tab
    ReactGA.send({ hitType: "pageview", page: `/${activeTab}` });
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    ReactGA.event({
      category: 'User',
      action: 'Changed Tab',
      label: tab
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Motherboard BIOS Search</h1>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange('search')}
        >
          Search
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'biosUpdate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange('biosUpdate')}
        >
          How To Update BIOS
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'statistics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange('statistics')}
        >
          Statistics
        </button>
      </div>
      {activeTab === 'search' && <SearchComponent parsedData={parsedData} />}
      {activeTab === 'biosUpdate' && <BiosUpdateInstructions />}
      {activeTab === 'statistics' && <StatisticsComponent parsedData={parsedData} />}
      
      <footer className="mt-8 pt-4 border-t text-center text-gray-500">
        <LicenseInfo />
      </footer>
    </div>
  );
};

export default App;