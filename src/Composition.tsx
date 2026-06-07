import { Composition } from "remotion";
import { BeforeAfter } from "./BeforeAfter";
import { WorkflowVisual } from "./WorkflowVisual";

export const RemotionVideo = () => {
  return (
    <>
      <Composition
        id="BeforeAfter"
        component={BeforeAfter}
        durationInFrames={180} // 6 seconds @ 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          beforeLabel: "12 Hours",
          afterLabel: "12 Minutes",
          beforeStat: "1 proposal",
          afterStat: "19 proposals",
          resultText: "The work gets done. You approve. You lead.",
        }}
      />
      <Composition
        id="WorkflowVisual"
        component={WorkflowVisual}
        durationInFrames={240} // 8 seconds
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
