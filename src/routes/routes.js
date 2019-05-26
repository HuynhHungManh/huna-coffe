import App from 'components/app';
import Login from 'components/pages/Login.jsx';
import Coffee from 'components/pages/Coffee.jsx';
import TemporaryBill from 'components/pages/TemporaryBill.jsx';

const routes = [
  {
    component: App,
    routes: [
      {
        component: Login,
        exact: true,
        path: '/',
      },
      {
        component: Coffee,
        exact: true,
        path: '/coffee'
      },
      {
        component: TemporaryBill,
        exact: true,
        path: '/temporary-bill'
      }
    ]
  }
];

export default routes;
