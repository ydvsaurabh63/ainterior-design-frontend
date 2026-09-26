import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { getCategoryBySlug, categories } from '../data/categories';
import { fallbackProjects } from '../data/fallbackProjects';
import { projectApi } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ContactCTA from '../components/ContactCTA';

const CategoryProjects = () => {
  const { categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return <Navigate to="/projects" replace />;
  }

  const initialCategoryProjects = fallbackProjects.filter(p => p.category === category.slug);
  const [projects, setProjects] = useState(initialCategoryProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryProjects = async () => {
      try {
        const data = await projectApi.getAll({ category: category.slug });
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(fallbackProjects.filter(p => p.category === category.slug));
        }
      } catch (err) {
        console.warn('Using seeded category data:', err.message);
        setProjects(fallbackProjects.filter(p => p.category === category.slug));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProjects();
  }, [category.slug]);

  const otherCategories = categories.filter((c) => c.slug !== category.slug);

  return (
    <div className="bg-studio-bg min-h-screen overflow-x-hidden">
      {/* 1. Category Hero Banner */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-studio-dark text-white pt-16 sm:pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={category.heroImage}
            alt={category.title}
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-studio-dark via-studio-dark/70 to-studio-dark/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16">
          {/* Breadcrumbs */}
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-studio-bronzeLight mb-4 sm:mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <Link to="/projects" className="hover:text-white transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <span className="text-white font-semibold">{category.title}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight font-normal text-white mb-3 sm:mb-4"
          >
            {category.title} <span className="italic font-light text-stone-300">Interiors</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-stone-300 font-light leading-relaxed mb-6 sm:mb-8 px-2"
          >
            {category.description}
          </motion.p>

          {/* Category Metric Badges */}
          {category.stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-2.5 px-4 sm:px-6 bg-white/10 backdrop-blur-md border border-white/20 text-xs uppercase tracking-wider"
            >
              <div>
                <span className="text-studio-bronzeLight font-serif text-base sm:text-xl font-medium block">
                  {category.stats.projectsCount}
                </span>
                <span className="text-[9px] sm:text-[10px] text-stone-300">Executed Projects</span>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/20 hidden sm:block" />
              <div>
                <span className="text-studio-bronzeLight font-serif text-base sm:text-xl font-medium block">
                  {category.stats.avgTimeline}
                </span>
                <span className="text-[9px] sm:text-[10px] text-stone-300">Average Handover</span>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/20 hidden sm:block" />
              <div>
                <span className="text-studio-bronzeLight font-serif text-base sm:text-xl font-medium block">
                  {category.stats.awardWinning}
                </span>
                <span className="text-[9px] sm:text-[10px] text-stone-300">Design Accolades</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 2. Key Design Features */}
      {category.features && (
        <section className="py-8 sm:py-10 bg-white border-b border-studio-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {category.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3.5 bg-studio-bg border border-studio-border/70"
                >
                  <Sparkles className="w-4 h-4 text-studio-bronze flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Project Gallery */}
      <section className="py-16 sm:py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronze font-semibold mb-1.5 sm:mb-2">
              <span className="w-5 sm:w-6 h-px bg-studio-bronze" />
              <span>Category Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-studio-charcoal">
              {category.title} Project Gallery
            </h2>
          </div>
          <p className="text-xs text-studio-muted mt-1.5 sm:mt-0 font-medium">
            Showing {projects.length} curated masterworks
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text={`Loading ${category.title} projects...`} />
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, idx) => (
              <ProjectCard key={project._id || project.slug} project={project} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-studio-border max-w-lg mx-auto p-6">
            <Layers className="w-10 h-10 text-studio-muted mx-auto mb-3 opacity-50" />
            <h3 className="font-serif text-xl text-studio-charcoal mb-2">
              No {category.title} Projects Yet
            </h3>
            <p className="text-xs text-studio-muted mb-5">
              New project case studies for this category are being photographed.
            </p>
            <Link
              to="/projects"
              className="px-5 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-widest font-semibold"
            >
              Browse All Projects
            </Link>
          </div>
        )}
      </section>

      {/* 4. Cross Category Discovery */}
      <section className="py-12 sm:py-16 bg-studio-sand/40 border-t border-studio-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronze font-semibold block mb-1">
              Explore More
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-studio-charcoal">
              Other Design Disciplines
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {otherCategories.map((other) => (
              <Link
                key={other.id}
                to={`/projects/${other.slug}`}
                className="group relative h-40 sm:h-48 overflow-hidden bg-studio-charcoal block shadow-md"
              >
                <img
                  src={other.thumbnail || other.heroImage}
                  alt={other.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-studio-charcoal via-studio-charcoal/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-studio-bronzeLight font-semibold">
                    Category
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-medium">{other.title}</h4>
                  <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-300 mt-1 group-hover:text-white transition-colors">
                    <span>View Projects</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </div>
  );
};

export default CategoryProjects;
