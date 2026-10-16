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
    // 3D GEOMETRY DEFINITIONS (WOUFX WORLD MODEL)
    // =========================================================================

    // 1. 3D Icosahedron Vertices & Edges (Core Luxury Gem)
    const tVal = (1 + Math.sqrt(5)) / 2;
    const rawIcoVerts = [
      [-1, tVal, 0], [1, tVal, 0], [-1, -tVal, 0], [1, -tVal, 0],
      [0, -1, tVal], [0, 1, tVal], [0, -1, -tVal], [0, 1, -tVal],
      [tVal, 0, -1], [tVal, 0, 1], [-tVal, 0, -1], [-tVal, 0, 1]
    ];
    // Normalize to radius 160
    const icoRadius = 155;
    const icoVertices = rawIcoVerts.map(v => {
      const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
      return [v[0]/len * icoRadius, v[1]/len * icoRadius, v[2]/len * icoRadius];
    });

    const icoEdges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [1, 7], [1, 8], [1, 9],
      [2, 11], [2, 4], [2, 3], [2, 6], [2, 10],
      [3, 4], [3, 6], [3, 8], [3, 9],
      [4, 5], [4, 9], [4, 11],
      [5, 9], [5, 11],
      [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10],
      [8, 9],
      [10, 11]
    ];

    // 2. Latitude / Longitude 3D Rings
    const latRings = [-60, -30, 0, 30, 60].map(deg => {
      const rad = deg * Math.PI / 180;
      const y = Math.sin(rad) * 195;
      const r = Math.cos(rad) * 195;
      const points = [];
      const segs = 36;
      for (let i = 0; i < segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        points.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
      }
      return points;
    });

    // 3. Concentric Orbital Rings (Astrolabe)
    const orbitalRings = [
      { radius: 240, tiltX: 0.75, tiltY: 0.3, speed: 0.4, color: 'rgba(229, 195, 120, 0.45)', dash: [6, 10] },
      { radius: 285, tiltX: -0.6, tiltY: 0.8, speed: -0.3, color: 'rgba(79, 199, 154, 0.4)', dash: [4, 8] },
      { radius: 330, tiltX: 0.4, tiltY: -0.5, speed: 0.25, color: 'rgba(229, 195, 120, 0.3)', dash: [8, 14] }
    ];

    // 4. Tashkent 3-Boutique Nodes
    const boutiqueNodes = [
      { name: "Qoratosh Node", phi: 0.65, theta: 0.85, color: '#E5C378' },
      { name: "Chilonzor-1 Node", phi: 0.95, theta: 1.15, color: '#4fc79a' },
      { name: "Chilonzor-3 Node", phi: 1.25, theta: 0.65, color: '#4fc79a' }
    ];

    // 5. 3D Infinite Tunnel Star Particles (900 particles)
    const particleCount = 850;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 2200,
        z: Math.random() * 2200 - 800,
        speed: Math.random() * 2.8 + 1.2,
        size: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.8 ? 'rgba(229,195,120,0.7)' : 'rgba(255,255,255,0.45)'
      });
    }

    // =========================================================================
    // 3D ROTATION & PROJECTION HELPERS
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

    // Project [x, y, z] in world coordinates to 2D screen [sx, sy, scale, zDepth]
    const project = (x, y, z, camX, camY, camZ, fov, cx, cy) => {
      const relX = x - camX;
      const relY = y - camY;
      const relZ = z - camZ;

      if (relZ <= 10) return null; // Behind camera
      const scale = fov / relZ;
      return {
        x: cx + relX * scale,
        y: cy + relY * scale,
        scale,
        depth: relZ
      };
    };

    // Smooth inertia variables
    let camX = 0;
    let camY = 0;
    let camZ = 650;
    let rotX = 0;
    let rotY = 0;

    // =========================================================================
    // MAIN RENDER LOOP (60 FPS)
    // =========================================================================
    const render = () => {
      animationId = requestAnimationFrame(render);
      time += 0.015;

      const w = stateRef.current.width;
      const h = stateRef.current.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const fov = 580;

      // Smooth mouse damping
      const mouse = stateRef.current.mouse;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Compute Normalized Scroll (0.0 to 1.0)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const targetScroll = stateRef.current.scroll;
      const scrollNorm = Math.min(1, Math.max(0, targetScroll / docHeight));

      // Clear Canvas
      ctx.clearRect(0, 0, w, h);

      // =======================================================================
      // WOUFX STAGE-BASED 3D CAMERA DEPTH & MORPHING
      // =======================================================================
      // Section 1 (Hero - 0 to 0.20): Elegant hovering 3D globe
      // Section 2 (Catalog - 0.20 to 0.48): Camera plunges directly through core!
      // Section 3 (Style Guide - 0.48 to 0.72): Morphs into rotating silk rings
      // Section 4 (Branches - 0.72 to 0.88): Locks onto 3 Tashkent Boutique radar nodes
      // Section 5 (Order - 0.88 to 1.0): Precision golden targeting circles

      let targetCamX = mouse.x * 60;
      let targetCamY = mouse.y * 40;
      let targetCamZ = 650;
      let targetRotY = time * 0.25;
      let targetRotX = time * 0.12 + mouse.y * 0.2;
      let globeScale = 1;

      if (scrollNorm < 0.20) {
        // STAGE 1: HERO
        const p = scrollNorm / 0.20;
        targetCamZ = 650 - p * 180; // 650 -> 470
        targetCamX += (1 - p) * 80;
        globeScale = 1;
      } else if (scrollNorm < 0.48) {
        // STAGE 2: CATALOG (CAMERA PLUNGES DEEP INTO 3D TUNNEL!)
        const p = (scrollNorm - 0.20) / 0.28;
        targetCamZ = 470 - p * 340; // 470 -> 130! (Diving inside!)
        targetCamX = Math.sin(p * Math.PI) * 140 + mouse.x * 50;
        targetCamY = p * -90 + mouse.y * 40;
        globeScale = 1 + p * 1.2; // Expands outward around screen
      } else if (scrollNorm < 0.72) {
        // STAGE 3: FASHION STYLE ACADEMY (Silk helical morph)
        const p = (scrollNorm - 0.48) / 0.24;
        targetCamZ = 130 + p * 260; // 130 -> 390
        targetCamX = -120 + p * 220 + mouse.x * 40;
        targetCamY = 50 + Math.sin(p * Math.PI) * 70;
        targetRotY = time * 0.4 + p * Math.PI * 1.5;
        globeScale = 0.95;
      } else if (scrollNorm < 0.88) {
        // STAGE 4: TASHKENT BOUTIQUES (Radar Lock on Nodes)
        const p = (scrollNorm - 0.72) / 0.16;
        targetCamZ = 390 - p * 60; // 390 -> 330
        targetCamX = 80 - p * 150;
        targetCamY = -40 + p * 50;
        // Lock rotation directly facing the 3 Tashkent boutique nodes
        targetRotY = 1.35 + p * 0.5;
        targetRotX = 0.45;
        globeScale = 1.05;
      } else {
        // STAGE 5: ORDER TERMINAL (Precision alignment)
        const p = (scrollNorm - 0.88) / 0.12;
        targetCamZ = 330 - p * 50;
        targetCamX = 0;
        targetCamY = 0;
        globeScale = 0.9 + p * 0.15;
      }

      // Smooth camera interpolation (WOUFX fluid damping)
      camX += (targetCamX - camX) * 0.07;
      camY += (targetCamY - camY) * 0.07;
      camZ += (targetCamZ - camZ) * 0.07;
      rotX += (targetRotX - rotX) * 0.06;
      rotY += (targetRotY - rotY) * 0.06;

      // =======================================================================
      // 1. DRAW 3D INFINITE TUNNEL WARP PARTICLES (Rushing past camera)
      // =======================================================================
      const warpSpeed = 1 + scrollNorm * 5.5; // High-speed tunnel flight!

      for (let i = 0; i < particleCount; i++) {
        const pt = particles[i];
        pt.z -= pt.speed * warpSpeed; // Flying forward towards viewer

        // Recycle when passing behind camera
        if (pt.z < -camZ + 20) {
          pt.z = 1800;
          pt.x = (Math.random() - 0.5) * 2200;
          pt.y = (Math.random() - 0.5) * 2200;
        }

        const proj = project(pt.x, pt.y, pt.z, camX, camY, -camZ, fov, cx, cy);
        if (proj && proj.x >= 0 && proj.x <= w && proj.y >= 0 && proj.y <= h) {
          const alpha = Math.min(1, Math.max(0.05, 1 - proj.depth / 2400));
          const pSize = Math.max(0.6, pt.size * proj.scale * 1.4);

          ctx.fillStyle = pt.color;
          ctx.globalAlpha = alpha * 0.8;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, pSize, 0, Math.PI * 2);
          ctx.fill();

          // Speed streak for nearest high-velocity particles
          if (warpSpeed > 2 && pSize > 1.4) {
            ctx.strokeStyle = pt.color;
            ctx.lineWidth = pSize * 0.6;
            ctx.beginPath();
            ctx.moveTo(proj.x, proj.y);
            ctx.lineTo(proj.x - (camX * 0.02) * warpSpeed, proj.y - (camY * 0.02) * warpSpeed - (pt.speed * warpSpeed * 1.2));
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // =======================================================================
      // 2. TRANSFORM & DRAW 3D LUXURY GLOBE & POLYHEDRON
      // =======================================================================
      // Transform 3D Icosahedron vertices
      const transformedVerts = icoVertices.map(v => {
        let x = v[0] * globeScale;
        let y = v[1] * globeScale;
        let z = v[2] * globeScale;

        // Apply 3D Rotations
        [x, y, z] = rotateX(x, y, z, rotX);
        [x, y, z] = rotateY(x, y, z, rotY);
        [x, y, z] = rotateZ(x, y, z, time * 0.05);

        return {
          world: [x, y, z],
          proj: project(x, y, z, camX, camY, -camZ, fov, cx, cy)
        };
      });

      // Draw Polyhedron Edges in Gold & Metallic Wireframe
      ctx.strokeStyle = scrollNorm > 0.45 && scrollNorm < 0.72 
        ? 'rgba(59, 130, 246, 0.35)' // Sapphire in fashion guide
        : scrollNorm >= 0.72 && scrollNorm < 0.88
        ? 'rgba(79, 199, 154, 0.4)'  // Emerald in branches
        : 'rgba(229, 195, 120, 0.32)'; // Signature Gold in Hero/Catalog
      ctx.lineWidth = 1;

      icoEdges.forEach(([i1, i2]) => {
        const p1 = transformedVerts[i1]?.proj;
        const p2 = transformedVerts[i2]?.proj;
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Draw Polyhedron Vertices (Golden Glowing Nodes)
      transformedVerts.forEach(v => {
        if (v.proj) {
          const r = Math.max(1.2, 2.8 * v.proj.scale);
          ctx.fillStyle = '#E5C378';
          ctx.beginPath();
          ctx.arc(v.proj.x, v.proj.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // =======================================================================
      // 3. DRAW 3D LATITUDE RINGS (Globe Wireframe)
      // =======================================================================
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 0.8;

      latRings.forEach(ring => {
        ctx.beginPath();
        let started = false;

        ring.forEach(pt => {
          let x = pt[0] * globeScale;
          let y = pt[1] * globeScale;
          let z = pt[2] * globeScale;

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
        ctx.closePath();
        ctx.stroke();
      });

      // =======================================================================
      // 4. DRAW CONCENTRIC ORBITAL RINGS (Astrolabe Rotations)
      // =======================================================================
      orbitalRings.forEach((orb, oIdx) => {
        ctx.save();
        ctx.strokeStyle = orb.color;
        ctx.lineWidth = 1.2;
        if (ctx.setLineDash) ctx.setLineDash(orb.dash);

        ctx.beginPath();
        const segs = 60;
        let started = false;

        for (let i = 0; i <= segs; i++) {
          const theta = (i / segs) * Math.PI * 2;
          let x = Math.cos(theta) * orb.radius * globeScale;
          let y = 0;
          let z = Math.sin(theta) * orb.radius * globeScale;

          // Orbit tilt rotations
          [x, y, z] = rotateX(x, y, z, orb.tiltX);
          [x, y, z] = rotateY(x, y, z, orb.tiltY + time * orb.speed);
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
        }
        ctx.stroke();
        ctx.restore();
      });

      // =======================================================================
      // 5. DRAW TASHKENT BOUTIQUE RADAR NODES & 3D CONNECTING ARCS
      // =======================================================================
      const projectedNodes = boutiqueNodes.map((node, nIdx) => {
        const radius = 195 * globeScale;
        let x = radius * Math.sin(node.phi) * Math.cos(node.theta);
        let y = radius * Math.cos(node.phi);
        let z = radius * Math.sin(node.phi) * Math.sin(node.theta);

        [x, y, z] = rotateX(x, y, z, rotX);
        [x, y, z] = rotateY(x, y, z, rotY);

        return {
          ...node,
          world: [x, y, z],
          proj: project(x, y, z, camX, camY, -camZ, fov, cx, cy)
        };
      });

      // Draw Arcs between Nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        const next = (i + 1) % projectedNodes.length;
        const n1 = projectedNodes[i].proj;
        const n2 = projectedNodes[next].proj;
        if (n1 && n2) {
          ctx.strokeStyle = 'rgba(229, 195, 120, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          const midX = (n1.x + n2.x) * 0.5;
          const midY = (n1.y + n2.y) * 0.5 - 25; // Arc curvature
          ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);
          ctx.stroke();
        }
      }

      // Draw Boutique Nodes & Pulsing Radar Waves
      projectedNodes.forEach((node) => {
        if (node.proj) {
          const { x, y, scale } = node.proj;

          // Core Node Dot
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(x, y, 4.5 * scale, 0, Math.PI * 2);
          ctx.fill();

          // Radar Wave Rings
          const pulse = (time * 2) % 1;
          const radarRadius = (8 + pulse * 28) * scale;
          ctx.strokeStyle = node.color;
          ctx.globalAlpha = Math.max(0, 0.8 - pulse);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, radarRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Node Label in Branches Section
          if (scrollNorm >= 0.65) {
            ctx.fillStyle = '#eef0f3';
            ctx.font = '10px "IBM Plex Mono", monospace';
            ctx.fillText(node.name, x + 12, y + 4);
          }
          ctx.globalAlpha = 1;
        }
      });
    };

    render();

    // Cleanup
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
