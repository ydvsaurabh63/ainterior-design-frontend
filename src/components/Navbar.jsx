import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3 sm:py-3.5 shadow-sm'
            : 'bg-studio-bg/95 md:bg-studio-bg/85 md:backdrop-blur-sm py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="z-50 hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 py-1 relative ${
                    isActive
                      ? 'text-studio-bronze font-semibold'
                      : 'text-studio-charcoal hover:text-studio-bronze'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Home
                    {isActive && (
                      <motion.span
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-studio-bronze"
                      />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 py-1 relative ${
                    isActive
                      ? 'text-studio-bronze font-semibold'
                      : 'text-studio-charcoal hover:text-studio-bronze'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    About
                    {isActive && (
                      <motion.span
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-studio-bronze"
                      />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 py-1 relative ${
                    isActive
                      ? 'text-studio-bronze font-semibold'
                      : 'text-studio-charcoal hover:text-studio-bronze'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Contact
                    {isActive && (
                      <motion.span
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-studio-bronze"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </nav>

            {/* Mobile Hamburger Menu Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2 -mr-1 text-studio-charcoal hover:text-studio-bronze transition-colors focus:outline-none touch-manipulation cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[60px] sm:top-[68px] z-30 bg-studio-bg flex flex-col justify-between p-6 sm:p-8 lg:hidden overflow-y-auto pb-20"
          >
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-studio-bronze font-bold block mb-3">
                  Navigation
                </span>
                <div className="flex flex-col space-y-2">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-lg font-serif tracking-wide py-2.5 border-b border-studio-border/60 flex items-center justify-between ${
                        isActive ? 'text-studio-bronze font-semibold' : 'text-studio-charcoal'
                      }`
                    }
                  >
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `text-lg font-serif tracking-wide py-2.5 border-b border-studio-border/60 flex items-center justify-between ${
                        isActive ? 'text-studio-bronze font-semibold' : 'text-studio-charcoal'
                      }`
                    }
                  >
                    <span>About Studio</span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `text-lg font-serif tracking-wide py-2.5 border-b border-studio-border/60 flex items-center justify-between ${
                        isActive ? 'text-studio-bronze font-semibold' : 'text-studio-charcoal'
                      }`
                    }
                  >
                    <span>Contact Us</span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </NavLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
