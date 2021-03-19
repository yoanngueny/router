import React, { ForwardedRef, forwardRef, useMemo, useRef } from "react";
import { CreateRouter, Link, Router, Stack, useStack } from "../../src";
import { transitionsHelper } from "../helper/transitionsHelper";
import { routesList } from "../index";
const componentName: string = "AboutPage";
const debug = require("debug")(`router:${componentName}`);

interface IProps {}

const AboutPage = forwardRef((props: IProps, handleRef: ForwardedRef<any>) => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    handleRef,
    rootRef,
    playIn: () => transitionsHelper(rootRef.current, true),
    playOut: () => transitionsHelper(rootRef.current, false),
  });


  // TODO trouver un moyen de rendre la creation d'instance plus facile pour les sous routers
  const router = useMemo(
    () =>
      new CreateRouter({
        routes: routesList.find((el) => el.path === "/about").children,
        base: "/master/:lang/about",
        id: 2,
      }),
    []
  );

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
      <br />
      <Router router={router}>
        <>
          <nav>
            <Link to={`/about/foo`}>Foo</Link>
            <br />
            <Link to={"/about/bar"}>Bar</Link>
            <br />
            <Link to={`/error`}>NotFound route</Link>
            <br />
          </nav>

          <br />
          {/* STACK */}
          <Stack />
        </>
      </Router>
    </div>
  );
});

AboutPage.displayName = componentName;
export default AboutPage;
