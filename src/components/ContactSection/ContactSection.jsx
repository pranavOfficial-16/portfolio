import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { useContactForm } from '../../hooks/useContactForm';
import { useToast } from '../ui';

export function ContactSection({ socialLinks, email }) {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const { formData, errors, status, handleChange, handleSubmit, resetForm } = useContactForm();
  const { addToast } = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSubmit();
    
    if (result === 'success') {
      addToast('Message sent successfully! I\'ll get back to you soon.', 'success');
      resetForm();
    } else if (result === 'error') {
      addToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
      <div ref={ref}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 font-medium">
            06 — Contact
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 tracking-tight">Get in Touch</h2>
          <div className="mt-4 w-12 h-px bg-black dark:bg-white" />
        </motion.div>

        <div className="relative grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-20">
          {/* Background decorative text */}
          <div className="absolute -top-4 right-0 text-[8rem] lg:text-[14rem] font-bold text-gray-100/80 dark:text-gray-900/80 pointer-events-none select-none leading-none hidden lg:block">
            Let&apos;s Talk
          </div>

          {/* Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative space-y-6 sm:space-y-8"
          >
            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-widest font-medium mb-2 sm:mb-3 text-gray-500 dark:text-gray-500">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-5 py-4 bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus-inner-shadow transition-all text-base"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest font-medium mb-3 text-gray-500 dark:text-gray-500">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-5 py-4 bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus-inner-shadow transition-all text-base"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Message field */}
            <div>
              <label htmlFor="message" className="block text-xs uppercase tracking-widest font-medium mb-3 text-gray-500 dark:text-gray-500">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                onInput={(e) => handleChange('message', e.target.value)}
                className="w-full px-5 py-4 bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus-inner-shadow transition-all text-base resize-none"
                placeholder="Your message..."
              />
              {errors.message && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
              )}
            </div>

            {/* Submit button — premium with animated border */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="relative group px-10 py-4 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium text-sm tracking-wide overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black dark:border-white pulse-border-btn"
              style={{ animation: 'pulse-border 2s ease-in-out infinite' }}
            >
              <span className="relative z-10">
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </span>
              {/* Animated shine */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </motion.form>

          {/* Social links / info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative flex flex-col justify-center"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
              Have a project in mind or want to collaborate? Feel free to reach out. I&apos;m always open to discussing new opportunities.
            </p>

            {/* Direct email */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-lg font-medium mb-12 hover:underline underline-offset-4 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {email}
              </a>
            )}

            {/* Social links with tooltips */}
            <div className="flex gap-6 mt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="group/social relative w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white transition-all duration-300 hover:scale-110"
                >
                  <SocialIcon platform={link.platform} />
                  {/* Tooltip */}
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-medium text-gray-500 dark:text-gray-500 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {link.platform}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SocialIcon({ platform }) {
  switch (platform) {
    case 'GitHub':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case 'LinkedIn':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'Twitter':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
  }
}
