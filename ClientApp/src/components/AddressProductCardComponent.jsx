import React from 'react'

function AddressProductCardComponent({image, name}) {
  return (
    <div className="my-2 flex items-center space-x-4 min-w-[20rem]">
        <img src={image} alt={name} className="rounded-md h-20 w-20"/>
        <h4>{name}</h4>
    </div>
  )
}

export default AddressProductCardComponent