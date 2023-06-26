import React, {useEffect,useState } from 'react'

function ProductsPage() {
  const [products, setProducts] = useState([])
  useEffect(() => {
      async function getProducts() {
          let response = await fetch('/api/Products',{
      headers: {
        'Authorization':`Bearer ${localStorage.getItem("authToken")}`
      }
    });
          let data = await response.json()
          setProducts(data)
      }
      getProducts()
    }, [])
    
  return (
    <div>

            <pre>
              {JSON.stringify(products, undefined, 2)}
            </pre>
    </div>
  )
}

export default ProductsPage