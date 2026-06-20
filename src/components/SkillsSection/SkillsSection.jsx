import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

/** Infinite scrolling marquee component */
function Marquee({ children, direction = 'left', speed = 30 }) {
  return (
    <div className="relative overflow-hidden marquee-fade">
      <motion.div
        className="flex gap-3 sm:gap-4 w-max"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export function SkillsSection({ skills }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section id="skills" className="py-16 sm:py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div ref={ref}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 font-medium">
            02 — Skills
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 tracking-tight">Skills</h2>
          <div className="mt-4 w-12 h-px bg-black dark:bg-white" />
        </motion.div>

        {/* Marquee skill rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 sm:space-y-8"
        >
          {skills.map((category, idx) => (
            <div key={category.name} className="space-y-3 sm:space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                {category.name}
              </h3>
              <Marquee
                direction={idx % 2 === 0 ? 'left' : 'right'}
                speed={25 + idx * 5}
              >
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full border border-gray-200 dark:border-gray-800 text-xs sm:text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 cursor-default whitespace-nowrap"
                  >
                    {skill.name}
                  </span>
                ))}
              </Marquee>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
