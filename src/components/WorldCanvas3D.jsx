import React, { useEffect, useRef } from 'react';

export default function WorldCanvas3D({ scrollProgress = 0 }) {
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
    // 3D SARTORIAL DECOMPOSITION GEOMETRY (KIYIM DEKOMPOZITSIYASI)
    // =========================================================================
    // Layer 1: Tailored Jacket / Blouson Shell (Pidjak/Kurtka tashqi qatlami)
    const jacketShellPaths = [
      // Left front panel & lapel
      [[-8, -135, 0], [-45, -130, 0], [-105, -95, 0], [-125, -25, 0], [-115, 75, 0], [-55, 95, 0], [-10, 85, 0], [-10, -50, 0], [-35, -75, 0], [-8, -135, 0]],
      // Right front panel & lapel
      [[8, -135, 0], [45, -130, 0], [105, -95, 0], [125, -25, 0], [115, 75, 0], [55, 95, 0], [10, 85, 0], [10, -50, 0], [35, -75, 0], [8, -135, 0]],
      // Collar back contour
      [[-45, -130, 0], [-25, -150, -15], [0, -153, -20], [25, -150, -15], [45, -130, 0]],
      // Left sleeve contour
      [[-105, -95, 0], [-150, -30, -10], [-160, 60, -15], [-130, 75, -15], [-115, 20, -5], [-125, -25, 0]],
      // Right sleeve contour
      [[105, -95, 0], [150, -30, -10], [160, 60, -15], [130, 75, -15], [115, 20, -5], [125, -25, 0]],
      // Left breast welt pocket
      [[-35, -25, 5], [-75, -20, 5], [-75, -12, 5], [-35, -17, 5], [-35, -25, 5]],
      // Left lower flap pocket
      [[-45, 40, 5], [-95, 45, 5], [-95, 58, 5], [-45, 53, 5], [-45, 40, 5]],
      // Right lower flap pocket
      [[45, 40, 5], [95, 45, 5], [95, 58, 5], [45, 53, 5], [45, 40, 5]],
      // Center buttons
      [[0, -10, 8], [0, -6, 8]],
      [[0, 30, 8], [0, 34, 8]]
    ];

    // Layer 2: Floating Silk Twill Lining & Floating Canvas (Ichki ipak astar va qovurg'a)
    const liningPaths = [
      // Left lining panel (slight offset & dashed silk texture)
      [[-10, -120, -25], [-40, -115, -25], [-85, -85, -25], [-100, -20, -25], [-90, 65, -25], [-45, 80, -25], [-10, 75, -25], [-10, -120, -25]],
      // Right lining panel
      [[10, -120, -25], [40, -115, -25], [85, -85, -25], [100, -20, -25], [90, 65, -25], [45, 80, -25], [10, 75, -25], [10, -120, -25]],
      // Internal passport pocket
      [[-25, 10, -20], [-60, 15, -20], [-60, 45, -20], [-25, 40, -20], [-25, 10, -20]],
      // Sartorial canvas cross-hatch structure
      [[-35, -60, -22], [-70, -20, -22]],
      [[-30, -30, -22], [-65, 10, -22]],
      [[35, -60, -22], [70, -20, -22]],
      [[30, -30, -22], [65, 10, -22]]
    ];

    // Layer 3: Base Cotton Polo / T-Shirt Contour (Baza qatlami)
    const basePoloPaths = [
      // Collar / Ribbed neckline
      [[-32, -125, -45], [-15, -105, -40], [0, -100, -38], [15, -105, -40], [32, -125, -45]],
      // Placket front
      [[0, -100, -38], [0, -45, -38]],
      // Torso outline
      [[-32, -125, -45], [-75, -95, -50], [-70, 70, -50], [70, 70, -50], [75, -95, -50], [32, -125, -45]],
      // Short sleeves
      [[-75, -95, -50], [-105, -55, -55], [-85, -45, -55], [-72, -60, -50]],
      [[75, -95, -50], [105, -55, -55], [85, -45, -55], [72, -60, -50]]
    ];

    // Layer 4: Tapered Trousers with Sartorial Crease (Shim qatlami)
    const trousersPaths = [
      // Waistband
      [[-58, 100, -20], [58, 100, -20], [54, 115, -20], [-54, 115, -20], [-58, 100, -20]],
      // Fly front seam
      [[0, 115, -18], [0, 145, -18]],
      // Left leg outline
      [[-54, 115, -20], [-60, 190, -15], [-50, 275, -10], [-22, 275, -10], [-12, 190, -15], [0, 150, -18]],
      // Right leg outline
      [[54, 115, -20], [60, 190, -15], [50, 275, -10], [22, 275, -10], [12, 190, -15], [0, 150, -18]],
      // Center sharp crease lines (dazmol chiziqlari)
      [[-36, 120, -15], [-36, 275, -8]],
      [[36, 120, -15], [36, 275, -8]]
    ];

    // Layer 5: Handcrafted Loafers & Soles (Poyabzal qatlami)
    const loafersPaths = [
      // Left loafer profile
      [[-46, 290, 15], [-20, 290, 15], [-16, 315, 25], [-26, 335, 30], [-46, 335, 30], [-52, 315, 25], [-46, 290, 15]],
      // Left strap saddle
      [[-48, 308, 22], [-22, 308, 22]],
      // Right loafer profile
      [[46, 290, 15], [20, 290, 15], [16, 315, 25], [26, 335, 30], [46, 335, 30], [52, 315, 25], [46, 290, 15]],
      // Right strap saddle
      [[48, 308, 22], [22, 308, 22]]
    ];

    // 3D Decomposition Labels with World Coordinates
    const decompMarkers = [
      { text: "01 // VIRGIN WOOL SHELL", pos: [-155, -80, 45], color: "#E5C378" },
      { text: "02 // BEMBERG SILK LINING", pos: [145, -30, -15], color: "#4fc79a" },
      { text: "03 // GIZA COTTON POLO", pos: [-130, 20, -45], color: "#60a5fa" },
      { text: "04 // TAPERED CHINOS", pos: [120, 180, -20], color: "#f59e0b" },
      { text: "05 // HANDMADE LOAFER", pos: [-110, 315, 20], color: "#ec4899" }
    ];

    // 3D Infinite Perspective Tunnel Rings (Concentric flight hoops)
    const tunnelRings = [];
    for (let r = 0; r < 9; r++) {
      tunnelRings.push({
        z: r * 280 - 600,
        radius: 320 + r * 35,
        color: r % 2 === 0 ? 'rgba(229,195,120,0.18)' : 'rgba(255,255,255,0.08)'
      });
    }

    // 3D Boutique Nodes (Tashkent 3-Node Physical Network)
    const boutiqueNodes = [
      { name: "Qoratosh Meratto", pos: [-240, 60, -120], color: '#E5C378' },
      { name: "Chilonzor Meratto", pos: [220, 120, -80], color: '#4fc79a' },
      { name: "De Franko", pos: [0, -180, -150], color: '#E5C378' }
    ];

    // 3D High-Velocity Spatial Warp Thread Particles
    const particleCount = 850;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2400,
        y: (Math.random() - 0.5) * 2400,
        z: Math.random() * 2600 - 800,
        speed: Math.random() * 3.2 + 1.5,
        size: Math.random() * 1.8 + 0.6,
        color: Math.random() > 0.75 ? 'rgba(229,195,120,0.7)' : 'rgba(255,255,255,0.4)'
      });
    }

    // =========================================================================
    // 3D ROTATION & PROJECTION ENGINE
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

    const rotateZ = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos - y * sin, x * sin + y * cos, z];
    };

    // Project 3D point into screen coordinates with camera depth
    const project = (x, y, z, camX, camY, camZ, fov, cx, cy) => {
      const relX = x - camX;
      const relY = y - camY;
      const relZ = z - camZ;

      if (relZ <= 10) return null; // Behind camera plane
      const scale = fov / relZ;
      return {
        x: cx + relX * scale,
        y: cy + relY * scale,
        scale,
        depth: relZ
      };
    };

    // Camera inertia
    let camX = 0;
    let camY = 0;
    let camZ = 650;
    let rotX = 0;
    let rotY = 0;

    // =========================================================================
    // 60 FPS 3D RENDER LOOP
    // =========================================================================
    const render = () => {
      animationId = requestAnimationFrame(render);
      time += 0.015;

      const w = stateRef.current.width;
      const h = stateRef.current.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const fov = 620;

      // Mouse inertia damping
      const mouse = stateRef.current.mouse;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Normalized Scroll Progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const targetScroll = stateRef.current.scroll;
      const scrollNorm = Math.min(1, Math.max(0, targetScroll / docHeight));

      ctx.clearRect(0, 0, w, h);

      // =======================================================================
      // 3D CAMERA FLIGHT: DIVE THROUGH THE CLOTHES (ICHKARIGA KIRIB BORISH)
      // =======================================================================
      // As scroll increases, the camera dives deep into the screen:
      // Hero (0.0): camZ = 620 (looking at full assembled outfit)
      // Decomposition (0.15 - 0.40): camZ dives to 320, decomposition explodes outward
      // Catalog (0.40 - 0.65): camZ dives to 80 (plunging directly through jacket into tunnel!)
      // Fashion Guide (0.65 - 0.85): camera flies through silk spiral rings
      // Branches (0.85 - 1.0): camera locks onto 3 Tashkent nodes
      let targetCamX = mouse.x * 70;
      let targetCamY = mouse.y * 50;
      let targetCamZ = 620;
      let targetRotY = Math.sin(time * 0.2) * 0.15 + mouse.x * 0.4;
      let targetRotX = mouse.y * 0.25;
      let decompExplosionFactor = 0.3; // Base exploded distance

      if (scrollNorm < 0.25) {
        // HERO STAGE
        const p = scrollNorm / 0.25;
        targetCamZ = 620 - p * 220; // 620 -> 400
        decompExplosionFactor = 0.25 + p * 0.65;
        targetRotY = mouse.x * 0.4 + p * 0.2;
      } else if (scrollNorm < 0.55) {
        // CATALOG STAGE: CAMERA PLUNGES DEEP INSIDE!
        const p = (scrollNorm - 0.25) / 0.30;
        targetCamZ = 400 - p * 380; // 400 -> 20! (Right through the deconstructed jacket!)
        targetCamX = Math.sin(p * Math.PI) * 120 + mouse.x * 40;
        targetCamY = p * -60 + mouse.y * 30;
        decompExplosionFactor = 0.9 + p * 1.4; // Maximum spatial explosion
        targetRotY = p * 0.45 + mouse.x * 0.3;
      } else if (scrollNorm < 0.80) {
        // FASHION GUIDE: Camera navigates the silk twill corridor
        const p = (scrollNorm - 0.55) / 0.25;
        targetCamZ = 20 + p * 340; // 20 -> 360
        targetCamX = -90 + p * 180 + mouse.x * 40;
        decompExplosionFactor = 1.6 - p * 0.7;
        targetRotY = time * 0.3 + p * 0.8;
      } else {
        // BRANCHES & ORDER: Locking onto architectural nodes
        const p = (scrollNorm - 0.80) / 0.20;
        targetCamZ = 360 - p * 80;
        targetCamX = mouse.x * 30;
        targetCamY = mouse.y * 30;
        decompExplosionFactor = 0.6;
      }

      // Smooth camera interpolation
      camX += (targetCamX - camX) * 0.06;
      camY += (targetCamY - camY) * 0.06;
      camZ += (targetCamZ - camZ) * 0.06;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      // =======================================================================
      // 1. DRAW 3D WARP THREAD PARTICLES (Speed Tunnel Flight)
      // =======================================================================
      const warpSpeed = 1.2 + scrollNorm * 6.5;

      for (let i = 0; i < particleCount; i++) {
        const pt = particles[i];
        pt.z -= pt.speed * warpSpeed;

        // Reset particle when passing camera
        if (pt.z < -camZ - 20) {
          pt.z = 2000;
          pt.x = (Math.random() - 0.5) * 2400;
          pt.y = (Math.random() - 0.5) * 2400;
        }

        const proj = project(pt.x, pt.y, pt.z, camX, camY, -camZ, fov, cx, cy);
        if (proj && proj.x >= -50 && proj.x <= w + 50 && proj.y >= -50 && proj.y <= h + 50) {
          const alpha = Math.min(1, Math.max(0.04, 1 - proj.depth / 2400));
          const pSize = Math.max(0.6, pt.size * proj.scale * 1.5);

          ctx.fillStyle = pt.color;
          ctx.globalAlpha = alpha * 0.75;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, pSize, 0, Math.PI * 2);
          ctx.fill();

          // Spatial warp streaks when diving
          if (warpSpeed > 2.5 && pSize > 1.2) {
            ctx.strokeStyle = pt.color;
            ctx.lineWidth = pSize * 0.5;
            ctx.beginPath();
            ctx.moveTo(proj.x, proj.y);
            ctx.lineTo(
              proj.x - (camX * 0.015) * warpSpeed,
              proj.y - (pt.speed * warpSpeed * 1.8)
            );
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // =======================================================================
      // 2. DRAW 3D PERSPECTIVE TUNNEL HOOPS (Diving Ring Portals)
      // =======================================================================
      tunnelRings.forEach((ring, idx) => {
        // Move ring with tunnel depth
        let ringZ = ring.z - ((time * 40 + scrollNorm * 1200) % 1800);
        if (ringZ < -camZ - 100) ringZ += 1800;

        const segs = 48;
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        let started = false;

        for (let s = 0; s <= segs; s++) {
          const theta = (s / segs) * Math.PI * 2;
          let rx = Math.cos(theta) * ring.radius;
          let ry = Math.sin(theta) * (ring.radius * 0.85); // Oval perspective
          let rz = ringZ;

          [rx, ry, rz] = rotateX(rx, ry, rz, rotX * 0.3);
          [rx, ry, rz] = rotateY(rx, ry, rz, rotY * 0.3);

          const proj = project(rx, ry, rz, camX, camY, -camZ, fov, cx, cy);
          if (proj) {
            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        ctx.stroke();
      });

      // =======================================================================
      // 3. DRAW 3D SARTORIAL DECOMPOSITION LAYERS (KIYIM DEKOMPOZITSIYASI)
      // =======================================================================
      // Helper function to render a set of 3D paths for a clothing layer
      const renderDecompLayer = (paths, zOffset, xOffset, yOffset, strokeStyle, lineWidth, isDashed = false) => {
        ctx.save();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        if (isDashed && ctx.setLineDash) {
          ctx.setLineDash([4, 6]);
        }

        paths.forEach(path => {
          ctx.beginPath();
          let started = false;

          path.forEach(pt => {
            // Apply layer-specific exploded offsets
            let x = pt[0] + xOffset * decompExplosionFactor;
            let y = pt[1] + yOffset * decompExplosionFactor;
            let z = pt[2] + zOffset * decompExplosionFactor;

            // Apply 3D global rotation
            [x, y, z] = rotateX(x, y, z, rotX);
            [x, y, z] = rotateY(x, y, z, rotY);

            const proj = project(x, y, z, camX, camY, -camZ, fov, cx, cy);
            if (proj) {
              if (!started) {
                ctx.moveTo(proj.x, proj.y);
                started = true;
              } else {
                ctx.lineTo(proj.x, proj.y);
              }
            }
          });
          ctx.stroke();
        });
        ctx.restore();
      };

      // Layer 1: Jacket Shell (Front & most prominent in Gold)
      renderDecompLayer(
        jacketShellPaths,
        90,   // zOffset forward
        -30,  // xOffset left
        -15,  // yOffset up
        'rgba(229, 195, 120, 0.65)', // Meratto Gold
        1.5
      );

      // Layer 2: Floating Silk Twill Lining & Canvas (Cyan / Emerald structural layer)
      renderDecompLayer(
        liningPaths,
        15,   // mid-depth
        25,   // xOffset right
        -8,
        'rgba(79, 199, 154, 0.45)', // Silk Emerald
        1.0,
        true  // dashed tailoring stitch
      );

      // Layer 3: Base Polo / T-Shirt (Sapphire Blue core)
      renderDecompLayer(
        basePoloPaths,
        -40,  // center base
        0,
        0,
        'rgba(96, 165, 250, 0.4)',  // Sapphire Blue
        1.1
      );

      // Layer 4: Tapered Trousers with Sharp Crease (Amber Gold lower)
      renderDecompLayer(
        trousersPaths,
        -90,  // deeper Z
        -20,
        35,   // lower Y
        'rgba(245, 158, 11, 0.5)',  // Amber
        1.3
      );

      // Layer 5: Calfskin Loafers (Rose Gold base)
      renderDecompLayer(
        loafersPaths,
        -140, // deepest Z
        30,
        70,   // lowest Y
        'rgba(236, 72, 153, 0.55)', // Rose Gold
        1.4
      );

      // =======================================================================
      // 4. DRAW 3D DECOMPOSITION LABELS & MEASURING CROSSHAIRS
      // =======================================================================
      decompMarkers.forEach((marker, mIdx) => {
        let x = marker.pos[0] * (1 + decompExplosionFactor * 0.35);
        let y = marker.pos[1];
        let z = marker.pos[2] + (mIdx % 2 === 0 ? 50 : -50) * decompExplosionFactor;

        [x, y, z] = rotateX(x, y, z, rotX);
        [x, y, z] = rotateY(x, y, z, rotY);

        const proj = project(x, y, z, camX, camY, -camZ, fov, cx, cy);
        if (proj && proj.x >= 20 && proj.x <= w - 20 && proj.y >= 20 && proj.y <= h - 20) {
          const { x: px, y: py, scale } = proj;

          // Crosshair target node
          ctx.strokeStyle = marker.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, 3.5 * scale, 0, Math.PI * 2);
          ctx.stroke();

          // Connecting trajectory leader line
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + 20, py - 12);
          ctx.lineTo(px + 50, py - 12);
          ctx.stroke();

          // 3D HUD Annotation Text
          ctx.save();
          ctx.fillStyle = marker.color;
          ctx.font = `600 ${Math.max(9, Math.round(10.5 * scale))}px "IBM Plex Mono", monospace`;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = 8;
          ctx.fillText(marker.text, px + 55, py - 9);
          ctx.restore();
        }
      });

      // =======================================================================
      // 5. DRAW 3D TASHKENT BOUTIQUE RADAR NODES
      // =======================================================================
      boutiqueNodes.forEach((node) => {
        let x = node.pos[0];
        let y = node.pos[1];
        let z = node.pos[2];

        [x, y, z] = rotateX(x, y, z, rotX);
        [x, y, z] = rotateY(x, y, z, rotY);

        const proj = project(x, y, z, camX, camY, -camZ, fov, cx, cy);
        if (proj) {
          const { x: px, y: py, scale } = proj;

          // Pulsing radar wave
          const pulse = (time * 1.8) % 1;
          const waveRadius = (6 + pulse * 24) * scale;

          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(px, py, 4 * scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = node.color;
          ctx.globalAlpha = Math.max(0, 0.7 - pulse);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, waveRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Label
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.font = '600 10px "IBM Plex Mono", monospace';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 6;
          ctx.fillText(node.name, px + 12, py + 3);
          ctx.restore();
          ctx.globalAlpha = 1;
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
