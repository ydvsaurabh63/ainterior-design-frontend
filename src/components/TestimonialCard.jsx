import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-8 border border-studio-border/70 flex flex-col justify-between shadow-sm relative group hover:border-studio-bronze/50 transition-colors duration-300"
    >
      {/* Decorative Quote Mark */}
      <Quote className="w-10 h-10 text-studio-sand text-opacity-80 absolute top-6 right-6 -z-0" />

      <div className="relative z-10">
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (testimonial.rating || 5)
                  ? 'text-studio-gold fill-studio-gold'
                  : 'text-stone-200 fill-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-studio-charcoal text-sm md:text-base leading-relaxed font-light italic mb-8">
          "{testimonial.review}"
        </p>
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-4 pt-6 border-t border-studio-border/60 relative z-10">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border border-studio-border shadow-sm flex-shrink-0"
        />
        <div>
          <h4 className="font-serif text-base font-medium text-studio-charcoal leading-tight">
            {testimonial.name}
          </h4>
          <p className="text-[11px] uppercase tracking-wider text-studio-muted mt-0.5">
            {testimonial.role || 'Homeowner'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
