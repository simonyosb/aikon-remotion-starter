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

const COLORS = {
  matchaLight: "#E4ECCB",
  matcha: "#BFD293",
  matchaDark: "#97AF67",
  coffee: "#4A2E1F",
  caramel: "#C8873A",
  milk: "#FFF8EE",
};

// Text line that bounces up into place when its Sequence starts
const BounceLine: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ children, style }) => {
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
        color: COLORS.coffee,
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

const IcedLatte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
          <clipPath id="glass">
            <path d="M70 90 L450 90 L405 640 Q403 660 383 660 L137 660 Q117 660 115 640 Z" />
          </clipPath>
          <linearGradient id="coffee" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B57A4A" />
            <stop offset="1" stopColor="#6B3E24" />
          </linearGradient>
        </defs>
        {/* Straw */}
        <rect x={300} y={0} width={36} height={420} rx={18} fill={COLORS.caramel} transform="rotate(12 318 210)" />
        <g clipPath="url(#glass)">
          <rect x={0} y={90} width={520} height={600} fill="rgba(255,255,255,0.35)" />
          {/* Milk layer */}
          <rect x={0} y={170} width={520} height={210} fill={COLORS.milk} />
          {/* Milk/coffee swirl boundary */}
          <path
            d={`M0 ${380 + Math.sin(frame / 12) * 8} Q130 ${350 - Math.sin(frame / 12) * 10} 260 380 T520 ${375 + Math.sin(frame / 15) * 8} L520 680 L0 680 Z`}
            fill="url(#coffee)"
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
          stroke={COLORS.coffee}
          strokeWidth={10}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const LattePromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 55%, ${COLORS.matchaLight} 0%, ${COLORS.matcha} 55%, ${COLORS.matchaDark} 100%)`,
      }}
    >
      <Sequence name="Glass" from={0.6 * fps} layout="none">
        <IcedLatte />
      </Sequence>

      <Sequence name="Brand" from={0.2 * fps} layout="none">
        <BounceLine style={{ top: 150 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 600,
              padding: "14px 48px",
              borderRadius: 999,
              border: `5px solid ${COLORS.coffee}`,
              letterSpacing: 2,
            }}
          >
            ร้านมุมกาแฟ
          </div>
        </BounceLine>
      </Sequence>

      <Sequence name="Headline" from={1.2 * fps} layout="none">
        <BounceLine style={{ top: 270, fontSize: 250, fontWeight: 800, lineHeight: 1.2 }}>
          ลาเต้เย็น
        </BounceLine>
      </Sequence>

      <Sequence name="Tagline" from={2.4 * fps} layout="none">
        <BounceLine style={{ top: 610, fontSize: 60, fontWeight: 400, color: "#FFFFFF" }}>
          หอมกาแฟเข้ม · นมนุ่มละมุน
        </BounceLine>
      </Sequence>

      <Sequence name="Price" from={3.6 * fps} layout="none">
        <BounceLine style={{ top: 1160, justifyContent: "flex-end", paddingRight: 90 }}>
          <div
            style={{
              width: 330,
              height: 330,
              borderRadius: "50%",
              background: COLORS.caramel,
              color: COLORS.milk,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              rotate: "-8deg",
              boxShadow: "0 18px 40px rgba(74,46,31,0.3)",
              // Heartbeat pulse every second once landed
              scale: String(1 + Math.max(0, Math.sin((frame / fps) * Math.PI * 2)) * 0.04),
            }}
          >
            <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1 }}>45</div>
            <div style={{ fontSize: 60, fontWeight: 600, lineHeight: 1.2 }}>บาท</div>
          </div>
        </BounceLine>
      </Sequence>

      <Sequence name="CTA" from={5 * fps} layout="none">
        <BounceLine style={{ top: 1560 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: COLORS.milk,
              background: COLORS.coffee,
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
