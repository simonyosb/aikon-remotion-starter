import { Composition } from "remotion";
import { LattePromo } from "./LattePromo";
import {
  ButterflyPeaLime,
  IcedCocoa,
  MatchaLatte,
  StrawberryMilk,
  ThaiTea,
} from "./DrinkPromo";

const DRINKS = [
  { id: "ThaiTea", component: ThaiTea },
  { id: "MatchaLatte", component: MatchaLatte },
  { id: "ButterflyPeaLime", component: ButterflyPeaLime },
  { id: "StrawberryMilk", component: StrawberryMilk },
  { id: "IcedCocoa", component: IcedCocoa },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LattePromo"
        component={LattePromo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      {DRINKS.map(({ id, component }) => (
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
