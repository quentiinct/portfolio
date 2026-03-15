"use client";

import { useRef, useEffect } from "react";

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const resize = () => {
      canvas.width  = W() * dpr;
      canvas.height = H() * dpr;
      canvas.style.width  = `${W()}px`;
      canvas.style.height = `${H()}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Mouse tracking ──────────────────────────────────────────
    let mouseX = -9999, mouseY = -9999;
    const onMove  = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onLeave = () => { mouseX = -9999; mouseY = -9999; };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    // ── Stars ──────────────────────────────────────────────────
    type Star = { rx: number; ry: number; sz: number; phase: number; speed: number; base: number; col: string; sparkle: boolean };
    const STAR_COLS = ["#ffffff", "#cce0ff", "#ffeedd", "#ddeeff", "#eeddff"];
    const stars: Star[] = Array.from({ length: 220 }, (_, i) => ({
      rx: Math.random(), ry: Math.random(),
      sz: Math.random() < 0.78 ? 1 : 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.1,
      base: 0.05 + Math.random() * 0.28,
      col: STAR_COLS[Math.floor(Math.random() * STAR_COLS.length)],
      sparkle: i < 18,
    }));

    // ── Pixel helpers ───────────────────────────────────────────
    const P = 2;
    const pixelDisk = (cx: number, cy: number, r: number, light: string, dark: string) => {
      for (let py = -r; py <= r; py += P)
        for (let px = -r; px <= r; px += P)
          if (px * px + py * py <= r * r) {
            ctx.fillStyle = (px + py > r * 0.35) ? dark : light;
            ctx.fillRect(cx + px, cy + py, P, P);
          }
    };

    // ── Planets ────────────────────────────────────────────────
    type Planet = {
      rx: number; ry: number; r: number;
      light: string; dark: string; glowRgb: string;
      ring?: { rx: number; ry: number; col: string; angle: number };
      craters: [number, number, number][];
    };
    const PLANETS: Planet[] = [
      { rx: 0.07, ry: 0.18, r: 28, light: "#2e1268", dark: "#190840", glowRgb: "110,50,220",
        ring: { rx: 46, ry: 9, col: "#7832cc", angle: -0.28 }, craters: [[-8,-6,5],[10,7,4],[-2,11,3]] },
      { rx: 0.91, ry: 0.56, r: 17, light: "#103428", dark: "#081c14", glowRgb: "30,140,70",
        craters: [[-4,-4,4],[5,5,3]] },
      { rx: 0.85, ry: 0.13, r: 10, light: "#301808", dark: "#1c0c04", glowRgb: "180,70,20",
        craters: [[3,-2,2]] },
      { rx: 0.10, ry: 0.80, r: 22, light: "#0a1c38", dark: "#050e1e", glowRgb: "30,90,210",
        ring: { rx: 36, ry: 7, col: "#2255aa", angle: 0.18 }, craters: [[-5,-5,4],[7,4,3],[-2,8,2]] },
      { rx: 0.24, ry: 0.91, r: 13, light: "#1a2a10", dark: "#0c160a", glowRgb: "50,160,50",
        craters: [[-3,-2,3],[4,3,2]] },
    ];

    const planetStates = PLANETS.map(() => ({ hover: 0 }));

    const drawPlanet = (p: Planet, cx: number, cy: number, scale: number, glowAmt: number) => {
      const r = Math.round(p.r * scale);
      if (glowAmt > 0.01) {
        const grad = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.8);
        grad.addColorStop(0, `rgba(${p.glowRgb},${(glowAmt * 0.45).toFixed(2)})`);
        grad.addColorStop(1, `rgba(${p.glowRgb},0)`);
        const saved = ctx.globalAlpha;
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.fillRect(cx - r * 3, cy - r * 3, r * 6, r * 6);
        ctx.globalAlpha = saved;
      }
      const drawRing = (startAngle: number, endAngle: number, alphaFactor: number) => {
        if (!p.ring) return;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(p.ring.angle);
        ctx.strokeStyle = p.ring.col;
        ctx.lineWidth = scale < 1.1 ? 3 : 4;
        ctx.globalAlpha *= alphaFactor;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.ring.rx * scale, p.ring.ry * scale, 0, startAngle, endAngle);
        ctx.stroke();
        ctx.restore();
      };
      drawRing(Math.PI, Math.PI * 2, 0.45);
      pixelDisk(cx, cy, r, p.light, p.dark);
      p.craters.forEach(([ox, oy, cr]) => {
        const scOx = Math.round(ox * scale), scOy = Math.round(oy * scale);
        const scCr = Math.max(2, Math.round(cr * scale));
        for (let py = -scCr; py <= scCr; py += P)
          for (let px = -scCr; px <= scCr; px += P)
            if (px * px + py * py <= scCr * scCr) {
              ctx.fillStyle = p.dark;
              ctx.fillRect(cx + scOx + px, cy + scOy + py, P, P);
            }
      });
      drawRing(0, Math.PI, 0.65);
    };

    // ── Rocket ─────────────────────────────────────────────────
    const RP = 5;
    type Px = [number, number, string];
    const ROCKET_BODY: Px[] = [
      [2,0,"#d8d8d8"],
      [1,1,"#bbbbbb"],[2,1,"#e4e4e4"],[3,1,"#bbbbbb"],
      [0,2,"#aaaaaa"],[1,2,"#cccccc"],[2,2,"#eeeeee"],[3,2,"#cccccc"],[4,2,"#aaaaaa"],
      [0,3,"#999999"],[1,3,"#bbbbbb"],[2,3,"#44aaff"],[3,3,"#bbbbbb"],[4,3,"#999999"],
      [0,4,"#aaaaaa"],[1,4,"#cccccc"],[2,4,"#eeeeee"],[3,4,"#cccccc"],[4,4,"#aaaaaa"],
      [-1,5,"#777777"],[0,5,"#999999"],[1,5,"#bbbbbb"],[2,5,"#cccccc"],[3,5,"#bbbbbb"],[4,5,"#999999"],[5,5,"#777777"],
      [-1,6,"#666666"],[0,6,"#888888"],[1,6,"#999999"],[2,6,"#aaaaaa"],[3,6,"#999999"],[4,6,"#888888"],[5,6,"#666666"],
    ];
    const FLAMES: [Px[], Px[]] = [
      [[1,7,"#ff7700"],[2,7,"#ffbb00"],[3,7,"#ff7700"],[1,8,"#ff4400"],[2,8,"#ffaa00"],[3,8,"#ff4400"],[2,9,"#ff6600"]],
      [[1,7,"#ffcc00"],[2,7,"#ff7700"],[3,7,"#ffcc00"],[2,8,"#ff3300"],[1,9,"#ff6600"],[3,9,"#ff6600"]],
    ];
    const drawRocket = (x: number, y: number, frame: number) => {
      [...ROCKET_BODY, ...FLAMES[frame % 2]].forEach(([col, row, color]) => {
        ctx.fillStyle = color as string;
        ctx.fillRect(x + (col as number) * RP, y + (row as number) * RP, RP, RP);
      });
    };

    // ── Shooting star ───────────────────────────────────────────
    type Shoot = { x: number; y: number; active: boolean; t: number };
    let shoot: Shoot = { x: 0, y: 0, active: false, t: 0 };
    const spawnShoot = () => {
      shoot = { x: Math.random() * W() * 0.65, y: Math.random() * H() * 0.35, active: true, t: 0 };
    };
    const t1 = setTimeout(spawnShoot, 3500);
    const shootIv = setInterval(spawnShoot, 9000 + Math.random() * 5000);

    // ── Animation state ─────────────────────────────────────────
    let rocketX = -90;
    // Start with a pause so the rocket doesn't appear immediately on load
    let rocketPaused = 8 + Math.random() * 10; // 8–18 s before first pass
    let lastTick = 0;
    let lastFlame = 0;
    let flameF = 0;
    let globalT = 0;
    let raf: number;

    const tick = (now: number) => {
      const dt = Math.min((now - (lastTick || now)) / 1000, 0.05);
      lastTick = now;
      globalT += dt;
      if (now - lastFlame > 120) { flameF++; lastFlame = now; }

      ctx.clearRect(0, 0, W(), H());
      ctx.imageSmoothingEnabled = false;

      // Stars
      stars.forEach(s => {
        const tw = (Math.sin(globalT * s.speed + s.phase) + 1) / 2;
        const alpha = s.base + tw * 0.55;
        const sx = s.rx * W(), sy = s.ry * H();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.col;
        ctx.fillRect(sx, sy, s.sz, s.sz);
        if (s.sparkle && tw > 0.78) {
          const reach = 3 + tw * 5;
          const sparkAlpha = (tw - 0.78) / 0.22;
          ctx.globalAlpha = alpha * sparkAlpha * 0.85;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(sx - reach, sy, reach * 2 + s.sz, 1);
          ctx.fillRect(sx, sy - reach, s.sz, reach * 2 + s.sz);
        }
      });

      // Planets
      let anyCursor = false;
      PLANETS.forEach((p, i) => {
        const cx = p.rx * W(), cy = p.ry * H();
        const isHovered = Math.hypot(mouseX - cx, mouseY - cy) <= p.r + 14;
        if (isHovered) anyCursor = true;
        planetStates[i].hover += ((isHovered ? 1 : 0) - planetStates[i].hover) * 0.07;
        const h = planetStates[i].hover;
        ctx.globalAlpha = 0.60 + h * 0.35;
        drawPlanet(p, cx, cy, 1 + h * 0.22, h);
      });
      document.body.style.cursor = anyCursor ? "pointer" : "";

      // Shooting star
      if (shoot.active) {
        shoot.t += dt;
        const prog = shoot.t / 0.65;
        if (prog >= 1) { shoot.active = false; }
        else {
          const spd = 340;
          const sx = shoot.x + shoot.t * spd;
          const sy = shoot.y + shoot.t * spd * 0.32;
          const trail = 70 * (1 - prog);
          ctx.globalAlpha = (1 - prog) * 0.85;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - trail * 0.95, sy - trail * 0.32);
          ctx.stroke();
          ctx.globalAlpha = (1 - prog) * 0.95;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(sx, sy, 2, 2);
        }
      }

      // Rocket — organic path, appears every ~45–70 s
      if (rocketPaused > 0) {
        rocketPaused -= dt;
      } else {
        const wave1 = Math.sin(globalT * 0.38) * H() * 0.055;
        const wave2 = Math.sin(globalT * 0.85 + 1.5) * H() * 0.022;
        const rocketY = H() * 0.38 + wave1 + wave2;
        const tilt = Math.cos(globalT * 0.38) * 0.38 * 0.14 + Math.cos(globalT * 0.85 + 1.5) * 0.85 * 0.04;
        const spd = (W() / 900) * (1 + Math.sin(globalT * 0.28) * 0.14);
        ctx.globalAlpha = 0.82;
        ctx.save();
        ctx.translate(rocketX + 2 * RP, rocketY + 5 * RP);
        ctx.rotate(tilt);
        drawRocket(-2 * RP, -5 * RP, flameF);
        ctx.restore();
        rocketX += spd;
        if (rocketX > W() + 90) {
          rocketX = -90;
          rocketPaused = 45 + Math.random() * 25; // 45–70 s pause between passes
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.body.style.cursor = "";
      clearTimeout(t1);
      clearInterval(shootIv);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: -1 }}
    />
  );
}
