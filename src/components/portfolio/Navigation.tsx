"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import posthog from "posthog-js";

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Seeded random function for consistent positioning
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return (
    <nav className="fixed top-0 md:top-4 w-full z-50 ">
      <div className="md:max-w-fit md:border-2 md:rounded-full mx-auto px-7 py-2 bg-zinc-200/50 dark:bg-slate-900/50 backdrop-blur-3xl relative overflow-hidden">
        {/* Space-themed nav background effects */}
        {isClient && (
          <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-20" suppressHydrationWarning>
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  left: `${seededRandom(i * 1.7) * 100}%`,
                  top: `${seededRandom(i * 2.9) * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + seededRandom(i * 3.1) * 3,
                  repeat: Infinity,
                  delay: seededRandom(i * 4.3) * 2,
                }}
              />
            ))}
          </div>
        )}
        <div className="flex justify-between items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400 bg-clip-text text-transparent flex items-center gap-1"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              🚀
            </motion.span>
            Glanze
          </motion.div>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              {["Overview", "Stack", "Experience", "Projects", "Certifications", "Contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => {
                    posthog.capture('navigation_menu_clicked', {
                      menu_item: item,
                      section: item.toLowerCase(),
                      position: index,
                      timestamp: new Date().toISOString()
                    });
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300 text-sm font-medium"
                >
                  {item}
                </motion.a>
              ))}
            </div>
            {/* Theme Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                posthog.capture('theme_toggle_clicked', {
                  from_theme: theme,
                  to_theme: newTheme,
                  timestamp: new Date().toISOString()
                });
                toggleTheme();
              }}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Icon icon="solar:sun-bold" className="text-yellow-500" width={20} height={20} />
              ) : (
                <Icon icon="solar:moon-bold" className="text-blue-500" width={20} height={20} />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}