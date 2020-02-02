import * as http from "http";
import {HttpRouterHandler} from './http-router-handler';

export class HttpMethodRouter {
  private readonly urls: { regex: RegExp, handler: HttpRouterHandler }[] = [];

  add(regex: RegExp, handler: HttpRouterHandler) {
    this.urls.push({regex, handler});
  }

  handle(request: http.IncomingMessage, response: http.ServerResponse) {
    if (!request.url) {
      return false;
    }

    for (const url of this.urls) {
      if (url.regex.test(request.url)) {
        url.handler(request, response);
        return true;
      }
    }

    return false;
  }
}
