import React from "react";
import { Composition } from "remotion";
import { Skyscraper } from "./skyscraper/Skyscraper";
import { ContentDay } from "./content-day/ContentDay";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Skyscraper" component={Skyscraper} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="ContentDay" component={ContentDay} durationInFrames={180} fps={30} width={1920} height={1080} loop />
    </>
  );
};
