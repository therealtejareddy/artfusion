import React, {useEffect, useState, useContext} from 'react';
import {useParams} from "react-router-dom"
import { followHandler, unFollowHandler } from '../utils/followHandlers';
import {authContext} from "./../context/authContext"
import ProductCardComponent from '../components/ProductCardComponent';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function ProfilePage() {
  const [user, setUser] = useState(null)
  const {userData}  = useContext(authContext);
  const {userId} = useParams()
  const [isFollowing, setIsFollowing] = useState();
  const [followersCount, setFollowersCount] = useState(0)

  const requestData = {
            headers: {
              'Authorization':`Bearer ${localStorage.getItem("authToken")}`,
              'Content-Type':'application/json'
            }
          }
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/User/${userId}`,requestData);
      const data = await response.json()
      console.log(response);
      console.log(data);
      setUser(data);
      setIsFollowing(data.followers.length!==0);
      setFollowersCount(data.followersCount)
      console.log(user);

    }
    fetchUser()
  }, [])
  
  
  return (
        user ? 
        <div className="z-0">
          <div className="profile-page">
      <section className="relative block h-[450px]">
        <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{
                backgroundImage: user.coverPicURL ? `url('${user.coverPicURL}')` : `url('https://api.dicebear.com/6.x/shapes/svg?seed=${user.firstName}')`
        }}>
          <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px" style={{transform: "translateZ(0px)"}}>
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    {
                        user && user.profilePicURL ? <img alt="..." src={user.profilePicURL} className="shadow-xl rounded-full max-h-[150px] min-h-[150px] align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 w-[24rem] max-w-150-px"/> :
                        <img alt="..." src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${user.firstName} ${user.lastName}`} className="shadow-xl rounded-full max-h-[150px] min-h-[150px] align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"/>
                    }
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 md:mt-0 sm:mt-0 flex justify-center md:block">
                    {
                      !isFollowing ? <button onClick={() => followHandler(user.userId, userData.id).then(status =>{
                        if(status===200){
                          setIsFollowing(true)
                          setFollowersCount(prev => prev+1)
                        }
                      })} className="bg-green-500 active:bg-green-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                      Follow
                    </button> : <button onClick={() => unFollowHandler(user.userId, userData.id).then(status => {
                      if(status===200){
                        setIsFollowing(false)
                        setFollowersCount(prev => prev-1)
                      }
                    })} className="bg-red-500 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                      Unfollow
                    </button>
                    }
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{user && user.listedProducts.length+user.soldOutProducts.length}</span><span className="text-sm text-blueGray-400">Arts</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{user && user.soldOutProducts.length}</span><span className="text-sm text-blueGray-400">Sold Out</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{ user && followersCount}</span><span className="text-sm text-blueGray-400">Followers</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 pb-6">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                  {user.firstName}{' '}{user.lastName}
                </h3>
                {
                  user.city && <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                              {user.city}, {user.state}
                            </div>
                }
                    <div className="mt-4">
                    <div>
                        <Tabs>
                            <TabList className="flex space-x-6">
                                <Tab>Listed</Tab>
                                <Tab>Sold Out</Tab>
                            </TabList>

                            <TabPanel>
                                <h3 className="ml-6 mt-4 text-left">Listed Products</h3>
                                <div className="flex flex-wrap justify-center">
                                    { (user && user.listedProducts.length>0) 
                                    ?
                                        user.listedProducts.map(product => {
                                            return <ProductCardComponent key={product.id} id={product.id} name={product.name} description={product.description || ''} price={product.price} image={product.image} likes={product.likes} likesCount={product.likes.length} createdAt={product.createdAt} status={product.status}></ProductCardComponent>
                                        })
                                        :<>
                                          <h2 className="text-center py-16 w-full">No Listed Products</h2>
                                        </>
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <h3 className="ml-6 mt-4 text-left">Sold Out Products</h3>
                                <div className="flex flex-wrap justify-center">
                                    { (user && user.soldOutProducts.length>0) ?
                                        user.soldOutProducts.map(product => {
                                            return <ProductCardComponent key={product.id} id={product.id} name={product.name} description={product.description} price={product.price} image={product.image} likes={product.likes} likesCount={product.likes.length} createdAt={product.createdAt} status={product.status}></ProductCardComponent>
                                        }) : 
                                        <>
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
        </div>
      </section>
    </div>
      </div> 
      : <div>Loading...</div>
  )
}

export default ProfilePage