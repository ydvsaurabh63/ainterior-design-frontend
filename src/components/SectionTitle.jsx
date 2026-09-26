import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({
  subtitle,
  title,
  description,
  alignment = 'center',
  light = false,
  className = ''
}) => {
  const isCenter = alignment === 'center';

  return (
    <div
      className={`mb-10 sm:mb-12 md:mb-16 ${
        isCenter ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'
      } ${className}`}
    >
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`inline-flex items-center gap-2 mb-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold ${
            light ? 'text-studio-bronzeLight' : 'text-studio-bronze'
          }`}
        >
          <span className="w-5 sm:w-6 h-px bg-current opacity-60" />
          <span>{subtitle}</span>
          {isCenter && <span className="w-5 sm:w-6 h-px bg-current opacity-60" />}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className={`text-2xl sm:text-4xl md:text-5xl font-serif tracking-tight font-normal leading-[1.2] sm:leading-[1.15] mb-3 sm:mb-4 ${
          light ? 'text-white' : 'text-studio-charcoal'
        }`}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={`text-xs sm:text-sm md:text-base leading-relaxed ${
            light ? 'text-stone-300' : 'text-studio-muted'
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;
