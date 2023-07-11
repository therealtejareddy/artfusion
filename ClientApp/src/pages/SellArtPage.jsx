import React,{useState, useEffect, useContext} from 'react'
import { getRequestOptions, postRequestOptions } from "./../utils/utils";
import ProfileSideBarComponent from '../components/ProfileSideBarComponent';
import {authContext} from "./../context/authContext"
import {useNavigate} from "react-router-dom"

function SellArtPage() {
    const navigate = useNavigate()
    const {userData} = useContext(authContext)
    const [categories, setCategories] = useState();
    const [productName, setProductName] = useState();
    const [productDescription, setProductDescription] = useState();
    const [productPrice, setProductPrice] = useState();
    const [productCategory, setProductCategory] = useState();
    const [uploadFile, setUploadFile] = useState();
    const [metaDataCount, setMetaDataCount] = useState(0)
    const [productMetaData, setProductMetaData] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    useEffect(() => {
      async function fetchCategories(){
        const response = await fetch('/api/Category',getRequestOptions);
        const data = await response.json();
        setCategories(data);
        console.log(data);
      }
      fetchCategories()
    }, [])


    async function handleSubmit(e){
        e.preventDefault();
        setIsUploading(true)
        for(let i=0;i<metaDataCount;i++){
            setProductMetaData(prev => [...prev,[e.target[`metaDataKey${i}`].value,e.target[`metaDataValue${i}`].value]]);
        }
        const formData = new FormData ();
        formData.append("file", uploadFile);
        formData.append("upload_preset", "ml_default");
        formData.append("folder","art");
        console.log(formData);
        let response = await fetch(`https://api.cloudinary.com/v1_1/dy5jbitxn/image/upload`,{
            method: 'POST',
            body: formData,
        }).then(res => res.json()).then(data => {
            console.log(data);
            return fetch('/api/Products',{
            ...postRequestOptions,
            body: JSON.stringify({name:productName, description:productDescription,image:data.secure_url.toString(),categoryId:productCategory,price:parseFloat(productPrice),ownerId:userData.id,metaData:productMetaData})
        })
        })
        let data = await response.json();
        if(response.status===201){
            e.target.reset();
            setIsUploading(false)
            navigate(`/product/${data.id}`)
        }
    }

    function getMetaDataFields() {
        let list = [];
        for(let i=0;i<metaDataCount;i++){
            let metaHtml = <div key={i} className="w-full flex items-center space-x-6 my-3">
                <div className="w-full"><input name={`metaDataKey${i}`} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter key name"/></div>
                <div className="w-full"><input name={`metaDataValue${i}`} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter value"/></div>
            </div>
            list.push(metaHtml)
        }
        return list
    }
    
  return (
    <div className="pt-[4rem] bg-gray-100 pl-10">
        <div className="flex justify-between max-w-8xl mx-auto mt-4">
            <div>
                <ProfileSideBarComponent></ProfileSideBarComponent>
            </div>
            <div className="w-full">
                <div className="mt-4 w-full max-w-xl mx-auto">
                    <h2 className="mt-6 mb-10">Add Your Art to Sell</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="my-3">
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="small_size">Upload Your Art</label>
                            <input required onChange ={(e) => {setUploadFile(e.target.files[0])}} class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file"></input>
                        </div>
                        <div className="my-3">
                            <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input required onChange={(e)=>setProductName(e.target.value)} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </div>
                        <div className="my-3">                   
                            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                            <textarea required onChange={(e) => setProductDescription(e.target.value)} id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write about your product here..."></textarea>
                        </div>
                        <div className="flex items-center w-full space-x-6 my-3">
                            <div className="w-full">
                                <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                <input required onChange={(e) => setProductPrice(e.target.value)} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div className="w-full">               
                                <label for="categories" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                                <select onChange={(e) => setProductCategory(e.target.value)} id="categories" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected>Choose a Category</option>
                                {   categories &&
                                    categories.map(category => <option key={category.categoryId} value={category.categoryId}>{category.name}</option>)
                                }
                                </select>
                            </div>
                        </div>
                        <div className="exp">
                            <div>
                                {
                                    getMetaDataFields()
                                }
                            </div>
                              <button onClick={() => {setMetaDataCount(prev => prev+1)}} type="button" class="text-white w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Add Field</button>
                        </div>
                        <div className="my-3">
                            <button type="submit" class="text-white w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">{isUploading?'Uploading...':'Upload'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SellArtPage