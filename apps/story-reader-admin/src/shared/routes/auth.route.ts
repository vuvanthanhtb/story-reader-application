import { lazy } from "react";
import { IRouteModel } from "./model.route";

const authRoutes: IRouteModel[] = [
  {
    name: "LoginPage",
    title: "Đăng nhập",
    path: "/login",
    private: false,
    component: lazy(() => import("modules/auth/pages/login")),
  },
];

export default authRoutes;
