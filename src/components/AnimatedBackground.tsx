"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  opacity: number;
}

const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize particles only once when client is ready
  useEffect(() => {
    if (!isClient) return;
    
    const colors = [
      "rgb(59, 130, 246)",   // blue-500
      "rgb(139, 92, 246)",   // purple-500
      "rgb(236, 72, 153)",   // pink-500
      "rgb(16, 185, 129)",   // emerald-500
      "rgb(245, 158, 11)",   // amber-500
    ];

    // Use seeded random to ensure consistent particle positions
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Use fixed dimensions for initial particle generation to ensure consistency
    const fixedWidth = 1200;
    const fixedHeight = 800;

    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 1.1) * fixedWidth,
      y: seededRandom(i * 2.3) * fixedHeight,
      size: seededRandom(i * 3.7) * 4 + 2,
      color: colors[Math.floor(seededRandom(i * 4.1) * colors.length)],
      velocity: {
        x: (seededRandom(i * 5.2) - 0.5) * 2,
        y: (seededRandom(i * 6.8) - 0.5) * 2,
      },
      opacity: seededRandom(i * 7.9) * 0.5 + 0.2,
    }));

    setParticles(initialParticles);
  }, [isClient]);

  // Handle mouse movement and particle animation
  useEffect(() => {
    if (!isClient || particles.length === 0) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let { x, y } = particle;
          const { velocity } = particle;

          // Update position
          x += velocity.x;
          y += velocity.y;

          // Bounce off walls
          if (x <= 0 || x >= dimensions.width) velocity.x *= -1;
          if (y <= 0 || y >= dimensions.height) velocity.y *= -1;

          // Mouse interaction
          const dx = mousePosition.x - x;
          const dy = mousePosition.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) / 100;
            velocity.x -= Math.cos(angle) * force * 0.5;
            velocity.y -= Math.sin(angle) * force * 0.5;
          }

          // Apply damping
          velocity.x *= 0.99;
          velocity.y *= 0.99;

          return {
            ...particle,
            x: Math.max(0, Math.min(dimensions.width, x)),
            y: Math.max(0, Math.min(dimensions.height, y)),
            velocity,
          };
        })
      );
    };

    const intervalId = setInterval(animateParticles, 50);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(intervalId);
    };
  }, [particles, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/30" />

      {/* Geometric Shapes */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 2 }}
          >
            <motion.div
              className={`w-${20 + i * 10} h-${20 + i * 10} border border-blue-500/20 dark:border-blue-400/20 rounded-full`}
              style={{
                left: `${10 + i * 15}%`,
                top: `${5 + i * 10}%`,
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating Particles */}
      <div suppressHydrationWarning>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full blur-sm"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + particle.id * 0.1, // Use particle.id instead of Math.random()
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full" suppressHydrationWarning>
        {particles.slice(0, 20).map((particle, i) =>
          particles.slice(i + 1, 20).map((otherParticle, j) => {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) +
              Math.pow(particle.y - otherParticle.y, 2)
            );

            if (distance < 150) {
              return (
                <line
                  key={`line-${i}-${j}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={otherParticle.x}
                  y2={otherParticle.y}
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  opacity={Math.max(0, 0.3 - distance / 500)}
                />
              );
            }
            return null;
          })
        )}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AnimatedBackground;