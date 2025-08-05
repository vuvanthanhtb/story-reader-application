import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter, Outlet } from "react-router-dom";
import PrivateLayout from "shared/layout/private.layout";
import { FullLoadingPage } from "shared/pages";
import { IRouteModel, routes } from "shared/routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullLoadingPage />}>
        <Routes>
          {routes.map((route: IRouteModel, index: number) => {
            const {
              path,
              component: Component,
              private: isPrivate,
              title,
            } = route;

            if (isPrivate) {
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <PrivateLayout title={title}>
                      <Component />
                    </PrivateLayout>
                  }
                />
              );
            }
            return <Route key={index} path={path} element={<Component />} />;
          })}
        </Routes>
      </Suspense>
      <Outlet />
    </BrowserRouter>
  );
};

export default AppRoutes;
