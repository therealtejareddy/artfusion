import React, {useEffect, useState, useContext} from 'react'
import authContext from "./../context/authContext"
import CartItemCard from '../components/CartItemCard'
import { redirectToCheckout } from '../utils/utils'

function CartPage() {
    const {userData} = useContext(authContext)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(null);
    useEffect(() => {
      async function fetchCart() {
        let response = await fetch(`api/ShoppingCartItem/all/user/${userData.id}`);
        let data = await response.json();
        setCartItems(data)
        console.log(data);
        setTotalPrice(cartItems.reduce((acc, curr) => acc+curr.price,0))
      }
      fetchCart();
    }, [])
    
  return (
    <div className="pt-[4rem] bg-gray-200 min-h-screen">
        <div className="mx-auto mt-4 flex justify-between space-x-6 max-w-7xl">
            <div className="p-4 w-[64rem] max-w-5xl bg-white shadow-lg rounded-md">
                <h2 className="font-bold mb-4">Shopping Cart</h2>
                {
                    cartItems.map(item => {
                        return(<CartItemCard name={item.name} price={item.price} image={item.image}/>)
                    })
                }
            </div>
            <div className="bg-white rounded-md shadow-lg p-4 h-96">
                <div className="flex items-center justify-around mb-6">
                    <span>Total Products{' '}:</span>
                    <span>{cartItems.length}</span>
                </div>
                <div className="flex items-center justify-around mb-6">
                    <span>Total{' '}:</span>
                    <h3>₹{' '}{totalPrice}</h3>
                </div>
                <div className="w-full">
                    <button type="button" onClick={() => redirectToCheckout(cartItems)} className="my-2 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Checkout</button>
                    <button type="button" className="my-2 w-full text-blue-700 bg-white border-1 border-blue-700 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Back to shop</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartPage