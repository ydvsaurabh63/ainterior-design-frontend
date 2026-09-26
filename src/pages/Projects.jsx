import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ContactCTA from '../components/ContactCTA';
import { fallbackProjects } from '../data/fallbackProjects';
import { projectApi } from '../services/api';

const filterCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'living-room', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'full-home', label: 'Full Home' },
  { id: 'furniture', label: 'Furniture' }
];

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    setActiveCategory(categoryFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = {};
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        const data = await projectApi.getAll(params);
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else if (!searchQuery.trim()) {
          // Filter fallback by category
          const filtered = activeCategory === 'all'
            ? fallbackProjects
            : fallbackProjects.filter(p => p.category === activeCategory);
          setProjects(filtered);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.warn('Using seeded data for projects filter:', err.message);
        const filtered = fallbackProjects.filter(p => {
          const matchCat = activeCategory === 'all' || p.category === activeCategory;
          const matchSearch = !searchQuery.trim() || 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.style.toLowerCase().includes(searchQuery.toLowerCase());
          return matchCat && matchSearch;
        });
        setProjects(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="bg-studio-bg min-h-screen pt-20 sm:pt-28 md:pt-32 overflow-x-hidden">
      {/* 1. Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 md:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronze font-semibold mb-2.5">
            <span className="w-5 sm:w-6 h-px bg-studio-bronze" />
            <span>Architecture & Interiors</span>
            <span className="w-5 sm:w-6 h-px bg-studio-bronze" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-studio-charcoal font-normal tracking-tight mb-3 sm:mb-4">
            Curated Design Portfolio
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-studio-muted leading-relaxed font-light max-w-2xl mx-auto px-2">
            Explore our curated body of residential transformations across India, showcasing pure materiality,
            spatial harmony, and bespoke artisanal finishes.
          </p>
        </div>
      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-studio-border">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {filterCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.16em] font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-studio-charcoal text-white shadow-sm'
                      : 'bg-white text-studio-charcoal border border-studio-border hover:border-studio-bronze hover:text-studio-bronze'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search style, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-studio-border text-xs text-studio-charcoal placeholder-studio-muted focus:outline-none focus:border-studio-bronze transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-studio-muted hover:text-studio-charcoal"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-studio-muted gap-1">
          <span>
            Showing <strong className="text-studio-charcoal">{projects.length}</strong> projects in{' '}
            <span className="text-studio-bronze font-medium">
              {filterCategories.find((c) => c.id === activeCategory)?.label || 'Selected'}
            </span>
          </span>
          {searchQuery && (
            <span>
              Matching "<em>{searchQuery}</em>"
            </span>
          )}
        </div>
      </div>

      {/* 3. Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        {loading ? (
          <LoadingSpinner text="Filtering portfolio..." />
        ) : projects.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {projects.map((project, idx) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white border border-studio-border p-6 sm:p-8 max-w-xl mx-auto">
            <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-studio-muted mx-auto mb-3 opacity-50" />
            <h3 className="font-serif text-xl sm:text-2xl text-studio-charcoal mb-2">No Projects Found</h3>
            <p className="text-xs text-studio-muted mb-5 leading-relaxed">
              We couldn't find any projects matching your current search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="px-5 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-widest font-semibold hover:bg-studio-bronze transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <ContactCTA />
    </div>
  );
};

export default Projects;
