'use client';

import React from 'react';

export default function Button({ variant = 'primary', children, onClick, disabled }) {
  const base = 'px-4 py-2 rounded';
  const style = variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${style}`}>
      {children}
    </button>
  );
}
