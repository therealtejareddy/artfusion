import React, {useContext, useRef} from 'react'
import { postRequestOptions } from '../utils/utils';
import {authContext} from "./../context/authContext"
import {useNavigate} from "react-router-dom"

function AddAddressModel() {
    const navigate = useNavigate()
    const {userData} = useContext(authContext)
    const submitBtnref = useRef(null)
    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(`/api/UserAddress`,{...postRequestOptions, body:JSON.stringify({
            userId:userData.id,
            name:e.target.name.value,
            phone:e.target.mobilenumber.value, 
            addressLane1:e.target.lane1.value, 
            addressLane2:e.target.lane2.value, 
            city:e.target.city.value, 
            postalCode:e.target.postalcode.value, state:e.target.state.value, district:e.target.district.value
        })});
        if(response.status===201){
            // console.log(submitBtnref.current);
            navigate(0)
            e.target.reset();
            submitBtnref.current.hide()
            console.log(e.target);
        }
    }
  return (
    <div id="medium-modal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative w-full max-w-md max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-sm shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Address
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="medium-modal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        <h6>Contact Details</h6>
                        <input name="name" className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="Name"></input>
                        <input name="mobilenumber" className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="Mobile No"></input>
                        <h6>Address</h6>
                        <input name="lane1" className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="House No, Building, Street"></input>
                        <input name="lane2" className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="Address Lane 2"></input>
                        <div className="flex space-x-2">
                            <input name="city" className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="City / Town"></input>
                            <input name="postalcode" className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="Pin Code"></input>
                        </div>
                        <div className="flex space-x-2">
                            <input name="district" className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="District"></input>
                            <input name="state" className="outline outline-1 outline-gray-500 w-full p-2 rounded-sm" placeholder="State"></input>
                        </div>
                    </div>
                    {/* <!-- Modal footer --> */}
                    <div className="flex items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button data-modal-hide="medium-modal" ref={submitBtnref} type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ADD ADDRESS</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddAddressModel