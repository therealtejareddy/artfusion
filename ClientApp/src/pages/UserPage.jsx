import React,{useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import CurrentUserProfile from '../components/CurrentUserProfile';
import ProductCardComponent from "../components/ProductCardComponent";
import { getRequestOptions } from "./../utils/utils"; 
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ProfileSideBarComponent from '../components/ProfileSideBarComponent';

function UserPage() {
     const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        async function fetchCurrentUser(){
            let response = await fetch('/api/User/current-user', getRequestOptions);
            let data = await response.json();
            if(response.status!=404){
                setCurrentUser(data);
            }
            console.log(data);
        }
        fetchCurrentUser()
    }, [])
    
  return (
    <div className="pt-[4rem] bg-gray-100 pl-10 -z-10">
        <div className="flex space-x-6 max-w-8xl mx-auto mt-4">
            <div>
                <ProfileSideBarComponent></ProfileSideBarComponent>
            </div>
            <div>
                <CurrentUserProfile currentUser={currentUser}></CurrentUserProfile>
                <div className="mt-4">

                    <div>
                        <Tabs>
                            <TabList className="flex space-x-6">
                                <Tab>Listed</Tab>
                                <Tab>Sold Out</Tab>
                            </TabList>

                            <TabPanel>
                                <h3 className="ml-6 mt-4">Listed Products</h3>
                                <div className="flex flex-wrap">
                                    { (currentUser && currentUser.listedProducts.length>0) 
                                    ?
                                        currentUser.listedProducts.map(product => {
                                            return <ProductCardComponent key={product.id} ownerId={product.ownerId} id={product.id} name={product.name} description={product.description} price={product.price} image={product.image} likes={product.likes} likesCount={product.likes.length} createdAt={product.createdAt} status={product.status}></ProductCardComponent>
                                        })
                                        :<>
                                          <h2 className="text-center py-16 w-full">No Listed Products</h2>
                                        </>
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <h3 className="ml-6 mt-4">Sold Out Products</h3>
                                <div className="flex flex-wrap">
                                    { (currentUser && currentUser.soldOutProducts.length>0) 
                                    ?
                                        currentUser.soldOutProducts.map(product => {
                                            return <ProductCardComponent key={product.id} id={product.id} name={product.name} description={product.description} price={product.price} image={product.image} likes={product.likes} likesCount={product.likes.length} createdAt={product.createdAt} status={product.status}></ProductCardComponent>
                                        })
                                        :<>
                                          <h2 className="text-center py-16 w-full">No Sold Out Products</h2>
                                        </>
                                    }
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserPage