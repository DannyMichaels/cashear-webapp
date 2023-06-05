import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import RoyaltiesChart from '../screens/RoyaltiesChart/RoyaltiesChart';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/royalties-chart',
    element: <RoyaltiesChart />,
  },
]);
