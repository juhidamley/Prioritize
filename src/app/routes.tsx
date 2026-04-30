import { createBrowserRouter } from 'react-router';
import { QueueList } from './components/QueueList';
import { QueueView } from './components/QueueView';
import { Login } from './components/Login'; 
import Hero from '../pages/Hero';
import { About } from '../pages/About';
import { RootLayout } from './Layouts'; 

export const router = createBrowserRouter([
  {
    // This JSX requires the .tsx extension
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