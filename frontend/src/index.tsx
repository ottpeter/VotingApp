import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AppRoot from './AppRoot';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import NotFound from './NotFound';
import PollDetails from './pages/PollDetails';
import NewPoll from './pages/NewPoll';


const router = createBrowserRouter([
  {
    path: '/',
    element: <AppRoot />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },{
        path: '/history/:pagenum?',
        element: <History />
      },
      {
        path: '/new',
        element: <NewPoll />
      },
      {
        path: '/details/:id',
        element: <PollDetails />
      },
      {
        path: '/',
        element: <Navigate to={'/dashboard'} />
      }
    ],
    errorElement: <NotFound />
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
