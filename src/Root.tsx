import React from "react";
import { Composition } from "remotion";
import { Skyscraper } from "./skyscraper/Skyscraper";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Skyscraper"
      component={Skyscraper}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
