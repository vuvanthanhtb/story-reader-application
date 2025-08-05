import { lazy } from 'react';
import { IRouteModel } from './model.route';
import dashboardRoutes from './dashboard.route';
import authRoutes from './auth.route';

export const routes: IRouteModel[] = [
  {
    name: 'NotFoundPage',
    title: 'Personnal Admin - Not Found',
    path: '*',
    private: false,
    component: lazy(() => import('shared/pages/not-found')),
  },
  ...dashboardRoutes,
  ...authRoutes
];
export * from './model.route';
