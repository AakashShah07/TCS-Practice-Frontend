"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
}

interface AuthParticlesProps {
  /** "blue" for left panel (login/register), "subtle" for right panel background */
  variant?: "blue" | "subtle";
  className?: string;
}

export default function AuthParticles({ variant = "subtle", className = "" }: AuthParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const createParticles = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 12000);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const baseOpacity = 0.15 + Math.random() * 0.25;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.5 + Math.random() * 2,
        opacity: baseOpacity,
        baseOpacity,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas!.width = w * devicePixelRatio;
      canvas!.height = h * devicePixelRatio;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      particlesRef.current = createParticles(w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const isBlue = variant === "blue";
    const particleColor = isBlue ? "255,255,255" : "";
    const connectionDistance = 120;
    const mouseRadius = 150;

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Detect dark mode from the html element
      const isDark = document.documentElement.classList.contains("dark");
      const dotColor = isBlue ? particleColor : isDark ? "148,163,184" : "100,116,139";
      const lineColor = isBlue ? particleColor : isDark ? "148,163,184" : "100,116,139";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse attraction / repulsion
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          // Gentle attraction toward cursor
          p.vx += dx * force * 0.003;
          p.vy += dy * force * 0.003;
          p.opacity = Math.min(1, p.baseOpacity + force * 0.5);
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.02;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw particle
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${dotColor},${p.opacity})`;
        ctx!.fill();

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < connectionDistance) {
            const lineOpacity = (1 - cdist / connectionDistance) * 0.15;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(${lineColor},${lineOpacity})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }

        // Draw connection to mouse
        if (dist < mouseRadius) {
          const lineOpacity = (1 - dist / mouseRadius) * 0.3;
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(mx, my);
          ctx!.strokeStyle = isBlue
            ? `rgba(255,255,255,${lineOpacity})`
            : isDark
              ? `rgba(99,102,241,${lineOpacity})`
              : `rgba(37,99,235,${lineOpacity})`;
          ctx!.lineWidth = 0.6;
          ctx!.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [variant, createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
