import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  RotateCcw,
  Eye,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { furnitureTryOnItems } from '../data/furnitureTryOnItems';

const FurnitureTryOnShowcase = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const fileInputRef = useRef(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  // Duplicate items for seamless infinite marquee loop
  const displayItems = [...furnitureTryOnItems, ...furnitureTryOnItems];

  // Default active item is LILLEHEM (item 5, index 4) as in the reference image
  const [selectedItem, setSelectedItem] = useState(
    furnitureTryOnItems.find((item) => item.defaultSelected) || furnitureTryOnItems[4]
  );

  const [productUrl, setProductUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState('furnished'); // 'furnished' | 'empty'
  const [customRoomImage, setCustomRoomImage] = useState(null);
  const [showHotspot, setShowHotspot] = useState(true);

  // Smooth continuous auto-scroll moving products right to left
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let animId;
    let lastTime = performance.now();
    const speedPxPerSecond = 35; // gentle, readable continuous gliding

    const step = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPausedRef.current && el) {
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        } else {
          el.scrollLeft += speedPxPerSecond * delta;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Horizontal scroll controls for carousel
  const scroll = (direction) => {
    if (carouselRef.current) {
      isPausedRef.current = true;
      const scrollAmount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      // Resume auto-scroll after 2.5 seconds
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isPausedRef.current = false;
      }, 2500);
    }
  };

  // Handle URL form submit
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!productUrl.trim()) {
      toast.error('Please enter a product link or choose one below');
      return;
    }

    setIsAnalyzing(true);
    toast.loading('Analyzing furniture dimensions and 3D mesh...', { id: 'ai-tryon' });

    setTimeout(() => {
      setIsAnalyzing(false);
      setViewMode('furnished');
      toast.success(`Success! Visualized product in room.`, { id: 'ai-tryon' });
    }, 1200);
  };

  // Quick preset click
  const handleSelectPreset = (item) => {
    setSelectedItem(item);
    setViewMode('furnished');
    setProductUrl(item.productUrl);
    toast.success(`Previewing ${item.name}`, { duration: 1800 });
  };

  // Handle custom room photo upload
  const handleRoomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (JPG, PNG, or WebP)');
        return;
      }
      const url = URL.createObjectURL(file);
      setCustomRoomImage(url);
      setViewMode('furnished');
      toast.success('Your room photo uploaded! Placing furniture in your space...');
    }
  };

  // Revert back to curated sample room
  const handleResetRoom = () => {
    setCustomRoomImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Reverted to demo curated room');
  };

  // Determine current active room background
  const currentRoomSrc = customRoomImage
    ? customRoomImage
    : viewMode === 'empty'
    ? '/sample-rooms/room-showcase.jpg'
    : selectedItem.roomImage || '/sample-rooms/room-furnished-sofa.jpg';

  return (
    <section className="relative bg-[#FAF9F5] border-b border-neutral-200/80 pt-10 pb-14 sm:pt-14 sm:pb-20 overflow-hidden font-sans">
      {/* Background ambient aesthetic glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-50/60 rounded-full blur-2xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split: Controls/Copy Left, Big Room Showcase Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Eyebrow, Bold Headline, Input Bar, Stats */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow text badge exactly like Image 1 */}
            <div className="inline-flex items-center gap-1.5 mb-3 sm:mb-4">
              <span className="text-[11px] sm:text-xs font-black tracking-[0.16em] uppercase text-[#5B8F1D]">
                NO MORE “I THINK IT WILL WORK”
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.12] mb-3 sm:mb-4">
              See any furniture <br />
              in your room <br />
              <span className="text-[#7CB328]">before you buy it</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed mb-6 sm:mb-7 max-w-md">
              Paste a product link and upload a room photo. Preview that item in your space before you buy.
            </p>

            {/* Input Bar Form */}
            <form onSubmit={handleUrlSubmit} className="relative w-full max-w-md">
              <div className="relative flex items-center bg-white rounded-full border border-neutral-300 shadow-sm hover:border-neutral-400 focus-within:border-[#7CB328] focus-within:ring-2 focus-within:ring-[#7CB328]/30 transition-all p-1 sm:p-1.5 pl-3.5 sm:pl-5">
                <input
                  type="text"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="Paste a product link..."
                  className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none pr-2"
                />
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="flex-shrink-0 inline-flex items-center justify-center gap-1 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#84cc16] hover:bg-[#74b816] active:scale-95 text-neutral-950 font-bold text-xs sm:text-sm rounded-full transition-all shadow-sm"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <>
                      <span>See it</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Activity Counter / Social Proof */}
            <div className="flex items-center gap-2 mt-3.5 text-xs font-medium text-neutral-600">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84cc16] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#84cc16]"></span>
              </span>
              <span>246 try-ons today</span>
            </div>

            {/* Interactive helper pills */}
            <div className="mt-5 pt-4 sm:mt-6 sm:pt-5 border-t border-neutral-200/70 flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-md">
              <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Quick Try:</span>
              <button
                type="button"
                onClick={() => handleSelectPreset(furnitureTryOnItems[4])}
                className={`text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all border ${
                  selectedItem.id === 'lillehem-modular-sofa'
                    ? 'bg-[#84cc16]/15 border-[#84cc16] text-neutral-900 font-bold'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                IKEA LILLEHEM Sofa
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(furnitureTryOnItems[8])}
                className={`text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all border ${
                  selectedItem.id === 'solid-wood-armchair'
                    ? 'bg-[#84cc16]/15 border-[#84cc16] text-neutral-900 font-bold'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                Oak Armchair
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(furnitureTryOnItems[0])}
                className={`text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all border ${
                  selectedItem.id === 'latitude-run-sectional'
                    ? 'bg-[#84cc16]/15 border-[#84cc16] text-neutral-900 font-bold'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                Dark Sectional
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: The Room Showcase (The 2nd Image) with Furniture Preview */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/90 bg-neutral-900 group aspect-[4/3] sm:aspect-[16/10] w-full">
              {/* Room Image Display */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentRoomSrc}
                  src={currentRoomSrc}
                  alt="Interior Room Try-on Preview"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.6 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover object-center select-none"
                />
              </AnimatePresence>

              {/* Ambient gradient at bottom for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Top Controls Overlay: Empty vs Furnished Room toggle & Upload Custom Room */}
              <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between gap-1.5 sm:gap-2 z-20">
                {/* Empty vs Furnished Toggle */}
                <div className="inline-flex p-0.5 sm:p-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                  <button
                    type="button"
                    onClick={() => setViewMode('furnished')}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
                      viewMode === 'furnished'
                        ? 'bg-[#84cc16] text-neutral-950 shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Furnished
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('empty')}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
                      viewMode === 'empty'
                        ? 'bg-white text-neutral-950 shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Original Room
                  </button>
                </div>

                {/* Upload your own room button */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {customRoomImage && (
                    <button
                      type="button"
                      onClick={handleResetRoom}
                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/60 hover:bg-neutral-800 backdrop-blur-md rounded-full border border-white/20 text-neutral-300 hover:text-white text-[10px] sm:text-xs font-medium transition-all shadow-sm cursor-pointer"
                      title="Reset to curated sample room"
                    >
                      <RotateCcw className="w-3 h-3 text-neutral-400" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleRoomUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/20 text-white text-[10px] sm:text-xs font-medium transition-all shadow-sm cursor-pointer"
                    title="Upload your own room photo"
                  >
                    <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#84cc16]" />
                    <span className="hidden sm:inline">{customRoomImage ? 'Change Room' : 'Use My Room'}</span>
                    <span className="sm:hidden">{customRoomImage ? 'Change' : 'Upload'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Placed Furniture Overlay on User's Uploaded Room Photo */}
              {customRoomImage && viewMode === 'furnished' && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`placed-furniture-${selectedItem.id}`}
                    initial={{ opacity: 0, scale: 0.88, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.28 }}
                    className="absolute bottom-[16%] sm:bottom-[18%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-auto"
                  >
                    {/* Realistic Floor Contact Ambient Shadow */}
                    <div className="absolute -bottom-2 sm:-bottom-3 w-[88%] h-5 sm:h-7 bg-black/45 rounded-full blur-md" />

                    {/* Furniture Cutout Image with Blend */}
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="max-h-40 sm:max-h-56 md:max-h-68 max-w-[85vw] sm:max-w-md object-contain mix-blend-multiply drop-shadow-2xl select-none"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Interactive Hotspot Marker on furniture in room */}
              {viewMode === 'furnished' && showHotspot && (
                <div
                  className={`absolute z-20 pointer-events-auto transition-all duration-300 ${
                    customRoomImage
                      ? 'bottom-[34%] left-1/2 -translate-x-1/2'
                      : 'bottom-[28%] left-[45%]'
                  }`}
                >
                  <div className="relative group/spot cursor-pointer">
                    <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-white opacity-60"></span>
                    <div className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/90 text-neutral-900 shadow-lg border border-white">
                      <span className="w-2 h-2 rounded-full bg-[#84cc16]"></span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-neutral-950/95 text-white text-xs rounded-xl shadow-2xl border border-white/10 opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none backdrop-blur-md">
                      <p className="font-bold text-white text-[11px] truncate">{selectedItem.name}</p>
                      <div className="flex justify-between items-center text-[10px] text-neutral-300 mt-1">
                        <span>{selectedItem.brand}</span>
                        <span className="text-[#a3e635] font-mono font-semibold">{selectedItem.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLOATING PILL AT BOTTOM OVERLAY (Exactly as shown in Image 1) */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-5 sm:left-5 sm:right-5 z-20">
                <div className="bg-[#151614]/90 backdrop-blur-md text-white rounded-full py-1.5 px-3 sm:py-2.5 sm:px-5 flex items-center justify-between gap-2 sm:gap-3 shadow-2xl border border-white/15">
                  <div className="flex items-center gap-1.5 sm:gap-3.5 min-w-0">
                    {/* Brand Pill */}
                    <span className="bg-white text-neutral-950 text-[9px] sm:text-xs font-black px-1.5 py-0.5 sm:px-2 rounded tracking-wider uppercase flex-shrink-0">
                      {selectedItem.brand}
                    </span>

                    {/* Product Name & Dimensions */}
                    <div className="truncate text-[11px] sm:text-sm font-medium text-neutral-100 flex items-center gap-1.5">
                      <span className="truncate">{selectedItem.name}</span>
                      <span className="font-mono text-[9px] sm:text-xs text-[#a3e635] font-normal flex-shrink-0">
                        {selectedItem.dimensions}
                      </span>
                    </div>
                  </div>

                  {/* Right Button: "Inquire →" */}
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] sm:text-sm font-bold text-[#84cc16] hover:text-[#a3e635] hover:underline transition-all group"
                  >
                    <span>Inquire</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CAROUSEL / ROW OF FURNITURE PRODUCTS (Exactly as shown in Image 1) */}
        <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-neutral-200/80">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500">
              Popular items tried by customers
            </p>
            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-7 h-7 rounded-full bg-white border border-neutral-300 hover:border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-7 h-7 rounded-full bg-white border border-neutral-300 hover:border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Card Track */}
          <div
            ref={carouselRef}
            onMouseEnter={() => { isPausedRef.current = true; }}
            onMouseLeave={() => { isPausedRef.current = false; }}
            onTouchStart={() => { isPausedRef.current = true; }}
            onTouchEnd={() => {
              clearTimeout(resumeTimeoutRef.current);
              resumeTimeoutRef.current = setTimeout(() => {
                isPausedRef.current = false;
              }, 2000);
            }}
            className="flex items-stretch gap-2.5 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayItems.map((item, idx) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => handleSelectPreset(item)}
                  className={`flex-shrink-0 w-28 sm:w-36 md:w-40 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 cursor-pointer transition-all duration-200 flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-2 border-[#84cc16] ring-2 ring-[#84cc16]/20 bg-lime-50/15 shadow-md scale-[1.02]'
                      : 'border border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="w-full h-20 sm:h-28 bg-[#F7F7F6] rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center p-1.5 sm:p-2 mb-1.5 sm:mb-2 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#84cc16]" />
                    )}
                  </div>

                  {/* Brand and Time metadata line */}
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-neutral-400 font-medium mb-1">
                    <span className="font-bold text-neutral-700 truncate max-w-[55px] sm:max-w-[65px]">{item.brand}</span>
                    <span className="flex-shrink-0">{item.time}</span>
                  </div>

                  {/* Product Title */}
                  <h4
                    className="text-[10px] sm:text-xs font-semibold text-neutral-800 line-clamp-2 leading-tight"
                    title={item.name}
                  >
                    {item.name}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FurnitureTryOnShowcase;
