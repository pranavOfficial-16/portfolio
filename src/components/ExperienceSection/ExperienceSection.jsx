import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

export function ExperienceSection({ experience }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section id="experience" className="py-16 sm:py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div ref={ref}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 font-medium">
            04 — Journey
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 tracking-tight">Experience</h2>
          <div className="mt-4 w-12 h-px bg-black dark:bg-white" />
        </motion.div>

        {/* Experience cards grid */}
        <div className="space-y-6 sm:space-y-8">
          {experience.map((entry, index) => {
            const isCurrent = entry.endDate === 'Present';

            return (
              <motion.div
                key={`${entry.company}-${entry.role}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`group relative border rounded-2xl p-6 sm:p-8 transition-all duration-300 overflow-hidden ${
                  isCurrent
                    ? 'border-black dark:border-white bg-white dark:bg-black hover:shadow-xl dark:hover:shadow-white/10'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg dark:hover:shadow-black/20'
                }`}
              >
                {/* Current job indicator */}
                {isCurrent && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold uppercase tracking-wide rounded-bl-lg">
                    Current
                  </div>
                )}

                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Content */}
                <div className="relative">
                  {/* Header - Role and Meta info */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight">{entry.role}</h3>
                      <div className="flex flex-wrap gap-2">
                        {entry.workMode && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                            {entry.workMode}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-black dark:bg-white text-white dark:text-black">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.company}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-black/20 via-black/10 to-transparent dark:from-white/20 dark:via-white/10 mb-4 sm:mb-6" />

                  {/* Meta info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                      <span className="font-medium">{entry.startDate} — {entry.endDate}</span>
                    </div>
                    {entry.location && (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                        <span className="font-medium">{entry.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
