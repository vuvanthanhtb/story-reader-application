import { lazy } from 'react';
import { IRouteModel } from './model.route';

const dashboardRoutes: IRouteModel[] = [
  {
    name: 'DashboardPage',
    title: '',
    path: '/',
    private: true,
    component: lazy(() => import('modules/dashboard/pages')),
    roles: [],
  },
];

export default dashboardRoutes;
