import { useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import VideoBackground from '../components/VideoBackground';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SponsorsRibbon from '../components/SponsorsRibbon';
// Lazy loaded sections
const AboutSection = lazy(() => import('../components/AboutSection'));
const EventsSection = lazy(() => import('../components/EventsSection'));
// const UnderwaterTransition = lazy(() => import('../components/UnderwaterTransition'));
const ScheduleSection = lazy(() => import('../components/ScheduleSection'));
const FAQSection = lazy(() => import('../components/FAQSection'));

import RegisterSection from '../components/RegisterSection';
import ContactSection from '../components/ContactSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { logPerformanceReport } from '../lib/lazyLoad';
import { monitorChunkLoading, logBundleReport } from '../lib/bundleMonitor';

const Index = () => {
  const { activeVideoIndex, scrollProgress } = useScrollProgress();

  // Monitor bundle performance in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log performance metrics after 5 seconds (allow time for lazy loads)
      const timer = setTimeout(() => {
        console.log('\n--- Lazy Load Performance ---');
        logPerformanceReport();

        console.log('\n--- Bundle Size Monitoring ---');
        const chunks = monitorChunkLoading();
        if (chunks.length > 0) {
          logBundleReport(chunks);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <SmoothScroll>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen bg-background text-foreground selection:bg-primary/30"
      >
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded"
        >
          Skip to main content
        </a>

        <VideoBackground activeIndex={activeVideoIndex} />

        <Navbar />

        <main id="main-content" className="relative z-10">
          <HeroSection />
          <SponsorsRibbon />
          {/* <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
            <UnderwaterTransition key="hero-about-transition" />
          </Suspense> */}
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
            <AboutSection />
          </Suspense>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
            <EventsSection />
          </Suspense>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
            <ScheduleSection />
          </Suspense>
          <RegisterSection />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
            <FAQSection />
          </Suspense>
          <ContactSection />
          <NewsletterSection />
        </main>

        <Footer />

        {/* Global Progress Bar */}
        <div
          className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-50 transition-all duration-300 pointer-events-none"
          style={{ width: `${scrollProgress * 100}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page scroll progress"
        />
      </motion.div>
    </SmoothScroll>
  );
};

export default Index;
