import React,{useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import CurrentUserProfile from '../components/CurrentUserProfile';
import ProductCardComponent from "../components/ProductCardComponent";
import { getRequestOptions } from "./../utils/utils"; 
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ProfileSideBarComponent from '../components/ProfileSideBarComponent';

function UserLikedProducts() {
     const [userLikedProducts, setUserLikedProducts] = useState(null);
    useEffect(() => {
        async function fetchUserLikedProducts(){
            let response = await fetch('/api/User/current-user/liked', getRequestOptions);
            let data = await response.json();
            setUserLikedProducts(data);
            console.log(data);
        }
        fetchUserLikedProducts()
    }, [])
    
  return (
    <div className="pt-[4rem] bg-gray-300 pl-10">
        <div className="flex space-x-6 max-w-8xl mx-auto mt-4">
            <div>
                <ProfileSideBarComponent></ProfileSideBarComponent>
            </div>
            <div className="w-full">
                <div className="pl-10">
                    <h3>Liked Arts</h3>
                </div>
                <div className="mt-4 w-full">
                    <div className="flex flex-wrap justify-center">
                        { userLikedProducts &&
                                        userLikedProducts.map(product => {
                                            return <ProductCardComponent key={product.id} id={product.id} name={product.name} description={product.description} price={product.price} image={product.image} likes={product.likes} likesCount={product.likes.length} createdAt={product.createdAt} status={product.status}></ProductCardComponent>
                                        })
                                    }
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserLikedProducts