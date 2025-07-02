"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'rocket' | 'planet' | 'asteroid' | 'star' | 'satellite';
  rotation: number;
  speed: number;
}

export default function SpaceElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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

  useEffect(() => {
    if (!isClient) return;
    
    const elementCount = isMobile ? 8 : 15;
    const types: FloatingElement['type'][] = ['rocket', 'planet', 'asteroid', 'star', 'satellite'];
    
    const initialElements: FloatingElement[] = Array.from({ length: elementCount }, (_, i) => ({
      id: i,
      x: seededRandom(i * 1.3) * 100,
      y: seededRandom(i * 2.7) * 100,
      size: seededRandom(i * 3.1) * 30 + 20,
      type: types[Math.floor(seededRandom(i * 4.9) * types.length)],
      rotation: seededRandom(i * 5.3) * 360,
      speed: seededRandom(i * 6.7) * 0.5 + 0.2,
    }));

    setElements(initialElements);
  }, [isMobile, isClient]);

  const renderElement = (element: FloatingElement) => {
    const baseClasses = "absolute opacity-20 dark:opacity-30";
    
    switch (element.type) {
      case 'rocket':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses} text-red-500 dark:text-red-400`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size}px`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [element.rotation, element.rotation + 360],
            }}
            transition={{
              duration: 8 + element.speed * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🚀
          </motion.div>
        );
      
      case 'planet':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses} text-blue-500 dark:text-blue-400`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size}px`,
            }}
            animate={{
              y: [-15, 15, -15],
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + element.speed * 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            🪐
          </motion.div>
        );
      
      case 'asteroid':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses} text-gray-600 dark:text-gray-400`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size * 0.8}px`,
            }}
            animate={{
              x: [-25, 25, -25],
              y: [-10, 10, -10],
              rotate: [element.rotation, element.rotation + 180, element.rotation + 360],
            }}
            transition={{
              duration: 6 + element.speed * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ☄️
          </motion.div>
        );
      
      case 'star':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses} text-yellow-400 dark:text-yellow-300`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size * 0.6}px`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + element.speed * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ⭐
          </motion.div>
        );
      
      case 'satellite':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses} text-purple-500 dark:text-purple-400`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size * 0.7}px`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-15, 15, -15],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + element.speed * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            🛰️
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
      {elements.map(renderElement)}
      
      {/* Additional space background elements */}
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 opacity-10 dark:opacity-20"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 left-10 w-24 h-24 opacity-15 dark:opacity-25"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          rotate: [0, -360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full blur-lg" />
      </motion.div>
    </div>
  );
}