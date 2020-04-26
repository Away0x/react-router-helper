# React Router Helper
> 类似 react-router-config，可以以配置形式生成路由

## Install
```bash
npm install --save aw-react-router-helper
```

## Types
```typescript
type RoutesRenderFun = () => React.ReactNode;

interface RouteState<Meta = {}> {
  path: string;
  meta: Meta;
  url: string;
}

interface RouteConfig<Meta = {}> {
  // 路径
  path: string;
  // 存储一些路由的额外信息
  meta?: Meta;
  // 重定向 route path
  redirect?: string;
  // 路由的展示组件 (二选一，且必须有其一)
  component?: React.ComponentType<RouteConfigComponentProps<any, Meta>> | React.ComponentType;
  render?: (props: RouteConfigComponentProps<any, Meta>) => React.ReactNode;
  // 中间件 (路由渲染的拦截器)
  middlewares?: RouteMiddlewareFunc<Meta>[];
  // 子路由
  routes?: RouteConfig<Meta>[];
}

interface RouteConfigComponentProps<Params extends {[K in keyof Params]?: string } = {}, Meta = {}> extends RouteComponentProps<Params> {
  // 路由配置信息
  route: RouteConfig<Meta>;
  // 渲染子路由的方法
  renderRoutes: RoutesRenderFun;
}

type RouteMiddlewareFunc<Meta = {}> = (params: RouteState<Meta>) => undefined | JSX.Element | string;

type RouteLoadOptions<Meta = {}> = {
  configs: RouteConfig<Meta>[];
  middlewares?: RouteMiddlewareFunc<Meta>[];
}

interface IRouterHelper<Meta> {
  load(options: RouteLoadOptions<Meta>): IRouterHelper<Meta>;
  render(routes?: RouteConfig<Meta>[]): JSX.Element | null;
}
```

## Examples
- [base](examples/src/base.tsx)
- [auth](examples/src/auth.tsx)

***
