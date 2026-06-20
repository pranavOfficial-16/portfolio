import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ToastProvider, ScrollProgress, LoadingSkeleton, BackToTop } from './components/ui';
import { portfolioData, navigationSections, resumeUrl, email, availableForWork, stats, siteTitle } from './data/portfolio';

/** Choreographed page entrance */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.15,
    },
  },
};

const navVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const heroName = portfolioData.hero.name;
  const description = portfolioData.hero.tagline;
  const photoUrl = portfolioData.about.photoUrl;

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        {/* Dynamic SEO Meta Tags */}
        <Helmet>
          <title>{siteTitle}</title>
          <meta name="title" content={siteTitle} />
          <meta name="description" content={description} />
          <meta name="author" content={heroName} />
          
          {/* Open Graph */}
          <meta property="og:title" content={siteTitle} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={photoUrl} />
          
          {/* Twitter */}
          <meta property="twitter:title" content={siteTitle} />
          <meta property="twitter:description" content={description} />
          <meta property="twitter:image" content={photoUrl} />
        </Helmet>

        {/* Loading Screen */}
        <AnimatePresence>
          {isLoading && <LoadingSkeleton />}
        </AnimatePresence>

        {/* Scroll Progress Bar */}
        <ScrollProgress />

        {/* Back to Top Button */}
        <BackToTop />

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate={isLoading ? 'hidden' : 'visible'}
          className="noise-overlay grid-pattern min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300"
        >
          <motion.div variants={navVariants}>
            <Navigation
              sections={navigationSections}
              resumeUrl={resumeUrl}
            />
          </motion.div>
          <motion.div variants={contentVariants}>
            <Layout>
              <HeroSection
                name={portfolioData.hero.name}
                tagline={portfolioData.hero.tagline}
                roles={portfolioData.hero.roles}
                resumeUrl={resumeUrl}
                availableForWork={availableForWork}
              />
              <AboutSection
                biography={portfolioData.about.biography}
                photoUrl={portfolioData.about.photoUrl}
                photoAlt={portfolioData.about.photoAlt}
                stats={stats}
              />
              <SkillsSection skills={portfolioData.skills} />
              <ProjectsSection projects={portfolioData.projects} />
              <ExperienceSection experience={portfolioData.experience} />
              <ServicesSection services={portfolioData.services} />
              <ContactSection
                socialLinks={portfolioData.contact.socialLinks}
                email={email}
              />
            </Layout>
            <Layout>
              <Footer
                name={portfolioData.hero.name}
                socialLinks={portfolioData.contact.socialLinks}
                sections={navigationSections}
              />
            </Layout>
          </motion.div>
        </motion.div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
