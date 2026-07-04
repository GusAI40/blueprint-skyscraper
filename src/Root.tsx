import React from "react";
import { Composition } from "remotion";
import { BeforeAfter, beforeAfterDefaultProps } from "./BeforeAfter";
import { ContentDay } from "./content-day/ContentDay";
import { Skyscraper } from "./skyscraper/Skyscraper";
import { WorkflowVisual } from "./WorkflowVisual";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Skyscraper"
        component={Skyscraper}
        durationInFrames={300}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ContentDay"
        component={ContentDay}
        durationInFrames={180}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BeforeAfter"
        component={BeforeAfter}
        durationInFrames={180}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={beforeAfterDefaultProps}
      />
      <Composition
        id="WorkflowVisual"
        component={WorkflowVisual}
        durationInFrames={240}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
