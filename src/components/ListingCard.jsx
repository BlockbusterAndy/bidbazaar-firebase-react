import React from 'react'

const ListingCard = ({itemName, itemCategory, itemDescription} ) => {
  return (
    <div className='flex flex-col gap-4 max-h-full w-full overflow-auto p-6 rounded-md shadow-md border border-slate-200'>
        <div className='flex flex-col gap-1'>
            <h3 className='text-2xl font-semibold'>{itemName}</h3>
            <span className='category text-gray-500 '>{itemCategory}</span>
        </div>
        <p className='text-slate-900 font-normal'>{itemDescription}</p>
    </div>
  )
}

export default ListingCard