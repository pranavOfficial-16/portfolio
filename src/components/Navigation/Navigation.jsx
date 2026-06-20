import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useScrollSpy } from '../../hooks/useScrollSpy';

export function Navigation({ sections, resumeUrl }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const sectionIds = sections.map((s) => s.id);
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl transition-all duration-500 ${
        scrolled ? 'py-0 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(255,255,255,0.03)]' : 'py-1 border-b border-gray-100 dark:border-gray-900'
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-center transition-all duration-500 ${
            scrolled ? 'h-12' : 'h-16'
          }`}
        >
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="relative text-xs uppercase tracking-widest font-medium text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-black dark:bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {activeSection === section.id && (
                  <motion.span
                    layoutId="nav-glow"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-black/15 dark:bg-white/15 blur-md rounded-full"
                    style={{ animation: 'nav-glow-pulse 2s ease-in-out infinite' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right side: resume + theme toggle + hamburger */}
          <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center gap-2">
            {/* Resume download icon */}
            {resumeUrl && (
              <div className="relative group/download">
                <a
                  href={resumeUrl}
                  download
                  aria-label="Download Resume"
                  className="relative inline-flex items-center justify-center p-2.5 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  {/* Circle background on hover */}
                  <span className="absolute inset-0 rounded-full bg-black/10 dark:bg-white/10 scale-0 group-hover/download:scale-100 transition-transform duration-200 pointer-events-none" />
                  <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                {/* Modern tooltip */}
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/download:opacity-100 transition-all duration-300 pointer-events-none translate-y-1 group-hover/download:translate-y-0">
                  <div className="relative px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium bg-black dark:bg-white text-white dark:text-black rounded-md shadow-lg whitespace-nowrap">
                    Download Resume
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black dark:bg-white rotate-45" />
                  </div>
                </div>
              </div>
            )}
            {/* Theme toggle */}
            <div className="relative group/theme">
              <button
                onClick={toggleTheme}
                className="relative inline-flex items-center justify-center p-2.5 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {/* Circle background on hover */}
                <span className="absolute inset-0 rounded-full bg-black/10 dark:bg-white/10 scale-0 group-hover/theme:scale-100 transition-transform duration-200 pointer-events-none" />
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.svg
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </button>
              {/* Modern tooltip */}
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/theme:opacity-100 transition-all duration-300 pointer-events-none translate-y-1 group-hover/theme:translate-y-0">
                <div className="relative px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium bg-black dark:bg-white text-white dark:text-black rounded-md shadow-lg whitespace-nowrap">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black dark:bg-white rotate-45" />
                </div>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-full bg-current origin-center transition-colors"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-0.5 w-full bg-current transition-colors"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-full bg-current origin-center transition-colors"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-900 bg-white/95 dark:bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                      : 'text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
