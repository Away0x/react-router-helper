import React from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';

import { RouteConfig, AWRouter, RouteConfigComponentProps } from 'aw-react-router-helper';

interface RouteMeta {
  name: string;
}

const Layout: React.FC<RouteConfigComponentProps<any, RouteMeta>> = ({
  renderRoutes,
}) => {
  return (
    <>
      <h1>A</h1>
      <div>
        <NavLink style={{ marginRight: '20px' }} to="/a/a1">a1</NavLink>
        <NavLink style={{ marginRight: '20px' }} to="/a/a2">a2</NavLink>
        <NavLink style={{ marginRight: '20px' }} to="/b">b</NavLink>
      </div>

      <div>
        {renderRoutes()}
      </div>
    </>
  );
}

const configs: RouteConfig<RouteMeta>[] = [
  {
    path: '/',
    redirect: '/a',
  },
  {
    path: '/a',
    meta: {
      name: 'a'
    },
    component: Layout,
    routes: [
      {
        path: '/a',
        redirect: '/a/a1',
      },
      {
        path: '/a/a1',
        component: () => {
          return <p>a1</p>
        },
      },
      {
        path: '/a/a2',
        component: () => {
          return <p>a2</p>
        },
      }
    ],
  },
  {
    path: '/b',
    meta: {
      name: 'b'
    },
    component: () => {
      return (
        <h1>B</h1>
      );
    },
  }
];

export const routerManager = AWRouter.instance<AWRouter<RouteMeta>>().load({
  configs,
  middlewares: [
    state => {
      if (state.meta && state.meta.name) {
        document.title = state.meta.name;
      }
      return '';
    },
  ],
});

function App() {
  return (
    <Router>
      {routerManager.render()}
    </Router>
  );
}

export default App;
