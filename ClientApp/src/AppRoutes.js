import LoginPage from "./pages/auth/LoginPage" 
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import Home from "./components/Home";
import RegisterPage from "./pages/auth/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import SingleProductPage from "./pages/SingleProductPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import MyOrders from "./pages/MyOrders";
import ShippingAdddressPage from "./pages/ShippingAdddressPage";
import UserPage from "./pages/UserPage";
import UserLikedProducts from "./pages/UserLikedProducts";
import SellArtPage from "./pages/SellArtPage";
import SellArtEditPage from "./pages/SellArtEditPage";
import EditProfilePage from "./pages/EditProfilePage";
import SearchResultPage from "./pages/SearchResultPage";
import SavedAddressPage from "./pages/SavedAddressPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import EditAddressPage from "./pages/EditAddressPage";

const AppRoutes = [
  {
    index: true,
    path: '/',
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/sign-in',
    element: <LoginPage></LoginPage>
  },
  {
    path: '/sign-up',
    element: <RegisterPage></RegisterPage>
  },
  {
    path: '/products',
    element: <ProductsPage></ProductsPage>
  },
  {
    path: '/products/search',
    element: <SearchResultPage></SearchResultPage>
  },
  {
    path: '/products/category/:categoryId',
    element: <ProductsPage></ProductsPage>
  },
  {
    path: '/product/:productId',
    element: <SingleProductPage></SingleProductPage>
  },
  
  {
    path: '/profile/:userId',
    element: <ProfilePage></ProfilePage>
  },
  {
    path: '/checkout/cart',
    element: <CartPage></CartPage>
  },
  {
    path: '/checkout/address',
    element: <ShippingAdddressPage></ShippingAdddressPage>
  },
  {
    path: '/profile/my-orders',
    element: <MyOrders></MyOrders>
  },
  {
    path: '/profile',
    element: <UserPage></UserPage>,
  },
  {
    path: '/profile/liked',
    element: <UserLikedProducts></UserLikedProducts>,
  },
  {
    path: '/profile/edit',
    element: <EditProfilePage></EditProfilePage>
  },
  {
    path:'/profile/saved-address',
    element: <SavedAddressPage/>
  },
  {
    path:'profile/saved-address/edit/:addressId',
    element:<EditAddressPage/>
  },
  {
    path: '/sell-art',
    element: <SellArtPage></SellArtPage>,
  },{
    path: '/sell-art/edit/:productId',
    element: <SellArtEditPage></SellArtEditPage>
  },{
    path: '/cart/checkout/success',
    element: <PaymentSuccessPage/>
  }
];

export default AppRoutes;
