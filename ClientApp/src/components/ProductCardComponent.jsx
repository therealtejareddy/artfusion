import React, {useContext, useState} from 'react'
import { descriptionShow } from '../utils/utils'
import authContext from "./../context/authContext"
import appContext from "./../context/appContext"
import { useNavigate } from "react-router-dom"
import {postRequestOptions} from "./../utils/utils";

function ProductCardComponent({id, name, description, price, image, likesCount, likes, createdAt}) {
  const {userData} = useContext(authContext);
  const {setCartItemsCount} = useContext(appContext);

  const [liked, setLiked] = useState(likes.some(like => like.userId===userData.id))
  const [likeCount, setLikeCount] = useState(likesCount);
  const navigate = useNavigate();

    async function addToCartHandler(){
        let response = await fetch(`api/ShoppingCartItem`,{...postRequestOptions, body: JSON.stringify({productId:id, userId:userData.id})});
        if(response.status===201){
            setCartItemsCount(prev => prev+1);
        }
    }
  async function likeHandler() {
    let response = await fetch(`/api/Follow/like?productId=${id}&userId=${userData.id}`,postRequestOptions);
    if(response.status===200){
      setLiked(prev => !prev)
      setLikeCount(prev => prev+1)
    }
  }
  async function unLikeHandler(){
    let response = await fetch(`/api/Follow/unlike?productId=${id}&userId=${userData.id}`,postRequestOptions);
    if(response.status===200){
      setLiked(prev => !prev)
      setLikeCount(prev => prev-1)
    }
  }

  function cardClick(e) {
    e.stopPropagation()

    console.log(id);
    navigate(`/product/${id}`);
  }

  function isNew(createdTime) {
    if((new Date().getFullYear() === new Date(createdAt).getFullYear()) && (new Date().getMonth() === new Date(createdAt).getMonth()) && (new Date().getDate() - new Date(createdAt).getDate() < 1)){
      return true
    }
    return false
  }

  return (
    <div className="w-[19.5rem] rounded relative overflow-hidden shadow-lg mb-10 mx-4" onClick={cardClick}>
        {
          isNew(createdAt)?<span className="absolute bg-green-300 px-3 py-1 top-1 left-1 rounded-md">New</span>:null
        }  
      <img className="h-52 w-full" src={image} alt={name}/>
      <div className="px-6 pt-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">
          {descriptionShow(description)}
        </p>
      </div>
      <div className="px-10 flex items-center justify-between pb-2">
        <h3 className="font-bold">₹{' '}{price}</h3>
        <span className="text-gray-500 font-semibold">{likeCount}{' '}likes</span>
      </div>
      <div className="px-6 flex items-center pb-4 justify-between">
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Buy Now</button>
        <button onClick={addToCartHandler} type="button" className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
          <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
          <span className="sr-only">Icon description</span>
        </button>          
        {
          !liked ? 
          <>
          {/* unlike handler */}
            <button onClick={likeHandler} type="button" className="text-red-700 border border-blue-700 hover:bg-gray-300 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
              <svg class="w-5 h-5 text-red-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 19">
                <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z"/>
              </svg>
            </button>
          </>
          :
          <>
          {/* like handler */}
            <button onClick={unLikeHandler} type="button" className="text-red-700 border border-blue-700 hover:bg-gray-300 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
              <svg class="w-5 h-5 text-red-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 19">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z"/>
              </svg>
            </button>
          </>
        }
      </div>
    </div>
  )
}

export default ProductCardComponent

// id,name, description, image, likescount, status createdAt, ownerId, categoryId, price