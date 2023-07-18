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
    loader: () => { console.log("Hello from default loader"); return null },
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
        loader: () => { console.log("Dashboard loader"); return 1; }
      },{
        path: '/history/:pagenum?',
        element: <History />,
        loader: () => { console.log("History loader"); return 2; }
      },
      {
        path: '/new',
        element: <NewPoll />,
        loader: () => { console.log("New Poll loader"); return 3; }
      },
      {
        path: '/details/:id',
        element: <PollDetails />,
        loader: () => { console.log("PollDetails loader"); return 4; }
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
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
