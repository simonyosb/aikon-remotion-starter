import { loadFont } from "@remotion/google-fonts/Kanit";
import { Audio } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["thai", "latin"],
});

type Garnish = "none" | "cream" | "lime" | "strawberry" | "cocoa";

export type DrinkTheme = {
  readonly id: string;
  readonly name: string;
  readonly headlineSize: number;
  readonly tagline1: string;
  readonly tagline2: string;
  readonly price: number;
  // Background radial gradient (center -> edge)
  readonly bgLight: string;
  readonly bgDark: string;
  // Main text, glass outline and shop pill
  readonly ink: string;
  readonly pillText: string;
  readonly tagline2Color: string;
  // Drink: base fills the glass, pour layer rises from the bottom
  readonly base: string;
  readonly pour: readonly [string, string, string];
  readonly pourEnd: number;
  readonly straw: string;
  readonly badge: string;
  readonly badgeText: string;
  readonly garnish: Garnish;
};

export const DRINKS = {
  ThaiTea: {
    id: "thaitea",
    name: "ชาไทยเย็น",
    headlineSize: 230,
    tagline1: "เข้มข้นสไตล์ไทยแท้",
    tagline2: "หวานมันกลมกล่อม",
    price: 40,
    bgLight: "#FFD9A8",
    bgDark: "#F29A4A",
    ink: "#6B2E12",
    pillText: "#FFE9CF",
    tagline2Color: "#FFFFFF",
    base: "#FBEFDF",
    pour: ["#F7A04E", "#E8742A", "#C4521A"],
    pourEnd: 130,
    straw: "#B23A1E",
    badge: "#B23A1E",
    badgeText: "#FFFFFF",
    garnish: "none",
  },
  MatchaLatte: {
    id: "matcha",
    name: "มัทฉะลาเต้",
    headlineSize: 210,
    tagline1: "มัทฉะแท้ หอมละมุน",
    tagline2: "นุ่มนมสดทุกคำ",
    price: 55,
    bgLight: "#F4F1E1",
    bgDark: "#D9DDB8",
    ink: "#2F4A22",
    pillText: "#F4F1E1",
    tagline2Color: "#6E8F3E",
    base: "#FBF7F0",
    pour: ["#B9D27A", "#86A845", "#5B7F2B"],
    pourEnd: 210,
    straw: "#5B7F2B",
    badge: "#6E8F3E",
    badgeText: "#FFFFFF",
    garnish: "none",
  },
  ButterflyPeaLime: {
    id: "butterfly",
    name: "อัญชันมะนาว",
    headlineSize: 185,
    tagline1: "สีสวยจากดอกอัญชัน",
    tagline2: "เปรี้ยวมะนาว สดชื่น",
    price: 35,
    bgLight: "#DCE3FF",
    bgDark: "#8E97E8",
    ink: "#2A1E6B",
    pillText: "#E9ECFF",
    tagline2Color: "#FFFFFF",
    base: "#3E5BD9",
    pour: ["#B46BE0", "#8A3FC9", "#5E2AA0"],
    pourEnd: 150,
    straw: "#9ACD32",
    badge: "#7FB623",
    badgeText: "#FFFFFF",
    garnish: "lime",
  },
  StrawberryMilk: {
    id: "strawberry",
    name: "นมสตรอว์เบอร์รี",
    headlineSize: 150,
    tagline1: "สตรอว์เบอร์รีหวานอมเปรี้ยว",
    tagline2: "นุ่มนมสดละมุน",
    price: 45,
    bgLight: "#FFE3EA",
    bgDark: "#F7A9BC",
    ink: "#7A1E3A",
    pillText: "#FFE9EF",
    tagline2Color: "#FFFFFF",
    base: "#FFF3F5",
    pour: ["#FFB3C4", "#F06A8A", "#D2304F"],
    pourEnd: 160,
    straw: "#D2304F",
    badge: "#D2304F",
    badgeText: "#FFFFFF",
    garnish: "strawberry",
  },
  IcedCocoa: {
    id: "cocoa",
    name: "โกโก้เย็น",
    headlineSize: 230,
    tagline1: "โกโก้เข้มข้น หอมกรุ่น",
    tagline2: "หวานชื่นใจทุกแก้ว",
    price: 45,
    bgLight: "#E9CFAF",
    bgDark: "#B98559",
    ink: "#3B2014",
    pillText: "#F3E3CF",
    tagline2Color: "#FFFFFF",
    base: "#F3E3CF",
    pour: ["#9A6040", "#6B3A22", "#3B2014"],
    pourEnd: 70,
    straw: "#E8B04A",
    badge: "#3B2014",
    badgeText: "#F6D9A8",
    garnish: "cream",
  },
} satisfies Record<string, DrinkTheme>;

