import React, { forwardRef, MutableRefObject, useRef } from "react";
import { useStack } from "../../src";
import { transitionsHelper } from "../helper/transitionsHelper";
const componentName: string = "YoloPage";
const debug = require("debug")(`front:${componentName}`);

interface IProps {}

const YoloPage = forwardRef((props: IProps, handleRef: MutableRefObject<any>) => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    handleRef,
    rootRef,
    playIn: () => transitionsHelper(rootRef.current, true),
    playOut: () => transitionsHelper(rootRef.current, false),
  });

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
    </div>
  );
});

YoloPage.displayName = componentName;
export default YoloPage;
