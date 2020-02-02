import * as http from "http";
import {HttpRequest} from './http-request';

export interface HttpRouterHandler {
  (request: HttpRequest,
   response: http.ServerResponse): void;
}
