import React, {useState, useEffect} from 'react'
import {useParams} from "react-router-dom"

function SingleProductPage() {
    const {productId} = useParams()
    const [product, setProduct] = useState(null)
    useEffect(() => {
        async function fetchProduct() {
            let response = await fetch(`/api/Products/${productId}`,{
                headers: {
                'Authorization':`Bearer ${localStorage.getItem("authToken")}`
                }
            });
            let data = await response.json()
            setProduct(data)
        }
        fetchProduct()
        }, [])
  return (
    <div>
        <pre>
            {JSON.stringify(product, undefined, 2)}
        </pre>
    </div>
  )
}

export default SingleProductPage