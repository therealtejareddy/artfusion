import React, {useState, useEffect, useContext} from 'react'
import {useParams} from "react-router-dom"
import authContext from "./../context/authContext"
import { redirectToCheckout } from '../utils/utils'

function SingleProductPage() {
    const {userData} = useContext(authContext)
    const {productId} = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState()
    const [likeCount, setLikeCount] = useState(0)

    

    const requestData = {
                method: "POST",
                headers: {
                'Authorization':`Bearer ${localStorage.getItem("authToken")}`,
                'Content-Type':'application/json'
                }
            }

    async function likeHandler() {
        let response = await fetch(`/api/Follow/like?productId=${product.id}&userId=${userData.id}`,requestData);
        if(response.status===200){
        setLiked(prev => !prev)
        setLikeCount(prev => prev+1)
        }
    }
    async function unLikeHandler(){
        let response = await fetch(`/api/Follow/unlike?productId=${product.id}&userId=${userData.id}`,requestData);
        if(response.status===200){
        setLiked(prev => !prev)
        setLikeCount(prev => prev-1)
        }
    }
    async function addToCartHandler(){
        let response = await fetch(`api/ShoppingCartItem`,{...requestData, body: JSON.stringify({productId:product.id, userId:userData.id})});
        if(response.status===201){
            console.log("added to cart");
        }
    }
    useEffect(() => {
        async function fetchProduct() {
            let response = await fetch(`/api/Products/${productId}`,{
                headers: {
                'Authorization':`Bearer ${localStorage.getItem("authToken")}`
                }
            });
            let data = await response.json()
            setProduct(data);
            setLiked(data.likes.some(like => like.userId===userData.id))
            setLikeCount(data.likes.length);
            console.log(data);
            setLoading(false)
        }
        fetchProduct()
        }, [])
  return (
    <div className="pt-[4rem]">
        <div className="max-w-7xl mx-auto shadow-lg rounded-md mt-4 p-4">
            {/* <pre>
                {JSON.stringify(product, undefined, 2)}
            </pre> */}
            {
                loading ? <div className="mt-8">
                    loading...
                </div>
                :
                <div className="md:grid md:grid-cols-2 w-full">
                    <div className="p-2 max-h-[40rem]">
                        <img className="rounded-md h-full w-full" src={product.image} alt={product.name}/>
                    </div>
                    <div className="py-2 pl-8">
                        <h3>{product.name}</h3>
                        <div className="">
                            <span className="text-gray-500">{likeCount}{' '}likes</span>
                            <span className="ml-6 text-green-700">verified</span>
                        </div>
                        <h4 className="font-semibold text-4xl">₹{' '}{product.price}</h4>
                        <p className="text-gray-600">
                            {product.description}
                        </p>
                        <div>
                            <button onClick={() => redirectToCheckout([product])} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Buy Now</button>
                            <button onClick={addToCartHandler} type="button" className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add To Cart</button>
                            {
                                !liked ? 
                                <>
                                {/* unlike handler */}
                                    <button onClick={likeHandler} type="button" className="text-red-700 border border-blue-700 hover:bg-gray-300 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                    <svg className="w-5 h-5 text-red-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 19">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z"/>
                                    </svg>
                                    </button>
                                </>
                                :
                                <>
                                {/* like handler */}
                                    <button onClick={unLikeHandler} type="button" className="text-red-700 border border-blue-700 hover:bg-gray-300 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                    <svg className="w-5 h-5 text-red-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 19">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z"/>
                                    </svg>
                                    </button>
                                </>
                                }
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default SingleProductPage