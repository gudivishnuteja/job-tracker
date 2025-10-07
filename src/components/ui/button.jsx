
import React from 'react';
export const Button = ({ className='', variant='default', ...props }) => {
  const base = 'px-4 py-2 rounded-2xl shadow-sm transition active:scale-[0.98]';
  const styles = variant === 'destructive'
    ? 'bg-red-600 text-white hover:bg-red-700'
    : 'bg-purple-600 text-white hover:bg-purple-700';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
};
