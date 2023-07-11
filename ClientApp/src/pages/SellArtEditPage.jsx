import React,{useState, useEffect, useContext} from 'react'
import { getRequestOptions, postRequestOptions, updateRequestOptions } from "./../utils/utils";
import {authContext} from "./../context/authContext"
import {useParams, useNavigate} from "react-router-dom"

function SellArtEditPage() {
    const navigate = useNavigate();
    const {userData} = useContext(authContext)
    const [categories, setCategories] = useState();
    const [productName, setProductName] = useState();
    const [productDescription, setProductDescription] = useState();
    const [productPrice, setProductPrice] = useState();
    const [productCategory, setProductCategory] = useState();
    const [uploadFile, setUploadFile] = useState();
    const [metaDataCount, setMetaDataCount] = useState(0)
    const [editMetadaCount, setEditMetadaCount] = useState()
    const [productMetaData, setProductMetaData] = useState([])
    const [cloudinaryImageURL, setCloudinaryImageURL] = useState()
    const [isUploading, setIsUploading] = useState(false)
    const [newMetaData, setNewMetaData] = useState([])
    const {productId} = useParams()
    useEffect(() => {
      async function fetchCategories(){
        const response = await fetch('/api/Category',getRequestOptions);
        const data = await response.json();
        setCategories(data);
        console.log(data);
      }
      async function fetchProduct(){
        let response = await fetch(`/api/Products/${productId}`,{
                headers: {
                'Authorization':`Bearer ${localStorage.getItem("authToken")}`
                }
            });
        let data = await response.json()
        console.log(data);
        setProductName(data.name);
        setProductPrice(data.price);
        setProductDescription(data.description)
        setProductCategory(data.categoryId)
        setCloudinaryImageURL(data.image)
        var mdata = data.metaData.map(md => [md.productId,md.metaDataKey, md.metaDataValue])
        setEditMetadaCount(data.metaData.length)
        setProductMetaData(mdata)
        console.log(mdata);
      }
      fetchCategories()
      fetchProduct()
    }, [])

    async function handleSubmit(e){
        e.preventDefault()
        for(let i=0;i<editMetadaCount;i++){
            setNewMetaData(prev => [...prev,[e.target[`metaDataKeyEdit${i}`].value,e.target[`metaDataValueEdit${i}`].value]]);
        }
        for(let i=0;i<metaDataCount;i++){
            setNewMetaData(prev => [...prev,[e.target[`metaDataKey${i}`].value,e.target[`metaDataValue${i}`].value]]);
        }
        console.log(productMetaData);
        if(!uploadFile){
            let response = await fetch(`/api/Products/${productId}`,{
                ...updateRequestOptions,
                body: JSON.stringify({id:productId,name:productName, description:productDescription,image:cloudinaryImageURL,categoryId:productCategory,price:parseFloat(productPrice),ownerId:userData.id,metaData:newMetaData})
            })
            let data = await response.json();
            console.log(data);
            if(response.status===204){
                navigate(`/product/${productId}`);
            }
        }
        e.target.reset()

    }

    function getMetaDataFields() {
        let list = [];
        for(let i=0;i<editMetadaCount;i++){
            let metaHtml = <div key={`edit${i}`} className="w-full flex items-center space-x-6 my-3">
                <div className="w-full"><input disabled value={productMetaData[i][1]} name={`metaDataKeyEdit${i}`} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter key name"/></div>
                <div className="w-full"><input value={productMetaData[i][2]} name={`metaDataValueEdit${i}`} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter value"/></div>
            </div>
            list.push(metaHtml)
        }
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
    <div className="pt-[4rem] bg-gray-100">
        <div className="w-full">
                <div className="mt-4 w-full max-w-xl mx-auto">
                    <h2 className="mt-6 mb-10">Add Your Art to Sell</h2>
                    <div className="max-w-sm">
                        <img src={cloudinaryImageURL} alt={productName}/>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="my-3">
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="small_size">Small file input</label>
                            <input onChange ={(e) => {setUploadFile(e.target.files[0])}} class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file"></input>
                        </div>
                        <div className="my-3">
                            <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input value={productName} onChange={(e)=>setProductName(e.target.value)} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </div>
                        <div className="my-3">                   
                            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                            <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write about your product here..."></textarea>
                        </div>
                        <div className="flex items-center w-full space-x-6 my-3">
                            <div className="w-full">
                                <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} type="text" class="block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div className="w-full">               
                                <label for="categories" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                                <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} id="categories" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
  )
}

export default SellArtEditPage