// Bouncy entrance: overshooting scale + rise from below, starting at `delay` seconds
const BounceLine: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ name, delay, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Interactive.Div
      name={name}
      style={{
        fontFamily,
        textAlign: "center",
        lineHeight: 1.15,
        opacity: interpolate(
          frame,
          [delay * fps, delay * fps + 0.15 * fps],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
        scale: interpolate(
          frame,
          [delay * fps, delay * fps + 0.8 * fps],
          [0.3, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 9, stiffness: 160 }),
            output: "perceptual-scale",
          },
        ),
        translate: interpolate(
          frame,
          [delay * fps, delay * fps + 0.8 * fps],
          ["0px 120px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 11, stiffness: 160 }),
          },
        ),
        ...style,
      }}
    >
      {children}
    </Interactive.Div>
  );
};

const GarnishTop: React.FC<{
  readonly garnish: Garnish;
  readonly t: number;
  readonly opacity: number;
}> = ({ garnish, t, opacity }) => {
  const bob = Math.sin(t * 2) * 3;

  if (garnish === "lime") {
    // Lime wheel perched on the rim
    return (
      <g opacity={opacity} transform={`translate(70 ${36 + bob}) rotate(-18)`}>
        <circle r="46" fill="#7FB623" />
        <circle r="39" fill="#E6F5A8" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={Math.cos((i * Math.PI) / 4) * 36}
            y2={Math.sin((i * Math.PI) / 4) * 36}
            stroke="#C5E36A"
            strokeWidth="4"
          />
        ))}
        <circle r="5" fill="#C5E36A" />
      </g>
    );
  }

  if (garnish === "strawberry") {
    // Strawberry hooked on the rim
    return (
      <g opacity={opacity} transform={`translate(78 ${30 + bob}) rotate(-20)`}>
        <path d="M0 -30 Q38 -30 34 6 Q26 42 0 52 Q-26 42 -34 6 Q-38 -30 0 -30 Z" fill="#E23B5A" />
        {[
          [-14, -8],
          [10, -12],
          [0, 10],
          [-16, 18],
          [16, 14],
          [0, 32],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="2.5" ry="4" fill="#FFE08A" />
        ))}
        <path d="M-22 -30 L-8 -40 L0 -30 L8 -42 L22 -30 L0 -22 Z" fill="#4E9A3A" />
      </g>
    );
  }

  if (garnish === "cream") {
    // Whipped cream dome with cocoa dusting
    return (
      <g opacity={opacity} transform={`translate(0 ${bob})`}>
        <path
          d="M40 48 Q50 0 100 8 Q130 -30 165 2 Q215 -6 260 48 Z"
          fill="#FFF8EE"
          stroke="#E7D6C0"
          strokeWidth="3"
        />
        {[
          [100, 22],
          [140, 8],
          [180, 20],
          [120, 36],
          [210, 34],
          [80, 38],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#6B3A22" />
        ))}
      </g>
    );
  }

  return null;
};

const IcedDrink: React.FC<{ readonly theme: DrinkTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Colored layer pours up from the bottom of the glass
  const pourTop = interpolate(frame, [0.6 * fps, 2.6 * fps], [400, theme.pourEnd], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });
  const wave = Math.sin(t * 3) * 6;
  const garnishOpacity = interpolate(frame, [2.4 * fps, 2.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ice = [
    { x: 95, y: 110, r: -14, phase: 0 },
    { x: 165, y: 95, r: 18, phase: 1.3 },
    { x: 125, y: 170, r: 8, phase: 2.4 },
  ];

  const clipId = `glass-${theme.id}`;
  const gradId = `pour-${theme.id}`;

  return (
    <svg viewBox="0 0 300 420" style={{ width: 460, height: 644, overflow: "visible" }}>
      <defs>
        <clipPath id={clipId}>
          <path d="M30 40 L270 40 L242 392 Q240 410 222 410 L78 410 Q60 410 58 392 Z" />
        </clipPath>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.pour[0]} />
          <stop offset="0.55" stopColor={theme.pour[1]} />
          <stop offset="1" stopColor={theme.pour[2]} />
        </linearGradient>
      </defs>

      {/* Straw */}
      <rect
        x="168"
        y="-20"
        width="22"
        height="300"
        rx="11"
        fill={theme.straw}
        transform="rotate(12 179 130)"
      />

      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="300" height="420" fill="#FFFFFF" opacity={0.35} />
        {/* Base layer */}
        <rect x="0" y="70" width="300" height="350" fill={theme.base} />
        {/* Pour layer with wavy top */}
        <path
          d={`M0 ${pourTop} Q75 ${pourTop - 12 + wave} 150 ${pourTop} T300 ${pourTop} L300 420 L0 420 Z`}
          fill={`url(#${gradId})`}
        />
        {/* Ice cubes */}
        {ice.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y + Math.sin(t * 2 + c.phase) * 5}
            width="62"
            height="62"
            rx="12"
            fill="#FFFFFF"
            opacity={0.55}
            stroke="#FFFFFF"
            strokeWidth="3"
            transform={`rotate(${c.r} ${c.x + 31} ${c.y + 31})`}
          />
        ))}
        {/* Glass shine */}
        <rect x="52" y="40" width="16" height="340" rx="8" fill="#FFFFFF" opacity={0.5} transform="rotate(-4 60 210)" />
      </g>

      {/* Glass outline */}
      <path
        d="M30 40 L270 40 L242 392 Q240 410 222 410 L78 410 Q60 410 58 392 Z"
        fill="none"
        stroke={theme.ink}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <line x1="22" y1="40" x2="278" y2="40" stroke={theme.ink} strokeWidth="8" strokeLinecap="round" />

      <GarnishTop garnish={theme.garnish} t={t} opacity={garnishOpacity} />
    </svg>
  );
};

