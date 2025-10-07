
import React from 'react';
export const Card = ({ className='', ...props }) => (
  <div className={`bg-white rounded-2xl border shadow-sm ${className}`} {...props} />
);
export const CardHeader = ({ className='', ...props }) => (
  <div className={`p-4 border-b ${className}`} {...props} />
);
export const CardContent = ({ className='', ...props }) => (
  <div className={`p-4 ${className}`} {...props} />
);
