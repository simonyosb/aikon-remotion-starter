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

const COLORS = {
  cream: "#F6EEDF",
  creamDark: "#EADBC2",
  matcha: "#C9DBA5",
  matchaDark: "#9BB872",
  coffee: "#5B3A29",
  caramel: "#C8874A",
  milk: "#FBF7F0",
};

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

const IcedLatte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Espresso pours down into the milk
  const coffeeTop = interpolate(frame, [0.6 * fps, 2.6 * fps], [400, 70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });
  const wave = Math.sin(t * 3) * 6;

  const ice = [
    { x: 95, y: 110, r: -14, phase: 0 },
    { x: 165, y: 95, r: 18, phase: 1.3 },
    { x: 125, y: 170, r: 8, phase: 2.4 },
  ];

  return (
    <svg viewBox="0 0 300 420" style={{ width: 460, height: 644 }}>
      <defs>
        <clipPath id="glass">
          <path d="M30 40 L270 40 L242 392 Q240 410 222 410 L78 410 Q60 410 58 392 Z" />
        </clipPath>
        <linearGradient id="coffee" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C89466" />
          <stop offset="0.55" stopColor="#8A5636" />
          <stop offset="1" stopColor="#5B3A29" />
        </linearGradient>
      </defs>

      {/* Straw */}
      <rect
        x="168"
        y="-20"
        width="22"
        height="300"
        rx="11"
        fill={COLORS.caramel}
        transform="rotate(12 179 130)"
      />

      <g clipPath="url(#glass)">
        <rect x="0" y="0" width="300" height="420" fill="#FFFFFF" opacity={0.35} />
        {/* Milk layer */}
        <rect x="0" y="70" width="300" height="350" fill={COLORS.milk} />
        {/* Coffee layer with wavy top */}
        <path
          d={`M0 ${coffeeTop} Q75 ${coffeeTop - 12 + wave} 150 ${coffeeTop} T300 ${coffeeTop} L300 420 L0 420 Z`}
          fill="url(#coffee)"
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
        stroke={COLORS.coffee}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <line x1="22" y1="40" x2="278" y2="40" stroke={COLORS.coffee} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
};

export const LatteAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${COLORS.matcha} 0%, ${COLORS.matchaDark} 100%)`,
        fontFamily,
        color: COLORS.coffee,
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
          color: COLORS.cream,
          backgroundColor: COLORS.coffee,
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
          fontSize: 235,
          fontWeight: 800,
          marginTop: 30,
          whiteSpace: "nowrap",
        }}
      >
        ลาเต้เย็น
      </BounceLine>
      <BounceLine
        name="Tagline 1"
        delay={3}
        style={{ fontSize: 64, fontWeight: 400 }}
      >
        หอมกาแฟ นุ่มนมสด
      </BounceLine>
      <BounceLine
        name="Tagline 2"
        delay={4.4}
        style={{ fontSize: 64, fontWeight: 400, color: "#FFFFFF" }}
      >
        สดชื่นทุกแก้ว
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
        <IcedLatte />
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
            backgroundColor: COLORS.caramel,
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 50px rgba(91,58,41,0.3)",
          }}
        >
          <div style={{ fontSize: 50, fontWeight: 600 }}>เพียง</div>
          <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1 }}>45</div>
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
