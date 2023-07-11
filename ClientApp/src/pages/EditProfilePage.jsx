import React,{useState,useEffect, useContext} from 'react'
import ProfileSideBarComponent from "./../components/ProfileSideBarComponent"
import {getRequestOptions, updateRequestOptions} from "./../utils/utils"
import {authContext} from "./../context/authContext"
import {useNavigate} from "react-router-dom"

function EditProfilePage() {
    const navigate = useNavigate()
    const {userData} = useContext(authContext)
    const [uploadCoverFile, setUploadCoverFile] = useState()
    const [uploadProfileFile, setUploadProfileFile] = useState()
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [city, setCity] = useState()
    const [state, setState] = useState()
    const [isUpdating, setIsUpdating] = useState(false)
    useEffect(() => {
      async function fetchProfileData(){
        let response = await fetch(`/api/User/${userData.id}`,getRequestOptions)
        const data = await response.json();
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setState(data.state);
        setCity(data.city);
      }
      fetchProfileData()
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault()
        setIsUpdating(true)
        let response;
        if(!uploadCoverFile&&!uploadProfileFile){
            response = await fetch(`/api/User/${userData.id}`,{
                ...updateRequestOptions,
                body:JSON.stringify({userId:userData.id,firstName, lastName, city, state})
            })
        }else if(!uploadCoverFile){
            const formData = new FormData();
            formData.append("file", uploadProfileFile);
            formData.append("upload_preset", "ml_default");
            formData.append("folder","profile_pic");
            response = await fetch(`https://api.cloudinary.com/v1_1/dy5jbitxn/image/upload`,{
                        method: 'POST',
                        body: formData,
                    }).then(res => res.json()).then(data => {
                        return fetch(`/api/User/${userData.id}`,{
                            ...updateRequestOptions,
                            body:JSON.stringify({userId:userData.id,firstName,lastName,city,state,profilePicURL:data.secure_url.toString()})
                        })
                    })
            console.log(response.status);
        }else if(!uploadProfileFile){
            const formData = new FormData();
            formData.append("file", uploadCoverFile);
            formData.append("upload_preset", "ml_default");
            formData.append("folder","cover_pic");
            response = await fetch(`https://api.cloudinary.com/v1_1/dy5jbitxn/image/upload`,{
                        method: 'POST',
                        body: formData,
                    }).then(res => res.json()).then(data => {
                        return fetch(`/api/User/${userData.id}`,{
                            ...updateRequestOptions,
                            body:JSON.stringify({userId:userData.id,firstName,lastName,city,state,coverPicURL:data.secure_url.toString()})
                        })
                    })
            console.log(response.status);
        } else if(uploadCoverFile && uploadProfileFile){
            const formDataCover = new FormData();
            formDataCover.append("file", uploadCoverFile);
            formDataCover.append("upload_preset", "ml_default");
            formDataCover.append("folder","cover_pic");
            const formDataProfile = new FormData();
            formDataProfile.append("file", uploadProfileFile);
            formDataProfile.append("upload_preset", "ml_default");
            formDataProfile.append("folder","profile_pic");
            response = await Promise.all([
                fetch(`https://api.cloudinary.com/v1_1/dy5jbitxn/image/upload`,{
                        method: 'POST',
                        body: formDataCover,
                    }),
                fetch(`https://api.cloudinary.com/v1_1/dy5jbitxn/image/upload`,{
                        method: 'POST',
                        body: formDataProfile,
                    })
            ]).then((responses) => {
                return Promise.all(responses.map(res => res.json())) 
            }).then((data) => {
                return fetch(`/api/User/${userData.id}`,{
                            ...updateRequestOptions,
                            body:JSON.stringify({userId:userData.id,firstName,lastName,city,state,coverPicURL:data[0].secure_url.toString(),profilePicURL:data[1].secure_url.toString()})
                })
            })
        }
        if(response.status===204){
            setIsUpdating(false)
            navigate('/profile');
            
        }
    }
  return (
    <div className="pt-[4rem] bg-gray-100 pl-10 min-h-[100vh]">
        <div className="flex justify-between max-w-8xl mx-auto mt-4">
            <div>
                <ProfileSideBarComponent></ProfileSideBarComponent>
            </div>
            <div className="w-full">
                <div className="mt-4 w-full max-w-xl mx-auto">
                    <h2 className="mt-6 mb-10">Add About You</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="my-3">
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="small_size">Cover Picture</label>
                            <input onChange ={(e) => {setUploadCoverFile(e.target.files[0])}} class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file"></input>
                        </div>
                        <div className="my-3">
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="small_size">Profile Picture</label>
                            <input onChange ={(e) => {setUploadProfileFile(e.target.files[0])}} class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file"></input>
                        </div>
                        <div className="my-3 flex items-center space-x-6">
                            <div class="w-full">
                                <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div class="w-full">
                                <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                <input value={lastName} onChange={(e)=>setLastName(e.target.value)} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                        </div>
                        <div className="my-3 flex items-center space-x-6">
                            <div class="w-full">
                                <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                <input value={city} onChange={(e)=>setCity(e.target.value)} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div class="w-full">
                                <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                                <input value={state} onChange={(e)=>setState(e.target.value)} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                        </div>
                        <div className="my-3">
                            <button type="submit" class="text-white w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">{isUpdating?'Updating...':'Update Profile'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditProfilePage