import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

const scenes = [
  // Disabled: modern-house.mp4
  // {
  //   id: 'house',
  //   label: '3D House Walkthrough',
  //   src: '/videos/modern-house.mp4',
  //   poster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90',
  //   tag: 'Architectural 3D Tour'
  // },
  {
    id: 'interior',
    label: 'Luxury Interior Suite',
    src: '/videos/luxury-interior.mp4',
    poster: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90',
    tag: 'Bespoke Living Space'
  }
];

const Hero = () => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const videoRef = useRef(null);

  const activeScene = scenes[activeSceneIndex] || scenes[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeSceneIndex]);

  return (
    <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden bg-studio-dark">
      {/* Background Video with Cinematic Darkened Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          key={activeScene.id}
          autoPlay
          loop
          muted
          playsInline
          poster={activeScene.poster}
          className="w-full h-full object-cover object-center scale-105 transition-opacity duration-1000"
        >
          <source src={activeScene.src} type="video/mp4" />
        </video>

        {/* Lightened, subtle overlay so background video is clearly visible */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Floating Interactive Video Scene Controller - Responsive Positioning */}
      {/* Desktop Version: Top-Right */}
      {scenes.length > 1 && (
        <div className="hidden sm:flex absolute top-24 right-6 lg:right-8 z-20 items-center">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 shadow-2xl">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => setActiveSceneIndex(idx)}
                className={`px-3 py-1 rounded-full text-xs font-medium tracking-wider transition-all duration-300 ${
                  activeSceneIndex === idx
                    ? 'bg-white text-studio-charcoal shadow-md font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {scene.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Version: Discreet Compact Controls in Bottom Corner */}
      {scenes.length > 1 && (
        <div className="flex sm:hidden absolute bottom-3 right-3 z-20 items-center gap-1.5 p-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white">
          <button
            onClick={() => setActiveSceneIndex((prev) => (prev === 0 ? 1 : 0))}
            title="Switch 3D View"
            className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center gap-1"
          >
            <Eye className="w-3 h-3 text-studio-bronzeLight" />
            <span>{activeSceneIndex === 0 ? 'Interior' : 'Villa'}</span>
          </button>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 sm:pt-28 sm:pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[52px] tracking-tight font-extrabold text-white leading-[1.18] mb-3.5 sm:mb-5 drop-shadow-xl px-2 max-w-3xl mx-auto"
        >
          Designing Spaces That <br className="hidden sm:inline" />
          <span className="font-extrabold text-studio-bronzeLight">Feel Like Home</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-stone-200/90 font-light leading-relaxed mb-10 sm:mb-14 px-4 drop-shadow-md"
        >
          Thoughtfully designed interiors crafted around your lifestyle, comfort and personality.
        </motion.p>

        {/* Floating Quick Stats (2 col on mobile, 4 col on desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 pt-6 sm:pt-10 border-t border-white/20 text-white max-w-3xl mx-auto"
        >
          <div className="p-1.5 sm:p-2">
            <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">150+</p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-300 font-semibold mt-0.5">Homes Transformed</p>
          </div>
          <div className="p-1.5 sm:p-2">
            <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">12+</p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-300 font-semibold mt-0.5">Years of Craft</p>
          </div>
          <div className="p-1.5 sm:p-2">
            <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">100%</p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-300 font-semibold mt-0.5">Turnkey Handover</p>
          </div>
          <div className="p-1.5 sm:p-2">
            <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">25+</p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-300 font-semibold mt-0.5">Design Accolades</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

