import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight, Sparkles } from 'lucide-react';

const BeforeAfterSlider = ({ originalImage, generatedImage, roomType, styleName }) => {
  const containerRef = useRef(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // pointer capture fallback
    }
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // release capture fallback
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Slider Header info */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-studio-charcoal">
          Interactive Before / After Transformation
        </span>
        <span className="text-[10px] uppercase tracking-wider text-studio-muted font-light hidden sm:inline">
          Drag slider or use arrow keys
        </span>
      </div>

      {/* Main Interactive Viewport Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Before and after room redesign comparison slider"
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[500px] overflow-hidden border border-studio-border bg-stone-900 select-none cursor-ew-resize touch-none focus:outline-none focus:ring-2 focus:ring-studio-bronze shadow-lg"
      >
        {/* 1. Base Background Image: BEFORE (Original Uploaded Room) */}
        <img
          src={originalImage}
          alt="Original Room"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* 2. Overlaid Clipped Image: AFTER (AI Redesigned Room) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition}%)`
          }}
        >
          <img
            src={generatedImage}
            alt="AI Redesigned Room"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* 3. Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 bg-black/85 text-white text-[9px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md border border-white/20 select-none pointer-events-none z-10 shadow-md">
          BEFORE
        </div>

        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 bg-studio-bronze text-white text-[9px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md border border-amber-300 select-none pointer-events-none flex items-center gap-1 sm:gap-1.5 z-10 shadow-md max-w-[55%] truncate">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white flex-shrink-0" />
          <span className="truncate">AFTER ({styleName.toUpperCase()})</span>
        </div>

        {/* 4. Vertical Draggable Divider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

          {/* Circular handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-studio-charcoal shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform group">
            <ChevronsLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-studio-charcoal group-hover:text-studio-bronze transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
