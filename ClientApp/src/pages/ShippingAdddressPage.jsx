import React, {useEffect, useState, useContext} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import authContext from "./../context/authContext"
import CartItemCard from '../components/CartItemCard'
import { redirectToCheckout } from '../utils/utils'
import {getRequestOptions, formatPrice} from "./../utils/utils.js"
import appContext from '../context/appContext'
import AddressProductCardComponent from '../components/AddressProductCardComponent';
import AddAddressModel from '../components/AddAddressModel';
import AddressCardComponent from '../components/AddressCardComponent';
import {useLocation} from "react-router-dom"

function ShippingAdddressPage() {
    const {userData} = useContext(authContext)
    const {cartItemsCount} = useContext(appContext)
    const {state} = useLocation();
    const cartItems = state.products;
    const totalPrice = state.totalPrice
    const [userAddresses, setUserAddresses] = useState([])
    const [shippingAddressId, setShippingAddressId] = useState()
    useEffect(() => {
      async function fetchAddress(){
        const response = await fetch(`api/UserAddress/user/${userData.id}`,getRequestOptions);
        const data = await response.json()
        setUserAddresses(data);
      }
      fetchAddress()
    }, [])
    
    function onOptionChange(e) {
        setShippingAddressId(e.target.value);
        console.log(e.target.value);
    }
  return (
    <div className="pt-[4rem] bg-gray-100 min-h-screen">
        <div className="mx-auto mt-4 flex justify-between space-x-6 max-w-7xl">
            <div className="p-4 w-[64rem] max-w-5xl rounded-md">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold">Select Delivery Address</h2>
                    <button type="button" data-modal-target="medium-modal" data-modal-toggle="medium-modal" className="border-solid border-1 px-4 py-2 border-black rounded-md">Add New Address</button>
                </div>
                <div>
                    {
                        userAddresses.map(address => {
                            return(
                                <div className="p-4 bg-white flex space-x-2 items-start" key={address.id} >
                                    <input type="radio" name="address" value={address.id} className="mt-[5px]" onChange={onOptionChange}></input>
                                    <AddressCardComponent 
                                                        
                                                        id={address.id} 
                                                        name={address.name} 
                                                        lane1={address.addressLane1} 
                                                        lane2={address.addressLane2} 
                                                        city={address.city} 
                                                        district={address.district} 
                                                        state={address.state} 
                                                        postalcode={address.postalCode} 
                                                        phone={address.phone}/>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="bg-white rounded-md border-1 border-dashed border-black p-4 shadow-lg mt-4">
                    <button className="font-bold text-blue-700" type="button" data-modal-target="medium-modal" data-modal-toggle="medium-modal">+{' '}Add New Address</button>
                </div>
            </div>
            <div>
                    <div className="bg-white rounded-md shadow-lg p-4 min-h-96">
                        <div>
                            {
                                cartItems.map(item => <AddressProductCardComponent key={item.id} name={item.name} image={item.image}></AddressProductCardComponent>)
                            }
                        </div>
                        <div className="flex items-center justify-around my-6">
                            <span>Total Products{' '}:</span>
                            <span>{cartItemsCount || 1}</span>
                        </div>
                        <div className="flex items-center justify-around mb-6">
                            <span>Total{' '}:</span>
                            <h3>₹{' '}{formatPrice(totalPrice)}</h3>
                        </div>
                        <div className="w-full">
                            <button type="button" onClick={() => {
                                if(!cartItems.some(prod => prod.status==="Sold Out")){
                                    redirectToCheckout(cartItems,shippingAddressId)
                                }else {
                                    toast.error("Your Cart Contains Sold Out item",{
                                        position: 'top-right'
                                    })
                                }
                                }} className="my-2 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Checkout</button>
                        </div>
                    </div>
            </div>
        </div>
        <Toaster></Toaster>
        <AddAddressModel></AddAddressModel>
    </div>
  )
}

export default ShippingAdddressPage