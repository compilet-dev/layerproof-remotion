// src/lib/loadFont.ts
// Local font loader following Remotion best practices:
// https://www.remotion.dev/docs/troubleshooting/font-loading-errors
// https://www.remotion.dev/docs/layout-utils/best-practices#example-with-high-order-component
//
// Pattern: module-level delayRender + race against a timeout so a hanging
// fontFace.load() never blocks the render indefinitely.

import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadDMSans, fontFamily as DM_SANS_FAMILY_VALUE } from "@remotion/google-fonts/DMSans";
import { loadFont as loadAnton, fontFamily as ANTON_FAMILY_VALUE } from "@remotion/google-fonts/Anton";

export const DM_SANS_FAMILY = DM_SANS_FAMILY_VALUE;
export const ANTON_FAMILY = ANTON_FAMILY_VALUE;

const FONT_TIMEOUT_MS = 118_000;

/** Race fontFace.load() against a timeout so it never hangs the render. */
const loadWithTimeout = (fontFace: FontFace): Promise<void> => {
  const timeout = new Promise<void>((resolve) =>
    setTimeout(resolve, FONT_TIMEOUT_MS),
  );
  return Promise.race([fontFace.load().then(() => undefined), timeout]);
};

const waitForDarkerGrotesque = async (): Promise<void> => {
  const fontFace = new FontFace(
    "Darker Grotesque",
    `url('${staticFile("fonts/DarkerGrotesque-600.woff2")}') format('woff2')`,
    { weight: "600", display: "block" },
  );
  await loadWithTimeout(fontFace);
  // Add to document.fonts after load so the font is available for rendering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (document.fonts as any).add(fontFace);
};

export const waitForFonts = (): Promise<void> => waitForDarkerGrotesque();

// Module-level: one delayRender per bundle load (webpack loads this once).
// On failure we still call continueRender so the render can proceed with
// a fallback font rather than crashing entirely.
if (typeof document !== "undefined") {
  const delay = delayRender("Loading fonts", { timeoutInMilliseconds: 120_000 });
  Promise.all([
    waitForFonts(),
    loadDMSans("normal", { weights: ["700"] }).waitUntilDone(),
    loadAnton("normal", { weights: ["400"] }).waitUntilDone(),
  ])
    .then(() => continueRender(delay))
    .catch(() => continueRender(delay));
}
