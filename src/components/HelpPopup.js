import React from 'react';

const HelpPopup = ({ onClose }) => (
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
        onClick={onClose}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  </div>
);

export default HelpPopup;