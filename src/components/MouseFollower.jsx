import React, { useEffect, useRef, useState } from 'react';

export default function MouseFollower() {
  const followerRef = useRef(null);
  const dotRef = useRef(null);
  const particlesRef = useRef([]);

  const [isPointerDevice, setIsPointerDevice] = useState(false);

  // Target mouse coordinates and interpolated current coordinates
  const mouse = useRef({ x: -200, y: -200, prevX: -200, prevY: -200, speed: 0 });
  const pos = useRef({ x: -200, y: -200 });
  const dotPos = useRef({ x: -200, y: -200 });

  // Floating particles state
  const particles = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      baseX: Math.random() * 100, // percentage of viewport
      baseY: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      currentX: Math.random() * 100,
      currentY: Math.random() * 100,
      parallaxFactor: (Math.random() * 0.04 + 0.01) * (i % 2 === 0 ? 1 : -1)
    }))
  );

  useEffect(() => {
    // Check if device supports hover/fine pointer
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    setIsPointerDevice(hasFinePointer);

    if (!hasFinePointer) return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - mouse.current.prevX;
      const dy = e.clientY - mouse.current.prevY;
      mouse.current.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.current.prevX = mouse.current.x;
      mouse.current.prevY = mouse.current.y;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;

    const render = () => {
      // Smooth lerp for outer ambient glow (lag factor 0.08)
      pos.current.x += (mouse.current.x - pos.current.x) * 0.08;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.08;

      // Snappier lerp for inner gold dot (lag factor 0.35)
      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.35;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${pos.current.x - 300}px, ${pos.current.y - 300}px, 0)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 12}px, ${dotPos.current.y - 12}px, 0)`;
      }

      // Animate floating gold particles with cursor parallax
      particles.current.forEach((p, idx) => {
        p.currentX += p.speedX;
        p.currentY += p.speedY;

        // Wrap around viewport edges
        if (p.currentX < 0) p.currentX = 100;
        if (p.currentX > 100) p.currentX = 0;
        if (p.currentY < 0) p.currentY = 100;
        if (p.currentY > 100) p.currentY = 0;

        const el = particlesRef.current[idx];
        if (el) {
          const parallaxX = (mouse.current.x - window.innerWidth / 2) * p.parallaxFactor;
          const parallaxY = (mouse.current.y - window.innerHeight / 2) * p.parallaxFactor;
          el.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0)`;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isPointerDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-30">
      {/* 1. Large Ambient Trailing Luminous Halo */}
      <div
        ref={followerRef}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-35 transition-opacity duration-500 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(229,195,120,0.3) 0%, rgba(197,160,89,0.15) 35%, rgba(30,58,138,0.1) 60%, transparent 80%)'
        }}
      />

      {/* 2. Precision Glowing Gold Dot Cursor */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-6 h-6 rounded-full border border-[#E5C378]/60 bg-[#C5A059]/20 backdrop-blur-[2px] shadow-[0_0_15px_#E5C378] will-change-transform flex items-center justify-center"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#E5C378] shadow-[0_0_6px_#FFF]" />
      </div>

      {/* 3. Floating Gold Micro-Particles */}
      {particles.current.map((p, idx) => (
        <div
          key={p.id}
          ref={(el) => (particlesRef.current[idx] = el)}
          className="absolute rounded-full pointer-events-none will-change-transform transition-transform duration-300 ease-out"
          style={{
            left: `${p.currentX}%`,
            top: `${p.currentY}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: '#E5C378',
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px #C5A059`
          }}
        />
      ))}
    </div>
  );
}
