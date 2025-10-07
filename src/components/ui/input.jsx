
import React from 'react';
export const Input = ({ className='', ...props }) => (
  <input className={`px-3 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-purple-500 ${className}`} {...props} />
);