const DrinkAd: React.FC<{ readonly theme: DrinkTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${theme.bgLight} 0%, ${theme.bgDark} 100%)`,
        fontFamily,
        color: theme.ink,
        alignItems: "center",
        paddingTop: 170,
      }}
    >
      {/* Soft background music with short fade in/out */}
      <Audio
        name="Background music"
        src={staticFile("music.mp3")}
        loop
        volume={interpolate(
          frame,
          [0, 0.5 * fps, durationInFrames - 1 * fps, durationInFrames],
          [0, 0.25, 0.25, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )}
      />

      {/* Text lines bounce in one at a time */}
      <BounceLine
        name="Shop name"
        delay={0.4}
        style={{
          fontSize: 52,
          fontWeight: 600,
          color: theme.pillText,
          backgroundColor: theme.ink,
          padding: "10px 44px",
          borderRadius: 999,
        }}
      >
        ร้านมุมกาแฟ
      </BounceLine>
      <BounceLine
        name="Headline"
        delay={1.4}
        style={{
          fontSize: theme.headlineSize,
          fontWeight: 800,
          marginTop: 30,
          whiteSpace: "nowrap",
        }}
      >
        {theme.name}
      </BounceLine>
      <BounceLine
        name="Tagline 1"
        delay={3}
        style={{ fontSize: 64, fontWeight: 400 }}
      >
        {theme.tagline1}
      </BounceLine>
      <BounceLine
        name="Tagline 2"
        delay={4.4}
        style={{ fontSize: 64, fontWeight: 400, color: theme.tagline2Color }}
      >
        {theme.tagline2}
      </BounceLine>

      {/* Glass rises in from the bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: 150,
          translate: interpolate(
            frame,
            [0, 1.2 * fps],
            ["0px 900px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 14 }),
            },
          ),
          rotate: `${Math.sin((frame / fps) * 1.5) * 2}deg`,
        }}
      >
        <IcedDrink theme={theme} />
      </div>

      {/* Price badge */}
      <div
        style={{
          position: "absolute",
          bottom: 440,
          right: 110,
          rotate: "8deg",
          scale: interpolate(
            frame,
            [9 * fps, 9.25 * fps, 9.5 * fps, 12 * fps, 12.25 * fps, 12.5 * fps],
            [1, 1.12, 1, 1, 1.12, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        <BounceLine
          name="Price"
          delay={6.2}
          style={{
            width: 380,
            height: 380,
            borderRadius: "50%",
            backgroundColor: theme.badge,
            color: theme.badgeText,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ fontSize: 50, fontWeight: 600 }}>เพียง</div>
          <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1 }}>{theme.price}</div>
          <div style={{ fontSize: 56, fontWeight: 600 }}>บาท</div>
        </BounceLine>
      </div>

      <div style={{ position: "absolute", bottom: 130 }}>
        <BounceLine
          name="Call to action"
          delay={8.2}
          style={{ fontSize: 76, fontWeight: 600 }}
        >
          แวะมาชิมกันนะ
        </BounceLine>
      </div>
    </AbsoluteFill>
  );
};

export const ThaiTeaAd: React.FC = () => <DrinkAd theme={DRINKS.ThaiTea} />;
export const MatchaLatteAd: React.FC = () => <DrinkAd theme={DRINKS.MatchaLatte} />;
export const ButterflyPeaLimeAd: React.FC = () => <DrinkAd theme={DRINKS.ButterflyPeaLime} />;
export const StrawberryMilkAd: React.FC = () => <DrinkAd theme={DRINKS.StrawberryMilk} />;
export const IcedCocoaAd: React.FC = () => <DrinkAd theme={DRINKS.IcedCocoa} />;
