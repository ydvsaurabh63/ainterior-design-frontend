import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Sparkles } from 'lucide-react';

const categoryLabels = {
  'living-room': 'Living Room',
  'bedroom': 'Bedroom',
  'kitchen': 'Kitchen',
  'full-home': 'Full Home'
};

const ProjectCard = ({ project, index = 0 }) => {
  const categoryName = categoryLabels[project.category] || project.category;
  const projectLink = `/project/${project._id || project.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col bg-white border border-studio-border/80 overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-500"
    >
      {/* Project Image Container */}
      <Link to={projectLink} className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-studio-sand block">
        <img
          src={project.mainImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Category Pill */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-3 py-1 bg-studio-charcoal/85 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] font-medium">
            {categoryName}
          </span>
        </div>

        {/* Featured Star Badge if applicable */}
        {project.featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-studio-bronze text-white text-[10px] uppercase tracking-wider font-semibold shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Hover View Button Overlay */}
        <div className="absolute inset-0 bg-studio-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white text-studio-charcoal flex items-center justify-center transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </Link>

      {/* Project Details */}
      <div className="p-6 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-studio-muted mb-2">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-studio-bronze" />
              {project.location}
            </span>
            <span className="font-mono text-[11px] text-stone-400">{project.area}</span>
          </div>

          <Link to={projectLink}>
            <h3 className="text-xl font-serif text-studio-charcoal group-hover:text-studio-bronze transition-colors font-medium leading-snug line-clamp-1 mb-2">
              {project.title}
            </h3>
          </Link>

          <p className="text-xs text-studio-muted font-light mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="pt-4 border-t border-studio-border/60 flex items-center justify-between text-xs">
          <span className="text-studio-muted tracking-wide">
            Style: <strong className="text-studio-charcoal font-medium">{project.style}</strong>
          </span>

          <Link
            to={projectLink}
            className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-[11px] text-studio-charcoal group-hover:text-studio-bronze transition-colors"
          >
            <span>View Case</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
