'use client';

import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface ShootingStar {
  id: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}

export const StarfieldBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate static random star positions once on mount to avoid SSR hydration mismatch
    const generatedStars: Star[] = Array.from({ length: 85 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1.8,
      opacity: 0.2 + Math.random() * 0.6,
      duration: 3 + Math.random() * 4,
      delay: -Math.random() * 6,
    }));
    setStars(generatedStars);

    const generatedShooting: ShootingStar[] = [
      { id: 1, top: 6, left: 75, duration: 11, delay: 2 },
      { id: 2, top: 22, left: 90, duration: 14, delay: 7 },
      { id: 3, top: 4, left: 40, duration: 16, delay: 13 },
      { id: 4, top: 35, left: 82, duration: 13, delay: 9 },
    ];
    setShootingStars(generatedShooting);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
      suppressHydrationWarning
    >
      {/* Deep Obsidian Radial Background Tint */}
      <div className="absolute inset-0 bg-[#0b0b0d] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,80,30,0.12),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,50,90,0.08),transparent_60%)]" />

      {/* Twinkling Stars rendered only after mount */}
      {mounted && stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white transition-opacity animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 2 ? '0 0 6px rgba(255,255,255,0.8)' : 'none',
          }}
        />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map((ss) => (
        <span
          key={ss.id}
          className="absolute h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-200 to-transparent animate-shooting-star"
          style={{
            top: `${ss.top}%`,
            left: `${ss.left}%`,
            animationDuration: `${ss.duration}s`,
            animationDelay: `${ss.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
