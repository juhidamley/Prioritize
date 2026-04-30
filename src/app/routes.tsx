import { createBrowserRouter } from 'react-router';
import { QueueList } from './components/QueueList';
import { QueueView } from './components/QueueView';
import { Login } from './components/Login'; 
import Hero from '../pages/Hero';
import { About } from '../pages/About';
import { RootLayout } from './Layouts'; // Import the layout that includes the Mandelbrot background

// Make sure to import RootLayout if you put it in a separate file

export const router = createBrowserRouter([
  {
    // The parent route uses the layout
    element: <RootLayout />, 
    children: [
      {
        path: '/',
        Component: QueueList,
      },
      {
        path: '/queue/:queueId',
        Component: QueueView,
      },
      {
        path: '/login',
        Component: Login,
      },
      {
        path: '/hero',
        Component: Hero,
      },
      {
        path: '/about',
        Component: About,
      }
    ]
  }
]);