
import HomePage from '../pages/home.jsx';
import ServerPage from '../pages/server.jsx';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    name: 'server',
    path: '/server/:serverName/:serverType/:serverAddress',
    component: ServerPage
  }
];

export default routes;
