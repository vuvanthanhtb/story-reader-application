import { POST } from "../../../shared/constants";
import endpoint from "./endpoint.auth";
import type { LoginRequest } from "./model.auth";
import RequestService from "../../../shared/api";

class AuthService {
  static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  loginUser = (data: LoginRequest) =>
    RequestService.methodRequest(endpoint.loginUser, POST, data);

  getCurrentUser = () => RequestService.methodRequest(endpoint.currentUser);
}

export default AuthService.getInstance();
