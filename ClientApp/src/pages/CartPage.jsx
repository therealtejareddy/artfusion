import React, {useEffect, useState, useContext} from 'react'
import {useNavigate} from "react-router-dom"
import authContext from "./../context/authContext"
import CartItemCard from '../components/CartItemCard'
import appContext from '../context/appContext'
import {formatPrice} from "../utils/utils"
import {Toaster} from "react-hot-toast"

function CartPage() {
    const {userData} = useContext(authContext)
    const {setCartItemsCount, cartItemsCount, totalPrice, cartItems} = useContext(appContext)
    const navigate = useNavigate()
    
  return (
    <div className="pt-[4rem] bg-gray-200 min-h-screen">
        <div className="mx-auto mt-4 flex justify-between space-x-6 max-w-7xl">
            <div className="p-4 w-[64rem] max-w-5xl bg-white shadow-lg rounded-md">
                <h2 className="font-bold mb-4">Shopping Cart</h2>
                {
                    cartItems.length>0?cartItems.map(item => {
                        return(<CartItemCard key={item.id} id={item.id} name={item.name} price={item.price} image={item.image} likes={item.likes}/>)
                    }):<h3 className="w-full text-center py-4">Your Cart is Empty</h3>
                }
            </div>
            <div className="bg-white rounded-md shadow-lg p-4 h-96">
                <div className="flex items-center justify-around mb-6">
                    <span>Total Products{' '}:</span>
                    <span>{cartItemsCount}</span>
                </div>
                <div className="flex items-center justify-around mb-6">
                    <span>Total{' '}:</span>
                    <h3>₹{' '}{formatPrice(totalPrice)}</h3>
                </div>
                <div className="w-full">
                        <button onClick={()=>{
                            if(cartItems.length>0){
                                navigate('/checkout/address',{state:{products:cartItems, totalPrice:totalPrice}})
                            }else{
                                alert("Your cart is empty")
                            }
                        }} className="my-2 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Checkout</button>
                    <button onClick={()=>{
                        navigate('/')
                    }} type="button" className="my-2 w-full text-blue-700 bg-white border-1 border-blue-700 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Back to shop</button>
                </div>
            </div>
        </div>
         <Toaster toastOptions={{
                success:{
                  style:{
                      padding:"24px",
              }
              },error:{
                style:{
                  padding: "24px"
                }
              }
            }} containerStyle={{
                              top: 40,
                              right: 40
                          }}/>
    </div>
  )
}

export default CartPage