/**
 * SimpliTrain Lite v2 - Branding Engine
 * Ported directly from setup_folder/v2/assets/branding.js
 */

export type BrandingColors = {
  primary: string;
  sidebar: string;
  sidebarText: string;
  topbar: string;
  pageBg: string;
  titleTint: string;
  link?: string;
};

export type ThemePreset = {
  id: string;
  name: string;
  desc: string;
  colors: BrandingColors;
};

export const DEFAULT_BRANDING_COLORS: BrandingColors = {
  primary: "#4F46E5",
  sidebar: "#1E293B",
  sidebarText: "#E2E8F0",
  topbar: "#FFFFFF",
  pageBg: "#F8FAFC",
  titleTint: "#E8ECF7",
  link: "",
};

function clamp(x: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, x));
}

export function normHex(h: string | null | undefined): string | null {
  let str = String(h == null ? "" : h).trim();
  if (!str) return null;
  if (str.charAt(0) !== "#") str = "#" + str;
  if (/^#[0-9a-f]{3}$/i.test(str)) {
    str = "#" + str[1] + str[1] + str[2] + str[2] + str[3] + str[3];
  }
  return /^#[0-9a-f]{6}$/i.test(str) ? str.toUpperCase() : null;
}

export function hexToRgb(h: string): [number, number, number] {
  const clean = normHex(h) || "#000000";
  return [
    parseInt(clean.substring(1, 3), 16),
    parseInt(clean.substring(3, 5), 16),
    parseInt(clean.substring(5, 7), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  function p(n: number) {
    const val = Math.round(clamp(n, 0, 255));
    return (val < 16 ? "0" : "") + val.toString(16);
  }
  return ("#" + p(r) + p(g) + p(b)).toUpperCase();
}

export function toHsl(h: string): [number, number, number] {
  const c = hexToRgb(h);
  const r = c[0] / 255;
  const g = c[1] / 255;
  const b = c[2] / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  let s = 0;
  let hu = 0;
  const d = mx - mn;
  if (d) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) hu = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) hu = (b - r) / d + 2;
    else hu = (r - g) / d + 4;
    hu *= 60;
  }
  return [hu, s, l];
}

