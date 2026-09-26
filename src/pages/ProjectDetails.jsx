import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Maximize2,
  Palette,
  Calendar,
  Layers,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';
import { projectApi } from '../services/api';
import { fallbackProjects } from '../data/fallbackProjects';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ContactCTA from '../components/ContactCTA';
import toast from 'react-hot-toast';

const categoryLabels = {
  'living-room': 'Living Room',
  'bedroom': 'Bedroom',
  'kitchen': 'Kitchen',
  'full-home': 'Full Home'
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find fallback match immediately so no blank flash
  const fallbackMatch = fallbackProjects.find(p => p._id === id || p.slug === id) || fallbackProjects[0];
  const [project, setProject] = useState(fallbackMatch);
  const [relatedProjects, setRelatedProjects] = useState(
    fallbackProjects.filter(p => p.category === fallbackMatch.category && p._id !== fallbackMatch._id).slice(0, 3)
  );
  const [loading, setLoading] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      window.scrollTo(0, 0);
      try {
        const data = await projectApi.getById(id);
        if (data && data.project) {
          setProject(data.project);
          setRelatedProjects(data.related || []);
        } else if (data && data.title) {
          setProject(data);
        }
      } catch (err) {
        console.warn('Using seeded project details:', err.message);
        const match = fallbackProjects.find(p => p._id === id || p.slug === id) || fallbackProjects[0];
        setProject(match);
        setRelatedProjects(
          fallbackProjects.filter(p => p.category === match.category && p._id !== match._id).slice(0, 3)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-studio-bg pt-32 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="font-serif text-2xl sm:text-3xl text-studio-charcoal mb-4">Project Not Found</h2>
        <p className="text-xs sm:text-sm text-studio-muted mb-6">
          The requested interior design case study could not be located.
        </p>
        <Link
          to="/projects"
          className="px-6 py-3 bg-studio-charcoal text-white text-xs uppercase tracking-widest font-semibold"
        >
          Browse All Projects
        </Link>
      </div>
    );
  }

  const categoryName = categoryLabels[project.category] || project.category;
  const allImages = [
    project.mainImage,
    ...(project.galleryImages && project.galleryImages.length > 0 ? project.galleryImages : [])
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Project link copied to clipboard!');
    }
  };

  return (
    <div className="bg-studio-bg min-h-screen pt-16 sm:pt-20 overflow-x-hidden">
      {/* 1. Project Hero Banner */}
      <section className="relative h-[55vh] sm:h-[65vh] md:h-[75vh] w-full overflow-hidden bg-studio-dark">
        <img
          src={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-studio-charcoal via-studio-charcoal/60 to-transparent opacity-90" />

        {/* Back Link & Category */}
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-studio-charcoal/80 backdrop-blur-md text-white text-[10px] sm:text-xs uppercase tracking-widest hover:bg-studio-bronze transition-colors"
          >
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Share Button */}
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20">
          <button
            onClick={handleShare}
            className="p-2 sm:p-2.5 rounded-full bg-studio-charcoal/80 backdrop-blur-md text-white hover:bg-studio-bronze transition-colors shadow-sm"
            aria-label="Share Project"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Hero Title & Meta */}
        <div className="absolute bottom-0 inset-x-0 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 text-white">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronzeLight font-semibold mb-2 sm:mb-3">
              <span>{categoryName}</span>
              <span>•</span>
              <span>{project.style}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight font-normal text-white mb-4 sm:mb-6 leading-[1.1]">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-300">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-studio-bronze" />
                {project.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-studio-bronze" />
                {project.area}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-studio-bronze" />
                {project.style}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Project Specifications Bar */}
      <div className="bg-white border-b border-studio-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-studio-muted block">
                Discipline
              </span>
              <span className="font-serif text-base sm:text-lg font-medium text-studio-charcoal">
                {categoryName}
              </span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-studio-muted block">
                Spatial Footprint
              </span>
              <span className="font-serif text-base sm:text-lg font-medium text-studio-charcoal">
                {project.area}
              </span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-studio-muted block">
                Design Language
              </span>
              <span className="font-serif text-base sm:text-lg font-medium text-studio-charcoal truncate block">
                {project.style}
              </span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-studio-muted block">
                Site Location
              </span>
              <span className="font-serif text-base sm:text-lg font-medium text-studio-charcoal truncate block">
                {project.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Narrative & Materials */}
      <section className="py-12 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
          {/* Left Column: Narrative (8 cols) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronze font-semibold mb-2 sm:mb-3">
                <span className="w-5 sm:w-6 h-px bg-studio-bronze" />
                <span>Architectural Narrative</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-studio-charcoal mb-4 sm:mb-6 font-normal">
                Design Vision & Spatial Concept
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-studio-muted leading-relaxed font-light whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Design Highlights */}
            <div className="pt-6 border-t border-studio-border">
              <h3 className="font-serif text-xl sm:text-2xl text-studio-charcoal mb-4">
                Signature Project Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="p-3.5 sm:p-4 bg-white border border-studio-border/70 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-studio-bronze mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                      Bespoke Spatial Flow
                    </h4>
                    <p className="text-[11px] sm:text-xs text-studio-muted mt-0.5">
                      Tailored architectural layout maximizing natural light and ventilation.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 bg-white border border-studio-border/70 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-studio-bronze mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                      Precision Millwork
                    </h4>
                    <p className="text-[11px] sm:text-xs text-studio-muted mt-0.5">
                      Custom cabinetry and joinery fabricated by master craftsmen.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 bg-white border border-studio-border/70 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-studio-bronze mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                      Architectural Lighting
                    </h4>
                    <p className="text-[11px] sm:text-xs text-studio-muted mt-0.5">
                      Multi-layered ambient, task, and accent lighting scenes.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 bg-white border border-studio-border/70 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-studio-bronze mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                      Turnkey Execution
                    </h4>
                    <p className="text-[11px] sm:text-xs text-studio-muted mt-0.5">
                      Flawlessly delivered with verified quality control protocols.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Materials & Consultation Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <div className="bg-white p-6 sm:p-8 border border-studio-border shadow-sm">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-studio-bronze font-semibold mb-3 sm:mb-4">
                <Layers className="w-4 h-4" />
                <span>Material Palette</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-studio-charcoal mb-4">
                Authentic Specifications
              </h3>

              {project.materials && project.materials.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.materials.map((mat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-studio-bg border border-studio-border text-[11px] sm:text-xs text-studio-charcoal font-medium"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-studio-muted">Curated natural stone & Italian veneers.</p>
              )}

              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-studio-border/60">
                <p className="text-xs text-studio-muted leading-relaxed font-light mb-5 sm:mb-6">
                  Inspired by this design? Connect with our design studio to explore similar concepts for your property.
                </p>
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-studio-charcoal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-bronze transition-colors shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-studio-bronze" />
                  <span>Inquire About This Design</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Project Visual Gallery */}
      <section className="py-12 sm:py-16 md:py-24 bg-studio-sand/40 border-y border-studio-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronze font-semibold block mb-1.5">
                Visual Documentation
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-studio-charcoal">
                Project Gallery & Close-ups
              </h3>
            </div>
            <p className="text-xs text-studio-muted mt-1.5 sm:mt-0 font-medium">
              Click any photo for high-resolution inspection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allImages.map((imgUrl, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative aspect-[4/3] overflow-hidden bg-studio-charcoal cursor-pointer shadow-md"
              >
                <img
                  src={imgUrl}
                  alt={`${project.title} Photo ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white/90 text-studio-charcoal text-[11px] sm:text-xs uppercase tracking-widest font-semibold backdrop-blur-sm">
                    View Fullscreen
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 text-white hover:text-studio-bronze z-50 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Prev Button */}
            <button
              onClick={() =>
                setActiveLightboxIndex((prev) =>
                  prev > 0 ? prev - 1 : allImages.length - 1
                )
              }
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white hover:text-studio-bronze z-50 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Lightbox Image */}
            <div className="max-w-5xl max-h-[85vh] flex items-center justify-center px-8">
              <img
                src={allImages[activeLightboxIndex]}
                alt={`Photo ${activeLightboxIndex + 1}`}
                className="max-h-[80vh] sm:max-h-[85vh] max-w-full object-contain shadow-2xl"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setActiveLightboxIndex((prev) =>
                  prev < allImages.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white hover:text-studio-bronze z-50 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Caption */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-0 text-center text-stone-300 text-[10px] sm:text-xs tracking-widest uppercase px-4 truncate">
              {project.title} — Image {activeLightboxIndex + 1} of {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Related Projects in Same Category */}
      {relatedProjects.length > 0 && (
        <section className="py-16 sm:py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronze font-semibold block mb-1.5">
                More in {categoryName}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-studio-charcoal">
                Related Design Studies
              </h3>
            </div>
            <Link
              to={`/projects/${project.category}`}
              className="text-xs uppercase tracking-widest font-semibold text-studio-charcoal hover:text-studio-bronze transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <span>View All {categoryName}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {relatedProjects.map((rel, idx) => (
              <ProjectCard key={rel._id || rel.slug} project={rel} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Dedicated Consultation CTA */}
      <ContactCTA />
    </div>
  );
};

export default ProjectDetails;
