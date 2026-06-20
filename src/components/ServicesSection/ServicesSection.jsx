import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

const serviceIcons = {
  'Website Development': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  'App Development': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  ),
  'Technical Consulting': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  'Maintenance & Support': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.658 3.286a.75.75 0 01-1.087-.67V5.653a.75.75 0 011.087-.671l5.658 3.286m0 6.602l5.658 3.286a.75.75 0 001.087-.671V5.653a.75.75 0 00-1.087-.671L11.42 8.568m0 6.602V8.568" />
    </svg>
  ),
};

/** Magnetic button that attracts toward cursor */
function MagneticCard({ children, className = '' }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Handle service inquiry - scroll to contact and pre-fill message */
function handleInquiry(serviceTitle) {
  // Scroll to contact section
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    // Pre-fill the message field after a short delay (for scroll to complete)
    setTimeout(() => {
      const messageField = document.querySelector('textarea[name="message"]');
      if (messageField) {
        messageField.value = `Hi, I'm interested in your ${serviceTitle} service. I'd like to discuss my project requirements.`;
        messageField.focus();
        // Trigger input event so React state updates
        messageField.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 800);
  }
}

export function ServicesSection({ services }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="services" className="py-16 sm:py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div ref={ref}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 font-medium">
            05 — Services
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 tracking-tight">Services</h2>
          <div className="mt-4 w-12 h-px bg-black dark:bg-white" />
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {services.map((service, idx) => (
            <motion.div key={service.title} variants={cardVariants}>
              <MagneticCard className="group relative border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-8 hover:border-black dark:hover:border-white hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden flex flex-col">
                {/* Gradient bottom border on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number index */}
                <span className="text-xs font-medium text-gray-300 dark:text-gray-700 tracking-wide mb-4 sm:mb-6 block">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="mb-5 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {/* Icon background circle */}
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-full bg-gray-100/60 dark:bg-gray-800/40 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/50 transition-colors duration-300" />
                    <div className="relative">
                      {serviceIcons[service.title] || (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-3 tracking-tight">{service.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                  {service.description}
                </p>
                
                {/* Inquire button — always visible */}
                <button
                  onClick={() => handleInquiry(service.title)}
                  className="mt-6 w-full py-2.5 px-4 text-xs font-medium uppercase tracking-wider border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all duration-300"
                >
                  Inquire
                </button>
              </MagneticCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
