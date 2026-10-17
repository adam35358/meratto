import React, { useEffect, useRef } from 'react';

export default function WorldCanvas3D() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    scroll: 0,
    targetScroll: 0,
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let time = 0;

    // Handle high-DPI Retina screens
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      stateRef.current.width = w;
      stateRef.current.height = h;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      stateRef.current.mouse.targetX = x;
      stateRef.current.mouse.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // =========================================================================
    // 3D SARTORIAL GARMENT GEOMETRIES (SHAFFOF KIYIMLAR DEKOMPOZITSIYASI)
    // Detailed polygons for translucent fills & sartorial pick-stitch outlines
    // =========================================================================

    // 1. Translucent Tailored Jacket / Blouson
    const jacketPanels = [
      // Left Front Quarters (Panel with translucent fill)
      {
        type: 'polygon',
        pts: [[-12, -145, 0], [-55, -140, 0], [-115, -100, 0], [-135, -25, 0], [-120, 85, 0], [-60, 105, 0], [-12, 95, 0], [-12, -45, 0], [-42, -75, 0]],
        fill: 'rgba(229, 195, 120, 0.045)',
        stroke: 'rgba(229, 195, 120, 0.65)',
        width: 1.4
      },
      // Right Front Quarters
      {
        type: 'polygon',
        pts: [[12, -145, 0], [55, -140, 0], [115, -100, 0], [135, -25, 0], [120, 85, 0], [60, 105, 0], [12, 95, 0], [12, -45, 0], [42, -75, 0]],
        fill: 'rgba(229, 195, 120, 0.045)',
        stroke: 'rgba(229, 195, 120, 0.65)',
        width: 1.4
      },
      // Left Lapel Roll (Faceted silk/wool lapel facing)
      {
        type: 'polygon',
        pts: [[-12, -145, 5], [-42, -75, 8], [-12, -45, 6], [-12, -145, 5]],
        fill: 'rgba(229, 195, 120, 0.08)',
        stroke: 'rgba(229, 195, 120, 0.8)',
        width: 1.6
      },
      // Right Lapel Roll
      {
        type: 'polygon',
        pts: [[12, -145, 5], [42, -75, 8], [12, -45, 6], [12, -145, 5]],
        fill: 'rgba(229, 195, 120, 0.08)',
        stroke: 'rgba(229, 195, 120, 0.8)',
        width: 1.6
      },
      // Stand Collar (Curved back contour in 3D depth)
      {
        type: 'line',
        pts: [[-55, -140, 0], [-35, -160, -20], [0, -165, -25], [35, -160, -20], [55, -140, 0]],
        stroke: 'rgba(229, 195, 120, 0.55)',
        width: 1.2
      },
      // Left Sleeve Outer Silhouette
      {
        type: 'polygon',
        pts: [[-115, -100, 0], [-160, -35, -10], [-170, 65, -15], [-135, 80, -15], [-120, 25, -5], [-135, -25, 0]],
        fill: 'rgba(229, 195, 120, 0.03)',
        stroke: 'rgba(229, 195, 120, 0.5)',
        width: 1.2
      },
      // Right Sleeve Outer Silhouette
      {
        type: 'polygon',
        pts: [[115, -100, 0], [160, -35, -10], [170, 65, -15], [135, 80, -15], [120, 25, -5], [135, -25, 0]],
        fill: 'rgba(229, 195, 120, 0.03)',
        stroke: 'rgba(229, 195, 120, 0.5)',
        width: 1.2
      },
      // Breast Barchetta Welt Pocket (Italiancha qayiqcha cho'ntak)
      {
        type: 'polygon',
        pts: [[-35, -25, 6], [-80, -20, 6], [-80, -10, 6], [-35, -15, 6]],
        fill: 'rgba(229, 195, 120, 0.07)',
        stroke: 'rgba(229, 195, 120, 0.85)',
        width: 1.2
      },
      // Lower Flap Pockets
      {
        type: 'polygon',
        pts: [[-50, 45, 6], [-105, 50, 6], [-105, 65, 6], [-50, 60, 6]],
        fill: 'rgba(229, 195, 120, 0.05)',
        stroke: 'rgba(229, 195, 120, 0.6)',
        width: 1.0
      },
      {
        type: 'polygon',
        pts: [[50, 45, 6], [105, 50, 6], [105, 65, 6], [50, 60, 6]],
        fill: 'rgba(229, 195, 120, 0.05)',
        stroke: 'rgba(229, 195, 120, 0.6)',
        width: 1.0
      },
      // Sartorial Basting Stitches (Pick-Stitch / Qaviq choklar - dashed gold)
      {
        type: 'line',
        pts: [[-10, -40, 4], [-40, -70, 6], [-52, -135, 2]],
        stroke: 'rgba(229, 195, 120, 0.75)',
        width: 1.0,
        dashed: [3, 4]
      },
      {
        type: 'line',
        pts: [[10, -40, 4], [40, -70, 6], [52, -135, 2]],
        stroke: 'rgba(229, 195, 120, 0.75)',
        width: 1.0,
        dashed: [3, 4]
      }
    ];

    // Floating Horn Buttons with cross-stitch thread holes
    const jacketButtons = [
      { x: 0, y: -12, z: 8, r: 4.5 },
      { x: 0, y: 35, z: 8, r: 4.5 }
    ];

    // 2. Translucent Floating Silk Canvas & Twill Lining (Ichki qovurg'a va ipak astar)
    const liningPanels = [
      // Left anatomical canvas panel
      {
        type: 'polygon',
        pts: [[-10, -130, -30], [-45, -125, -30], [-95, -90, -30], [-110, -20, -30], [-100, 75, -30], [-50, 90, -30], [-10, 82, -30]],
        fill: 'rgba(79, 199, 154, 0.04)',
        stroke: 'rgba(79, 199, 154, 0.55)',
        width: 1.2
      },
      // Right anatomical canvas panel
      {
        type: 'polygon',
        pts: [[10, -130, -30], [45, -125, -30], [95, -90, -30], [110, -20, -30], [100, 75, -30], [50, 90, -30], [10, 82, -30]],
        fill: 'rgba(79, 199, 154, 0.04)',
        stroke: 'rgba(79, 199, 154, 0.55)',
        width: 1.2
      },
      // Interior Passport Pocket with Meratto label stitch
      {
        type: 'polygon',
        pts: [[-28, 10, -25], [-70, 15, -25], [-70, 50, -25], [-28, 45, -25]],
        fill: 'rgba(79, 199, 154, 0.08)',
        stroke: 'rgba(79, 199, 154, 0.75)',
        width: 1.1
      },
      // Horsehair Canvas Cross-Hatching Weave (Ichki qovurg'a tolasi)
      { type: 'line', pts: [[-40, -70, -28], [-80, -30, -28]], stroke: 'rgba(79, 199, 154, 0.4)', width: 0.8, dashed: [2, 3] },
      { type: 'line', pts: [[-35, -40, -28], [-75, 0, -28]], stroke: 'rgba(79, 199, 154, 0.4)', width: 0.8, dashed: [2, 3] },
      { type: 'line', pts: [[-30, -10, -28], [-70, 30, -28]], stroke: 'rgba(79, 199, 154, 0.4)', width: 0.8, dashed: [2, 3] },
      { type: 'line', pts: [[40, -70, -28], [80, -30, -28]], stroke: 'rgba(79, 199, 154, 0.4)', width: 0.8, dashed: [2, 3] },
      { type: 'line', pts: [[35, -40, -28], [75, 0, -28]], stroke: 'rgba(79, 199, 154, 0.4)', width: 0.8, dashed: [2, 3] },
      { type: 'line', pts: [[30, -10, -28], [70, 30, -28]], stroke: 'rgba(79, 199, 154, 0.4)', width: 0.8, dashed: [2, 3] }
    ];

    // 3. Translucent Egyptian Cotton Base Polo & Weft Mesh (Baza qatlami)
    const poloPanels = [
      // Ribbed Knit Neckline & Collar Contour
      {
        type: 'polygon',
        pts: [[-35, -130, -55], [-18, -110, -50], [0, -105, -48], [18, -110, -50], [35, -130, -55]],
        fill: 'rgba(96, 165, 250, 0.05)',
        stroke: 'rgba(96, 165, 250, 0.65)',
        width: 1.3
      },
      // Front 3-Button Placket
      {
        type: 'polygon',
        pts: [[-9, -105, -48], [9, -105, -48], [9, -45, -48], [-9, -45, -48]],
        fill: 'rgba(96, 165, 250, 0.08)',
        stroke: 'rgba(96, 165, 250, 0.8)',
        width: 1.1
      },
      // Torso Fabric Panel
      {
        type: 'polygon',
        pts: [[-35, -130, -55], [-80, -100, -60], [-75, 80, -60], [75, 80, -60], [80, -100, -60], [35, -130, -55]],
        fill: 'rgba(96, 165, 250, 0.035)',
        stroke: 'rgba(96, 165, 250, 0.5)',
        width: 1.2
      },
      // Micro Fabric Weave Grid Lines (Ko'krak sohasidagi mato to'qimasi)
      { type: 'line', pts: [[-50, -20, -52], [50, -20, -52]], stroke: 'rgba(96, 165, 250, 0.25)', width: 0.7 },
      { type: 'line', pts: [[-50, 0, -52], [50, 0, -52]], stroke: 'rgba(96, 165, 250, 0.25)', width: 0.7 },
      { type: 'line', pts: [[-50, 20, -52], [50, 20, -52]], stroke: 'rgba(96, 165, 250, 0.25)', width: 0.7 },
      { type: 'line', pts: [[-25, -35, -52], [-25, 35, -52]], stroke: 'rgba(96, 165, 250, 0.25)', width: 0.7 },
      { type: 'line', pts: [[0, -35, -52], [0, 35, -52]], stroke: 'rgba(96, 165, 250, 0.25)', width: 0.7 },
      { type: 'line', pts: [[25, -35, -52], [25, 35, -52]], stroke: 'rgba(96, 165, 250, 0.25)', width: 0.7 }
    ];

    // 4. Translucent Tapered Trousers with Sharp Crease (Shim qatlami)
    const trousersPanels = [
      // Extended Sartorial Waistband (Gurkha/tab waistband)
      {
        type: 'polygon',
        pts: [[-62, 105, -20], [62, 105, -20], [58, 122, -20], [-58, 122, -20]],
        fill: 'rgba(245, 158, 11, 0.06)',
        stroke: 'rgba(245, 158, 11, 0.7)',
        width: 1.3
      },
      // Left Leg Silhouette with translucent fill
      {
        type: 'polygon',
        pts: [[-58, 122, -20], [-65, 200, -15], [-54, 290, -10], [-24, 290, -10], [-14, 200, -15], [0, 155, -18]],
        fill: 'rgba(245, 158, 11, 0.035)',
        stroke: 'rgba(245, 158, 11, 0.55)',
        width: 1.2
      },
      // Right Leg Silhouette
      {
        type: 'polygon',
        pts: [[58, 122, -20], [65, 200, -15], [54, 290, -10], [24, 290, -10], [14, 200, -15], [0, 155, -18]],
        fill: 'rgba(245, 158, 11, 0.035)',
        stroke: 'rgba(245, 158, 11, 0.55)',
        width: 1.2
      },
      // Razor-Sharp Center Crease Lines (Dazmol chiziqlari)
      {
        type: 'line',
        pts: [[-39, 128, -12], [-39, 290, -8]],
        stroke: 'rgba(245, 158, 11, 0.9)',
        width: 1.5
      },
      {
        type: 'line',
        pts: [[39, 128, -12], [39, 290, -8]],
        stroke: 'rgba(245, 158, 11, 0.9)',
        width: 1.5
      },
      // Slant Pocket Welts
      { type: 'line', pts: [[-52, 124, -18], [-38, 160, -18]], stroke: 'rgba(245, 158, 11, 0.7)', width: 1.1 },
      { type: 'line', pts: [[52, 124, -18], [38, 160, -18]], stroke: 'rgba(245, 158, 11, 0.7)', width: 1.1 }
    ];

    // 5. Translucent Hand-Stitched Loafers & Soles (Poyabzal arxitekturasi)
    const loafersPanels = [
      // Left Loafer Upper Silhouette
      {
        type: 'polygon',
        pts: [[-48, 305, 15], [-22, 305, 15], [-18, 332, 25], [-28, 352, 30], [-48, 352, 30], [-55, 332, 25]],
        fill: 'rgba(236, 72, 153, 0.04)',
        stroke: 'rgba(236, 72, 153, 0.65)',
        width: 1.3
      },
      // Left Penny Saddle Strap with cutout
      {
        type: 'line',
        pts: [[-52, 324, 22], [-22, 324, 22]],
        stroke: 'rgba(236, 72, 153, 0.85)',
        width: 1.4
      },
      // Right Loafer Upper Silhouette
      {
        type: 'polygon',
        pts: [[48, 305, 15], [22, 305, 15], [18, 332, 25], [28, 352, 30], [48, 352, 30], [55, 332, 25]],
        fill: 'rgba(236, 72, 153, 0.04)',
        stroke: 'rgba(236, 72, 153, 0.65)',
        width: 1.3
      },
      // Right Penny Saddle Strap
      {
        type: 'line',
        pts: [[52, 324, 22], [22, 324, 22]],
        stroke: 'rgba(236, 72, 153, 0.85)',
        width: 1.4
      },
      // Goodyear Welt Stitch Line (dashed thread perimeter)
      {
        type: 'line',
        pts: [[-57, 336, 23], [-50, 356, 28], [-26, 356, 28], [-16, 336, 23]],
        stroke: 'rgba(229, 195, 120, 0.7)',
        width: 1.0,
        dashed: [2, 3]
      },
      {
        type: 'line',
        pts: [[57, 336, 23], [50, 356, 28], [26, 356, 28], [16, 336, 23]],
        stroke: 'rgba(229, 195, 120, 0.7)',
        width: 1.0,
        dashed: [2, 3]
      }
    ];

    // =========================================================================
    // SARTORIAL WEAVING THREAD STREAMS (IP TOLALARI OQIMI)
    // Dynamic 3D curves flowing through space linking garment components
    // =========================================================================
    const threadStreamCount = 14;
    const threadStreams = [];
    for (let s = 0; s < threadStreamCount; s++) {
      const angle = (s / threadStreamCount) * Math.PI * 2;
      const radius = 180 + (s % 3) * 65;
      const knots = [];
      const knotCount = 18;
      for (let k = 0; k < knotCount; k++) {
        const kz = k * 180 - 1600;
        const wave = Math.sin(k * 0.45 + s) * 55;
        knots.push({
          x: Math.cos(angle + k * 0.18) * (radius + wave),
          y: Math.sin(angle + k * 0.18) * (radius * 0.75 + wave) + (k * 22 - 180),
          z: kz
        });
      }
      threadStreams.push({
        knots,
        color: s % 3 === 0 
          ? 'rgba(229, 195, 120, 0.45)' // Gold Silk Thread
          : s % 3 === 1 
            ? 'rgba(79, 199, 154, 0.35)' // Emerald Lining Thread
            : 'rgba(255, 255, 255, 0.25)', // White Basting Thread
        width: s % 2 === 0 ? 1.0 : 0.7,
        dashed: s % 4 === 0
      });
    }

    // Elongated Fiber Particles (Tolalar va mikro-iplar)
    const fiberCount = 420;
    const fibers = [];
    for (let i = 0; i < fiberCount; i++) {
      fibers.push({
        x: (Math.random() - 0.5) * 1900,
        y: (Math.random() - 0.5) * 2200,
        z: Math.random() * 3200 - 1800,
        length: Math.random() * 28 + 14,
        curve: (Math.random() - 0.5) * 18,
        speed: Math.random() * 3.8 + 1.8,
        color: Math.random() > 0.65 ? 'rgba(229, 195, 120, 0.75)' : 'rgba(255, 255, 255, 0.45)'
      });
    }

    // 3D Technical Tailoring HUD Labels
    const sartorialHudMarkers = [
      { text: "01 // TASHQI QOBIQ: VIRGIN WOOL 15.5μ", pos: [-165, -95, 50], color: "#E5C378" },
      { text: "02 // ICHKI QOVURG'A: BEMBERG SILK TWILL", pos: [155, -45, -20], color: "#4fc79a" },
      { text: "03 // BAZA MATOSI: MISR PAXTA TRIKOTAJ", pos: [-145, 15, -60], color: "#60a5fa" },
      { text: "04 // SHIM BICHIMI: ERGONOMIC TAPERED", pos: [135, 195, -25], color: "#f59e0b" },
      { text: "05 // POYABZAL: BUZOQ TERISI & WELT CHOK", pos: [-125, 340, 25], color: "#ec4899" }
    ];

    // =========================================================================
    // 3D MATH & PROJECTION ENGINE
    // =========================================================================
    const rotateX = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x, y * cos - z * sin, y * sin + z * cos];
    };

    const rotateY = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos + z * sin, y, -x * sin + z * cos];
    };

    const project = (x, y, z, camX, camY, camZ, fov, cx, cy) => {
      const relX = x - camX;
      const relY = y - camY;
      const relZ = z - camZ;

      if (relZ <= 8) return null; // Behind camera plane
      const scale = fov / relZ;
      return {
        x: cx + relX * scale,
        y: cy + relY * scale,
        scale,
        depth: relZ
      };
    };

    // Camera State
    let camX = 0;
    let camY = -40;
    let camZ = 700;
    let rotX = 0;
    let rotY = 0;

    // =========================================================================
    // 60 FPS RENDER LOOP
    // =========================================================================
    const render = () => {
      animationId = requestAnimationFrame(render);
      time += 0.014;

      const w = stateRef.current.width;
      const h = stateRef.current.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const fov = Math.min(w, h) > 768 ? 640 : 520;

      // Mouse inertia damping
      const mouse = stateRef.current.mouse;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Normalized scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const targetScroll = stateRef.current.scroll;
      const scrollNorm = Math.min(1, Math.max(0, targetScroll / docHeight));

      ctx.clearRect(0, 0, w, h);

      // =======================================================================
      // CAMERA FLIGHT TRAJECTORY: DIVING DIRECTLY DOWN THROUGH CLOTHES
      // As scroll proceeds down, camera plunges along Z and descends down Y,
      // flying straight through collar -> chest lining -> waist -> legs -> shoes!
      // =======================================================================
      // Total travel distance in 3D space
      const flightDistance = 2400;
      const scrollZ = scrollNorm * flightDistance;

      // Camera coordinates in sartorial world
      const targetCamZ = 650 - scrollZ;
      // Camera descends from collar level down through the outfit components
      const targetCamY = -50 + (scrollNorm * 420) + mouse.y * 35;
      // Gentle subtle curve in flight to weave around garment panels
      const targetCamX = Math.sin(scrollNorm * Math.PI * 2.5) * 65 + mouse.x * 50;

      // Subtle tilt
      const targetRotY = mouse.x * 0.25 + Math.sin(time * 0.3) * 0.06;
      const targetRotX = mouse.y * 0.18 + Math.cos(time * 0.25) * 0.04;

      // Exploded distance factor increases during the scroll so pieces expand outward
      const decompExplosion = 0.35 + Math.sin(scrollNorm * Math.PI) * 1.35;

      // Interpolate camera
      camX += (targetCamX - camX) * 0.08;
      camY += (targetCamY - camY) * 0.08;
      camZ += (targetCamZ - camZ) * 0.08;
      rotX += (targetRotX - rotX) * 0.06;
      rotY += (targetRotY - rotY) * 0.06;

      // =======================================================================
      // 1. RENDER FLOWING THREAD STREAMS (IP TOLALARI OQIMI)
      // Spline curves weaving between garment parts
      // =======================================================================
      threadStreams.forEach((stream, sIdx) => {
        ctx.save();
        ctx.strokeStyle = stream.color;
        ctx.lineWidth = stream.width;
        if (stream.dashed && ctx.setLineDash) {
          ctx.setLineDash([4, 6]);
        }

        ctx.beginPath();
        let started = false;

        for (let k = 0; k < stream.knots.length; k++) {
          const knot = stream.knots[k];
          // Gentle animated ripple along threads
          const waveX = Math.sin(time * 2 + k * 0.4 + sIdx) * 8;
          const waveY = Math.cos(time * 2 + k * 0.4 + sIdx) * 8;

          let x = knot.x + waveX;
          let y = knot.y + waveY;
          let z = knot.z;

          [x, y, z] = rotateX(x, y, z, rotX * 0.4);
          [x, y, z] = rotateY(x, y, z, rotY * 0.4);

          const proj = project(x, y, z, camX, camY, camZ, fov, cx, cy);
          if (proj) {
            // Near camera fade
            const alpha = Math.min(1, Math.max(0, (proj.depth - 25) / 180));
            if (alpha <= 0.05) continue;

            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      // =======================================================================
      // 2. RENDER ELONGATED FIBER PARTICLES (TOLALAR VA MIKRO-IPLAR)
      // Curved micro-threads streaming past camera in 3D
      // =======================================================================
      const fiberSpeed = 2.0 + scrollNorm * 7.0;

      for (let i = 0; i < fiberCount; i++) {
        const fb = fibers[i];
        fb.z += fb.speed * fiberSpeed;

        // Wrap around camera flight
        if (fb.z > camZ + 300) {
          fb.z = camZ - 2000;
          fb.x = (Math.random() - 0.5) * 1900 + camX;
          fb.y = (Math.random() - 0.5) * 2200 + camY;
        }

        const proj = project(fb.x, fb.y, fb.z, camX, camY, camZ, fov, cx, cy);
        if (proj && proj.x >= -60 && proj.x <= w + 60 && proj.y >= -60 && proj.y <= h + 60) {
          // Fade based on distance & near-camera clip
          const depthAlpha = Math.min(1, Math.max(0, 1 - proj.depth / 2200));
          const nearAlpha = Math.min(1, Math.max(0, (proj.depth - 30) / 120));
          const finalAlpha = depthAlpha * nearAlpha;

          if (finalAlpha > 0.04) {
            ctx.save();
            ctx.strokeStyle = fb.color;
            ctx.globalAlpha = finalAlpha * 0.7;
            ctx.lineWidth = Math.max(0.6, 1.4 * proj.scale);

            // Draw curved fiber filament
            ctx.beginPath();
            ctx.moveTo(proj.x, proj.y);
            const streakLen = fb.length * proj.scale * (1 + scrollNorm * 1.5);
            ctx.quadraticCurveTo(
              proj.x + fb.curve * proj.scale,
              proj.y + streakLen * 0.5,
              proj.x,
              proj.y + streakLen
            );
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // =======================================================================
      // 3. RENDER SHAFFOF KIYIMLAR DEKOMPOZITSIYASI (TRANSLUCENT CLOTHING MODULES)
      // Multiple deconstruction stages distributed along flight trajectory Z
      // =======================================================================
      // Render helper for translucent panels
      const renderClothingGroup = (panels, zBase, xExplode, yExplode, zExplode, groupAlpha = 1) => {
        panels.forEach((p) => {
          // Calculate 3D projected vertices
          const projectedPts = [];
          let avgDepth = 0;

          for (let i = 0; i < p.pts.length; i++) {
            const pt = p.pts[i];
            let x = pt[0] + xExplode * decompExplosion;
            let y = pt[1] + yExplode * decompExplosion;
            let z = zBase + pt[2] + zExplode * decompExplosion;

            // Apply 3D rotation
            [x, y, z] = rotateX(x, y, z, rotX);
            [x, y, z] = rotateY(x, y, z, rotY);

            const proj = project(x, y, z, camX, camY, camZ, fov, cx, cy);
            if (!proj) return; // Behind camera
            projectedPts.push(proj);
            avgDepth += proj.depth;
          }

          if (projectedPts.length < 2) return;
          avgDepth /= projectedPts.length;

          // Camera proximity fade (smooth fade when flying right through it!)
          const nearFade = Math.min(1, Math.max(0, (avgDepth - 35) / 140));
          const farFade = Math.min(1, Math.max(0, 1 - (avgDepth - 400) / 1600));
          const netAlpha = nearFade * farFade * groupAlpha;
          if (netAlpha <= 0.02) return;

          ctx.save();
          ctx.globalAlpha = netAlpha;

          // Draw polygon / line
          ctx.beginPath();
          ctx.moveTo(projectedPts[0].x, projectedPts[0].y);
          for (let i = 1; i < projectedPts.length; i++) {
            ctx.lineTo(projectedPts[i].x, projectedPts[i].y);
          }

          if (p.type === 'polygon') {
            ctx.closePath();
            if (p.fill) {
              ctx.fillStyle = p.fill;
              ctx.fill();
            }
          }

          if (p.stroke) {
            ctx.strokeStyle = p.stroke;
            ctx.lineWidth = p.width || 1;
            if (p.dashed && ctx.setLineDash) {
              ctx.setLineDash(p.dashed);
            }
            ctx.stroke();
          }

          ctx.restore();
        });
      };

      // Helper for floating horn buttons
      const renderButtons = (buttons, zBase, xExplode, yExplode, zExplode) => {
        buttons.forEach(btn => {
          let x = btn.x + xExplode * decompExplosion;
          let y = btn.y + yExplode * decompExplosion;
          let z = zBase + btn.z + zExplode * decompExplosion;

          [x, y, z] = rotateX(x, y, z, rotX);
          [x, y, z] = rotateY(x, y, z, rotY);

          const proj = project(x, y, z, camX, camY, camZ, fov, cx, cy);
          if (proj && proj.depth > 30) {
            const alpha = Math.min(1, Math.max(0, (proj.depth - 30) / 100));
            ctx.save();
            ctx.globalAlpha = alpha * 0.9;
            ctx.strokeStyle = '#E5C378';
            ctx.fillStyle = 'rgba(20, 20, 20, 0.7)';
            ctx.lineWidth = 1.2;

            // Outer button rim
            const r = btn.r * proj.scale;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 4 Thread Holes + Cross Stitch
            const d = r * 0.38;
            ctx.strokeStyle = 'rgba(229, 195, 120, 0.9)';
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(proj.x - d, proj.y - d);
            ctx.lineTo(proj.x + d, proj.y + d);
            ctx.moveTo(proj.x + d, proj.y - d);
            ctx.lineTo(proj.x - d, proj.y + d);
            ctx.stroke();

            ctx.restore();
          }
        });
      };

      // -----------------------------------------------------------------------
      // STAGE 1: PRIMARY SUIT SET (Hero & Decomposition Corridor, Z = 0)
      // -----------------------------------------------------------------------
      const zStation1 = 0;

      // 1. Jacket Shell (Golden Translucent Outer Shell)
      renderClothingGroup(jacketPanels, zStation1, -35, -15, 80, 1.0);
      renderButtons(jacketButtons, zStation1, -35, -15, 80);

      // 2. Silk Twill Canvas & Lining (Emerald Translucent Structural Layer)
      renderClothingGroup(liningPanels, zStation1, 30, -8, 20, 0.9);

      // 3. Base Cotton Polo (Sapphire Blue Translucent Base Core)
      renderClothingGroup(poloPanels, zStation1, 0, 0, -50, 0.85);

      // 4. Tapered Pleated Trousers (Amber Translucent Creased Pants)
      renderClothingGroup(trousersPanels, zStation1, -25, 30, -95, 0.95);

      // 5. Handcrafted Calfskin Loafers (Rose Gold Translucent Footwear)
      renderClothingGroup(loafersPanels, zStation1, 35, 60, -140, 0.9);

      // -----------------------------------------------------------------------
      // STAGE 2: SECOND SARTORIAL SET IN DEEP PERSPECTIVE (Z = -950)
      // Greets camera as user dives past middle catalog into styling guide!
      // -----------------------------------------------------------------------
      const zStation2 = -950;
      renderClothingGroup(jacketPanels, zStation2, 35, -10, 70, 0.85);
      renderButtons(jacketButtons, zStation2, 35, -10, 70);
      renderClothingGroup(liningPanels, zStation2, -30, -6, 15, 0.8);
      renderClothingGroup(poloPanels, zStation2, 0, 0, -45, 0.75);
      renderClothingGroup(trousersPanels, zStation2, 20, 25, -90, 0.85);
      renderClothingGroup(loafersPanels, zStation2, -30, 50, -135, 0.8);

      // -----------------------------------------------------------------------
      // STAGE 3: THIRD DECONSTRUCTED SET (Z = -1900)
      // Greets camera near bottom branches & ordering section!
      // -----------------------------------------------------------------------
      const zStation3 = -1900;
      renderClothingGroup(jacketPanels, zStation3, -30, -12, 75, 0.75);
      renderButtons(jacketButtons, zStation3, -30, -12, 75);
      renderClothingGroup(liningPanels, zStation3, 25, -8, 20, 0.7);
      renderClothingGroup(trousersPanels, zStation3, -20, 25, -85, 0.75);
      renderClothingGroup(loafersPanels, zStation3, 25, 45, -130, 0.7);

      // =======================================================================
      // 4. RENDER 3D SARTORIAL HUD LABELS & MEASURING CROSSHAIRS
      // =======================================================================
      sartorialHudMarkers.forEach((marker) => {
        let x = marker.pos[0] * (1 + decompExplosion * 0.35);
        let y = marker.pos[1];
        let z = zStation1 + marker.pos[2];

        [x, y, z] = rotateX(x, y, z, rotX);
        [x, y, z] = rotateY(x, y, z, rotY);

        const proj = project(x, y, z, camX, camY, camZ, fov, cx, cy);
        if (proj && proj.x >= 20 && proj.x <= w - 20 && proj.y >= 20 && proj.y <= h - 20) {
          const nearFade = Math.min(1, Math.max(0, (proj.depth - 35) / 120));
          const farFade = Math.min(1, Math.max(0, 1 - proj.depth / 1500));
          const netAlpha = nearFade * farFade;

          if (netAlpha > 0.05) {
            const { x: px, y: py, scale } = proj;

            ctx.save();
            ctx.globalAlpha = netAlpha;

            // Reticle Target Node
            ctx.strokeStyle = marker.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(px, py, 3.5 * scale, 0, Math.PI * 2);
            ctx.stroke();

            // Technical Leader Trajectory
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + 22, py - 12);
            ctx.lineTo(px + 52, py - 12);
            ctx.stroke();

            // Label text
            ctx.fillStyle = marker.color;
            ctx.font = `600 ${Math.max(9, Math.round(10.5 * scale))}px "IBM Plex Mono", monospace`;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
            ctx.shadowBlur = 8;
            ctx.fillText(marker.text, px + 56, py - 9);
            ctx.restore();
          }
        }
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Update target scroll in state on scroll
  useEffect(() => {
    const onScroll = () => {
      stateRef.current.scroll = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
        style={{ opacity: 0.95 }}
      />
    </div>
  );
}
