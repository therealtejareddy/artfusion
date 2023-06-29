import getStripe from "./get-stripe";

export const descriptionShow = (desc) => {
    if(desc.length<20){
        return desc
    }
    return `${desc.substring(0,60)}...`
}

export const postRequestOptions = {
                method: "POST",
                headers: {
                'Authorization':`Bearer ${localStorage.getItem("authToken")}`,
                'Content-Type':'application/json'
                }
            }

export const getRequestOptions = {
                headers: {
                'Authorization':`Bearer ${localStorage.getItem("authToken")}`
                }
            }

export const deleteRequestOptins = {
  
}

export const redirectToCheckout = async (prods) => {
        console.log(prods);
        let items = prods.map(prod =>{
                return {id:prod.id, 
                    name:prod.name,
                    description:prod.description,
                    image:prod.image,price:prod.price
            }
            } )
          const requestData = {
            ...postRequestOptions,
            body: JSON.stringify({items:items})
          }
        const response = await fetch('/api/Payments/checkout',requestData)
        const stripe = await getStripe();
        let data = await response.json()
        console.log(data);
        await stripe.redirectToCheckout({sessionId: data.id});
    }