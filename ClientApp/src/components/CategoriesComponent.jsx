import React, {useContext, useEffect} from 'react'
import {Link} from "react-router-dom"
import {getRequestOptions} from "./../utils/utils.js"
import {appContext} from "../context/appContext.js"

function CategoriesComponent() {
    const {categories, setCategories} = useContext(appContext);
    useEffect(() => {
      async function fetchCategories(){
        const response = await fetch('/api/Category',getRequestOptions);
        const data = await response.json();
        setCategories(data);
        localStorage.setItem("categories",JSON.stringify(data))
      }
      fetchCategories()
    }, [])
    
  return (
    <div className="z-20 min-w-[10rem] h-[94vh] relative overflow-y-auto inset-0">
        <div className="">
            <h4 className="w-full text-center">Categories</h4>
            <ul>
                {
                    categories && categories.map(category => <li className="my-2" key={category.categoryId}><Link className="no-underline" to={`/products/category/${category.categoryId}`}>{category.name}</Link></li>)
                }
            </ul>
        </div>
    </div>
  )
}

export default CategoriesComponent