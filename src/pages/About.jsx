import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import ContactCTA from '../components/ContactCTA';

const About = () => {
  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Consultation',
      description: 'We begin with an in-depth dialogue examining your spatial needs, lifestyle patterns, family dynamics, and budget expectations.'
    },
    {
      step: '02',
      title: 'Concept & Material Curation',
      description: 'Our team crafts tactile mood boards with authentic marble samples, timber veneers, customized upholstery swatches, and spatial flow diagrams.'
    },
    {
      step: '03',
      title: 'Photorealistic 3D Renders',
      description: 'Experience your future space with millimeter-precise 3D walkthroughs, lighting simulations, and detailed technical drawings.'
    },
    {
      step: '04',
      title: 'Turnkey Execution & Styling',
      description: 'Our civil engineers and master artisans take full charge on-site, delivering on-time handover with final bespoke art curation.'
    }
  ];

  return (
    <div className="bg-studio-bg min-h-screen pt-24 md:pt-32">
      {/* 1. Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-studio-bronze font-semibold mb-4">
            <span className="w-6 h-px bg-studio-bronze" />
            <span>The Studio Narrative</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-studio-charcoal font-normal tracking-tight leading-[1.1] mb-6">
            Pioneering Thoughtful Spaces Designed for Timeless Living
          </h1>
          <p className="text-base sm:text-lg text-studio-muted leading-relaxed font-light">
            Founded in 2014, aiterior is a bespoke residential interior architecture practice combining AI spatial design with master craftsmanship.
            We treat every home as a living sanctuary, balancing raw organic textures with quiet modernist proportions.
          </p>
        </div>
      </div>

      {/* 2. Hero Split Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 aspect-[16/10] overflow-hidden shadow-luxury">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85"
              alt="Studio Interior Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <div className="overflow-hidden shadow-luxury aspect-[4/3] md:aspect-auto">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                alt="Travertine Kitchen Craft"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden shadow-luxury aspect-[4/3] md:aspect-auto">
              <img
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80"
                alt="Master Suite Architecture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Studio Process */}
      <section className="py-20 md:py-28 bg-white border-y border-studio-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="How We Work"
            title="Our Four-Stage Design Journey"
            description="A structured, transparent methodology ensuring complete clarity from preliminary sketches to final key handover."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-studio-bg p-8 border border-studio-border/80 flex flex-col justify-between relative group hover:border-studio-bronze transition-colors"
              >
                <div>
                  <span className="font-serif text-3xl font-light text-studio-bronze block mb-4">
                    {step.step}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-studio-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-studio-muted leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-studio-border/60 flex items-center gap-2 text-[11px] uppercase tracking-wider text-studio-bronze font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Milestone</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <ContactCTA />
    </div>
  );
};

export default About;
