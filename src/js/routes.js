
import HomePage from '../pages/home.jsx';
import ServerPage from '../pages/server.jsx';
import PlayerManagement from '../pages/playerManagement.jsx';
import BanManagement from '../pages/banManagement.jsx';
import WhitelistManagement from '../pages/whitelistManagement.jsx';

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
  },
  {
    name: 'banManagement',
    path: '/banManagement/:serverName/:serverAddress/:sessionKey',
    component: BanManagement
  },
  {
    name: 'whitelistManagement',
    path: '/whitelistManagement/:serverName/:serverAddress/:sessionKey',
    component: WhitelistManagement
  }
];

export default routes;
