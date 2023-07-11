import React, {useContext} from 'react';
import { Route, Routes, Redirect } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';
import { AuthProvider, authContext } from './context/authContext';
import { AppProvider } from './context/appContext';

export default function App() {
  //static displayName = App.name;

    return (
      <AuthProvider>
        <AppProvider>
          <Layout>
              <Routes>
                {AppRoutes.map((route, index) => {
                  const { element, ...rest } = route;
                  return <Route key={index} {...rest} element={element} ></Route>
                })}
              </Routes>
            </Layout>
        </AppProvider>
      </AuthProvider>
    );
}
