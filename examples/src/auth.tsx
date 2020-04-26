import React from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';

import { RouteConfig, AWRouter } from 'aw-react-router-helper';

let logged = Number(window.localStorage.getItem('login')) || 0;

interface RouteMeta {
  auth: boolean;
}

function login() {
  logged = 1;
  window.localStorage.setItem('login', '1');
}

function logout() {
  logged = 0;
  window.localStorage.setItem('login', '0');
}

function checkAuth() {
  if (!logged) {
    return '/login';
  }
}

const Login = () => {
  const history = useHistory();

  return (
    <>
      <button type="button" onClick={_ => {
        login();
        history.push('/home');
      }}>登录</button>
    </>
  );
}

const Home = () => {
  const history = useHistory();

  return (
    <>
      <h1>HOME</h1>
      <button type="button" onClick={_ => {
        logout();
        history.push('/login');
      }}>登出</button>
    </>
  );
}

const configs: RouteConfig<RouteMeta>[] = [
  {
    path: '/',
    middlewares: [
      () => {
        // 未登录默认首页为 login，登录默认首页为 home
        return checkAuth() || '/home';
      },
    ],
  },
  {
    path: '/login',
    component: Login,
    middlewares: [
      () => {
        // 已登录跳转 home
        if (logged) return '/home';
      },
    ],
  },
  {
    path: '/home',
    meta: {
      auth: true, // 需要登录才能访问
    },
    component: Home,
  },
];

export const routerManager = AWRouter.instance<AWRouter<RouteMeta>>().load({
  configs,
  middlewares: [
    state => {
      console.log(state);
      if (state.meta && state.meta.auth) {
        return checkAuth(); 
      }
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
