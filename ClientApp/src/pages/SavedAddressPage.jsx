import React,{useState, useEffect, useContext} from 'react'
import ProfileSideBarComponent from "./../components/ProfileSideBarComponent"
import AddressCardComponent from "./../components/AddressCardComponent"
import {authContext} from "./../context/authContext"
import {getRequestOptions} from "./../utils/utils"


function SavedAddressPage() {
    const {userData} = useContext(authContext)
    const [addressList, setAddressList] = useState([])
    useEffect(() => {
      async function fetchAddressList(){
        const response = await fetch(`api/UserAddress/user/${userData.id}`,getRequestOptions);
        const data = await response.json()
        setAddressList(data);
      }
      fetchAddressList()
    }, [])
    
  return (
    <div className="pt-[4rem] bg-gray-300 pl-10">
        <div className="flex space-between max-w-8xl mx-auto mt-4">
            <div>
                <ProfileSideBarComponent></ProfileSideBarComponent>
            </div>
            <div className="w-full">
                <div className="pl-10">
                    <h3>Saved Address</h3>
                </div>
                <div className="mt-4 w-full mx-auto pl-10 flex justify-center items-center flex-wrap">
                    {
                        addressList.map(address =>{
                            return <div className="min-w-md max-w-md bg-white p-4 m-2">
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
                        })
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default SavedAddressPage