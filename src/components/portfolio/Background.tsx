"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Background() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Seeded random function for consistent positioning
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Reduce particle count on mobile
  const particleCount = isMobile ? 5 : 12;

  // Reduce animation complexity on mobile
  const animationConfig = isMobile
    ? { duration: 12, ease: "linear" }
    : { duration: 8, ease: "easeInOut" };

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Space-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-black" />
      
      {/* Space stars pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-60" suppressHydrationWarning>
        {Array.from({ length: isMobile ? 30 : 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${seededRandom(i * 1.1) * 100}%`,
              top: `${seededRandom(i * 2.3) * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + seededRandom(i * 3.7) * 3,
              repeat: Infinity,
              delay: seededRandom(i * 4.1) * 2,
            }}
          />
        ))}
      </div>

      {/* Space nebula orbs - enhanced for space theme */}
      <motion.div
        className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/25 to-purple-600/25 dark:from-indigo-400/40 dark:to-purple-500/40 rounded-full -z-10 ${isMobile ? 'blur-xl' : 'blur-3xl'
          }`}
        animate={isMobile ? {
          x: [0, 50, 0],
          y: [0, -25, 0],
          rotate: [0, 180, 360],
        } : {
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          ...animationConfig,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ willChange: 'transform' }}
      />

      <motion.div
        className={`absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:from-cyan-300/35 dark:to-blue-400/35 rounded-full ${isMobile ? 'blur-lg' : 'blur-3xl'
          }`}
        animate={isMobile ? {
          x: [0, -40, 0],
          y: [0, 30, 0],
          rotate: [0, -180, -360],
        } : {
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
          rotate: [0, -360],
        }}
        transition={{
          duration: animationConfig.duration + 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: animationConfig.ease,
        }}
        style={{ willChange: 'transform' }}
      />

      {!isMobile && (
        <>
          <motion.div
            className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-400/30 dark:to-pink-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, 120, 0],
              y: [0, -80, 0],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{ willChange: 'transform' }}
          />
          
          {/* Additional space-themed nebula */}
          <motion.div
            className="absolute top-1/6 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/15 to-teal-500/15 dark:from-emerald-300/25 dark:to-teal-400/25 rounded-full blur-2xl"
            animate={{
              x: [0, -60, 0],
              y: [0, 40, 0],
              scale: [1, 0.9, 1],
              rotate: [0, -270, -360],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{ willChange: 'transform' }}
          />
        </>
      )}

      {/* Space dust particles */}
      <div suppressHydrationWarning>
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg"
            style={{
              left: `${seededRandom(i * 5.2) * 100}%`,
              top: `${seededRandom(i * 6.8) * 100}%`,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, isMobile ? -50 : -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: seededRandom(i * 7.9) * 2 + 4,
              repeat: Infinity,
              delay: seededRandom(i * 8.1) * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Simplified grid pattern overlay - only on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      )}

      {/* Simplified radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/20 dark:to-black/15" />

      {/* Remove noise texture on mobile for better performance */}
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-[0.01] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
}