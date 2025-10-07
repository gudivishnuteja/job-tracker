
import React from 'react';
export const Badge = ({ className='', children }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{children}</span>
);
