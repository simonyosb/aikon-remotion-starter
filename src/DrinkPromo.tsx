import { loadFont } from "@remotion/google-fonts/Kanit";
import { Audio } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["thai", "latin"],
});

type DrinkTheme = {
  readonly id: string;
  readonly name: string;
  readonly headlineSize: number;
  readonly tagline: string;
  readonly price: number;
  readonly bgLight: string;
  readonly bgMid: string;
  readonly bgDark: string;
  readonly ink: string;
  readonly taglineColor: string;
  readonly topLayer: string;
  readonly drinkTop: string;
  readonly drinkBottom: string;
  readonly straw: string;
  readonly badge: string;
  readonly badgeText: string;
  readonly ctaText: string;
};

const THEMES = {
  thaiTea: {
    id: "thai-tea",
    name: "ชาไทยเย็น",
    headlineSize: 220,
    tagline: "ชาเข้มข้น · หวานมันกลมกล่อม",
    price: 40,
    bgLight: "#FFE6C7",
    bgMid: "#F7B36B",
    bgDark: "#E0843A",
    ink: "#5A2A0E",
    taglineColor: "#FFFFFF",
    topLayer: "#FBE6CC",
    drinkTop: "#EE8A35",
    drinkBottom: "#C2540F",
    straw: "#D9481C",
    badge: "#C2410C",
    badgeText: "#FFF4E6",
    ctaText: "#FFF4E6",
  },
  matchaLatte: {
    id: "matcha-latte",
    name: "มัทฉะลาเต้",
    headlineSize: 220,
    tagline: "มัทฉะแท้ · นมสดหอมมัน",
    price: 55,
    bgLight: "#EAF2D7",
    bgMid: "#ADC97F",
    bgDark: "#6E9446",
    ink: "#2B451B",
    taglineColor: "#FFFFFF",
    topLayer: "#86AE4F",
    drinkTop: "#FFF8EE",
    drinkBottom: "#EFE6D2",
    straw: "#4F7A2E",
    badge: "#4F7A2E",
    badgeText: "#FFF8EE",
    ctaText: "#F4F9E8",
  },
  butterflyPeaLime: {
    id: "butterfly-pea-lime",
    name: "อัญชันมะนาว",
    headlineSize: 190,
    tagline: "สดชื่น · เปรี้ยวหวานกำลังดี",
    price: 35,
    bgLight: "#E4E7FF",
    bgMid: "#A2A9F0",
    bgDark: "#5B5FC7",
    ink: "#1F1F5C",
    taglineColor: "#FFFFFF",
    topLayer: "#B66BCB",
    drinkTop: "#4A63D6",
    drinkBottom: "#23308F",
    straw: "#9BC53D",
    badge: "#B5D334",
    badgeText: "#1F1F5C",
    ctaText: "#F0F2FF",
  },
  strawberryMilk: {
    id: "strawberry-milk",
    name: "นมสตรอว์เบอร์รี",
    headlineSize: 145,
    tagline: "สตรอว์เบอร์รีสด · นมนุ่มละมุน",
    price: 45,
    bgLight: "#FFE6EC",
    bgMid: "#F8AFC0",
    bgDark: "#EC7E98",
    ink: "#7A1F3D",
    taglineColor: "#FFFFFF",
    topLayer: "#FFF2F5",
    drinkTop: "#F27593",
    drinkBottom: "#C9365B",
    straw: "#E0335F",
    badge: "#E0335F",
    badgeText: "#FFF5F7",
    ctaText: "#FFF5F7",
  },
  icedCocoa: {
    id: "iced-cocoa",
    name: "โกโก้เย็น",
    headlineSize: 250,
    tagline: "โกโก้เข้มข้น · หอมนุ่มชื่นใจ",
    price: 45,
    bgLight: "#F4E4D2",
    bgMid: "#D3A57E",
    bgDark: "#9C6A45",
    ink: "#3B1F12",
    taglineColor: "#FFFFFF",
    topLayer: "#FFF4E6",
    drinkTop: "#8A5235",
    drinkBottom: "#4A2717",
    straw: "#E9B872",
    badge: "#E9B872",
    badgeText: "#3B1F12",
    ctaText: "#FFF4E6",
  },
} satisfies Record<string, DrinkTheme>;

