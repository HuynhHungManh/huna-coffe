import App from 'components/app';
import HomePage from 'components/pages/HomePage.jsx';
import Calendar from 'components/pages/Calendar.jsx';
import Document from 'components/pages/Document.jsx';
import ProcedureDetail from 'components/pages/ProcedureDetail.jsx';
import FindProcedure from 'components/pages/FindProcedure.jsx';
import FindProcedureDetail from 'components/pages/FindProcedureDetail.jsx';
import Feedback from 'components/pages/Feedback.jsx';
import Plan from 'components/pages/Plan.jsx';
import ViewMapPlan from 'components/pages/ViewMapPlan.jsx';
import RatingList from 'components/pages/RatingList.jsx';
import RatingDetail from 'components/pages/RatingDetail.jsx';
import SearchFile from 'components/pages/SearchFile.jsx';
import SearchDetail from 'components/pages/SearchDetail.jsx';
import Login from 'components/pages/Login.jsx';
import Coffee from 'components/pages/Coffee.jsx';
const routes = [
  {
    component: App,
    routes: [
      {
        component: HomePage,
        exact: true,
        path: '/',
      },
      {
        component: Calendar,
        exact: true,
        path: '/calendar',
      },
      {
        component: Document,
        exact: true,
        path: '/document',
      },
      {
        component: ProcedureDetail,
        exact: true,
        path: '/procedure-detail',
      },
      {
        component: ProcedureDetail,
        exact: true,
        path: '/procedure-detail/:id',
      },
      {
        component: FindProcedure,
        exact: true,
        path: '/find-procedure',
      },
      {
        component: FindProcedureDetail,
        exact: true,
        path: '/find-procedure-detail',
      },
      {
        component: FindProcedureDetail,
        exact: true,
        path: '/find-procedure-detail/:id',
      },
      {
        component: Feedback,
        exact: true,
        path: '/feedback',
      },
      {
        component: Plan,
        exact: true,
        path: '/plan',
      },
      {
        component: ViewMapPlan,
        exact: true,
        path: '/view-project/:id',
      },

      {
        component: RatingDetail,
        exact: true,
        path: '/rating-detail',
      },
      {
        component: RatingDetail,
        exact: true,
        path: '/rating-detail/:id',
      },
      {
        component: RatingList,
        exact: true,
        path: '/rating-list',
      },
      {
        component: SearchDetail,
        exact: true,
        path: '/search-detail/:id',
      },
      {
        component: SearchDetail,
        exact: true,
        path: '/search-detail/:id',
      },
      {
        component: SearchFile,
        exact: true,
        path: '/search-file',
      },
      {
        component: Login,
        exact: true,
        path: '/login'
      },
      {
        component: Coffee,
        exact: true,
        path: '/coffee'
      }
    ]
  }
];

export default routes;
