'use client';

import React from 'react';

export default function InvoiceList({ invoices = [], onPay, onView }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Invoices ({invoices.length})</h3>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">New Invoice</button>
      </div>
      <div className="space-y-2">
        {invoices.length === 0 && <p className="text-sm text-gray-500">No invoices yet</p>}
        {invoices.map((inv) => (
          <div key={inv.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-medium">Invoice #{inv.id}</div>
              <div className="text-sm text-gray-600">{inv.amount} TND - {inv.status}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onView?.(inv)} className="text-sm text-blue-600">View</button>
              {inv.status !== 'paid' && (
                <button onClick={() => onPay?.(inv)} className="text-sm text-green-600">Pay</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
