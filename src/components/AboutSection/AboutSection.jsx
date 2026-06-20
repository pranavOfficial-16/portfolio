import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

export function AboutSection({ biography, photoUrl, photoAlt, stats }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section id="about" className="py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      {/* Keyframes for decorative animations */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-15px) scale(1.2); opacity: 1; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
        }
        @keyframes orbit-reverse {
          0% { transform: rotate(0deg) translateX(220px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(220px) rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
      `}</style>
      
      <div ref={ref}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 font-medium">
            01 — About
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 tracking-tight">About</h2>
          <div className="mt-4 w-12 h-px bg-black dark:bg-white" />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-start">
          {/* Photo — clean modern style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center items-center min-h-[24rem] sm:min-h-[32rem] md:min-h-[50rem]"
          >
            {/* Orbiting particles - hidden on small screens */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden sm:block">
              <div className="absolute w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" style={{ animation: 'orbit 15s linear infinite' }} />
              <div className="absolute w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full" style={{ animation: 'orbit-reverse 20s linear infinite' }} />
              <div className="absolute w-1 h-1 bg-gray-600 dark:bg-gray-300 rounded-full" style={{ animation: 'orbit 25s linear infinite', animationDelay: '-5s' }} />
            </div>

            {/* Decorative rings - scaled for mobile */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[18rem] sm:w-[28rem] h-[18rem] sm:h-[28rem] md:w-[38rem] md:h-[38rem] rounded-full border border-gray-200/20 dark:border-gray-800/20 animate-[spin_60s_linear_infinite] transition-colors duration-500" />
              <div className="absolute w-[20rem] sm:w-[32rem] h-[20rem] sm:h-[32rem] md:w-[42rem] md:h-[42rem] rounded-full border border-dashed border-gray-200/15 dark:border-gray-700/15 animate-[spin_45s_linear_infinite_reverse] transition-colors duration-500" />
              <div className="absolute w-[16rem] sm:w-[24rem] h-[16rem] sm:h-[24rem] md:w-[34rem] md:h-[34rem] rounded-full border-2 border-gray-300/10 dark:border-gray-700/10 transition-colors duration-500" style={{ animation: 'pulse-ring 4s ease-in-out infinite' }} />
              <div className="absolute w-[17rem] sm:w-[26rem] h-[17rem] sm:h-[26rem] md:w-[36rem] md:h-[36rem] rounded-full border border-dotted border-gray-400/20 dark:border-gray-600/20 animate-[spin_30s_linear_infinite] transition-colors duration-500" />
            </div>

            {/* Radial glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 sm:w-80 h-48 sm:h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-gray-400/10 dark:bg-gray-500/8 blur-[80px] sm:blur-[120px] transition-colors duration-500" />
              <div className="absolute w-32 sm:w-48 h-32 sm:h-48 md:w-64 md:h-64 rounded-full bg-gray-300/15 dark:bg-gray-400/10 blur-[60px] sm:blur-[80px] transition-colors duration-500" />
            </div>

            {/* Cross lines */}
            {/* Removed: Cross lines were creating rectangular border artifacts during theme transitions */}

            {/* Floating particles - hidden on mobile */}
            <div className="absolute inset-0 pointer-events-none hidden sm:block">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"
                  style={{
                    top: `${20 + (i * 10)}%`,
                    left: `${10 + (i * 12) % 80}%`,
                    animation: `float-particle ${3 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>

            {/* The photo container — responsive sizing */}
            <div className="relative w-[16rem] sm:w-[22rem] md:w-[30rem] lg:w-[34rem] h-[24rem] sm:h-[32rem] md:h-[44rem] lg:h-[48rem] group mx-auto -mt-16 sm:-mt-32 md:-mt-56">
              {/* Subtle backdrop glow */}
              <div className="absolute inset-x-8 top-1/4 bottom-0 bg-gradient-to-t from-gray-400/5 via-gray-400/10 to-transparent dark:from-gray-600/5 dark:via-gray-600/10 rounded-full blur-3xl transition-colors duration-500" />
              
              {/* Main photo — B&W, simple zoom on hover */}
              <img
                src={photoUrl}
                alt={photoAlt}
                className="absolute inset-0 w-full h-full object-contain object-top grayscale drop-shadow-[0_25px_80px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_25px_80px_rgba(0,0,0,0.7)] transition-all duration-500 ease-out group-hover:scale-[1.03]"
              />
              
              {/* Bottom fade gradient */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/80 pointer-events-none transition-colors duration-500" />
              
              {/* Subtle side vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 dark:from-black/30 dark:to-black/30 pointer-events-none transition-colors duration-500" />
            </div>
          </motion.div>

          {/* Biography with decorative quote */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Decorative quote mark */}
            <span className="absolute -top-8 -left-4 text-8xl font-serif text-gray-200 dark:text-gray-800 pointer-events-none select-none leading-none">
              &ldquo;
            </span>

            <div className="relative">
              {biography.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-700 dark:text-gray-300 leading-[1.8] text-lg mb-5 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Stats counter */}
            {stats && stats.length > 0 && (
              <>
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                </div>
                <div className="mt-8 pt-0 grid grid-cols-3 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <span className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</span>
                      <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
