import {useState, createContext, useEffect,useContext} from "react";
import {authContext} from "./authContext.js"
import { getRequestOptions } from "../utils/utils.js";

export const appContext = createContext();

export const AppProvider = ({children}) => {
    const {userData} = useContext(authContext)
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(null);
    const [categories, setCategories] = useState(JSON.parse(localStorage.getItem("categories")));
    useEffect(() => {
      async function fetchCart() {
        let response = await fetch(`api/ShoppingCartItem/all/user/${userData.id}`, getRequestOptions);
        let data = await response.json();
        setCartItems(data)
        setCartItemsCount(data.length)
        console.log(data);
        setTotalPrice(data.reduce((acc, curr) => {
            return acc+curr.price
        },0))
      }
      fetchCart();
    }, [])
    useEffect(() => {
      setTotalPrice(cartItems.reduce((acc, curr) => {
            return acc+curr.price
        },0))
    }, [cartItems])
    
    let contextData = {
        cartItemsCount,
        setCartItemsCount,
        totalPrice,
        cartItems,
        setCartItems,
        categories,
        setCategories

    }

    return(
        <appContext.Provider value={contextData}>
            {children}
        </appContext.Provider>
    )
}

export default appContext;
export const AppConsumer = appContext.Consumer