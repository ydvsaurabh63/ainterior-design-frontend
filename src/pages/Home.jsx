import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Palette,
  Layers,
  Award,
  Hammer,
  ArrowRight,
  Sparkles,
  Star,
  Quote,
  Send,
  CheckCircle2
} from 'lucide-react';
import Hero from '../components/Hero';
import FurnitureTryOnShowcase from '../components/FurnitureTryOnShowcase';
import FurniturePairingShowcase from '../components/FurniturePairingShowcase';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';
import TestimonialCard from '../components/TestimonialCard';
import ContactCTA from '../components/ContactCTA';
import { projectApi, testimonialApi, enquiryApi } from '../services/api';
import { fallbackProjects, fallbackTestimonials } from '../data/fallbackProjects';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Quick Enquiry Form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: '3 BHK',
    budget: '₹25L - ₹40L',
    city: 'Noida',
    message: ''
  });
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Fetch Featured Projects dynamically from backend API
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await projectApi.getAll({ featured: true });
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedProjects(data.slice(0, 6));
        } else {
          // Fallback to seeded/sample projects
          const filtered = fallbackProjects.filter((p) => p.featured);
          setFeaturedProjects(filtered.length > 0 ? filtered.slice(0, 6) : fallbackProjects.slice(0, 6));
        }
      } catch (err) {
        console.warn('Using seeded featured projects:', err.message);
        const filtered = fallbackProjects.filter((p) => p.featured);
        setFeaturedProjects(filtered.length > 0 ? filtered.slice(0, 6) : fallbackProjects.slice(0, 6));
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchFeatured();
  }, []);

  // Fetch Testimonials dynamically from backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await testimonialApi.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        console.warn('Using seeded testimonials:', err.message);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    fetchReviews();
  }, []);

  // Submit Quick Consultation Enquiry
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryForm.name.trim() || !enquiryForm.phone.trim()) {
      toast.error('Please provide at least your name and phone number');
      return;
    }

    setSubmittingEnquiry(true);
    try {
      await enquiryApi.create(enquiryForm);
      toast.success('Consultation request received! Our designers will call you.');
      setEnquirySuccess(true);
      setEnquiryForm({
        name: '',
        phone: '',
        email: '',
        propertyType: '3 BHK',
        budget: '₹25L - ₹40L',
        city: 'Noida',
        message: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed to submit enquiry');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const whyChooseUsFeatures = [
    {
      icon: Palette,
      title: 'Personalized Design',
      description: 'Custom-tailored spatial architecture shaped precisely around your daily lifestyle, aesthetics, and functional demands.'
    },
    {
      icon: Layers,
      title: 'Quality Materials',
      description: 'Direct sourcing of authentic Italian marbles, FSC-certified hardwoods, fluted glass, and durable architectural hardware.'
    },
    {
      icon: Award,
      title: 'Experienced Designers',
      description: 'Award-winning architects and interior stylists with over 12+ years of luxury residential execution expertise.'
    },
    {
      icon: Hammer,
      title: 'End-to-End Execution',
      description: 'Zero-hassle turnkey project delivery encompassing 3D visualizations, civil engineering, bespoke millwork, and final styling.'
    }
  ];

  return (
    <div className="bg-studio-bg min-h-screen overflow-x-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Dynamic Featured Projects / Signature Works (Synced with Admin Panel) */}
      <section className="py-16 sm:py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronze font-semibold mb-2">
              <span className="w-5 sm:w-6 h-px bg-studio-bronze" />
              <span>Signature Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-studio-charcoal">
              Featured Residential Masterworks
            </h2>
          </div>
          <Link
            to="/projects"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-studio-charcoal hover:text-studio-bronze transition-colors group"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white/70 border border-studio-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((project, idx) => (
              <ProjectCard key={project._id || project.slug} project={project} index={idx} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 bg-studio-charcoal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-bronze transition-colors shadow-sm"
          >
            <span>View Full Portfolio ({fallbackProjects.length}+ Works)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Furniture Try-On / Room Visualizer */}
      <FurnitureTryOnShowcase />

      {/* 4. Furniture Pairing / "Not sure what goes with what?" */}
      <FurniturePairingShowcase />

      {/* 5. Why Choose Us Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-white border-y border-studio-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="The Aura Difference"
            title="Why Choose Our Studio"
            description="Our uncompromising commitment to architectural purity and turnkey project precision sets us apart."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChooseUsFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 sm:p-8 bg-studio-bg border border-studio-border/70 hover:border-studio-bronze transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-studio-border flex items-center justify-center text-studio-charcoal group-hover:bg-studio-charcoal group-hover:text-white transition-colors mb-5 sm:mb-6 shadow-sm">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-studio-bronze group-hover:text-studio-bronzeLight" />
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl text-studio-charcoal font-medium mb-2 sm:mb-3">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-studio-muted leading-relaxed font-light">
                      {feat.description}
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-studio-border/50 text-[10px] sm:text-[11px] font-mono text-studio-bronze">
                    0{idx + 1} //
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Dynamic Client Testimonials / Reviews (Synced with Admin Panel) */}
      <section className="py-16 sm:py-20 md:py-28 bg-studio-sand/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Client Experiences"
            title="Voices of Homeowners"
            description="Read firsthand reflections from discerning patrons who entrusted our studio with their sacred residences."
          />

          {loadingTestimonials ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-white border border-studio-border animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {testimonials.map((testimonial, idx) => (
                <TestimonialCard
                  key={testimonial._id || idx}
                  testimonial={testimonial}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. Homepage Direct Consultation / Enquiry Form (Syncs with Admin Panel Enquiries) */}
      <section className="py-16 sm:py-24 bg-white border-t border-studio-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-studio-bronze font-semibold block mb-2">
              Book Consultation
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-studio-charcoal">
              Begin Your Architectural Journey
            </h2>
            <p className="text-xs sm:text-sm text-studio-muted mt-2 max-w-lg mx-auto">
              Schedule an in-depth spatial assessment with our principal design directors.
            </p>
          </div>

          <div className="bg-studio-bg p-6 sm:p-10 border border-studio-border shadow-sm">
            {enquirySuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-studio-bronze mx-auto mb-3" />
                <h3 className="font-serif text-2xl text-studio-charcoal mb-2">
                  Request Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-studio-muted mb-6">
                  Our principal consultant will review your spatial requirements and contact you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setEnquirySuccess(false)}
                  className="px-6 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-widest font-semibold hover:bg-studio-bronze transition-colors"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Verma"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Property Type
                    </label>
                    <select
                      value={enquiryForm.propertyType}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, propertyType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze"
                    >
                      <option value="2 BHK">2 BHK Apartment</option>
                      <option value="3 BHK">3 BHK Apartment</option>
                      <option value="4+ BHK / Penthouse">4+ BHK / Penthouse</option>
                      <option value="Independent Villa">Independent Villa</option>
                      <option value="Bespoke Furniture">Bespoke Furniture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Target Budget
                    </label>
                    <select
                      value={enquiryForm.budget}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, budget: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze"
                    >
                      <option value="₹15L - ₹25L">₹15L - ₹25L</option>
                      <option value="₹25L - ₹40L">₹25L - ₹40L</option>
                      <option value="₹40L - ₹75L">₹40L - ₹75L</option>
                      <option value="₹75L+ Luxury">₹75L+ Ultra Luxury</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Specific Spatial Needs / Message
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Tell us about your space, location, timeline or design preferences..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingEnquiry}
                  className="w-full py-3.5 bg-studio-charcoal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-bronze transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                >
                  {submittingEnquiry ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Book Principal Consultation</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 8. Luxury Bottom CTA Banner */}
      <ContactCTA />
    </div>
  );
};

export default Home;
