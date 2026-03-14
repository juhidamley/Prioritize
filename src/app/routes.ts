import { createBrowserRouter } from 'react-router';
import { QueueList } from './components/QueueList';
import { QueueView } from './components/QueueView';
import { Login } from './components/Login'; // Import Login

export const router = createBrowserRouter([
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
], {
  basename: '/prioritize',
});