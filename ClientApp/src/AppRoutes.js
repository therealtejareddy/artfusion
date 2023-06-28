import LoginPage from "./pages/auth/LoginPage" 
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import Home from "./components/Home";
import RegisterPage from "./pages/auth/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import SingleProductPage from "./pages/SingleProductPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";

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
    path: '/product/:productId',
    element: <SingleProductPage></SingleProductPage>
  },
  {
    path: '/profile/:userId',
    element: <ProfilePage></ProfilePage>
  },
  {
    path: '/cart',
    element: <CartPage></CartPage>
  }
];

export default AppRoutes;
