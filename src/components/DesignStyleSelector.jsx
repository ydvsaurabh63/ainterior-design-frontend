import React from 'react';
import { Sparkles, CheckCircle2, Home, BedDouble, Utensils, Building2 } from 'lucide-react';

export const ROOM_TYPES = [
  { id: 'Living Room', label: 'Living Room', icon: Home },
  { id: 'Bedroom', label: 'Bedroom', icon: BedDouble },
  { id: 'Kitchen', label: 'Kitchen', icon: Utensils },
  { id: 'Full Home', label: 'Full Home', icon: Building2 }
];

export const DESIGN_STYLES = [
  {
    id: 'Modern',
    name: 'Modern',
    description: 'Sleek geometric lines, neutral palette & functional architectural luxury',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Luxury',
    name: 'Luxury',
    description: 'Opulent marble, custom warm sconces, bronze trims & velvet accents',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Minimalist',
    name: 'Minimalist',
    description: 'Clutter-free space, subtle monochromatic textures & clean organic form',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Contemporary',
    name: 'Contemporary',
    description: 'Curated modern aesthetics, statement artwork & fluid open lighting',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Scandinavian',
    name: 'Scandinavian',
    description: 'Warm natural oak wood, cozy hygge textiles & soft ambient daylight',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Traditional',
    name: 'Traditional',
    description: 'Classic architectural crown moldings, rich dark wood & timeless elegance',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'Industrial',
    name: 'Industrial',
    description: 'Exposed structural elements, matte black steel & raw brick textures',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80'
  }
];

const DesignStyleSelector = ({
  hasUploadedImage,
  roomType,
  setRoomType,
  selectedStyle,
  setSelectedStyle,
  customInstruction,
  setCustomInstruction
}) => {
  if (!hasUploadedImage) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* STEP 2: Room Type Selection */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-studio-charcoal font-bold block mb-3">
          STEP 2 — SELECT ROOM TYPE {!roomType && <span className="text-[10px] text-amber-600 font-normal tracking-normal lowercase ml-1">(choose 1)</span>}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ROOM_TYPES.map((rt) => {
            const IconComp = rt.icon;
            const isSelected = roomType === rt.id;
            return (
              <button
                key={rt.id}
                type="button"
                onClick={() => setRoomType(rt.id)}
                className={`py-3 px-3 border text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-studio-charcoal text-white border-studio-charcoal shadow-sm'
                    : 'bg-white text-studio-charcoal border-studio-border hover:border-studio-bronze hover:bg-studio-sand/30'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isSelected ? 'text-studio-bronze' : 'text-studio-muted'}`} />
                <span>{rt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: Select Interior Design Style Cards (Revealed after Room Type is selected) */}
      {roomType && (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-[0.2em] text-studio-charcoal font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-studio-bronze" />
              <span>STEP 3 — SELECT INTERIOR DESIGN STYLE {!selectedStyle && <span className="text-[10px] text-amber-600 font-normal tracking-normal lowercase ml-1">(choose 1)</span>}</span>
            </label>
            <span className="text-[10px] text-studio-bronze font-semibold uppercase tracking-wider">
              7 Signature Styles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {DESIGN_STYLES.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`relative border text-left overflow-hidden transition-all group cursor-pointer ${
                    isSelected
                      ? 'border-studio-bronze ring-2 ring-studio-bronze/40 bg-studio-sand/30 shadow-md'
                      : 'border-studio-border hover:border-studio-bronze/60 bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-studio-bronze text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Style Reference</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5">
                      <span className="text-xs font-serif font-bold uppercase tracking-wider text-white block">
                        {style.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] text-studio-muted leading-relaxed font-light line-clamp-2">
                      {style.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Custom Design Requirement */}
      {roomType && selectedStyle && (
        <div className="animate-fadeIn">
          <label className="text-xs uppercase tracking-[0.2em] text-studio-charcoal font-bold block mb-2">
            Custom Design Instruction <span className="text-[10px] text-studio-muted font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder="e.g. Use beige walls, wooden furniture and warm lighting."
            className="w-full p-3 bg-studio-bg border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze placeholder:text-stone-400 resize-none"
          />
        </div>
      )}
    </div>
  );
};

export default DesignStyleSelector;