export function fromHsl(h: number, s: number, l: number): string {
  const hu = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 1);
  const lumVal = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * lumVal - 1)) * sat;
  const x = c * (1 - Math.abs(((hu / 60) % 2) - 1));
  const m = lumVal - c / 2;
  let r = 0, g = 0, b = 0;
  if (hu < 60) { r = c; g = x; }
  else if (hu < 120) { r = x; g = c; }
  else if (hu < 180) { g = c; b = x; }
  else if (hu < 240) { g = x; b = c; }
  else if (hu < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

export function lum(h: string): number {
  const c = hexToRgb(h).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function calcContrastRatio(a: string, b: string): number {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export function mixColors(a: string, b: string, t: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex(
    x[0] * (1 - t) + y[0] * t,
    x[1] * (1 - t) + y[1] * t,
    x[2] * (1 - t) + y[2] * t
  );
}

export function shadeColor(h: string, dl: number): string {
  const c = toHsl(h);
  return fromHsl(c[0], c[1], c[2] + dl);
}

export function rgbaColor(h: string, a: number): string {
  const c = hexToRgb(h);
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

function minC(fg: string, bgs: string[]): number {
  let m = 99;
  for (let i = 0; i < bgs.length; i++) {
    m = Math.min(m, calcContrastRatio(fg, bgs[i]));
  }
  return m;
}

export function ensureContrast(fg: string, bgs: string[], ratio: number): string {
  const normalizedFg = normHex(fg) || "#000000";
  if (minC(normalizedFg, bgs) >= ratio) return normalizedFg;
  let avg = 0;
  bgs.forEach((b) => {
    avg += lum(b);
  });
  avg /= bgs.length;
  const dirs = avg > 0.4 ? [-1, 1] : [1, -1];
  const hs = toHsl(normalizedFg);
  for (let d = 0; d < 2; d++) {
    for (let i = 1; i <= 100; i++) {
      const c = fromHsl(hs[0], hs[1], hs[2] + dirs[d] * i * 0.01);
      if (minC(c, bgs) >= ratio) return c;
    }
  }
  const wh = minC("#FFFFFF", bgs);
  const bk = minC("#000000", bgs);
  return wh >= bk ? "#FFFFFF" : "#000000";
}

export function getOnColor(bg: string, dark = "#0F172A", light = "#FFFFFF"): string {
  const cl = calcContrastRatio(bg, light);
  const cd = calcContrastRatio(bg, dark);
  if (cl >= 4.5) return light;
  return cd >= cl ? dark : light;
}

export const BRANDING_PRESETS: ThemePreset[] = [
  {
    id: "slate-indigo",
    name: "Slate and Indigo",
    desc: "The current default look.",
    colors: { primary: "#4F46E5", sidebar: "#1E293B", sidebarText: "#E2E8F0", topbar: "#FFFFFF", pageBg: "#F8FAFC", titleTint: "#E8ECF7", link: "" },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    desc: "Calm blues with a deep navy menu.",
    colors: { primary: "#0369A1", sidebar: "#0C2A43", sidebarText: "#E2F0FA", topbar: "#FFFFFF", pageBg: "#F4F9FC", titleTint: "#DCEBF5", link: "" },
  },
  {
    id: "forest-green",
    name: "Forest Green",
    desc: "Fresh green on a dark pine menu.",
    colors: { primary: "#15803D", sidebar: "#14291F", sidebarText: "#E3F2E8", topbar: "#FFFFFF", pageBg: "#F5FAF6", titleTint: "#DDEEE2", link: "" },
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    desc: "Warm orange with a dark brown menu.",
    colors: { primary: "#C2410C", sidebar: "#3B1D10", sidebarText: "#FBEADF", topbar: "#FFFFFF", pageBg: "#FFF9F5", titleTint: "#FBE6D9", link: "" },
  },
  {
    id: "crimson",
    name: "Crimson",
    desc: "Bold red for a confident brand.",
    colors: { primary: "#BE123C", sidebar: "#3A0F1C", sidebarText: "#FBE4EA", topbar: "#FFFFFF", pageBg: "#FFF8F9", titleTint: "#F9E1E7", link: "" },
  },
  {
    id: "charcoal-teal",
    name: "Charcoal and Teal",
    desc: "Neutral charcoal with a teal accent.",
    colors: { primary: "#0F766E", sidebar: "#1F2326", sidebarText: "#E6ECEB", topbar: "#FFFFFF", pageBg: "#F6F8F8", titleTint: "#DCEBE9", link: "" },
  },
  {
    id: "purple",
    name: "Purple",
    desc: "Rich violet on a midnight menu.",
    colors: { primary: "#7E22CE", sidebar: "#2A1245", sidebarText: "#F0E4FB", topbar: "#FFFFFF", pageBg: "#FAF7FD", titleTint: "#EBE0F6", link: "" },
  },
  {
    id: "light-sky",
    name: "Light Sky",
    desc: "A light menu and a bright blue accent.",
    colors: { primary: "#2563EB", sidebar: "#EAF1FB", sidebarText: "#1E293B", topbar: "#FFFFFF", pageBg: "#F8FAFC", titleTint: "#DCE7F7", link: "" },
  },
];

export function cleanColors(raw?: Partial<BrandingColors>): BrandingColors {
  const o = {} as BrandingColors;
  for (const k in DEFAULT_BRANDING_COLORS) {
    const key = k as keyof BrandingColors;
    o[key] = normHex(raw && raw[key]) || (key === "link" ? "" : DEFAULT_BRANDING_COLORS[key]);
  }
  return o;
}

export function deriveCssVars(colors: BrandingColors): {
  light: Record<string, string>;
  dark: Record<string, string>;
  clean: BrandingColors;
} {
  const c = cleanColors(colors);
  const bg = c.pageBg;
  const textDark = calcContrastRatio(bg, "#0F172A") >= calcContrastRatio(bg, "#F8FAFC");
  const text = textDark ? "#0F172A" : "#F8FAFC";
  const surface = textDark ? "#FFFFFF" : mixColors(bg, "#FFFFFF", 0.08);
  const surface2 = textDark ? mixColors(bg, "#0F172A", 0.03) : mixColors(surface, "#FFFFFF", 0.06);
  const border = mixColors(bg, text, 0.1);
  const borderStrong = mixColors(bg, text, 0.2);
  const muted = ensureContrast(mixColors(text, bg, 0.3), [bg, surface, surface2], 4.5);
  const head = c.titleTint;
  const headBorder = mixColors(head, textDark ? "#0F172A" : "#FFFFFF", 0.12);
  const accent = c.primary;
  const onAccent = getOnColor(accent);
  const hover = shadeColor(accent, -0.08);
  const onHover = getOnColor(hover);
  const soft = mixColors(accent, surface, 0.91);
  const accentText = c.link
    ? ensureContrast(c.link, [surface, bg, soft, surface2, head], 4.5)
    : ensureContrast(accent, [surface, bg, soft, surface2, head], 7);
  const accent2 = mixColors(accent, onAccent === "#FFFFFF" ? "#000000" : "#FFFFFF", 0.25);
  const sb = c.sidebar;
  const sbText = c.sidebarText;
  const sbDark = lum(sb) < 0.4;
  const sbMuted = ensureContrast(mixColors(sbText, sb, 0.22), [sb], 4.5);
  const sbActive = ensureContrast(accent, [sb], 3.05);
  const sbActiveText = getOnColor(sbActive);
  const tb = c.topbar;
  const tbText = calcContrastRatio(tb, text) >= calcContrastRatio(tb, "#F8FAFC") ? text : "#F8FAFC";

  const sbH = toHsl(sb);
  const bHue = sbH[1] >= 0.15 ? sbH[0] : toHsl(accent)[0];
  const bSat = sbH[1] >= 0.15 ? clamp(sbH[1] * 1.1, 0.3, 0.5) : clamp(toHsl(accent)[1] * 0.5, 0.3, 0.5);

  function deep(h: number, s: number, l: number): string {
    let col = fromHsl(h, s, l);
    let n = 0;
    while (calcContrastRatio("#FFFFFF", col) < 4.5 && n++ < 60) {
      l -= 0.01;
      col = fromHsl(h, s, l);
    }
    return col;
  }

  const thBg = deep(bHue, bSat, 0.37);
  const thLine = "rgba(255,255,255,.22)";
  const tsHue = toHsl(accent)[0] - 52;
  const tsBg = fromHsl(tsHue, 0.4, 0.87);
  const tsText = ensureContrast(fromHsl(tsHue, 0.5, 0.15), [tsBg], 7);
  const tsLine = fromHsl(tsHue, 0.33, 0.74);

  const L: Record<string, string> = {
    "--bg": bg,
    "--surface": surface,
    "--surface-2": surface2,
    "--border": border,
    "--border-strong": borderStrong,
    "--text": text,
    "--muted": muted,
    "--accent": accent,
    "--accent-hover": hover,
    "--accent-soft": soft,
    "--accent-text": accentText,
    "--on-accent": onAccent,
    "--accent-2": accent2,
    "--on-accent-hover": onHover,
    "--sb-bg": sb,
    "--sb-border": mixColors(sb, sbText, 0.15),
    "--sb-text": sbText,
    "--sb-muted": sbMuted,
    "--sb-hover": sbDark ? "rgba(255,255,255,.09)" : "rgba(15,23,42,.07)",
    "--sb-active": sbActive,
    "--sb-active-text": sbActiveText,
    "--rail-bg": head,
    "--rail-border": headBorder,
    "--rail-hover": rgbaColor(accent, 0.12),
    "--th-bg": thBg,
    "--th-text": "#FFFFFF",
    "--th-line": thLine,
    "--head-bg": thBg,
    "--head-border": thLine,
    "--head-text": "#FFFFFF",
    "--ts-bg": tsBg,
    "--ts-line": tsLine,
    "--ts-text": tsText,
    "--ts-hover": rgbaColor(tsText, 0.1),
    "--tb-bg": tb,
    "--tb-text": tbText,
    "--tb-muted": ensureContrast(mixColors(tbText, tb, 0.3), [tb], 4.5),
    "--tb-border": mixColors(tb, tbText, 0.12),
    "--tb-hover": rgbaColor(tbText, 0.08),
  };

  /* ===== dark mode derivation ===== */
  const ph = toHsl(c.pageBg);
  let hh = ph[0];
  let hs = clamp(ph[1] * 0.9, 0.08, 0.4);
  if (ph[1] < 0.05) {
    const sh = toHsl(c.sidebar);
    hh = sh[0];
    hs = clamp(sh[1] * 0.6, 0.08, 0.3);
  }
  const dbg = fromHsl(hh, hs, 0.08);
  const dsurface = fromHsl(hh, hs, 0.115);
  const dsurface2 = fromHsl(hh, hs, 0.165);
  const dborder = fromHsl(hh, hs, 0.21);
  const dborderS = fromHsl(hh, hs, 0.27);
  const dtext = "#E5E7EB";
  const dmuted = ensureContrast("#94A3B8", [dbg, dsurface, dsurface2], 4.5);
  const th = toHsl(c.titleTint);
  const dhead = fromHsl(th[0], clamp(th[1] * 0.9, 0.1, 0.35), 0.18);
  const dheadB = fromHsl(th[0], clamp(th[1] * 0.9, 0.1, 0.35), 0.26);
  const daccent = ensureContrast(accent, [dsurface, dbg], 3);
  const dOn = getOnColor(daccent, "#0B1120");
  const dhover = shadeColor(daccent, 0.08);
  const dOnH = getOnColor(dhover, "#0B1120");
  const ah = toHsl(accent);
  const dsoft = fromHsl(ah[0], clamp(ah[1], 0.2, 0.6), 0.17);
  const lh = toHsl(c.link || accent);
  const dstart = fromHsl(lh[0], Math.min(lh[1], 0.9), Math.max(lh[2], 0.8));
  const daText = ensureContrast(dstart, [dsurface, dbg, dsoft, dsurface2, dhead], 4.5);
  const dsb = toHsl(c.sidebar);
  const dsbBg = fromHsl(dsb[0], clamp(dsb[1] * 0.8, 0.05, 0.4), 0.065);
  const dsbText = lum(sbText) > 0.5 ? sbText : "#E2E8F0";
  const dsbMuted = ensureContrast(mixColors(dsbText, dsbBg, 0.28), [dsbBg], 4.5);
  const dsbActive = ensureContrast(daccent, [dsbBg], 3.05);
  const dtb = lum(tb) > 0.5 ? dsurface : (function () {
    const t = toHsl(tb);
    return fromHsl(t[0], clamp(t[1], 0.05, 0.4), 0.12);
  })();
  const dThBg = deep(bHue, bSat * 0.9, 0.3);
  const dTsBg = fromHsl(tsHue, 0.45, 0.14);
  const dTsText = ensureContrast(fromHsl(tsHue, 0.4, 0.91), [dTsBg], 7);
  const dTsLine = fromHsl(tsHue, 0.35, 0.25);

  const D: Record<string, string> = {
    "--bg": dbg,
    "--surface": dsurface,
    "--surface-2": dsurface2,
    "--border": dborder,
    "--border-strong": dborderS,
    "--text": dtext,
    "--muted": dmuted,
    "--accent": daccent,
    "--accent-hover": dhover,
    "--accent-soft": dsoft,
    "--accent-text": daText,
    "--on-accent": dOn,
    "--accent-2": mixColors(daccent, dOn === "#FFFFFF" ? "#000000" : "#FFFFFF", 0.25),
    "--on-accent-hover": dOnH,
    "--sb-bg": dsbBg,
    "--sb-border": mixColors(dsbBg, dsbText, 0.12),
    "--sb-text": dsbText,
    "--sb-muted": dsbMuted,
    "--sb-hover": "rgba(255,255,255,.09)",
    "--sb-active": dsbActive,
    "--sb-active-text": getOnColor(dsbActive, "#0B1120"),
    "--rail-bg": dhead,
    "--rail-border": dheadB,
    "--rail-hover": rgbaColor(daccent, 0.16),
    "--th-bg": dThBg,
    "--th-text": "#FFFFFF",
    "--th-line": thLine,
    "--head-bg": dThBg,
    "--head-border": thLine,
    "--head-text": "#FFFFFF",
    "--ts-bg": dTsBg,
    "--ts-line": dTsLine,
    "--ts-text": dTsText,
    "--ts-hover": "rgba(255,255,255,.12)",
    "--tb-bg": dtb,
    "--tb-text": dtext,
    "--tb-muted": ensureContrast(mixColors(dtext, dtb, 0.3), [dtb], 4.5),
    "--tb-border": mixColors(dtb, dtext, 0.12),
    "--tb-hover": "rgba(255,255,255,.08)",
  };

  return { light: L, dark: D, clean: c };
}

export type ContrastCheckResult = {
  id: string;
  label: string;
  kind: "text" | "ui";
  need: number;
  block: boolean;
  fix: string;
  light: number;
  dark: number;
  lightState: "ok" | "warn" | "block";
  darkState: "ok" | "warn" | "block";
};

const PAIRS = [
  { id: "sbText", label: "Menu text on the sidebar", kind: "text", fg: "--sb-text", bg: ["--sb-bg"], block: true, fix: "Choose a lighter or darker Sidebar text colour." },
  { id: "sbMuted", label: "Menu sub-items on the sidebar", kind: "text", fg: "--sb-muted", bg: ["--sb-bg"], block: false, fix: "" },
  { id: "sbActive", label: "Selected menu item text", kind: "text", fg: "--sb-active-text", bg: ["--sb-active"], block: false, fix: "" },
  { id: "btn", label: "Button text on the primary colour", kind: "text", fg: "--on-accent", bg: ["--accent"], block: false, fix: "" },
  { id: "link", label: "Links on page and cards", kind: "text", fg: "--accent-text", bg: ["--bg", "--surface"], block: false, fix: "" },
  { id: "body", label: "Body text on the page", kind: "text", fg: "--text", bg: ["--bg", "--surface"], block: false, fix: "" },
  { id: "title", label: "Card title on the dark title bar", kind: "text", fg: "--head-text", bg: ["--head-bg"], block: false, fix: "" },
  { id: "top", label: "Top bar text on the top bar", kind: "text", fg: "--tb-text", bg: ["--tb-bg"], block: false, fix: "" },
  { id: "prim", label: "Primary colour against the page (buttons, focus rings)", kind: "ui", fg: "--accent", bg: ["--bg", "--surface"], block: false, fix: "" },
  { id: "sbSel", label: "Selected item against the sidebar", kind: "ui", fg: "--sb-active", bg: ["--sb-bg"], block: false, fix: "" },
];

function ratioIn(map: Record<string, string>, p: typeof PAIRS[0]): number {
  let m = 99;
  p.bg.forEach((b) => {
    m = Math.min(m, calcContrastRatio(map[p.fg], map[b]));
  });
  return m;
}

export function runReadabilityChecks(colors: BrandingColors): ContrastCheckResult[] {
  const v = deriveCssVars(colors);
  return PAIRS.map((p) => {
    const l = ratioIn(v.light, p);
    const d = ratioIn(v.dark, p);
    const need = p.kind === "text" ? 4.5 : 3;
    function st(r: number): "ok" | "warn" | "block" {
      return r >= need ? "ok" : p.kind === "text" && r < 3 ? "block" : "warn";
    }
    return {
      id: p.id,
      label: p.label,
      kind: p.kind as "text" | "ui",
      need,
      block: !!p.block,
      fix: p.fix || "",
      light: l,
      dark: d,
      lightState: st(l),
      darkState: st(d),
    };
  });
}

function decl(o: Record<string, string>): string {
  return Object.keys(o)
    .map((k) => k + ":" + o[k])
    .join(";");
}

const OVERRIDES = [
  "@media (max-width:860px){.sidebar .brand{color:var(--sb-text)}}",
  ".sidebar-foot a,.nav .sub a:hover,.nav .sub a.active,.nav .sub button.sub-h:hover{color:var(--sb-text)}",
  ".sidebar :focus-visible{outline-color:var(--sb-text)}",
  ".brand .logo,.logo-m,.skip-link,.stepper .step.done .n{color:var(--on-accent)}",
  '.btn.primary:hover,:root[data-theme="dark"] .btn.primary:hover{color:var(--on-accent-hover)}',
  ".hero,.auth .art{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent)}",
  ".thumb{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent)}",
  ".topbar,.lshell .ltop{background:var(--tb-bg);color:var(--tb-text);border-bottom-color:var(--tb-border)}",
  ".topbar .icon-btn,.ltop .icon-btn,.topbar .lang-btn,.ltop .lang-btn{color:var(--tb-text)}",
  ".topbar .icon-btn:hover,.ltop .icon-btn:hover{background:var(--tb-hover)}",
  ".topbar .icon-btn .dot,.ltop .icon-btn .dot{border-color:var(--tb-bg)}",
  ".ltop .lnav a{color:var(--tb-muted)}",
  ".ltop .lnav a:hover{background:var(--tb-hover);color:var(--tb-text)}",
  ".ltop .lnav a.active{color:var(--accent-text);background:var(--accent-soft)}",
  ".sidebar{background:var(--sb-bg);color:var(--sb-text);border-right-color:var(--sb-border)}",
  ".sidebar .brand{border-bottom-color:var(--sb-border);color:var(--sb-text)}",
  ".nav a.item,.nav summary{color:var(--sb-text)}",
  ".nav a.item:hover,.nav summary:hover{background:var(--sb-hover)}",
  ".nav .item.active,.nav details.active > summary{background:var(--sb-active);color:var(--sb-active-text)}",
  ".nav .sub a{color:var(--sb-muted)}",
  ".nav .sub a:hover{background:var(--sb-hover);color:var(--sb-text)}",
  ".nav .sub a.active{color:var(--sb-text);font-weight:600}",
  ".sidebar-foot{border-top-color:var(--sb-border);color:var(--sb-muted)}",
].join("\n");

export function buildBrandCss(colors: BrandingColors): string {
  const v = deriveCssVars(colors);
  return (
    "/* SimpliTrain Lite branding (generated) */\n" +
    ":root{" + decl(v.light) + "}\n" +
    ':root[data-theme="dark"]{' + decl(v.dark) + "}\n" +
    '@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){' + decl(v.dark) + "}}\n" +
    OVERRIDES + "\n"
  );
}
