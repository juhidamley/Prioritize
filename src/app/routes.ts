import { createBrowserRouter } from 'react-router';
import { QueueList } from './components/QueueList';
import { QueueView } from './components/QueueView';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: QueueList,
  },
  {
    path: '/queue/:queueId',
    Component: QueueView,
  },
]);
