import React from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router';

import { Singleton } from './Singleton';
import {
  RouteConfig,
  RouteState,
  RouteMiddlewareFunc,
  RouteLoadOptions,
  IRouterHelper,
} from './types';

export class AWRouter<Meta = {}> extends Singleton implements IRouterHelper<Meta> {

  private routeConfigs: RouteConfig<Meta>[] = [];
  private globalMiddlewares: RouteMiddlewareFunc<Meta>[] = [];

  public load({
    configs,
    middlewares,
  }: RouteLoadOptions<Meta>) {
    this.routeConfigs = configs;

    if (middlewares) {
      this.globalMiddlewares = middlewares;
    }

    return this;
  }

  /**
   * routes undefined 为渲染根路由 
   */
  public render(routes?: RouteConfig<Meta>[]) {
    if (routes && routes.length === 0) return null;
    const configs = routes || this.routeConfigs;

    return (
      <Switch>
        {
          configs.map((r) => {
            const exact = !(r.routes && r.routes.length);
            return (
              <Route
                key={r.path}
                path={r.path}
                exact={exact}
                render={this.renderView(r)} />
            );
          })
        }
      </Switch>
    );
  }

  private renderView(route: RouteConfig<Meta>) {
    return (props: RouteComponentProps<any>) => {
      if (route.redirect) {
        return <Redirect to={route.redirect} />
      }

      const state: RouteState<Meta> = {
        meta: route.meta || ({} as any),
        path: route.path,
        url: window.location.href,
      };

      // 执行中间件
      const redirect = this.applyMiddleware(state, this.globalMiddlewares.concat(route.middlewares || []));
      if (redirect) {
        return redirect;
      }

      // 渲染子路由的方法
      const renderRoutesFunc = () => this.render(route.routes || []);

      if (route.render) {
        return route.render({ ...props, route: route, renderRoutes: renderRoutesFunc });
      }

      if (route.component) {
        return <route.component {...props} route={route} renderRoutes={renderRoutesFunc} />;
      }

      throw new Error(`[AWRouter#renderView] ${route.path} 必须得配置 component 或者 render`);
    };
  }

  /**
   * 执行中间件
   */
  private applyMiddleware(state: RouteState<Meta>, middlewares: RouteMiddlewareFunc<Meta>[]) {
    for (let i = 0; i < middlewares.length; i++) {
      const view = middlewares[i](state);
      if (view) {
        if (typeof view === 'string') {
          return <Redirect to={view} />
        }
        return view;
      }
    }
    return null;
  }

}
