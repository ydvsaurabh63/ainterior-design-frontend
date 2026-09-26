import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Wand2 } from 'lucide-react';

const LOADING_MESSAGES = [
  'Analyzing room perspective and architecture...',
  'Mapping depth dimensions and wall boundaries...',
  'Applying selected interior design style textures...',
  'Generating realistic material lighting & shadow pass...',
  'Rendering final photorealistic interior visualization...'
];

const LoadingDesign = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[440px] bg-studio-charcoal text-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-xl border border-studio-border">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#B89255_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Animated rotating outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        className="w-20 h-20 border-2 border-studio-bronze/30 border-t-studio-bronze rounded-full mb-6 flex items-center justify-center relative"
      >
        <Wand2 className="w-8 h-8 text-studio-bronze" />
      </motion.div>

      <span className="text-xs uppercase tracking-[0.3em] text-studio-bronze font-bold mb-2 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-studio-bronze animate-pulse" />
        <span>Designing your room...</span>
      </span>

      <h3 className="text-xl font-serif text-stone-100 mb-3 font-medium">
        Virtual AI Interior Designer
      </h3>

      {/* Dynamic Animated Status Message */}
      <div className="h-8 flex items-center justify-center mb-6">
        <motion.p
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="text-xs text-stone-300 font-light tracking-wide max-w-md"
        >
          {LOADING_MESSAGES[currentMessageIndex]}
        </motion.p>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full max-w-xs bg-stone-800 rounded-full h-1.5 overflow-hidden border border-stone-700/50">
        <motion.div
          initial={{ width: '5%' }}
          animate={{ width: ['5%', '35%', '70%', '95%'] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="bg-gradient-to-r from-amber-600 via-studio-bronze to-amber-400 h-full rounded-full"
        />
      </div>

      <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-4">
        Synthesizing high-resolution interior layout
      </span>
    </div>
  );
};

export default LoadingDesign;
