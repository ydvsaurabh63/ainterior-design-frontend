import React from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Layers,
  Award,
  Hammer
} from 'lucide-react';
import Hero from '../components/Hero';
import FurnitureTryOnShowcase from '../components/FurnitureTryOnShowcase';
import FurniturePairingShowcase from '../components/FurniturePairingShowcase';
import SectionTitle from '../components/SectionTitle';

const Home = () => {
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

      {/* 2. Furniture Try-On / Room Visualizer */}
      <FurnitureTryOnShowcase />

      {/* 3. Furniture Pairing / "Not sure what goes with what?" */}
      <FurniturePairingShowcase />

      {/* 4. Why Choose Us Section */}
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
    </div>
  );
};

export default Home;
