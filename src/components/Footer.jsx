import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import {
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  MessageCircle
} from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-studio-dark text-stone-300 pt-16 md:pt-24 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-stone-800">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block hover:opacity-95 transition-opacity">
              <Logo size="md" variant="dark" />
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Disruptive Innovation Through Autonomous Intelligence. Building AI agents that run businesses - not just assist them.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-studio-bronze hover:bg-studio-bronze/10 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-studio-bronze hover:bg-studio-bronze/10 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-studio-bronze hover:bg-studio-bronze/10 transition-colors"
              >
                <span className="text-xs font-bold font-serif">P</span>
              </a>
              <a
                href="https://wa.me/918147540362"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-green-400 hover:border-green-500 hover:bg-green-500/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white font-semibold">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-stone-400 hover:text-studio-bronzeLight transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-studio-bronzeLight transition-colors">
                  About Studio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-studio-bronzeLight transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174/login'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-500 hover:text-stone-300 text-xs transition-colors"
                >
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white font-semibold">
              Categories
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/projects/living-room"
                  className="text-stone-400 hover:text-studio-bronzeLight transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Living Room Interiors</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/projects/bedroom"
                  className="text-stone-400 hover:text-studio-bronzeLight transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Master Bedrooms</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/projects/full-home"
                  className="text-stone-400 hover:text-studio-bronzeLight transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Full Home Turnkey</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/projects/furniture"
                  className="text-stone-400 hover:text-studio-bronzeLight transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Bespoke Furniture</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white font-semibold">
              Studio Contact
            </p>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-studio-bronze mt-1 flex-shrink-0" />
                <span>C-116, Sector-2, Noida, Uttar Pradesh – 201301, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-studio-bronze flex-shrink-0" />
                <a href="tel:+918147540362" className="hover:text-white transition-colors">
                  +91 81475 40362
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-studio-bronze flex-shrink-0" />
                <a href="mailto:contact@diintech.com" className="hover:text-white transition-colors">
                  contact@diintech.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <a
                  href="https://wa.me/918147540362"
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 hover:underline"
                >
                  WhatsApp: +91 81475 40362
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {currentYear} Diin Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Noida • Delhi NCR • India</span>
            <span className="hidden sm:inline">•</span>
            <a
              href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174/login'}
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-300 transition-colors"
            >
              Staff Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
