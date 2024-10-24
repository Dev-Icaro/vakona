import axios, { AxiosResponse, AxiosError } from 'axios';

export enum HttpStatusCode {
  ok = 200,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500,
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HttpRequest = {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
};
export type HttpResponse = {
  statusCode: number;
  body?: unknown;
};

export interface IHttpClient {
  request: (data: HttpRequest) => Promise<HttpResponse>;
}

export class AxiosHttpClient implements IHttpClient {
  async request(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await axios.request({
        url: data.url,
        method: data.method,
        headers: data.headers,
        data: data.body,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      axiosResponse = axiosError.response as AxiosResponse;
    }

    return this.adapt(axiosResponse);
  }

  private adapt(axiosResponse: AxiosResponse): HttpResponse {
    return {
      body: axiosResponse.data,
      statusCode: axiosResponse.status,
    };
  }
}
