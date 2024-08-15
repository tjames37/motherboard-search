import React from 'react';

const BiosUpdateInstructions = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="font-bold">Disclaimer:</p>
        <p>
          These are general instructions for updating your BIOS. The exact process may vary depending on your motherboard manufacturer and model. 
          If you are unsure about any step, please consult your motherboard's manual or contact the manufacturer directly for specific instructions.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">How To Update Your BIOS</h2>
      
      <ol className="list-decimal list-inside space-y-4">
        <li>
          <strong>Download the BIOS update:</strong>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Use the search function on this website to find your motherboard model.</li>
            <li>Click on the "BIOS Download Page" button for your motherboard.</li>
            <li>On the manufacturer's website, locate and download the latest BIOS version.</li>
          </ul>
        </li>
        
        <li>
          <strong>Prepare a USB drive:</strong>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Insert a USB drive into your computer.</li>
            <li>Back up any important data on the USB drive, as it will be erased in the next step.</li>
            <li>Format the USB drive to FAT32 file system:
              <ol className="list-decimal list-inside ml-4">
                <li>Right-click on the USB drive in File Explorer.</li>
                <li>Select "Format..."</li>
                <li>Choose "FAT32" as the file system.</li>
                <li>Click "Start" to format the drive.</li>
              </ol>
            </li>
          </ul>
        </li>
        
        <li>
          <strong>Extract and copy BIOS file:</strong>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Extract the downloaded BIOS update ZIP file.</li>
            <li>Copy the extracted BIOS file to your formatted USB drive. (Common file extensions for BIOS files include .CAP, .ROM, or .BIN)</li>
          </ul>
        </li>
        
        <li>
          <strong>Enter BIOS:</strong>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Restart your computer.</li>
            <li>As soon as the computer starts to boot, repeatedly press the Delete key (or the key specified by your motherboard manufacturer) to enter the BIOS setup.</li>
          </ul>
        </li>
        
        <li>
          <strong>Use BIOS flash utility:</strong>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>In the BIOS setup, look for an option like "EZ Flash", "Q-Flash", or "M-Flash" (the name varies by manufacturer).</li>
            <li>Select this option to open the BIOS update utility.</li>
            <li>In the utility, select your USB drive as the source.</li>
            <li>Choose the BIOS file you copied to the USB drive.</li>
            <li>Confirm that you want to update the BIOS.</li>
          </ul>
        </li>
        
        <li>
          <strong>Wait for the update to complete:</strong>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>The update process may take several minutes. Do not turn off your computer or interrupt the process.</li>
            <li>Once complete, your computer will restart automatically.</li>
          </ul>
        </li>
      </ol>
      
      <div className="mt-6 p-4 bg-blue-100 border-l-4 border-blue-500">
        <p className="font-bold">Important Note:</p>
        <p>
          Updating your BIOS is essential for optimal system performance and security, but it should be done with caution. 
          To minimize risks, ensure your computer is plugged into a stable power source. 
          Do not interrupt the update process once it has started, as this could potentially render your system inoperable.
        </p>
      </div>
    </div>
  );
};

export default BiosUpdateInstructions;