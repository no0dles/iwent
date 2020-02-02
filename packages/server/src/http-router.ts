import * as http from "http";
import {HttpRouterHandler} from './http-router-handler';
import {HttpMethodRouter} from './http-method-router';

export class HttpRouter {
  private readonly middlewares: HttpRouterHandler[] = [];
  private readonly methods: { [key: string]: HttpMethodRouter } = {
    'GET': new HttpMethodRouter(),
    'POST': new HttpMethodRouter(),
    'OPTIONS': new HttpMethodRouter(),
  };

  private addHandler(method: string, urlOrHandler: string | HttpRouterHandler | RegExp, handler?: HttpRouterHandler) {
    const router = this.methods[method];
    if (!router) {
      return;
    }

    if (typeof urlOrHandler === 'string') {
      router.add(new RegExp(urlOrHandler), handler as HttpRouterHandler);
    } else if (urlOrHandler instanceof RegExp) {
      router.add(urlOrHandler, handler as HttpRouterHandler);
    } else {
      router.add(/(.*?)/, urlOrHandler);
    }
  }

  get(handler: HttpRouterHandler)
  get(url: string, handler: HttpRouterHandler)
  get(url: RegExp, handler: HttpRouterHandler)
  get(urlOrHandler: string | HttpRouterHandler | RegExp, handler?: HttpRouterHandler) {
    this.addHandler('GET', urlOrHandler, handler);
  }

  post(handler: HttpRouterHandler)
  post(url: string, handler: HttpRouterHandler)
  post(url: RegExp, handler: HttpRouterHandler)
  post(urlOrHandler: string | HttpRouterHandler | RegExp, handler?: HttpRouterHandler) {
    this.addHandler('POST', urlOrHandler, handler);
  }

  options(handler: HttpRouterHandler)
  options(url: string, handler: HttpRouterHandler)
  options(url: RegExp, handler: HttpRouterHandler)
  options(urlOrHandler: string | HttpRouterHandler | RegExp, handler?: HttpRouterHandler) {
    this.addHandler('OPTIONS', urlOrHandler, handler);
  }

  middleware(handler: HttpRouterHandler) {
    this.middlewares.push(handler);
  }

  handle(request: http.IncomingMessage, response: http.ServerResponse) {
    if (!request.method) {
      return false;
    }

    for (const middleware of this.middlewares) {
      middleware(request, response);
    }

    const methodRouter = this.methods[request.method];
    if (methodRouter) {
      return methodRouter.handle(request, response);
    }
    return false;
  }
}