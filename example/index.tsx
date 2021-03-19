import ReactDOM from "react-dom";
import * as React from "react";
import { forwardRef } from "react";
import { CreateRouter, EHistoryMode, Router, TRoute } from "../src";
import LangService from "../src";
import { langMiddleware } from "../src";

import App from "./App";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import FooPage from "./pages/FooPage";
import BarPage from "./pages/BarPage";
import "./index.css";
import { createBrowserHistory } from "history";

const debug = require("debug")(`router:index`);

/**
 * Define routes list
 */
export const routesList: TRoute[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/blog/:id",
    component: ArticlePage,
    props: {
      color: "red",
    },
  },
  {
    path: "/about",
    component: AboutPage,
    children: [
      {
        path: "/foo",
        component: FooPage,
      },
      {
        path: "/bar",
        component: BarPage,
      },
    ],
  },
  {
    path: "/:rest",
    component: forwardRef((props, r) => <div className="NotFoundPage">Not Found</div>),
  },
];

const baseUrl = "/master";
// TODO si showDefaultLangInUrl is true - la base sur sous router doit être modifié a chaque changement type
// TODO  const base = isCurrentLang ? /base/path : /base/:lang/path
// TODO ce n'est pas pratique. Il faudrait que CreateRouter s'en charge lui même.

LangService.init([{ key: "en" }, { key: "fr" }, { key: "de" }], true, baseUrl);

const router = new CreateRouter({
  routes: routesList,
  base: baseUrl,
  middlewares: [langMiddleware],
});


/**
 * Init Application
 */
ReactDOM.render(
  <Router router={router}>
    <App />
  </Router>,
  document.getElementById("root")
);
