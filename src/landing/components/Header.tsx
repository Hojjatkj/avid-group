import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AvidLogo from '../../components/AvidLogo';

const NAV_ITEMS: { label: string; href?: string; action?: 'about' }[] = [
  { label: 'خانه', href: '/' },
  { label: 'درباره ما', action: 'about' },
  { label: 'وبلاگ', href: '/blog' },
  { label: 'تماس با ما', href: '#site-footer' },
];

interface HeaderProps { onLoginClick: () => void; onAboutClick: () => void; }

export const Header = ({ onLoginClick, onAboutClick }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [heroPulled, setHeroPulled] = useState(false);

  useEffect(() => {
    let stopTimer: number | undefined;
    let lastY = window.scrollY;

    const revealWhenStopped = () => {
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        // Any pause in scrolling brings the header back down.
        setHeroPulled(false);
      }, 180);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const atTop = y <= 8;
      const moved = y !== lastY;

      if (atTop) {
        setHeroPulled(false);
      } else if (moved) {
        // Hide for the entire time the page is actively scrolling, in
        // either direction — previously this only hid on scroll-down, so
        // scrolling back up left it stuck hidden until the stop-timer fired.
        setHeroPulled(true);
      }

      lastY = y;
      revealWhenStopped();
    };

    const onResize = () => {
      if (window.scrollY <= 8) setHeroPulled(false);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.clearTimeout(stopTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 py-5 bg-transparent avid-transparent-header"
      animate={{ y: heroPulled ? '-118%' : '0%', scaleY: heroPulled ? 0.72 : 1, opacity: heroPulled ? 0 : 1 }}
      transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
      style={{ transformOrigin: '50% 0%' }}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="/" className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--pharma-text)' }}>
            <AvidLogo size={34} context="card" />
          </a>
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => item.action === 'about' ? (
              <button key={item.label} onClick={onAboutClick} className="avid-nav-link font-medium transition-colors text-sm">{item.label}</button>
            ) : (
              <a key={item.href} href={item.href} className="avid-nav-link font-medium transition-colors text-sm">{item.label}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLoginClick} className="hidden lg:block px-5 py-2 text-sm rounded-full transition-colors font-medium avid-header-login" style={{ color: 'var(--pharma-text)' }}>ورود / ثبت‌نام</button>
          <button className="lg:hidden avid-mobile-menu" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'بستن منو' : 'باز کردن منو'}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lg:hidden absolute top-full left-0 right-0 avid-mobile-panel shadow-lg backdrop-blur-xl">
            <nav className="flex flex-col p-6 gap-4">
              {NAV_ITEMS.map((item) => item.action === 'about' ? (
                <button key={item.label} onClick={() => { setIsOpen(false); onAboutClick(); }} className="avid-mobile-link font-medium text-lg text-right">{item.label}</button>
              ) : (
                <a key={item.href} href={item.href} className="avid-mobile-link font-medium text-lg" onClick={() => setIsOpen(false)}>{item.label}</a>
              ))}
              <button onClick={() => { setIsOpen(false); onLoginClick(); }} className="mt-2 px-5 py-3 text-white text-base rounded-lg text-center" style={{ background: '#102F50' }}>ورود / ثبت‌نام</button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
