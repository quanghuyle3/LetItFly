import React from 'react';
import { BrowserRouter as Router, Route, RouterProvider, createBrowserRouter} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

function App() {

  const router = createBrowserRouter ([
    {
      path: "/",
      element:<Login></Login>
    }, 
    {
      path:"/home",
      element:<Home></Home>
    },
    {
      path:"/register",
      element:<Register></Register>
    }
  ]);
  return (
   <div>
    <RouterProvider router={router}></RouterProvider>
   </div>
  );
}

export default App;
