import App from 'components/app';
import Login from 'components/pages/Login.jsx';
import Coffee from 'components/pages/Coffee.jsx';
import TemporaryBill from 'components/pages/TemporaryBill.jsx';
import StoreTmp from 'components/pages/StoreTmp.jsx';

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
        path: '/order'
      },
      {
        component: Coffee,
        exact: true,
        path: '/order/:code',
      },
      {
        component: TemporaryBill,
        exact: true,
        path: '/temporary-bill'
      },
      {
        component: StoreTmp,
        exact: true,
        path: '/store-tmp'
      }
    ]
  }
];

export default routes;
