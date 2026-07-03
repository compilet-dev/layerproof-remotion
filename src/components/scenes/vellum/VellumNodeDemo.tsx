// src/components/scenes/vellum/VellumNodeDemo.tsx
// Scene 1 — NodeGraphDemo (local frames 0–496)
//
// Timeline:
//  0–54    Card deck fan + cursor sweep
//  54      Click center card
//  54–84   Card FLIPS to flat face-on (rotateY: -42 → 0)
//  84–136  Card ZOOMS IN while flat (scale 1→2.0, translates toward canvas center)
//  136–165 Zoom UNWINDS → reveals Character node at canvas position
//  148+    Reference + Comp spring in; wires A & D already drawn
//  178–213 Camera zooms into comp for typing
//  200     Cursor clicks text area
//  203–255 Typewriter fills prompt
//  258–293 Camera zooms out to reveal full canvas
//  290     Lighting node appears at source position
//  300–330 Cursor drags lighting node to final position
//  330     Node snaps; wire B draws 330–348
//  340–363 Camera zooms back in for run button
//  378     RUN CLICK → output springs in
//  406–442 Camera → output (easeOutBack)
//  448–488 Fade out

import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { easeIO3, easeOut3, positionAt } from "../../../lib/animations";
import type { CursorKeyframe } from "../../../types";
import { Cursor } from "../../ui/Cursor";

const INTER  = '"Inter", "SF Pro Display", -apple-system, sans-serif';
const INDIGO = "#6366F1";
const AMBER  = "#F59E0B";
const YELLOW = "#FACC15";
const CANVAS_W = 1920;
const CANVAS_H = 1080;

// ── Modern automation workflow light theme ────────────────────────────────────
const BG_CANVAS        = "#F0F2F5";
const NODE_BG          = "#FFFFFF";
const NODE_BORDER      = "rgba(0,0,0,0.07)";
const TEXT_PRIMARY     = "#111827";
const TEXT_MUTED       = "#9CA3AF";
const PORT_COLOR       = "#6366F1";   // kept for text highlights
const PORT_DOT         = "#B8BDCA";   // neutral gray port circles like screenshot
const WIRE_COLOR       = "#FACC15";
const GREEN            = "#10B981";

// ── Frame markers ─────────────────────────────────────────────────────────────
// Opening: flip+zoom simultaneous from frame 2, settled ~frame 35
const FLIP_DONE_F         = 30;   // camera starts following after flip settles
const WIRE_A_DRAG_START   = 30;
const NODES_APPEAR        = 36;
const WIRE_A_DRAG_END     = 60;

// Camera tour (after wire A snaps): pan+zoom to Reference → immediately pan to Comp (no hold)
const CAM_AT_REF          = 85;  // 25f pan — crisp, deliberate
const CAM_HOLD_END        = 85;  // no hold — pan to comp starts immediately
const CAM_BACK_COMP_END   = 119; // same 34f comp pan duration

// Ref → Comp wire drag (cursor drags during camera pan)
const REF_DRAG_START      = 85;  // = CAM_AT_REF — cursor starts drag as camera settles on ref
const REF_DRAG_END        = 109; // drops wire 10f before camera finishes panning to comp

const TYPE_CLICK_F             = 129;
const TYPE_START               = 132;
const TYPE_FRAMES              = 52;
const LIGHT_APPEAR             = 199;
const LIGHT_DRAG_START_F       = 223;
const LIGHT_DRAG_END_F         = 253;
const WIRE_B_DRAW_END          = 261;
const RUN_BTN_ACTIVE_F         = 281;
const RUN_CLICK_FRAME          = 293;
const OUTPUT_ZOOM_START        = 336;
const WIRE_C_START             = 343;
const WIRE_C_END               = 367;
const OUTPUT_ZOOM_END          = 376;

// Camera: zoom into comp after ref wire drops, hold through typing/light phases
const CAM_WORK        = 1.50;
const CAM_OVERVIEW    = 1.00;
const CAM_CLOSE       = 2.45;
const CAM_COMP_CLOSE_END = 283; // LIGHT_DRAG_END_F + 30f smooth zoom
const CAM_OUTPUT      = 1.95;

// ── Card deck ─────────────────────────────────────────────────────────────────
const CARD_W = 315; const CARD_H = 440; const CARD_CY = 540;
const CARD1_CX = 290; const CARD2_CX = 535; const CARD3_CX = 780;
const CARD4_CX = 1025; const CARD5_CX = 1270;
const ROT_ENTRY = -65; const ROT_REST = -42;
const CARD3_TO_CENTER_X = 960 - CARD3_CX; // +180px toward canvas center
const MAX_CARD_ZOOM = 1.65;

// ── Node layout ───────────────────────────────────────────────────────────────
// Character card lives at CHAR_L/CHAR_T in DOM; CSS transform zooms 2× + translates
// to visual center (960, 540). All other nodes sit to the right of that big card.
const CHAR_W = 315; const CHAR_H = 440;
const CHAR_L = CARD3_CX - CHAR_W / 2; // 622
const CHAR_T = CARD_CY  - CHAR_H / 2; // 320

// Nodes pushed far right — camera sweeps a long distance from char (x=960) to comp
// Elements beyond x=1920 are rendered and accessible when camera pans there
const REF_W = 310; const REF_H = 300;
const REF_L = 1370; const REF_T = 55;

const COMP_W = 330; const COMP_H = 275;
const COMP_L = 1800; const COMP_T = 295;
const COMP_CX = COMP_L + COMP_W / 2; // 1965

const LIGHT_W = 255; const LIGHT_H = 94;  // port midpoint — matches auto content height
const LIGHT_L = 1420;    const LIGHT_T = 580;

const RES_W = CHAR_W; const RES_H = CHAR_H; // matches character card size
const RES_L = 2360; const RES_T = COMP_T; // 295 — same top as comp card
const RES_CX = RES_L + RES_W / 2; // 2612

// ── Port coords ────────────────────────────────────────────────────────────────
// charRX = visual right edge of zoomed+centered card — scales with MAX_CARD_ZOOM
const charRX   = CHAR_L + CHAR_W / 2 + CARD3_TO_CENTER_X + (CHAR_W / 2) * MAX_CARD_ZOOM;
const charRY   = CHAR_T + CHAR_H / 2; // 540
const refRX    = REF_L  + REF_W;          // right port of ref
const refRY    = REF_T  + REF_H / 2;      // right port mid-y
const compRefRX = COMP_L;                 // left input port on comp for reference
const compRefRY = COMP_T + 120;           // same port as character wire — single merged input
const compLX   = COMP_L;                  // 1800
const compLY   = COMP_T + 120;        // 420
const compRX   = COMP_L + COMP_W;     // 2130
const compRY   = COMP_T + COMP_H / 2; // 437
const lightRX  = LIGHT_L + LIGHT_W;   // 1565
const lightRY  = LIGHT_T + LIGHT_H / 2; // 730
const resLX    = RES_L;               // 1700
const resLY    = RES_T + RES_H / 2;   // 440
const RUN_BTN_Y = COMP_T + COMP_H - 32; // 538 — cursor tip (+6) lands at ~544 = button center
const RUN_BTN_X = COMP_L + COMP_W - 44;  // 2086 — cursor tip (+10) lands at ~2096 = button center x


