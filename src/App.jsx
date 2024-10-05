import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import CreateListing from './components/pages/CreateListing';
import Listing from './components/pages/Listing';

import { useEffect, useState } from 'react';

const App = () => {
  const [loading, setLoading] = useState(true);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/profile',
      element: <ProfilePage />,
    },
    {
      path: '/create-listing',
      element: <CreateListing />,
    },
    {
      path: '/listing',
      element: <Listing />,
    }
  ]);

  return(
    <>
      <RouterProvider router={router} />
    </>
  ) ;
};

export default App;