// Text line that bounces up into place when its Sequence starts
const BounceLine: React.FC<{
  readonly children: React.ReactNode;
  readonly color: string;
  readonly style?: React.CSSProperties;
}> = ({ children, color, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        fontFamily,
        color,
        textAlign: "center",
        opacity: interpolate(frame, [0, 0.2 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [0, 0.9 * fps], ["0px 140px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 9, stiffness: 140 }),
        }),
        scale: interpolate(frame, [0, 0.9 * fps], [0.6, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 9, stiffness: 140 }),
          output: "perceptual-scale",
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const IcedDrink: React.FC<{ readonly theme: DrinkTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clipId = `glass-${theme.id}`;
  const gradientId = `drink-${theme.id}`;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 760,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [0, 1.2 * fps], ["0px 500px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 14 }),
        }),
      }}
    >
      <svg
        width={520}
        height={680}
        viewBox="0 0 520 680"
        style={{
          // Gentle float after landing
          translate: `0px ${Math.sin(frame / (0.8 * fps)) * 10}px`,
          rotate: `${Math.sin(frame / (1.1 * fps)) * 1.5}deg`,
        }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d="M70 90 L450 90 L405 640 Q403 660 383 660 L137 660 Q117 660 115 640 Z" />
          </clipPath>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={theme.drinkTop} />
            <stop offset="1" stopColor={theme.drinkBottom} />
          </linearGradient>
        </defs>
        {/* Straw */}
        <rect x={300} y={0} width={36} height={420} rx={18} fill={theme.straw} transform="rotate(12 318 210)" />
        <g clipPath={`url(#${clipId})`}>
          <rect x={0} y={90} width={520} height={600} fill="rgba(255,255,255,0.35)" />
          {/* Top layer */}
          <rect x={0} y={170} width={520} height={210} fill={theme.topLayer} />
          {/* Layer swirl boundary */}
          <path
            d={`M0 ${380 + Math.sin(frame / 12) * 8} Q130 ${350 - Math.sin(frame / 12) * 10} 260 380 T520 ${375 + Math.sin(frame / 15) * 8} L520 680 L0 680 Z`}
            fill={`url(#${gradientId})`}
          />
          {/* Ice cubes */}
          <rect x={120} y={190} width={110} height={100} rx={18} fill="rgba(255,255,255,0.65)" transform="rotate(-12 175 240)" />
          <rect x={250} y={230} width={100} height={95} rx={18} fill="rgba(255,255,255,0.55)" transform="rotate(14 300 277)" />
          <rect x={170} y={320} width={95} height={90} rx={16} fill="rgba(255,255,255,0.45)" transform="rotate(6 217 365)" />
          {/* Highlight */}
          <rect x={110} y={110} width={22} height={500} rx={11} fill="rgba(255,255,255,0.5)" transform="rotate(-4 121 360)" />
        </g>
        <path
          d="M70 90 L450 90 L405 640 Q403 660 383 660 L137 660 Q117 660 115 640 Z"
          fill="none"
          stroke={theme.ink}
          strokeWidth={10}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const DrinkPromo: React.FC<{ readonly theme: DrinkTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 55%, ${theme.bgLight} 0%, ${theme.bgMid} 55%, ${theme.bgDark} 100%)`,
      }}
    >
      <Sequence name="Glass" from={0.6 * fps} layout="none">
        <IcedDrink theme={theme} />
      </Sequence>

      <Sequence name="Brand" from={0.2 * fps} layout="none">
        <BounceLine color={theme.ink} style={{ top: 150 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 600,
              padding: "14px 48px",
              borderRadius: 999,
              border: `5px solid ${theme.ink}`,
              letterSpacing: 2,
            }}
          >
            ร้านมุมกาแฟ
          </div>
        </BounceLine>
      </Sequence>

      <Sequence name="Headline" from={1.2 * fps} layout="none">
        {/* Fixed-height row keeps shorter-font names vertically centered */}
        <BounceLine
          color={theme.ink}
          style={{
            top: 270,
            height: 300,
            alignItems: "center",
            fontSize: theme.headlineSize,
            fontWeight: 800,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {theme.name}
        </BounceLine>
      </Sequence>

      <Sequence name="Tagline" from={2.4 * fps} layout="none">
        <BounceLine color={theme.taglineColor} style={{ top: 610, fontSize: 60, fontWeight: 400 }}>
          {theme.tagline}
        </BounceLine>
      </Sequence>

      <Sequence name="Price" from={3.6 * fps} layout="none">
        <BounceLine color={theme.ink} style={{ top: 1160, justifyContent: "flex-end", paddingRight: 90 }}>
          <div
            style={{
              width: 330,
              height: 330,
              borderRadius: "50%",
              background: theme.badge,
              color: theme.badgeText,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              rotate: "-8deg",
              boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
              // Heartbeat pulse every second once landed
              scale: String(1 + Math.max(0, Math.sin((frame / fps) * Math.PI * 2)) * 0.04),
            }}
          >
            <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1 }}>{theme.price}</div>
            <div style={{ fontSize: 60, fontWeight: 600, lineHeight: 1.2 }}>บาท</div>
          </div>
        </BounceLine>
      </Sequence>

      <Sequence name="CTA" from={5 * fps} layout="none">
        <BounceLine color={theme.ink} style={{ top: 1560 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: theme.ctaText,
              background: theme.ink,
              padding: "24px 70px",
              borderRadius: 32,
            }}
          >
            แวะมาเลย วันนี้!
          </div>
        </BounceLine>
      </Sequence>

      {/* Soft background music: fade in 0.5s, fade out over the last 1s */}
      <Audio
        name="Music"
        src={staticFile("music.mp3")}
        volume={interpolate(frame, [0, 0.5 * fps, 14 * fps, 15 * fps], [0, 0.25, 0.25, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </AbsoluteFill>
  );
};

export const ThaiTea: React.FC = () => <DrinkPromo theme={THEMES.thaiTea} />;
export const MatchaLatte: React.FC = () => <DrinkPromo theme={THEMES.matchaLatte} />;
export const ButterflyPeaLime: React.FC = () => <DrinkPromo theme={THEMES.butterflyPeaLime} />;
export const StrawberryMilk: React.FC = () => <DrinkPromo theme={THEMES.strawberryMilk} />;
export const IcedCocoa: React.FC = () => <DrinkPromo theme={THEMES.icedCocoa} />;
