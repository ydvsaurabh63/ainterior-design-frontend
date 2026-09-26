import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative h-[420px] sm:h-[480px] overflow-hidden bg-studio-charcoal flex flex-col justify-end p-6 sm:p-8 cursor-pointer shadow-luxury"
    >
      {/* Background Image */}
      <img
        src={category.thumbnail || category.heroImage}
        alt={category.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Editorial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-studio-charcoal via-studio-charcoal/50 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-black/10" />

      {/* Decorative Border Line */}
      <div className="absolute top-6 left-6 right-6 bottom-6 border border-white/15 pointer-events-none transition-all duration-500 group-hover:border-studio-bronze/50" />

      {/* Card Content */}
      <div className="relative z-10 space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-studio-bronzeLight font-medium">
          Category 0{index + 1}
        </span>

        <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-wide font-normal">
          {category.title}
        </h3>

        <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed font-light">
          {category.description}
        </p>

        <div className="pt-2">
          <Link
            to={`/projects/${category.slug}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-white group-hover:text-studio-bronzeLight transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
