import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga4';
import SearchComponent from './components/SearchComponent';
import BiosUpdateInstructions from './components/BiosUpdateInstructions';
import StatisticsComponent from './components/StatisticsComponent';
import IntroSection from './components/IntroSection';
import LicenseInfo from './components/LicenseInfo';
import { csvData } from './data';

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
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.split('/').pop();
    return ['biosUpdate', 'statistics'].includes(path) ? path : '';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      if (['biosUpdate', 'statistics'].includes(path)) {
        setActiveTab(path);
      } else {
        setActiveTab('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: activeTab ? `/${activeTab}` : '/' });
  }, [activeTab]);

  const handleTabChange = (tab, event) => {
    event.preventDefault();
    setActiveTab(tab);
    const newPath = tab ? `${window.location.pathname.split('/').slice(0, -1).join('/')}/${tab}` : '/motherboard-search/';
    window.history.pushState(null, '', newPath);
    ReactGA.event({
      category: 'User',
      action: 'Changed Tab',
      label: tab || 'home'
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Motherboard BIOS Search and Update Tool",
    "description": "Find and update your motherboard BIOS easily. Search for your motherboard model, get direct links to BIOS downloads, and learn how to update your BIOS safely.",
    "url": "https://tjames37.github.io/motherboard-search/",
    "applicationCategory": "Utility",
    "operatingSystem": "Web"
  };

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Motherboard BIOS Search and Update Tool</title>
        <meta name="description" content="Find and update your motherboard BIOS easily. Search for your motherboard model, get direct links to BIOS downloads, and learn how to update your BIOS safely." />
        <meta name="keywords" content="motherboard, BIOS, update, search, Intel, 600 series, 700 series, 0x129, microcode, 13th gen, 14th gen" />
        <meta name="author" content="Taylor James" />
        <meta property="og:title" content="Motherboard BIOS Search and Update Tool" />
        <meta property="og:description" content="Find and update your motherboard BIOS easily. Search for your motherboard model, get direct links to BIOS downloads, and learn how to update your BIOS safely." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tjames37.github.io/motherboard-search/" />
        <meta property="og:image" content="https://tjames37.github.io/motherboard-search/image.jpg" />
        <link rel="canonical" href={`https://tjames37.github.io/motherboard-search${activeTab ? `/${activeTab}` : ''}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">Motherboard BIOS Search</h1>
      <nav className="mb-4">
        <a
          href="/motherboard-search/"
          onClick={(e) => handleTabChange('', e)}
          className={`mr-2 px-4 py-2 rounded ${activeTab === '' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Search
        </a>
        <a
          href="/motherboard-search/biosUpdate"
          onClick={(e) => handleTabChange('biosUpdate', e)}
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'biosUpdate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          How To Update BIOS
        </a>
        <a
          href="/motherboard-search/statistics"
          onClick={(e) => handleTabChange('statistics', e)}
          className={`px-4 py-2 rounded ${activeTab === 'statistics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Statistics
        </a>
      </nav>
      {activeTab === '' && (
        <>
          <IntroSection />
          <SearchComponent parsedData={parsedData} />
        </>
      )}
      {activeTab === 'biosUpdate' && <BiosUpdateInstructions />}
      {activeTab === 'statistics' && <StatisticsComponent parsedData={parsedData} />}
      
      <footer className="mt-8 pt-4 border-t text-center text-gray-500">
        <LicenseInfo />
      </footer>
    </div>
  );
};

export default App;