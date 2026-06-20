import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultRoles = ['Full-Stack Developer', 'UI Designer', 'Problem Solver', 'Open Source Contributor'];

export function HeroSection({ name, tagline, roles = defaultRoles }) {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* Grid lines background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(128,128,128,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(128,128,128,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-px h-16 bg-gray-300/20 dark:bg-gray-700/20" />
        <div className="absolute top-1/4 left-1/4 w-16 h-px bg-gray-300/20 dark:bg-gray-700/20 -translate-x-8" />
        <div className="absolute bottom-1/3 right-1/4 w-px h-16 bg-gray-300/20 dark:bg-gray-700/20" />
        <div className="absolute bottom-1/3 right-1/4 w-16 h-px bg-gray-300/20 dark:bg-gray-700/20 -translate-x-8" />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-500 opacity-30 dark:opacity-25 blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-gray-400 to-gray-200 dark:from-gray-800 dark:to-gray-600 opacity-20 dark:opacity-15 blur-[80px] pointer-events-none"
        animate={{ scale: [1.1, 1, 1.1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Spotlight cursor glow */}
      <SpotlightGlow />

      {/* Floating particles for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-1 h-1 rounded-full bg-gray-400/40 dark:bg-gray-500/30" style={{ animation: 'float-particle 6s ease-in-out infinite' }} />
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-gray-300/30 dark:bg-gray-600/25" style={{ animation: 'float-particle 8s ease-in-out infinite 1s' }} />
        <div className="absolute top-1/2 left-2/3 w-1 h-1 rounded-full bg-gray-400/35 dark:bg-gray-500/20" style={{ animation: 'float-particle 7s ease-in-out infinite 2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-0.5 h-0.5 rounded-full bg-gray-500/30 dark:bg-gray-400/20" style={{ animation: 'float-particle 9s ease-in-out infinite 3s' }} />
      </div>

      {/* Availability badge - removed */}

      {/* Name with dramatic size */}
      <motion.h1
        className="relative text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-gradient-to-b from-black via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {name}
      </motion.h1>

      {/* Animated decorative line expanding from center */}
      <motion.div
        className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 60, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Typing role effect with blinking cursor */}
      <div className="relative mt-8 h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={roleIndex}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
            className="text-lg sm:text-xl font-medium text-gray-500 dark:text-gray-400 tracking-wide"
          >
            {roles[roleIndex]}
            <span
              className="inline-block w-[2px] h-5 bg-gray-500 dark:bg-gray-400 ml-1 align-middle"
              style={{ animation: 'blink 1s step-end infinite' }}
            />
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Tagline with decorative lines */}
      <motion.div
        className="relative mt-6 sm:mt-8 flex items-center gap-4 sm:gap-6 max-w-2xl px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="hidden sm:block flex-shrink-0 w-8 md:w-12 h-px bg-gray-300 dark:bg-gray-700" />
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-center">
          {tagline}
        </p>
        <span className="hidden sm:block flex-shrink-0 w-8 md:w-12 h-px bg-gray-300 dark:bg-gray-700" />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 font-medium">
          Scroll
        </span>
        <motion.div
          className="w-5 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-start justify-center p-1.5"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <motion.div
            className="w-0.5 h-2 rounded-full bg-gray-400 dark:bg-gray-600"
            animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Spotlight glow that follows the cursor */
function SpotlightGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      animate={{ opacity: isHovering ? 1 : 0 }}
    >
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-gray-300/20 to-transparent dark:from-gray-600/15 dark:to-transparent blur-xl"
        style={{
          left: mousePos.x - 250,
          top: mousePos.y - 250,
        }}
      />
    </motion.div>
  );
}
