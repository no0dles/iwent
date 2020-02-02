import * as http from "http";

export interface HttpRouterHandler {
  (request: http.IncomingMessage,
   response: http.ServerResponse): void;
}
