
import HomePage from '../pages/home.jsx';
import ServerPage from '../pages/server.jsx';
import PlayerManagement from '../pages/playerManagement.jsx';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    name: 'server',
    path: '/server/:serverName/:serverType/:serverAddress/:sessionKey',
    component: ServerPage
  },
  {
    name: 'playerManagement',
    path: '/playerManagement/:serverName/:serverAddress/:sessionKey/',
    component: PlayerManagement
  }
];

export default routes;
