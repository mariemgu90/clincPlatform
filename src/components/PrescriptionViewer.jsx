'use client';

import React from 'react';

export default function PrescriptionViewer({ prescription }) {
  return (
    <div className="border rounded p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Prescription</h3>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Download PDF</button>
      </div>
      <div className="space-y-2">
        <div className="text-sm">
          <strong>Issued:</strong> {prescription?.issuedAt || 'N/A'}
        </div>
        <div className="text-sm">
          <strong>Medications:</strong>
        </div>
        <ul className="list-disc list-inside text-sm">
          {prescription?.medications?.map((m, i) => <li key={i}>{m}</li>) || <li>No medications</li>}
        </ul>
      </div>
    </div>
  );
}
