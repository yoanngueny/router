import { EHistoryMode, CreateRouter, TRoute, useRouter } from "..";
import React, {
  createContext,
  memo,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import { joinPaths } from "../api/helpers";
import { ROUTERS } from "../api/routers";
import { LangService } from "..";

const componentName = "Router";
// const debug = require("debug")(`router:${componentName}`);

interface IProps {
  base: string;
  // routes array is required for 1st instance only
  routes?: TRoute[];
  middlewares?: any[];
  children: ReactElement;
  historyMode?: EHistoryMode;
}

// Router instance will be keep on this context
// Big thing is you can access this context from the closest provider in the tree.
// This allow to manage easily nested stack instances.
export const RouterContext = createContext<CreateRouter>(null);
RouterContext.displayName = componentName;

/**
 * Router
 * This component returns children wrapped by provider who contains router instance
 */
export const Router = memo((props: IProps) => {
  // deduce a router ID
  const id = ROUTERS.instances?.length > 0 ? ROUTERS.instances.length + 1 : 1;

  // get parent router instance if exist, in case we are one sub router
  const parentRouter = useRouter();

  const showLang = LangService.showLangInUrl();

  // join each parent router base
  const base = joinPaths([
    parentRouter?.base,
    // because language middleware nedd to patch only first level routes
    id !== 1 && showLang && "/:lang",
    props.base,
  ]);

  // get routes list by props first
  // if there is no props.routes, we deduce that we are on a subrouter
  const routes = useMemo(() => {
    let currentRoutesList: TRoute[];
    if (props.routes) {
      ROUTERS.routes = props.routes;
      currentRoutesList = props.routes;
    } else {
      currentRoutesList = ROUTERS.routes?.find((el) => {
        return `${el.path}` === props.base;
      })?.children;
    }

    return currentRoutesList;
  }, [props.routes, props.base]);

  // middlewares are properties of root instance only?
  const middlewares = props.middlewares;

  // keep router instance in state
  const [routerState] = useState<CreateRouter>(() => {
    const newRouter = new CreateRouter({
      base,
      routes,
      id,
      middlewares,
      historyMode: props.historyMode,
    });

    // keep new router in global constant
    ROUTERS.instances.push(newRouter);
    // return it as state
    return newRouter;
  });

  // on destroy, we need to remove this current router instance from ROUTERS.instances array
  // remove 1 element from specific index
  useEffect(() => {
    return () => {
      ROUTERS.instances.splice(
        ROUTERS.instances.findIndex((el) => el.id === routerState.id),
        1
      );
      routerState.destroyEvents();
    };
  }, [routerState]);

  return <RouterContext.Provider value={routerState} children={props.children} />;
});

Router.displayName = componentName;
