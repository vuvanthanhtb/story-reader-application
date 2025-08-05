import { AxiosStrategy, type IRequestStrategy } from "./strategies.axios";
import type { Method } from "axios";
import { GET, POST } from "shared/constants";
import { errorNotification } from "shared/notifications";

class RequestService {
  private static instance: RequestService;
  private strategy: IRequestStrategy;

  private constructor(strategy: IRequestStrategy) {
    this.strategy = strategy;
  }

  public static getInstance(): RequestService {
    if (!RequestService.instance) {
      RequestService.instance = new RequestService(new AxiosStrategy());
    }
    return RequestService.instance;
  }

  private handleError(error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as any).response === "object" &&
      (error as any).response !== null &&
      "data" in (error as any).response &&
      typeof (error as any).response.data === "object" &&
      (error as any).response.data !== null &&
      "message" in (error as any).response.data
    ) {
      errorNotification((error as any).response.data.message);
      return null;
    }
    errorNotification(error instanceof Error ? error.message : String(error));
    return null;
  }

  async methodRequest<T = any>(
    endpoint: string,
    method: Method = GET,
    body: any = null,
    params: Record<string, any> = {},
    headers: Record<string, string> = {}
  ): Promise<T | null> {
    try {
      return await this.strategy.request<T>(
        endpoint,
        method,
        body,
        params,
        headers
      );
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async download(
    endpoint: string,
    params: Record<string, any> = {},
    method: Method = GET,
    headers: Record<string, string> = {}
  ): Promise<void> {
    try {
      await this.strategy.downloadFile(endpoint, params, method, headers);
    } catch (error) {
      this.handleError(error);
    }
  }

  async upload<T = any>(
    endpoint: string,
    files: File | File[] | Record<string, File | File[]>,
    extraData: Record<string, any> = {},
    method: Method = POST,
    headers: Record<string, string> = {}
  ): Promise<T | null> {
    try {
      return await this.strategy.uploadFile<T>(
        endpoint,
        files,
        extraData,
        method,
        headers
      );
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }
}

export default RequestService.getInstance();
