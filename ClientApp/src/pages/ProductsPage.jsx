import React, {useEffect,useState } from 'react'
import ProductCardComponent from '../components/ProductCardComponent';

function ProductsPage() {
  const [products, setProducts] = useState([])
  useEffect(() => {
      async function fetchProducts() {
          let response = await fetch('/api/Products',{
            headers: {
              'Authorization':`Bearer ${localStorage.getItem("authToken")}`
            }
          });
          let data = await response.json()
          setProducts(data)
      }
      fetchProducts()
    }, [])
    
  return (
    <div>

            <pre>
              {JSON.stringify(products, undefined, 2)}
            </pre>
      <div className="flex flex-wrap justify-center">
        {
          products.map(product => {
            return <ProductCardComponent key={product.id} id={product.id} name={product.name} description={product.description} price={product.price} image={product.image} likes={product.likes} likesCount={product.likes.length} createdAt={product.createdAt}></ProductCardComponent>
          })
        }
      </div>
            
    </div>
  )
}

export default ProductsPage