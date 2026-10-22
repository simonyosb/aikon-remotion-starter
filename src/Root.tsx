import { Composition } from "remotion";
import {
  ButterflyPeaLimeAd,
  IcedCocoaAd,
  MatchaLatteAd,
  StrawberryMilkAd,
  ThaiTeaAd,
} from "./DrinkAd";
import { LatteAd } from "./LatteAd";

const DRINK_ADS = [
  { id: "ThaiTea", component: ThaiTeaAd },
  { id: "MatchaLatte", component: MatchaLatteAd },
  { id: "ButterflyPeaLime", component: ButterflyPeaLimeAd },
  { id: "StrawberryMilk", component: StrawberryMilkAd },
  { id: "IcedCocoa", component: IcedCocoaAd },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LatteYen"
        component={LatteAd}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      {DRINK_ADS.map(({ id, component }) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={450}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
    </>
  );
};
