import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { pairingScenarios } from '../data/pairingShowcaseItems';

const FurniturePairingShowcase = () => {
  const fileInputRef = useRef(null);

  // Scenario state: 0 = Chairs, 1 = Rugs, 2 = Wall Paint
  const [scenarioIndex, setScenarioIndex] = useState(0);

  // Custom uploaded photo from user's gallery
  const [customRoomImage, setCustomRoomImage] = useState(null);
  const [customRoomFileName, setCustomRoomFileName] = useState('');
  const [paintIntensity, setPaintIntensity] = useState(55);

  // Active item index per scenario:
  // Scenario 0 (Chairs) defaults to index 1 (Groton)
  // Scenario 1 (Rugs) defaults to index 0 (Cream Shag)
  // Scenario 2 (Walls) defaults to index 0 (Sage Green)
  const [activeItems, setActiveItems] = useState({
    0: 1,
    1: 0,
    2: 0
  });

  const currentScenario = pairingScenarios[scenarioIndex];
  const currentItemIndex = activeItems[scenarioIndex] ?? 0;
  const activeItem = currentScenario.items[currentItemIndex] || currentScenario.items[0];

  // Set active item for the current scenario
  const handleSelectItem = (idx) => {
    setActiveItems((prev) => ({
      ...prev,
      [scenarioIndex]: idx
    }));
  };

  // Handle gallery photo upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (JPG, PNG, or WebP)');
        return;
      }
      const url = URL.createObjectURL(file);
      setCustomRoomImage(url);
      setCustomRoomFileName(file.name);
      // Auto-switch to Wall Paint Colors scenario to visualize colors immediately
      setScenarioIndex(2);
      toast.success('Room photo uploaded from gallery! Now pick any paint color below.');
    }
  };

  // Reset to default sample curated room
  const handleResetCustomImage = () => {
    setCustomRoomImage(null);
    setCustomRoomFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Reverted to curated sample room');
  };

  // Continuous slider navigation across items and scenarios
  const handlePrev = () => {
    if (currentItemIndex > 0) {
      handleSelectItem(currentItemIndex - 1);
    } else {
      // Go to previous scenario's last item
      const prevScenarioIndex =
        scenarioIndex === 0 ? pairingScenarios.length - 1 : scenarioIndex - 1;
      const prevItemsLength = pairingScenarios[prevScenarioIndex].items.length;
      setScenarioIndex(prevScenarioIndex);
      setActiveItems((prev) => ({
        ...prev,
        [prevScenarioIndex]: prevItemsLength - 1
      }));
    }
  };

  const handleNext = () => {
    if (currentItemIndex < currentScenario.items.length - 1) {
      handleSelectItem(currentItemIndex + 1);
    } else {
      // Go to next scenario's first item
      const nextScenarioIndex =
        scenarioIndex === pairingScenarios.length - 1 ? 0 : scenarioIndex + 1;
      setScenarioIndex(nextScenarioIndex);
      setActiveItems((prev) => ({
        ...prev,
        [nextScenarioIndex]: 0
      }));
    }
  };

  // Switch scenario directly from tabs
  const handleSwitchScenario = (newIndex) => {
    setScenarioIndex(newIndex);
  };

  return (
    <section className="relative py-14 sm:py-20 md:py-24 border-b border-neutral-200/80 overflow-hidden font-sans bg-[#FAF8F5]">
      {/* Hidden file input for gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Subtle architectural graph paper grid background matching the screenshot */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Heading, Subtext, Scenario Switcher Tabs, Gallery Upload, "More examples ->" */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Quick Scenario Slider Tabs */}
            <div className="inline-flex items-center p-1 rounded-full bg-neutral-200/60 border border-neutral-300/80 mb-4 max-w-fit">
              {pairingScenarios.map((sc, sIdx) => {
                const isActive = scenarioIndex === sIdx;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleSwitchScenario(sIdx)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white text-neutral-900 shadow-sm font-bold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <span>{sc.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]" />
                    )}
                  </button>
                );
              })}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-neutral-900 tracking-tight leading-[1.15] mb-4 sm:mb-5">
              Not sure what goes with what?
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed mb-5 max-w-md">
              Keep the room exactly as it is and try what you are missing — chairs for your table, a rug
              under the sofa, or designer paint colors for your walls. You see at once what goes together.
            </p>


            <div className="flex items-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-neutral-900 hover:text-studio-bronze transition-colors group"
              >
                <span>Explore Projects</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              {/* Slider indicator dots */}
              <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-neutral-300">
                {pairingScenarios.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSwitchScenario(sIdx)}
                    className={`h-2 rounded-full transition-all ${
                      scenarioIndex === sIdx
                        ? 'w-6 bg-[#84cc16]'
                        : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                    }`}
                    aria-label={`Slide ${sIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Room Showcase with Top Tag, Gallery Button, Navigation Arrows & Item Selector */}
          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
            {/* The Main Room Image Container */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-neutral-300/80 bg-neutral-900 aspect-[4/3] sm:aspect-[16/10] w-full group">
              {/* Room Image with Smooth Crossfade Animation & Live Color Blending for Gallery Uploads */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={customRoomImage ? `custom-${activeItem.id}` : activeItem.id}
                  className="relative w-full h-full"
                  initial={{ opacity: 0.65 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.65 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={customRoomImage || activeItem.roomImage}
                    alt={customRoomImage ? 'Your Room' : activeItem.name}
                    className="w-full h-full object-cover object-center select-none"
                  />

                  {/* If custom room photo is uploaded and Wall Paint scenario is active: Realistic Color Blend Overlay */}
                  {customRoomImage && scenarioIndex === 2 && activeItem.colorHex && (
                    <>
                      <div
                        className="absolute inset-0 pointer-events-none transition-all duration-300"
                        style={{
                          backgroundColor: activeItem.colorHex,
                          mixBlendMode: 'multiply',
                          opacity: (paintIntensity / 100) * 0.75
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none transition-all duration-300"
                        style={{
                          backgroundColor: activeItem.colorHex,
                          mixBlendMode: 'color',
                          opacity: (paintIntensity / 100) * 0.65
                        }}
                      />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Floating Tag in Top-Left Corner */}
              <div className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5 z-20">
                <div className="bg-white/95 backdrop-blur-md text-neutral-900 text-[10px] sm:text-xs md:text-sm font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-black/5 flex items-center gap-1.5">
                  <span>{customRoomImage ? 'Your Uploaded Room' : currentScenario.tag}</span>
                </div>
              </div>

              {/* Floating Button in Top-Right Corner for quick Gallery Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 z-20 bg-white/95 backdrop-blur-md hover:bg-white text-neutral-900 text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-full shadow-md border border-black/10 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-neutral-700" />
                <span>{customRoomImage ? 'Change Photo' : 'Upload Gallery'}</span>
              </button>

              {/* Navigation Arrow Left */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 border border-black/10 cursor-pointer"
                aria-label="Previous item"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Navigation Arrow Right */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 border border-black/10 cursor-pointer"
                aria-label="Next item"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Bottom Overlay Floating Pill (White pill with Brand, Title, Dimensions) */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-5 sm:right-5 z-20">
                <div className="bg-white/95 backdrop-blur-md rounded-full py-1.5 px-3 sm:py-2.5 sm:px-5 flex items-center justify-between shadow-lg border border-black/10 text-neutral-900 gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                    {/* Optional Color swatch preview if available */}
                    {activeItem.colorHex && (
                      <span
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-black/20 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: activeItem.colorHex }}
                        title={activeItem.name}
                      />
                    )}

                    {/* Brand Identifier */}
                    <span className="text-[9px] sm:text-xs font-black tracking-wider uppercase text-neutral-800 font-mono flex-shrink-0">
                      {activeItem.brand}
                    </span>

                    {/* Item Title */}
                    <span className="text-[11px] sm:text-sm font-semibold truncate text-neutral-900">
                      {activeItem.name}
                    </span>
                  </div>

                  {/* Dimensions / Finish */}
                  <span className="text-[9px] sm:text-xs font-mono text-neutral-500 font-normal flex-shrink-0 ml-1">
                    {activeItem.dimensions}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Selection Cards (3 items for the active scenario) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-1">
              {currentScenario.items.map((item, idx) => {
                const isSelected = currentItemIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(idx)}
                    className={`bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between select-none ${
                      isSelected
                        ? 'border-2 border-[#84cc16] ring-2 ring-[#84cc16]/25 bg-lime-50/15 shadow-md scale-[1.01]'
                        : 'border border-neutral-200/90 hover:border-neutral-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Item Thumbnail on clean background */}
                    <div className="w-full h-16 sm:h-24 md:h-28 bg-[#FAFAFA] rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center p-1 sm:p-2 mb-1.5 relative">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className={`w-full h-full object-contain ${
                          scenarioIndex === 0 ? 'mix-blend-multiply' : 'rounded-md shadow-xs'
                        } transition-transform hover:scale-105`}
                      />
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#84cc16]" />
                      )}
                    </div>

                    {/* Bottom Metadata: Brand + Name + Dimensions */}
                    <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-neutral-700 font-medium">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {item.colorHex && (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/15 flex-shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        )}
                        <span className="font-bold uppercase tracking-tight text-neutral-900 text-[9px] sm:text-[10px]">
                          {item.brand}
                        </span>
                        <span className="truncate font-semibold text-[9px] sm:text-[11px]">
                          {item.shortName || item.name.split(' ')[0]}
                        </span>
                      </div>
                      <span className="font-mono text-neutral-400 text-[8px] sm:text-[10px] flex-shrink-0 ml-1">
                        {item.dimensions}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FurniturePairingShowcase;
