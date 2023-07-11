import React, {useState, useEffect, useContext} from 'react'
import authContext from "./../context/authContext"
import appContext from '../context/appContext'
import {useNavigate, useParams, Link} from "react-router-dom"
import {deleteRequestOptions, formatPrice, successToast, errorToast} from "./../utils/utils"
import {Toaster} from "react-hot-toast"


function SingleProductPage() {
    const {userData} = useContext(authContext)
    const {setCartItemsCount, setCartItems, cartItems, categories} = useContext(appContext)
    const {productId} = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState()
    const [likeCount, setLikeCount] = useState(0)
    const navigate = useNavigate()

    

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
        successToast("Art Liked")
        }
    }
    async function unLikeHandler(){
        let response = await fetch(`/api/Follow/unlike?productId=${product.id}&userId=${userData.id}`,requestData);
        if(response.status===200){
        setLiked(prev => !prev)
        setLikeCount(prev => prev-1)
        successToast("Art Unliked")
        }
    }
    async function addToCartHandler(){
        let response = await fetch(`api/ShoppingCartItem`,{...requestData, body: JSON.stringify({productId:product.id, userId:userData.id})});
        if(response.status===201){
            setCartItemsCount(prev => prev+1);
            setCartItems(prev => {
                return [...prev, product]
            })
            successToast("Added To Cart")
        }
        else if(response.status===409){
            let data = await response.json()
            errorToast(data.message)
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

        async function handleDelete() {
            const response = await fetch(`/api/Products/${productId}`,deleteRequestOptions)
            if(response.status===204){
                navigate(-1)
            }
        }
    
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
                        <div className="my-2">
                            <span className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg"><Link to={`/products/category/${product.categoryId}`} className="no-underline">{categories.find(c =>c.categoryId===product.categoryId).name}</Link></span>
                        </div>
                        <div>Selling by <Link to={`/profile/${product.ownerId}`}>{product.ownerUsername}</Link></div>
                        <h4 className="font-semibold text-4xl">₹{' '}{formatPrice(product.price)}</h4>
                        <p className="text-gray-600">
                            {product.description}
                        </p>
                        <div className="md:flex items-center mx-auto">
                            {
                                product.status==="Sold Out"
                                ?
                                <>
                                    <h4 className="font-normal mr-10 mb-0 text-red-500">Sold Out</h4>
                                </>
                                :
                                <>
                                    {
                                        product.ownerId===userData.id?
                                        <>
                                        <button onClick={()=>{
                                            navigate(`/sell-art/edit/${product.id}`)
                                        }} className="mr-4 py-2.5 px-5 rounded-md text-white font-medium hover:bg-gradient-to-br bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700">Edit Product Details</button>
                                        <button onClick={handleDelete} className="mr-4 py-2.5 px-5 rounded-md text-white font-medium hover:bg-gradient-to-br bg-gradient-to-r from-red-500 via-red-600 to-red-700">Delete Product</button>
                                        </>:
                                        <>
                                            <button onClick={()=>{
                                                // setCartItemsCount()
                                                navigate("/checkout/address",{state:{
                                                    products:[product],
                                                    totalPrice:product.price
                                                }})
                                            }} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Buy Now</button>
                                            <button onClick={addToCartHandler} type="button" className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add To Cart</button>
                                        </>
                                    }
                                </>
                            }
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
                        {
                            product.metaData.length>0 && <div className="w-full">
                                <h4 className="mt-5 mb-3">More info about the art</h4>
                                <div>
                                    {
                                        product.metaData.map(data =>{
                                            return(<div className="flex w-sm my-1 items-center justify-around pr-80">
                                                <p><span className="font-semibold">{data.metaDataKey}</span>{' '}{' '}- </p>
                                                <p>{data.metaDataValue}</p>
                                            </div>)
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
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

export default SingleProductPage