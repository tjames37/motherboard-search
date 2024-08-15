import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const StatisticsComponent = ({ parsedData }) => {
  const [selectedChipsets, setSelectedChipsets] = useState([]);

  const uniqueChipsets = useMemo(() => {
    return [...new Set(parsedData.map(mb => mb.chipset))].sort();
  }, [parsedData]);

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
  }, [parsedData, selectedChipsets]);

  const toggleChipset = (chipset) => {
    setSelectedChipsets(prev => 
      prev.includes(chipset)
        ? prev.filter(c => c !== chipset)
        : [...prev, chipset]
    );
  };

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

  return (
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
};

export default StatisticsComponent;