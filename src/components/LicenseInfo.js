import React, { useState } from 'react';

const LicenseInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-blue-500 hover:text-blue-700"
      >
        License Info
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setIsOpen(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white z-51" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">MIT License</h3>
            <p className="mb-2">Copyright (c) 2024 Taylor James</p>
            <p className="mb-4">
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p className="mb-4">
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
            <button 
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseInfo;