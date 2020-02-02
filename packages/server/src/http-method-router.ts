import * as http from 'http';
import {HttpRouterHandler} from './http-router-handler';
import {HttpRequest} from './http-request';

export class HttpMethodRouter {
  private readonly urls: { regex: RegExp, handler: HttpRouterHandler }[] = [];

  add(regex: RegExp, handler: HttpRouterHandler) {
    this.urls.push({regex, handler});
  }

  handle(request: HttpRequest, response: http.ServerResponse) {
    if (!request.path) {
      return false;
    }

    for (const url of this.urls) {
      if (url.regex.test(request.path)) {
        url.handler(request, response);
        return true;
      }
    }

    return false;
  }
}
