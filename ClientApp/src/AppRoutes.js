import LoginPage from "./pages/auth/LoginPage" 
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import Home from "./components/Home";
import RegisterPage from "./pages/auth/RegisterPage";
import ProductsPage from "./pages/ProductsPage";

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
  }
];

export default AppRoutes;
