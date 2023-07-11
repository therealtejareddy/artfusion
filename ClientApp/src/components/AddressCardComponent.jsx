import React,{useState} from 'react'
import { deleteRequestOptions } from '../utils/utils';
import {useNavigate} from "react-router-dom"

function AddressCardComponent({id,name,lane1, lane2,city, district, state, postalcode, phone }) {
    const navigate = useNavigate()
    const [deleted, setDeleted] = useState(false);
    async function deleteAddressHandler() {
        let response = await fetch(`api/UserAddress/${id}`,deleteRequestOptions);
        if(response.status===204){
            setDeleted(true)
            navigate(0)
        }

    }
  return (
    <div className={deleted?"hidden":""}>
        <p className="font-bold">{name}</p>
        <p className="mb-1">{lane1},{' '}{lane2},{' '}{city},</p>
        <p>{district},{' '}{state} - {postalcode}</p>
        <p>Mobile: <span className="font-semibold">{phone}</span></p>

        <div className="space-x-8 px-4">
            <button onClick={deleteAddressHandler} className="border-2 border-red-500 rounded-sm px-3 py-1">Remove</button>
            <button type="button" onClick={() => {navigate(`/profile/saved-address/edit/${id}`,{state:{id,name,lane1,lane2,city,district,state,postalcode,phone}})}} className="border-2 border-gray-700 rounded-sm px-3 py-1">Edit</button>
        </div>
        
        {/* <EditAddressModelComponent id={id} dname={name} dphone={phone} dlane1={lane1} dlane2={lane2} dcity={city} ddistrict={district} dstate={state} dpostalcode={postalcode} /> */}
    </div>
  )
}

export default AddressCardComponent