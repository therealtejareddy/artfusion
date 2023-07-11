import React, {useContext, useRef, useEffect, useState} from 'react'
import { updateRequestOptions } from '../utils/utils';
import {authContext} from "./../context/authContext"
import {useLocation, useNavigate} from "react-router-dom"

function EditAddressModelComponent() {
    const navigate = useNavigate();
    const {userData} = useContext(authContext)
    const {state} = useLocation()
    const submitBtnref = useRef(null)
    const [name, setName] = useState("")
    const [mobilenumber, setMobilenumber] = useState("")
    const [lane1, setLane1] = useState("")
    const [lane2, setLane2] = useState("")
    const [city, setCity] = useState("")
    const [ustate, setUstate] = useState("")
    const [district, setDistrict] = useState("")
    const [postalcode, setPostalcode] = useState("")
    // const {addressId} = useParams()
    useEffect(() => {
      setName(state.name)
      setMobilenumber(state.phone)
      setLane1(state.lane1)
      setLane2(state.lane2)
      setCity(state.city)
      setUstate(state.state)
      setDistrict(state.district)
      setPostalcode(state.postalcode)
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(`/api/UserAddress/${state.id}`,{...updateRequestOptions, body:JSON.stringify({
            id:state.id,
            userId:userData.id,
            name:name,
            phone:mobilenumber, 
            addressLane1:lane1, 
            addressLane2:lane2, 
            city:city, 
            postalCode:postalcode, state:ustate, district:district
        })});
        if(response.status===204){
            // console.log(submitBtnref.current);
            navigate(-1);
            e.target.reset();
            submitBtnref.current.hide()
            console.log(e.target);
        }
    }
  return (
    <div className="w-full flex justify-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative w-full max-w-xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-sm shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Edit Address
                    </h3>
                </div>
                {/* <!-- Modal body --> */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        <h6>Contact Details</h6>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="Name"></input>
                        <input value={mobilenumber} onChange={(e) => setMobilenumber(e.target.value)} className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="Mobile No"></input>
                        <h6>Address</h6>
                        <input value={lane1} onChange={(e) => setLane1(e.target.value)} className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="House No, Building, Street"></input>
                        <input value={lane2} onChange={(e) => setLane2(e.target.value)} className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="Address Lane 2"></input>
                        <div className="flex space-x-2">
                            <input value={city} onChange={(e) => setCity(e.target.value)} className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="City / Town"></input>
                            <input value={postalcode} onChange={(e) => setPostalcode(e.target.value)} className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="Pin Code"></input>
                        </div>
                        <div className="flex space-x-2">
                            <input value={district} onChange={(e) => setDistrict(e.target.value)} className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="District"></input>
                            <input value={ustate} onChange={(e) => setUstate(e.target.value)} className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="State"></input>
                        </div>
                    </div>
                    {/* <!-- Modal footer --> */}
                    <div className="flex items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">UPDATE ADDRESS</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default EditAddressModelComponent