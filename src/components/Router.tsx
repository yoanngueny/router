import { CreateRouter } from "..";
import React, { createContext, memo, ReactElement, useEffect } from "react";
import { ROUTERS } from "../api/routers";

const componentName = "Router";
const debug = require("debug")(`router:${componentName}`);

interface IProps {
  router: CreateRouter;
  children: ReactElement;
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
  useEffect(() => {
    ROUTERS.instances.push(props.router);
    return () => {
      ROUTERS.instances.splice(
        ROUTERS.instances.findIndex((el) => el.id === props.router.id),
        1
      );
      props.router.destroyEvents();
    };
  }, [props.router]);

  return <RouterContext.Provider value={props.router} children={props.children} />;
});

Router.displayName = componentName;
