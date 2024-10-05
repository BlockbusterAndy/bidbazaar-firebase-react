import React from 'react';

const CardLayout = ({ children }) => {
  return (
    <div className='flex flex-col gap-4 h-full w-full overflow-auto p-6 rounded-md shadow-md border border-slate-200'>
      {children}
    </div>
  );
}

export default CardLayout;