// ── Wire bezier paths (smooth curves) ────────────────────────────────────────
// Horizontal-tangent bezier: smooth S-curve regardless of direction
const bezH = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1},${y1} C ${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}`;
};
// Vertical-tangent bezier: used for top/bottom port connections
const bezV = (x1: number, y1: number, x2: number, y2: number) => {
  const dy = (y2 - y1) * 0.5;
  return `M ${x1},${y1} C ${x1},${y1+dy} ${x2},${y2-dy} ${x2},${y2}`;
};
const PATH_A = bezH(charRX, charRY, compLX, compLY);
// PATH_D is dynamic — declared inside the component so it tracks refEntryY
// PATH_B: smooth bezier — exits RIGHT from lighting port, arcs up, enters comp LEFT port from left
// Use proportional control points so the curve never loops (avoids gap < fixed-offset)
// Wide horizontal control points create a natural arc without touching the lighting node box
const _gapXB   = compLX - lightRX;                        // horizontal gap between ports
const _cpOffB  = Math.max(_gapXB * 0.70, 80);             // proportional offset, min 80px
const PATH_B   = `M ${lightRX},${lightRY} C ${lightRX+_cpOffB},${lightRY} ${compLX-_cpOffB},${compLY} ${compLX},${compLY}`;
const PATH_C = bezH(compRX, compRY, resLX, resLY);

// ── Confetti particles — deterministic burst on output reveal ─────────────────
// { a: launch angle (rad), s: speed (canvas px/s), c: color, w/h: rect dims }
const CONFETTI_BURST = [
  { a: -Math.PI/2 - 0.60, s: 560, c: "#FACC15", w: 9,  h: 5  },
  { a: -Math.PI/2 - 0.30, s: 510, c: "#10B981", w: 7,  h: 4  },
  { a: -Math.PI/2,        s: 640, c: "#6366F1", w: 8,  h: 6  },
  { a: -Math.PI/2 + 0.30, s: 480, c: "#F59E0B", w: 6,  h: 5  },
  { a: -Math.PI/2 + 0.60, s: 560, c: "#EF4444", w: 9,  h: 4  },
  { a: -Math.PI/2 - 0.90, s: 430, c: "#8B5CF6", w: 7,  h: 5  },
  { a: -Math.PI/2 + 0.90, s: 460, c: "#06B6D4", w: 7,  h: 4  },
  { a: -Math.PI/3,        s: 400, c: "#FACC15", w: 6,  h: 5  },
  { a: -2*Math.PI/3,      s: 420, c: "#F59E0B", w: 7,  h: 4  },
  { a: -Math.PI/4,        s: 370, c: "#10B981", w: 6,  h: 6  },
  { a: -3*Math.PI/4,      s: 390, c: "#6366F1", w: 8,  h: 5  },
  { a: -Math.PI/2 - 0.45, s: 595, c: "#EC4899", w: 7,  h: 4  },
  { a: -Math.PI/2 + 0.45, s: 575, c: "#FACC15", w: 9,  h: 5  },
  { a: -Math.PI/2 - 0.15, s: 545, c: "#F59E0B", w: 6,  h: 5  },
  { a: -Math.PI/2 + 0.15, s: 525, c: "#10B981", w: 7,  h: 4  },
  { a: -Math.PI/2 - 0.75, s: 465, c: "#8B5CF6", w: 8,  h: 5  },
  { a: -Math.PI/2 + 0.75, s: 490, c: "#EF4444", w: 7,  h: 6  },
  { a: -Math.PI/5,        s: 355, c: "#06B6D4", w: 6,  h: 4  },
  { a: -4*Math.PI/5,      s: 375, c: "#FACC15", w: 8,  h: 4  },
  { a: -Math.PI/2 - 1.10, s: 405, c: "#F59E0B", w: 6,  h: 6  },
  { a: -Math.PI/2 + 1.10, s: 420, c: "#EC4899", w: 7,  h: 5  },
  { a: -Math.PI/6,        s: 330, c: "#10B981", w: 8,  h: 4  },
  { a: -5*Math.PI/6,      s: 345, c: "#6366F1", w: 6,  h: 5  },
  { a: -Math.PI/2 - 1.30, s: 375, c: "#FACC15", w: 7,  h: 4  },
  { a: -Math.PI/2 + 1.30, s: 360, c: "#F59E0B", w: 8,  h: 5  },
];

const COMP_TEXT = "Generate a cinematic portrait of @Character placed in the @Composition. Shallow DOF, film grain.";

// ── Cursor keyframes ──────────────────────────────────────────────────────────
const CURSOR_KFS: CursorKeyframe[] = [
  { frame:  5, x: CARD3_CX / CANVAS_W,              y: 0.500 },
  { frame: 25,  x: charRX / CANVAS_W,               y: charRY / CANVAS_H },
  { frame: WIRE_A_DRAG_START, x: charRX / CANVAS_W, y: charRY / CANVAS_H, click: true },
  { frame: WIRE_A_DRAG_END,   x: compLX / CANVAS_W, y: compLY / CANVAS_H },
  { frame: 82, x: refRX / CANVAS_W,                 y: refRY / CANVAS_H },
  { frame: REF_DRAG_START, x: refRX / CANVAS_W,     y: refRY / CANVAS_H, click: true },
  { frame: REF_DRAG_END,   x: compRefRX / CANVAS_W, y: compRefRY / CANVAS_H },
  { frame: CAM_BACK_COMP_END, x: COMP_CX / CANVAS_W, y: (COMP_T + 105) / CANVAS_H },
  { frame: TYPE_CLICK_F, x: COMP_CX / CANVAS_W,     y: (COMP_T + 105) / CANVAS_H, click: true },
  { frame: 189, x: (COMP_CX + 14) / CANVAS_W,       y: (COMP_T + 115) / CANVAS_H },
  { frame: LIGHT_DRAG_START_F - 2, x: lightRX / CANVAS_W, y: lightRY / CANVAS_H },
  { frame: LIGHT_DRAG_START_F, x: lightRX / CANVAS_W, y: lightRY / CANVAS_H, click: true },
  { frame: LIGHT_DRAG_END_F,   x: compLX / CANVAS_W,  y: compLY / CANVAS_H },
  { frame: 286, x: RUN_BTN_X / CANVAS_W,              y: RUN_BTN_Y / CANVAS_H },
  { frame: RUN_CLICK_FRAME, x: RUN_BTN_X / CANVAS_W,  y: RUN_BTN_Y / CANVAS_H, click: true },
  { frame: 396, x: (RES_L + RES_W - 28) / CANVAS_W,  y: (RES_T + RES_H - 32) / CANVAS_H },
];

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

function easeOutBack(t: number): number {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ── Micro components ───────────────────────────────────────────────────────────
const DotGrid: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)", backgroundSize: "26px 26px", pointerEvents: "none" }} />
);

const ImgIcon: React.FC<{ color?: string }> = ({ color = "#9CA3AF" }) => (
  <svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <rect x="0.5" y="1.5" width="13" height="11" rx="2" stroke={color} strokeWidth="1.3" />
    <circle cx="4.5" cy="5.5" r="1.2" fill={color} />
    <path d="M0.5 10.5l3-3 2.5 2.5 2-1.5 4 4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const TextIcon: React.FC<{ color?: string }> = ({ color = "#9CA3AF" }) => (
  <svg width={13} height={13} viewBox="0 0 14 14" fill="none">
    <path d="M1 3.5h12M1 7h8M1 10.5h10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const PlaceholderIcon: React.FC<{ light?: boolean }> = ({ light }) => {
  const c = light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.22)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <rect x="3" y="6" width="30" height="24" rx="4" stroke={c} strokeWidth="1.8" fill="none" />
        <circle cx="12" cy="15" r="3" fill={c} />
        <path d="M3 27l8-9 7 7 5-4 10 8" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: INTER, fontSize: 10, color: c, fontWeight: 500, letterSpacing: 0.3 }}>Drop image</span>
    </div>
  );
};

const Port: React.FC<{ x: number; y: number; opacity?: number; pulseR?: number; pulseOp?: number }> = ({ x, y, opacity = 1, pulseR = 0, pulseOp = 0 }) => (
  <>
    {pulseR > 7 && <div style={{ position: "absolute", left: x-pulseR, top: y-pulseR, width: pulseR*2, height: pulseR*2, borderRadius: "50%", border: `1.5px solid ${PORT_DOT}`, opacity: pulseOp, pointerEvents: "none" }} />}
    <div style={{ position: "absolute", left: x-5, top: y-5, width: 10, height: 10, borderRadius: "50%", background: PORT_DOT, border: "2px solid #FFFFFF", opacity, zIndex: 2 }} />
  </>
);

const Wire: React.FC<{ d: string; opacity: number }> = ({ d, opacity }) => {
  if (opacity < 0.02) return null;
  return <path d={d} fill="none" stroke={WIRE_COLOR} strokeWidth={2} strokeOpacity={opacity} markerEnd="url(#arr)" strokeLinejoin="round" strokeLinecap="round" />;
};

// Growing wire: draws via strokeDashoffset so the line visibly travels from start to end
const GrowingWire: React.FC<{ d: string; progress: number; pathLen?: number }> = ({ d, progress, pathLen = 800 }) => {
  if (progress < 0.01) return null;
  const offset = pathLen * (1 - progress);
  return <path d={d} fill="none" stroke={WIRE_COLOR} strokeWidth={2}
    strokeDasharray={pathLen} strokeDashoffset={offset}
    markerEnd={progress > 0.94 ? "url(#arr)" : undefined}
    strokeLinejoin="round" strokeLinecap="round" />;
};

const NodeLabel: React.FC<{ type: string; name?: string; x: number; y: number; opacity: number }> = ({ type, name, x, y, opacity }) => {
  const isImg = type === "image";
  return (
    <div style={{
      position: "absolute", left: x, top: y - 28, whiteSpace: "nowrap",
      display: "flex", alignItems: "center", gap: 6,
      opacity, pointerEvents: "none",
    }}>
      <span style={{ display: "flex", alignItems: "center", lineHeight: 1 }}>
        {isImg ? <ImgIcon color="#6B7280" /> : <TextIcon color="#6B7280" />}
      </span>
      <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: 0.3 }}>{type}</span>
      {name && <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 400, color: "#9CA3AF", letterSpacing: 0.2 }}>{name}</span>}
    </div>
  );
};

const PromptText: React.FC<{ text: string; disabled?: number }> = ({ text, disabled = 0 }) => {
  // disabled: 0 = active (amber mentions, dark text), 1 = grayed out
  const mentionColor = disabled > 0 ? `rgba(${Math.round(107+148*disabled)},${Math.round(114+24*disabled)},${Math.round(128-25*disabled)},1)` : "#B45309";
  const mentionBg    = `rgba(250,204,21,${0.14*(1-disabled)})`;
  const textOpacity  = 1 - disabled * 0.45;
  return (
    <span style={{ opacity: textOpacity }}>
      {text.split(/(@\w+)/g).map((part, i) =>
        /^@\w+$/.test(part)
          ? <span key={i} style={{ color: mentionColor, fontWeight: 500, background: mentionBg, borderRadius: 4, padding: "1px 5px" }}>{part}</span>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
};

// ── Main ───────────────────────────────────────────────────────────────────────
export const VellumNodeDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = Math.min(
    interpolate(frame, [0, 18],    [0, 1], clamp),
    interpolate(frame, [404, 424], [1, 0], clamp),
  );

  const cursorPos = positionAt(frame, CURSOR_KFS);

  // ── 3D float ─────────────────────────────────────────────────────────────
  const floatFade = interpolate(frame, [NODES_APPEAR, NODES_APPEAR + 60], [0, 1], clamp);
  const ft = frame / 30;
  // Each node gets its own float frequency so nothing bobs in unison
  const charF = {
    y:  Math.sin(ft*0.91 + 0.0)  * 4.2 * floatFade,
    x:  Math.cos(ft*0.67 + 1.3)  * 1.6 * floatFade,
    rx: Math.sin(ft*0.53 + 2.1)  * 2.0 * floatFade,
    ry: Math.cos(ft*0.74 + 0.7)  * 2.4 * floatFade,
  };
  const refF = {
    y:  Math.sin(ft*0.73 + 3.7)  * 5.8 * floatFade,
    x:  Math.cos(ft*0.55 + 1.9)  * 2.2 * floatFade,
    rx: Math.sin(ft*0.44 + 0.5)  * 2.8 * floatFade,
    ry: Math.cos(ft*0.81 + 2.4)  * 3.0 * floatFade,
  };
  const compF = {
    y:  Math.sin(ft*0.62 + 1.4)  * 2.1 * floatFade,
    x:  Math.cos(ft*0.48 + 3.1)  * 0.8 * floatFade,
    rx: Math.sin(ft*0.39 + 1.8)  * 1.0 * floatFade,
    ry: Math.cos(ft*0.57 + 0.3)  * 1.2 * floatFade,
  };
  const resF = {
    y:  Math.sin(ft*0.85 + 2.3)  * 5.2 * floatFade,
    x:  Math.cos(ft*0.61 + 0.8)  * 2.0 * floatFade,
    rx: Math.sin(ft*0.47 + 3.5)  * 2.3 * floatFade,
    ry: Math.cos(ft*0.70 + 1.1)  * 2.6 * floatFade,
  };

  const float3D = (z: number, f: { x: number; y: number; rx: number; ry: number }, scale = 1) =>
    `perspective(1600px) translateZ(${z*floatFade}px) translate(${f.x}px,${f.y}px) rotateX(${f.rx}deg) rotateY(${f.ry}deg) scale(${scale})`;

  // ── Camera scale: zoom in simultaneously with pan → hold → ease to CAM_WORK ──
  const cameraScale = (() => {
    if (frame <= WIRE_A_DRAG_START) return 1.0;
    // zoom in while wire is dragged (1.0 → 1.4)
    if (frame <= WIRE_A_DRAG_END) {
      const t = easeIO3((frame-WIRE_A_DRAG_START)/(WIRE_A_DRAG_END-WIRE_A_DRAG_START));
      return 1.0 + 0.4*t;
    }
    // continue zoom to ref (1.4 → 1.65) — easeOut for soft landing
    if (frame <= CAM_AT_REF) {
      const t = easeOut3((frame-WIRE_A_DRAG_END)/(CAM_AT_REF-WIRE_A_DRAG_END));
      return 1.4 + 0.25*t;
    }
    // hold at 1.65
    if (frame <= CAM_HOLD_END) return 1.65;
    // ease back to CAM_WORK while panning to comp — easeOut matches pan curve
    if (frame <= CAM_BACK_COMP_END) {
      const t = easeOut3((frame-CAM_HOLD_END)/(CAM_BACK_COMP_END-CAM_HOLD_END));
      return 1.65 - (1.65-CAM_WORK)*t;
    }
    // stable at CAM_WORK through typing and light drag
    if (frame <= LIGHT_DRAG_END_F) return CAM_WORK;
    // fast zoom onto comp center after wire snaps
    if (frame <= CAM_COMP_CLOSE_END) {
      const t = easeIO3((frame-LIGHT_DRAG_END_F)/(CAM_COMP_CLOSE_END-LIGHT_DRAG_END_F));
      return CAM_WORK + (CAM_CLOSE-CAM_WORK)*t;
    }
    if (frame <= OUTPUT_ZOOM_START) return CAM_CLOSE;
    if (frame <= OUTPUT_ZOOM_END)
      return CAM_CLOSE + (CAM_OUTPUT-CAM_CLOSE) * easeOutBack(Math.min(1,(frame-OUTPUT_ZOOM_START)/(OUTPUT_ZOOM_END-OUTPUT_ZOOM_START)));
    return CAM_OUTPUT;
  })();

  // ── Camera pan: card → char center (drag) → Reference tour → Comp ───────────
  const camX = (() => {
    const charBigNX = 0.5;                 // centered from entrance
    const refNX     = (REF_L + REF_W / 2) / CANVAS_W;
    const compNX    = COMP_CX / CANVAS_W;
    const resNX     = RES_CX  / CANVAS_W;

    // Camera is centered on the card from frame 0 — no entrance pan
    if (frame <= WIRE_A_DRAG_START) return charBigNX;
    // pan to follow cursor as wire is dragged: char port → comp input port
    if (frame <= WIRE_A_DRAG_END) {
      const t = easeIO3((frame-WIRE_A_DRAG_START)/(WIRE_A_DRAG_END-WIRE_A_DRAG_START));
      return charBigNX + t * (compLX / CANVAS_W - charBigNX);
    }
    // pan to ref simultaneously with remaining zoom — easeOut for soft landing
    const dragEndNX = compLX / CANVAS_W;
    if (frame <= CAM_AT_REF) {
      const t = easeOut3((frame-WIRE_A_DRAG_END)/(CAM_AT_REF-WIRE_A_DRAG_END));
      return dragEndNX + t*(refNX-dragEndNX);
    }
    // hold at ref
    if (frame <= CAM_HOLD_END) return refNX;
    // pan to comp as wire lands — easeOut lands on comp just as cursor arrives
    if (frame <= CAM_BACK_COMP_END) {
      const t = easeOut3((frame - CAM_HOLD_END) / (CAM_BACK_COMP_END - CAM_HOLD_END));
      return refNX + t * (compNX - refNX);
    }
    // hold comp centered through typing, light phases, generation
    if (frame <= OUTPUT_ZOOM_START) return compNX;
    // pan to result only after done — follows cursor
    if (frame <= OUTPUT_ZOOM_END) {
      const t = easeIO3((frame-OUTPUT_ZOOM_START)/(OUTPUT_ZOOM_END-OUTPUT_ZOOM_START));
      return compNX + t*(resNX-compNX);
    }
    return resNX;
  })();

  const cameraTX = (960 - camX * CANVAS_W) * cameraScale;

  // ── Camera vertical pan: 0.5 (center) during normal phases, up to refNY during tour ─
  const camY = (() => {
    const midNY  = 0.5;
    const refNY  = (REF_T + REF_H / 2) / CANVAS_H;          // ≈ 0.119
    const compNY = (COMP_T + COMP_H / 2) / CANVAS_H;         // ≈ 0.400

    if (frame <= WIRE_A_DRAG_START) return midNY;
    // tilt down slightly following cursor toward comp port Y during drag
    if (frame <= WIRE_A_DRAG_END) {
      const t = easeIO3((frame-WIRE_A_DRAG_START)/(WIRE_A_DRAG_END-WIRE_A_DRAG_START));
      return midNY + t*(compLY/CANVAS_H - midNY);
    }
    // pan up to ref — easeOut matches X and scale
    const dragEndNY = compLY / CANVAS_H;
    if (frame <= CAM_AT_REF) {
      const t = easeOut3((frame-WIRE_A_DRAG_END)/(CAM_AT_REF-WIRE_A_DRAG_END));
      return dragEndNY + t*(refNY-dragEndNY);
    }
    // hold at ref
    if (frame <= CAM_HOLD_END) return refNY;
    // pan down to comp Y as wire lands — matches X pan timing
    if (frame <= CAM_BACK_COMP_END) {
      const t = easeOut3((frame - CAM_HOLD_END) / (CAM_BACK_COMP_END - CAM_HOLD_END));
      return refNY + t * (compNY - refNY);
    }
    // hold comp centered through typing, light phases, generation
    if (frame <= OUTPUT_ZOOM_START) return compNY;
    // pan to result center Y — follows cursor
    const resNY = (RES_T + RES_H / 2) / CANVAS_H;
    const t = easeIO3((frame - OUTPUT_ZOOM_START) / (OUTPUT_ZOOM_END - OUTPUT_ZOOM_START));
    return compNY + t * (resNY - compNY);
  })();

  const cameraTY = (540 - camY * CANVAS_H) * cameraScale;

  // ── Center card: flip + zoom simultaneously from frame 2 ─────────────────
  const revealS       = spring({ frame: Math.max(0, frame - 2), fps, config: { stiffness: 120, damping: 16 } });
  const entryFlipRotY = interpolate(Math.min(1, revealS), [0, 1], [-90, 0]);
  const zoomVal = 0.3 + (MAX_CARD_ZOOM - 0.3) * Math.min(1, revealS);
  const txVal   = CARD3_TO_CENTER_X;
  const isFlipDone    = revealS > 0.98; // only for zIndex/borderRadius — not transform
  const entryOpacity  = interpolate(frame, [2, 8], [0, 1], clamp); // fast fade so card pops in mid-zoom

  // Unified continuous transform — no boolean switch, no scale/perspective jump
  // Float offsets are gated by floatFade (0 until NODES_APPEAR) so they're silent during flip
  const card3Transform =
    `translateX(${CARD3_TO_CENTER_X}px) ` +
    `perspective(1200px) ` +
    `translateZ(${-10 * floatFade}px) ` +
    `translate(${charF.x}px,${charF.y}px) ` +
    `rotateX(${charF.rx}deg) ` +
    `rotateY(${entryFlipRotY + charF.ry}deg) ` +
    `scale(${zoomVal})`;

  // Shadow grows continuously — no switch
  const _rs = Math.min(1, revealS);
  const card3Shadow =
    `0 ${8 + 28*_rs + 10*floatFade}px ${24 + 40*_rs + 20*floatFade}px rgba(0,0,0,${0.14 + 0.14*_rs + 0.08*floatFade}), ` +
    `0 0 0 1px ${NODE_BORDER}`;

  // True cross-dissolve: back and front share the same range so combined opacity = 1 always
  const placeholderFade   = interpolate(Math.min(1, revealS), [0.38, 0.68], [1, 0], clamp);
  const bodyWhiteOpacity  = interpolate(Math.min(1, revealS), [0.38, 0.68], [0, 1], clamp);
  // Node label + port appear once the card is fully settled
  const nodeHeaderOpacity = interpolate(Math.min(1, revealS), [0.80, 1.00], [0, 1], clamp);
  const charPortOpacity   = interpolate(Math.min(1, revealS), [0.85, 1.00], [0, 1], clamp);

  // ── Hover border: glow when cursor is over the card ───────────────────────
  // Card visual center in canvas coords (camera wrapper space)
  const cardCX = CHAR_L + CHAR_W / 2 + CARD3_TO_CENTER_X; // 960
  const cardCY = CHAR_T + CHAR_H / 2;                      // 540
  const halfW  = (CHAR_W * zoomVal) / 2;
  const halfH  = (CHAR_H * zoomVal) / 2;
  const cursorCX = cursorPos.x * CANVAS_W;
  const cursorCY = cursorPos.y * CANVAS_H;
  const dX = Math.max(0, Math.abs(cursorCX - cardCX) - halfW);
  const dY = Math.max(0, Math.abs(cursorCY - cardCY) - halfH);
  const distToCard = Math.sqrt(dX * dX + dY * dY);
  // proximity: 1 when cursor is inside or touching, falls off over 120px
  const proximity     = Math.max(0, 1 - distToCard / 120);
  // only show hover once card is face-on; fades out when wire drag starts
  const hoverReadyOp  = interpolate(Math.min(1, revealS), [0.72, 0.90], [0, 1], clamp);
  const hoverExitOp   = interpolate(frame, [WIRE_A_DRAG_START, WIRE_A_DRAG_START + 8], [1, 0], clamp);
  const hoverIntensity = proximity * hoverReadyOp * hoverExitOp;

  // ── Reference + Comp ──────────────────────────────────────────────────────
  // Ref node appears as camera starts zooming toward it (WIRE_A_DRAG_END), not before
  const REF_APPEAR  = WIRE_A_DRAG_END; // 120
  const refSpring   = spring({ frame: Math.max(0, frame-REF_APPEAR), fps, config: { stiffness: 200, damping: 14 } });
  const refOpacity  = interpolate(frame, [REF_APPEAR, REF_APPEAR+8], [0, 1], clamp);
  const refEntryY   = interpolate(refSpring, [0,1], [-36, 0]);

  // comp slides in before the wire lands — appears mid-drag so it's ready when cursor arrives
  const COMP_APPEAR = WIRE_A_DRAG_START + Math.round((WIRE_A_DRAG_END - WIRE_A_DRAG_START) * 0.45); // ~44
  const compSpring  = spring({ frame: Math.max(0, frame-COMP_APPEAR), fps, config: { stiffness: 55, damping: 16 } });
  const compOpacity = interpolate(frame, [COMP_APPEAR, COMP_APPEAR+14], [0, 1], clamp);
  const compEntryX  = interpolate(compSpring, [0,1], [80, 0]);
  const compEntryY  = 0;

  // Wire A: tip tracks cursor canvas position exactly — feels like cursor is pulling it
  const wireADynEndX = Math.round(cursorPos.x * CANVAS_W);
  const wireADynEndY = Math.round(cursorPos.y * CANVAS_H);
  const wireADynDX   = (wireADynEndX - charRX) * 0.5;
  const wireADynPath = `M ${charRX},${charRY} C ${charRX+wireADynDX},${charRY} ${wireADynEndX-wireADynDX},${wireADynEndY} ${wireADynEndX},${wireADynEndY}`;
  const wireADynOpacity = interpolate(frame, [WIRE_A_DRAG_START, WIRE_A_DRAG_START+3, WIRE_A_DRAG_END-2, WIRE_A_DRAG_END], [0, 1, 1, 0], clamp);
  // static final wire fades in once drag completes
  const wireAOpacity = interpolate(frame, [WIRE_A_DRAG_END, WIRE_A_DRAG_END+8], [0, 1], clamp);
  // Wire D: dynamic during cursor drag, then static after drop
  const wireDDynEndX   = Math.round(cursorPos.x * CANVAS_W);
  const wireDDynEndY   = Math.round(cursorPos.y * CANVAS_H);
  const wireDDynDX     = (wireDDynEndX - refRX) * 0.5;
  const wireDDynPath   = `M ${refRX},${refRY} C ${refRX+wireDDynDX},${refRY} ${wireDDynEndX-wireDDynDX},${wireDDynEndY} ${wireDDynEndX},${wireDDynEndY}`;
  const wireDDynOpacity = interpolate(frame,
    [REF_DRAG_START, REF_DRAG_START+3, REF_DRAG_END-2, REF_DRAG_END], [0, 1, 1, 0], clamp);
  // static wire snaps in once drag completes
  const wireDOpacity   = interpolate(frame, [REF_DRAG_END, REF_DRAG_END+6], [0, 1], clamp);
  const pathD          = bezH(refRX, refRY, compRefRX, compRefRY);

  // ── Typing ────────────────────────────────────────────────────────────────
  const typedChars    = Math.floor(Math.min(COMP_TEXT.length, Math.max(0, (frame-TYPE_START)*(COMP_TEXT.length/TYPE_FRAMES))));
  const typedText     = frame >= TYPE_START ? COMP_TEXT.slice(0, typedChars) : "";
  const textDone      = typedChars >= COMP_TEXT.length;
  const cursorBlink   = frame >= TYPE_START && !textDone && (frame % 20 < 12);
  const showPlaceholder = frame < TYPE_START;
  const compFocusGlow = interpolate(frame,
    [TYPE_CLICK_F-10, TYPE_CLICK_F+14, TYPE_START+TYPE_FRAMES+10, TYPE_START+TYPE_FRAMES+40],
    [0, 1, 1, 0], clamp);

  // ── Lighting: floats up from below ────────────────────────────────────────
  const lightFloatS  = spring({ frame: Math.max(0, frame-LIGHT_APPEAR), fps, config: { stiffness: 105, damping: 12 } });
  const lightOpacity = interpolate(frame, [LIGHT_APPEAR, LIGHT_APPEAR+8], [0, 1], clamp);
  const lightEntryY  = interpolate(lightFloatS, [0, 1], [90, 0]);

  // Dynamic wire B: tip tracks cursor exactly during drag (same pattern as wire A)
  const lightPortY      = lightRY + Math.round(lightEntryY);
  const wireBDynEndX    = Math.round(cursorPos.x * CANVAS_W);
  const wireBDynEndY    = Math.round(cursorPos.y * CANVAS_H);
  const wireBDynDY      = (wireBDynEndY - lightPortY) * 0.5;
  const wireBDynPath    = `M ${lightRX},${lightPortY} C ${lightRX},${lightPortY+wireBDynDY} ${wireBDynEndX},${wireBDynEndY-wireBDynDY} ${wireBDynEndX},${wireBDynEndY}`;
  const wireBDynOpacity = interpolate(frame, [LIGHT_DRAG_START_F, LIGHT_DRAG_START_F+3, LIGHT_DRAG_END_F-2, LIGHT_DRAG_END_F], [0, 1, 1, 0], clamp);
  // Static wire B snaps in once drag completes
  const wireBOpacity    = interpolate(frame, [LIGHT_DRAG_END_F, LIGHT_DRAG_END_F+8], [0, 1], clamp);
  const lightingChipS   = spring({ frame: Math.max(0, frame - WIRE_B_DRAW_END), fps, config: { stiffness: 120, damping: 14 } });
  const lightingChipOp  = interpolate(frame, [WIRE_B_DRAW_END, WIRE_B_DRAW_END+6], [0, 1], clamp);

  const portPulse = () => {
    if (frame < WIRE_B_DRAW_END) return { r: 0, op: 0 };
    const t = ((frame-WIRE_B_DRAW_END) % 56)/56;
    return { r: 6+t*22, op: (1-t)*0.5 };
  };
  const compInputPulse = portPulse();

  // ── Run button ────────────────────────────────────────────────────────────
  const runBtnActive     = frame >= RUN_BTN_ACTIVE_F;
  const runBtnGenerating = frame >= RUN_CLICK_FRAME && frame < OUTPUT_ZOOM_START;
  const runBtnDone       = frame >= OUTPUT_ZOOM_START;
  const runClickS        = spring({ frame: Math.max(0, frame-RUN_CLICK_FRAME), fps, config: { stiffness: 320, damping: 12 } });
  const doneBtnS         = spring({ frame: Math.max(0, frame-OUTPUT_ZOOM_START), fps, config: { stiffness: 280, damping: 14 } });
  const runBtnScale      = runBtnDone ? 1-0.08*(1-doneBtnS) : runBtnGenerating ? 1-0.18*(1-runClickS) : 1.0;
  const clickRipple      = interpolate(frame, [RUN_CLICK_FRAME, RUN_CLICK_FRAME+18], [0, 1], clamp);
  const clickRippleOp    = interpolate(frame, [RUN_CLICK_FRAME, RUN_CLICK_FRAME+6, RUN_CLICK_FRAME+18], [0, 0.55, 0], clamp);
  const dotCount         = runBtnGenerating ? 1 + (Math.floor((frame - RUN_CLICK_FRAME) / 8) % 3) : 0;
  const runBtnLabel      = runBtnDone ? "Done" : runBtnGenerating ? `Generating${'.'.repeat(dotCount)}` : "Run";
  const runBtnGlow       = runBtnActive && frame < RUN_CLICK_FRAME ? 0.6+Math.sin(frame*0.4)*0.2 : 0;

  // ── Output ────────────────────────────────────────────────────────────────
  const resSpring     = spring({ frame: Math.max(0, frame-RUN_CLICK_FRAME), fps, config: { stiffness: 140, damping: 10 } });
  const resOpacity    = interpolate(frame, [RUN_CLICK_FRAME, RUN_CLICK_FRAME+8], [0, 1], clamp);
  const resEntryY     = interpolate(resSpring, [0,1], [40, 0]);
  const wireC         = interpolate(frame, [WIRE_C_START, WIRE_C_END], [0, 1], clamp);
  const genFade       = interpolate(frame, [RUN_CLICK_FRAME, RUN_CLICK_FRAME+14], [0, 1], clamp);
  const shimmerActive    = frame >= RUN_CLICK_FRAME && frame < OUTPUT_ZOOM_START;
  // Neutral shimmer sweeping across disabled prompt text while generating
  const textShimmerX  = shimmerActive ? ((( frame - RUN_CLICK_FRAME) % 55) / 55) * 160 - 30 : -30;
  const shimmerCycle     = shimmerActive ? (((frame-RUN_CLICK_FRAME)%30)/30)*300-50 : 300;
  const genProgress      = interpolate(frame, [RUN_CLICK_FRAME, OUTPUT_ZOOM_START], [0, 1], clamp);
  const generatingBorder = shimmerActive ? 0.30 + Math.sin(frame * 0.35) * 0.15 : 0;
  const resultReveal     = interpolate(frame, [OUTPUT_ZOOM_START, OUTPUT_ZOOM_START+8], [0, 1], clamp);
  const glowPulse        = interpolate(frame, [OUTPUT_ZOOM_START, OUTPUT_ZOOM_START+14, OUTPUT_ZOOM_START+48], [0, 1, 0.35], clamp);
  const resRevealS    = spring({ frame: Math.max(0, frame-OUTPUT_ZOOM_START), fps, config: { stiffness: 90, damping: 14 } });
  const resRevealScale = frame >= OUTPUT_ZOOM_START ? interpolate(resRevealS,[0,1],[0.87,1.0]) : 1.0;

  const burstAge  = frame - OUTPUT_ZOOM_START;
  const burstShow = burstAge >= 0 && burstAge < 24;
  const burstT    = burstAge / 24;

  const energyDot = (() => {
    if (frame < WIRE_C_END+40) return null;
    const t = ((frame-WIRE_C_END)%58)/58;
    return { x: compRX+(resLX-compRX)*t, y: compRY+(resLY-compRY)*t, op: Math.sin(t*Math.PI)*0.85 };
  })();

  // ── Deck card images (index 0 = leftmost card, 4 = rightmost) ───────────────
  // Drop deck_01.jpg … deck_05.jpg into /public to replace placeholder gradients.
  const DECK_IMGS = [
    staticFile("deck_01.jpg"),
    staticFile("deck_02.jpg"),
    staticFile("deck_03.jpg"),  // center card — also the back face before flip
    staticFile("deck_04.jpg"),
    staticFile("deck_05.jpg"),
  ];


  return (
    <AbsoluteFill style={{ background: BG_CANVAS, overflow: "hidden", opacity: sceneOpacity }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 55% 50% at ${camX*100}% 45%, rgba(99,102,241,0.05), transparent)`,
        opacity: compOpacity,
      }} />

      <div style={{
        position: "absolute", width: CANVAS_W, height: CANVAS_H,
        transform: `translate(${cameraTX}px, ${cameraTY}px) scale(${cameraScale})`,
        transformOrigin: "center center",
      }}>
        <DotGrid />

        {/* ── Center card: flip entrance → flip flat → zoom → unzoom to Character node ── */}
        <div style={{
          position: "absolute", left: CHAR_L, top: CHAR_T,
          width: CHAR_W, height: CHAR_H,
          borderRadius: interpolate(Math.min(1, revealS), [0.80, 1.00], [14, 16], clamp), overflow: "hidden",
          boxShadow: card3Shadow,
          opacity: entryOpacity,
          zIndex: frame >= FLIP_DONE_F ? 20 : undefined,
          transform: card3Transform,
          transformOrigin: "center center",
          display: "flex", flexDirection: "column",
          background: revealS < 0.35 ? "transparent" : NODE_BG,
        }}>
          {/* Back face image — visible while card still angled, fades as it flips */}
          {placeholderFade > 0.02 && (
            <Img src={DECK_IMGS[2]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: placeholderFade }} />
          )}

          {/* No inner header — label is rendered above the card */}

          {/* Char node body — character image (renders early so cross-dissolve has no gap) */}
          {revealS > 0.35 && (
            <div style={{ position: "absolute", inset: 0, opacity: bodyWhiteOpacity }}>
              <Img src={staticFile("character_01.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* Hover glow border — yellow ring + neutral shadow when cursor is over the card */}
          {hoverIntensity > 0.01 && (
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: interpolate(Math.min(1, revealS), [0.80, 1.00], [14, 16], clamp),
              border: `2px solid rgba(250,204,21,${hoverIntensity * 0.90})`,
              boxShadow: `0 8px 24px rgba(0,0,0,${hoverIntensity * 0.18}), 0 2px 8px rgba(0,0,0,${hoverIntensity * 0.10})`,
              pointerEvents: "none",
            }} />
          )}
        </div>

        {/* Label at visual top-left of the 2× zoomed+translated card */}
        <NodeLabel
          type="image"
          name="character_01.jpg"
          x={CHAR_L + CHAR_W/2 + CARD3_TO_CENTER_X - CHAR_W*MAX_CARD_ZOOM/2}
          y={CHAR_T + CHAR_H/2 - CHAR_H*MAX_CARD_ZOOM/2}
          opacity={nodeHeaderOpacity}
        />
        <Port x={charRX} y={charRY} opacity={charPortOpacity} />

        {/* ═══ REFERENCE ═══════════════════════════════════════════════════ */}
        <NodeLabel type="image" name="composition.jpg" x={REF_L} y={REF_T + refEntryY} opacity={refOpacity} />
        <div style={{
          position: "absolute", left: REF_L, top: REF_T+refEntryY,
          width: REF_W, height: REF_H, borderRadius: 13, overflow: "hidden",
          background: NODE_BG,
          border: `1px solid ${NODE_BORDER}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)", opacity: refOpacity,
          transform: float3D(50, refF), transformOrigin: "center center",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Img src={staticFile("composition.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <Port x={refRX} y={refRY+refEntryY} opacity={wireDOpacity} />

        {/* ═══ COMPOSITION CARD — slides in from right as camera follows cursor ════ */}
        <NodeLabel type="assistance prompt" x={COMP_L + compEntryX} y={COMP_T} opacity={compOpacity} />
        <div style={{
          position: "absolute", left: COMP_L + compEntryX, top: COMP_T,
          width: COMP_W, height: COMP_H, background: NODE_BG, borderRadius: 18,
          border: `${compFocusGlow>0.05 ? 2 : 1}px solid ${compFocusGlow>0.05 ? `rgba(250,204,21,${0.5+compFocusGlow*0.5})` : NODE_BORDER}`,
          boxShadow: compFocusGlow>0.05 ? `0 0 0 3px rgba(250,204,21,${compFocusGlow*0.18}), 0 6px 24px rgba(0,0,0,0.08)` : "0 4px 16px rgba(0,0,0,0.06)",
          overflow: "hidden", opacity: compOpacity,
          transform: float3D(25, compF), transformOrigin: "center center",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", gap: 6, padding: "9px 14px 8px", flexShrink: 0 }}>
            {/* Character chip — image node icon */}
            <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 6, padding: "3px 9px", display: "flex", alignItems: "center", gap: 5, border: "1px solid rgba(0,0,0,0.06)" }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="1.5" width="9" height="8" rx="1.2" stroke="#9CA3AF" strokeWidth="1.2"/>
                <path d="M1 7.5l2.5-2.5 2 2 1.5-1.5L9 7.5" stroke="#9CA3AF" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7.5" cy="4" r="0.9" fill="#9CA3AF"/>
              </svg>
              <span style={{ fontFamily: INTER, fontSize: 11, color: "#6B7280", fontWeight: 500 }}>Character</span>
            </div>
            {/* Composition chip — image node icon */}
            <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 6, padding: "3px 9px", display: "flex", alignItems: "center", gap: 5, border: "1px solid rgba(0,0,0,0.06)" }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="1.5" width="9" height="8" rx="1.2" stroke="#9CA3AF" strokeWidth="1.2"/>
                <path d="M1 7.5l2.5-2.5 2 2 1.5-1.5L9 7.5" stroke="#9CA3AF" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7.5" cy="4" r="0.9" fill="#9CA3AF"/>
              </svg>
              <span style={{ fontFamily: INTER, fontSize: 11, color: "#6B7280", fontWeight: 500 }}>Composition</span>
            </div>
            {/* Lighting chip — text node icon, springs in after wire connects */}
            <div style={{
              background: "rgba(0,0,0,0.04)", borderRadius: 6, padding: "3px 9px",
              display: "flex", alignItems: "center", gap: 5, border: "1px solid rgba(0,0,0,0.06)",
              opacity: lightingChipOp,
              transform: `scale(${interpolate(lightingChipS, [0,1], [0.6, 1])})`,
              transformOrigin: "left center",
            }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 3h7M2 5.5h5M2 8h6" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: INTER, fontSize: 11, color: "#6B7280", fontWeight: 500 }}>Lighting</span>
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 14px", flexShrink: 0 }} />
          <div style={{ flex: 1, padding: "12px 16px 8px", overflow: "hidden", position: "relative" }}>
            {showPlaceholder
              ? <span style={{ fontFamily: INTER, fontSize: 13, color: TEXT_MUTED, lineHeight: 1.65 }}>Describe your composition…</span>
              : <span style={{ fontFamily: INTER, fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.65 }}>
                  <PromptText text={typedText} disabled={genFade} />
                  {cursorBlink && <span style={{ display: "inline-block", width: 1.5, height: 13, background: INDIGO, marginLeft: 2, verticalAlign: "text-bottom" }} />}
                </span>
            }
            {/* Neutral shimmer sweep while generating — rides over the grayed text */}
            {shimmerActive && (
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(90deg,
                  transparent ${textShimmerX - 22}%,
                  rgba(160,160,160,0.18) ${textShimmerX}%,
                  rgba(210,210,210,0.28) ${textShimmerX + 8}%,
                  rgba(160,160,160,0.18) ${textShimmerX + 16}%,
                  transparent ${textShimmerX + 38}%)`,
                pointerEvents: "none",
              }} />
            )}
          </div>
          {/* ── Bottom toolbar: Auto + Run ── */}
          <div style={{ padding: "7px 12px 11px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, borderTop: "1px solid rgba(0,0,0,0.055)" }}>
            {/* Auto pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, border: "1.5px solid rgba(0,0,0,0.11)", borderRadius: 20, padding: "5px 10px 5px 9px" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1.5L11 4V9L6.5 11.5L2 9V4L6.5 1.5Z" stroke="#374151" strokeWidth="1.2"/>
                <path d="M6.5 1.5V11.5M2 4L11 9M11 4L2 9" stroke="#374151" strokeWidth="1" opacity="0.35"/>
              </svg>
              <span style={{ fontFamily: INTER, fontSize: 12, color: TEXT_PRIMARY, fontWeight: 500 }}>Auto</span>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 3L4.5 6L7.5 3" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            {/* Run pill — ripple centered on this button */}
            <div style={{ position: "relative" }}>
            {clickRippleOp > 0 && (
              <div style={{
                position: "absolute", left: "50%", top: "50%",
                width: `${20 + clickRipple * 120}px`, height: `${20 + clickRipple * 120}px`,
                borderRadius: "50%", background: `rgba(250,204,21,${clickRippleOp})`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none", zIndex: 0,
              }} />
            )}
            <div style={{ position: "relative", zIndex: 1 }}><div style={{
              background: runBtnDone ? "#10B981" : runBtnActive ? "#FACC15" : "#F0F0F0",
              borderRadius: 20, padding: "6px 15px",
              display: "flex", alignItems: "center", gap: 5,
              transform: `scale(${runBtnScale})`, transformOrigin: "center right",
              boxShadow: runBtnDone ? "0 3px 10px rgba(16,185,129,0.30)" : runBtnGlow>0 ? `0 3px 12px rgba(250,204,21,${runBtnGlow*0.5})` : runBtnActive&&frame>=RUN_CLICK_FRAME ? "0 3px 10px rgba(250,204,21,0.30)" : undefined,
            }}>
              {runBtnDone ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5L5.5 10L11 3.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1L7.5 5.5L12 6.5L7.5 7.5L6.5 12L5.5 7.5L1 6.5L5.5 5.5L6.5 1Z" fill={runBtnActive ? "#111827" : "#9CA3AF"}/>
                  <circle cx="10.5" cy="2.5" r="0.9" fill={runBtnActive ? "#111827" : "#9CA3AF"}/>
                  <circle cx="2.5" cy="10.5" r="0.7" fill={runBtnActive ? "#111827" : "#9CA3AF"}/>
                </svg>
              )}
              <span style={{ fontFamily: INTER, fontSize: 13, fontWeight: 600, color: runBtnDone ? "#FFFFFF" : runBtnActive ? "#111827" : TEXT_MUTED, letterSpacing: 0.2 }}>{runBtnLabel}</span>
            </div></div></div>
          </div>
        </div>

        <Port x={compRX} y={compRY+compEntryY} opacity={interpolate(frame,[WIRE_C_START,WIRE_C_START+8],[0,1],clamp)} />

        {/* ═══ LIGHTING ════════════════════════════════════════════════════ */}
        <NodeLabel type="text" name="lighting" x={LIGHT_L} y={LIGHT_T + lightEntryY} opacity={lightOpacity} />
        <div style={{
          position: "absolute", left: LIGHT_L, top: LIGHT_T + lightEntryY,
          width: LIGHT_W, background: NODE_BG, borderRadius: 16,
          border: `1px solid ${NODE_BORDER}`,
          boxShadow: "0 6px 22px rgba(0,0,0,0.08)",
          opacity: lightOpacity, transformOrigin: "center center",
        }}>
          {/* Plain text body — label is shown outside via NodeLabel */}
          <div style={{ padding: "12px 14px" }}>
            <span style={{ fontFamily: INTER, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
              Warm afternoon sun, golden hour glow, soft shadows left, slight haze, cinematic grade.
            </span>
          </div>
        </div>
        <Port x={lightRX} y={lightRY + lightEntryY} opacity={interpolate(frame,[LIGHT_APPEAR+20,LIGHT_APPEAR+34],[0,1],clamp)} />

        {/* ═══ OUTPUT ══════════════════════════════════════════════════════ */}
        <NodeLabel type="image" name="output" x={RES_L} y={RES_T + resEntryY} opacity={resOpacity} />
        <div style={{
          position: "absolute", left: RES_L, top: RES_T+resEntryY,
          width: RES_W, height: RES_H, background: NODE_BG, borderRadius: 18,
          border: `1px solid ${generatingBorder>0 ? `rgba(16,185,129,${generatingBorder})` : glowPulse>0.05 ? `rgba(16,185,129,${0.22+glowPulse*0.28})` : NODE_BORDER}`,
          boxShadow: generatingBorder>0 ? `0 4px 18px rgba(0,0,0,0.07), 0 0 0 2px rgba(16,185,129,${generatingBorder*0.5})` : glowPulse>0.05 ? `0 4px 18px rgba(0,0,0,0.07), 0 0 0 2px rgba(16,185,129,${glowPulse*0.30})` : "0 4px 16px rgba(0,0,0,0.06)",
          overflow: "hidden", opacity: resOpacity,
          transform: float3D(40, resF, resRevealScale), transformOrigin: "center center",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#F4F5F7" }}>
            {/* Placeholder icon while generating */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: shimmerActive ? 1 : 0 }}>
              <PlaceholderIcon light />
            </div>
            {/* Shimmer sweep */}
            {shimmerActive && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent ${shimmerCycle-80}%, rgba(255,255,255,0.55) ${shimmerCycle}%, transparent ${shimmerCycle+80}%)` }} />}
            {/* Progress bar */}
            {shimmerActive && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(16,185,129,0.12)" }}>
                <div style={{ height: "100%", width: `${genProgress*100}%`, background: GREEN, borderRadius: 2 }} />
              </div>
            )}
            {/* Result reveal — drop output.jpg into /public to replace placeholder */}
            {resultReveal>0 && <Img src={staticFile("output.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: resultReveal }} />}
            {frame>=OUTPUT_ZOOM_START&&frame<=OUTPUT_ZOOM_START+4 && <div style={{ position: "absolute", inset: 0, background: "#F4F5F7", opacity: 1-(frame-OUTPUT_ZOOM_START)/4 }} />}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.10) 100%)", pointerEvents: "none" }} />
          </div>
        </div>
        <Port x={resLX} y={resLY+resEntryY} opacity={interpolate(frame,[WIRE_C_START,WIRE_C_START+8],[0,1],clamp)} />

        {/* ═══ WIRES ═══════════════════════════════════════════════════════ */}
        <svg style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", filter: "drop-shadow(0 0 3px rgba(250,204,21,0.40))", overflow: "visible" }} width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} overflow="visible">
          <defs>
            <marker id="arr" markerWidth="20" markerHeight="16" refX="18" refY="8" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,1 L18,8 L0,15 Z" fill={WIRE_COLOR} />
            </marker>
          </defs>
          {/* Growing wire A: extends from char port toward comp port as cursor drags */}
          <Wire d={wireADynPath} opacity={wireADynOpacity} />
          {/* Static wire A: fades in once drag completes */}
          <Wire d={PATH_A} opacity={wireAOpacity} />
          {/* Dynamic wire D: cursor drags ref port → comp port */}
          <Wire d={wireDDynPath} opacity={wireDDynOpacity} />
          {/* Static wire D: snaps in after drop */}
          <Wire d={pathD} opacity={wireDOpacity} />
          <Wire d={wireBDynPath} opacity={wireBDynOpacity} />
          <Wire d={PATH_B} opacity={wireBOpacity} />
          <GrowingWire d={PATH_C} progress={wireC} pathLen={750} />
          {energyDot && <circle cx={energyDot.x} cy={energyDot.y} r={4.5} fill={YELLOW} opacity={energyDot.op} />}
          {burstShow && [1,2,3].map(ring => {
            const r  = (40+ring*20)*burstT*(1+ring*0.18);
            const op = (1-burstT)*(0.55-ring*0.14);
            return <circle key={ring} cx={RES_L+RES_W/2} cy={RES_T+RES_H/2} r={Math.max(0,r)} fill="none" stroke={GREEN} strokeWidth={2.5-ring*0.5} opacity={Math.max(0,op)} />;
          })}
          {/* ── Confetti burst from output reveal ── */}
          {frame >= OUTPUT_ZOOM_START && frame < OUTPUT_ZOOM_START + 70 && (() => {
            const age = frame - OUTPUT_ZOOM_START;
            const t   = age / fps;
            const gravity = 880;
            const ox  = RES_L + RES_W / 2;
            const oy  = RES_T + RES_H * 0.28;
            return CONFETTI_BURST.map((p, i) => {
              const vx  = p.s * Math.cos(p.a);
              const vy  = p.s * Math.sin(p.a);
              const cx  = ox + vx * t;
              const cy  = oy + vy * t + 0.5 * gravity * t * t;
              const rot = age * (i % 2 === 0 ? 14 : -11) + i * 19;
              const op  = age < 5 ? age / 5 : Math.max(0, 1 - (age - 5) / 60);
              return (
                <rect key={i}
                  x={cx - p.w / 2} y={cy - p.h / 2}
                  width={p.w} height={p.h}
                  fill={p.c} rx={1.5} opacity={op}
                  transform={`rotate(${rot},${cx},${cy})`}
                />
              );
            });
          })()}
        </svg>

        <Cursor keyframes={CURSOR_KFS} containerWidth={CANVAS_W} containerHeight={CANVAS_H} />
      </div>
    </AbsoluteFill>
  );
};
