import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';

const ContactCTA = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-studio-charcoal text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Interior Atmosphere"
          className="w-full h-full object-cover opacity-20 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-studio-charcoal via-studio-charcoal/90 to-studio-charcoal/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-studio-bronzeLight text-xs uppercase tracking-[0.25em] font-medium mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-studio-bronze" />
          <span>Complimentary Studio Session</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-white tracking-tight leading-[1.15] mb-6"
        >
          Let’s Create a Space <br className="hidden sm:inline" />
          <span className="italic font-light text-stone-300">You’ll Truly Love</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-stone-300 font-light leading-relaxed mb-10"
        >
          Whether you are renovating a single room or seeking a complete turnkey transformation,
          our principal designers are ready to translate your vision into reality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-studio-charcoal text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-bronze hover:text-white transition-all duration-300 shadow-xl"
          >
            <Calendar className="w-4 h-4 text-studio-bronze group-hover:text-white" />
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="https://wa.me/918147540362"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 transition-all duration-300"
          >
            <span>WhatsApp Our Team</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
