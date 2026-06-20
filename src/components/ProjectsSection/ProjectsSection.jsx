import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

/** 3D Tilt Card with spotlight effect */
function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setIsHovering(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-[box-shadow] duration-300 ${className}`}
      style={{ transform, transition: 'transform 0.15s ease-out' }}
    >
      {/* Spotlight glare */}
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-15"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

export function ProjectsSection({ projects }) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div ref={ref}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 font-medium">
            03 — Work
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 tracking-tight">Projects</h2>
          <div className="mt-4 w-12 h-px bg-black dark:bg-white" />
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr"
        >
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              variants={cardVariants}
              className={idx === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
            >
              <TiltCard
                className={`h-full rounded-xl hover:shadow-2xl dark:hover:shadow-gray-900/50 shimmer-border ${
                  idx === 0
                    ? 'border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50'
                    : 'border border-gray-200 dark:border-gray-800'
                }`}
              >
                <article className={`group relative p-5 sm:p-8 flex flex-col h-full ${idx === 0 ? 'sm:p-10 lg:p-12' : ''}`}>
                  {/* Featured label for first project */}
                  {idx === 0 && (
                    <span className="absolute top-3 sm:top-4 left-3 sm:left-4 text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black z-10">
                      Featured
                    </span>
                  )}

                  {/* Numbered index */}
                  <span className="absolute top-4 sm:top-6 right-4 sm:right-6 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-200/80 dark:text-gray-800/80 select-none pointer-events-none leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <div className="relative">
                    <h3 className={`font-semibold mb-2 sm:mb-3 tracking-tight ${idx === 0 ? 'text-xl sm:text-2xl md:text-3xl' : 'text-base sm:text-lg'}`}>
                      {project.title}
                    </h3>
                    <p className={`text-gray-600 dark:text-gray-400 leading-relaxed mb-4 sm:mb-5 ${idx === 0 ? 'text-sm sm:text-base md:text-lg' : 'text-xs sm:text-sm'}`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5 mt-auto">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link button - only show if demoUrl exists */}
                  {project.demoUrl && (
                    <div className="flex gap-4 items-center">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium hover:underline underline-offset-4"
                      >
                        View Project
                        <svg
                          className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </a>
                    </div>
                  )}
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
