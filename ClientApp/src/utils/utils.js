import getStripe from "./get-stripe";
import toast from "react-hot-toast"

export const descriptionShow = (desc) => {
  if(desc==null){
    return ''
  }
    if(desc.length<20){
        return desc
    }
    return `${desc.substring(0,50)}...`
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

export const deleteRequestOptions = {
  method: "DELETE",
  headers:{
    'Authorization':`Bearer ${localStorage.getItem("authToken")}`
  }
}

export const updateRequestOptions = {
  method: "PUT",
                headers: {
                'Authorization':`Bearer ${localStorage.getItem("authToken")}`,
                'Content-Type':'application/json'
                }
}

export const redirectToCheckout = async (prods, deliveryAddressId) => {
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
            body: JSON.stringify({items:items, deliveryAddressId:deliveryAddressId})
          }
        const response = await fetch('/api/Payments/checkout',requestData)
        const stripe = await getStripe();
        let data = await response.json()
        console.log(data);
        await stripe.redirectToCheckout({sessionId: data.id});
    }

export function formatPrice(price){
  return new Intl.NumberFormat('en-IN').format(price)
}

export function successToast(msg){
  toast.success(msg,{
    position: "top-right"
  })
}
export function errorToast(msg){
  toast.error(msg,{
    position: "top-right"
  })
}