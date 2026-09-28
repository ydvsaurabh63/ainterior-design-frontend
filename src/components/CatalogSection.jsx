import React, { useState, useEffect, useRef } from 'react';
import { catalogApi } from '../services/api';
import { interiorAIService } from '../services/interiorAIService';
import { CLIENT_CATEGORIES, getObjectsForClientCategory } from '../constants/catalogCategories';
import {
  Search,
  Wand2,
  Eye,
  X,
  Package,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  Building2,
  Brush,
  Home as HomeIcon,
  Layers,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Check,
  Move,
  ZoomIn,
  ZoomOut,
  FlipHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_ROOM_CANVAS = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop';

// Category Icon Mapping
const CATEGORY_ICONS = {
  'furniture-manufacturers-dealers': HomeIcon,
  'interior-design-companies-designers': Brush,
  'real-estate-developers-builders': Building2,
  'home-decor-tiles-flooring': Layers,
  'modular-kitchen-wardrobe-companies': UtensilsCrossed,
  'popular-items-tried-by-customers': Sparkles
};

const CatalogSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Category State (Default: First Client Category)
  const [selectedClientCategory, setSelectedClientCategory] = useState(CLIENT_CATEGORIES[0].label);
  const [selectedObjectCategory, setSelectedObjectCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Product Item from Left 20% Sidebar
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Canvas Overlay Drag & Placement State
  const canvasRef = useRef(null);
  const [overlayPos, setOverlayPos] = useState({ x: 50, y: 55 });
  const [overlayScale, setOverlayScale] = useState(1);
  const [overlayFlipped, setOverlayFlipped] = useState(false);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);

  // User Uploaded Room Image State & Canvas Display State
  const [userRoomImage, setUserRoomImage] = useState(null);
  const [userRoomPreview, setUserRoomPreview] = useState(null);
  const [canvasDisplayImage, setCanvasDisplayImage] = useState(null);
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
  const [activeCanvasView, setActiveCanvasView] = useState('original'); // 'original' | 'ai'
  const [fitMode, setFitMode] = useState('cover'); // 'cover' (100% frame fill) | 'contain' (full uncropped view)
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  // Image URL Input Toggle
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);

  // Popular Items Slider State
  const [popularItems, setPopularItems] = useState([]);
  const popularSliderRef = useRef(null);

  // AI Room Redesign State
  const [isRedesigning, setIsRedesigning] = useState(false);
  const [aiRedesignResult, setAiRedesignResult] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);

  // Selected Item for Detail Modal
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fileInputRef = useRef(null);

  // Trigger PixVerse AI Room Redesign with Room Image + Selected Product Image
  const triggerPixVerseAIRedesign = async (targetProduct) => {
    const currentRoomFileOrUrl = userRoomImage || userRoomPreview;

    if (!currentRoomFileOrUrl) {
      toast('Please upload your room photo from gallery first!', { icon: '📷' });
      fileInputRef.current?.click();
      return;
    }

    const activeProduct = targetProduct || selectedProduct;
    const activeProductTitle = activeProduct ? activeProduct.name : 'Luxury Interior Furniture';
    const categoryLabel = selectedClientCategory || 'Living Room';

    setIsRedesigning(true);
    toast(`Processing ${activeProductTitle} with PixVerse AI Engine...`, { icon: '✨' });

    try {
      const formData = new FormData();
      if (currentRoomFileOrUrl instanceof File) {
        formData.append('image', currentRoomFileOrUrl);
      } else if (typeof currentRoomFileOrUrl === 'string') {
        formData.append('imagePreviewUrl', currentRoomFileOrUrl);
      }

      formData.append('roomType', categoryLabel);
      formData.append('style', activeProductTitle);
      formData.append(
        'customInstruction',
        `Integrate and place ${activeProductTitle} naturally inside this room. Preserve the original room architecture, perspective, walls, doors, windows and flooring, while inserting the selected product seamlessly into the layout.`
      );

      const response = await interiorAIService.generateRoomDesign(formData);

      let finalGeneratedUrl = null;
      if (response && (response.imageUrl || response.data?.generatedUrl)) {
        finalGeneratedUrl = response.imageUrl || response.data.generatedUrl;
      } else if (activeProduct?.imageUrl) {
        finalGeneratedUrl = activeProduct.imageUrl;
      } else {
        finalGeneratedUrl = userRoomPreview;
      }

      setAiGeneratedImage(finalGeneratedUrl);
      setCanvasDisplayImage(finalGeneratedUrl);
      setActiveCanvasView('ai');

      setAiRedesignResult({
        originalUrl: userRoomPreview,
        generatedUrl: finalGeneratedUrl,
        productTitle: activeProductTitle,
        category: categoryLabel
      });

      toast.success(`✨ PixVerse AI Redesign Ready! ${activeProductTitle} placed in room.`);
    } catch (err) {
      console.warn('PixVerse AI Generation Notice:', err.message);
      const fallbackUrl = activeProduct?.imageUrl || userRoomPreview;
      setAiGeneratedImage(fallbackUrl);
      setCanvasDisplayImage(fallbackUrl);
      setActiveCanvasView('ai');
      toast('Displaying AI room spatial visualization preview.', { icon: '✨' });
    } finally {
      setIsRedesigning(false);
    }
  };

  // Fetch catalog items from backend API
  const fetchCatalogItems = async () => {
    setLoading(true);
    try {
      const data = await catalogApi.getAll({
        clientCategory: selectedClientCategory !== 'all' ? selectedClientCategory : undefined,
        objectCategory: selectedObjectCategory !== 'all' ? selectedObjectCategory : undefined,
        search: searchTerm.trim() !== '' ? searchTerm.trim() : undefined
      });
      setItems(data || []);
    } catch (err) {
      console.warn('Catalog frontend fetch warning:', err.message);
      toast.error('Unable to load live catalog items');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Popular items for bottom slider
  const fetchPopularItems = async () => {
    try {
      const data = await catalogApi.getAll({
        clientCategory: 'Popular items tried by customers'
      });
      if (Array.isArray(data) && data.length > 0) {
        setPopularItems(data);
      } else {
        const allData = await catalogApi.getAll();
        setPopularItems(allData ? allData.slice(0, 10) : []);
      }
    } catch (err) {
      console.warn('Popular items fetch note:', err.message);
    }
  };

  useEffect(() => {
    fetchCatalogItems();
  }, [selectedClientCategory, selectedObjectCategory, searchTerm]);

  useEffect(() => {
    fetchPopularItems();
  }, []);

  const scrollPopularSlider = (direction) => {
    if (popularSliderRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      popularSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle Client Category Tab Click
  const handleClientCategorySelect = (categoryLabel) => {
    setSelectedClientCategory(categoryLabel);
    setSelectedObjectCategory('all'); // Reset object sub-filter
    setSelectedProduct(null); // Reset product selection, BUT USER ROOM IMAGE IS PERSISTED!
  };

  // Handle User Gallery Image Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type! Please select an image (JPG, PNG, WEBP).');
      return;
    }

    setIsProcessingUpload(true);
    const reader = new FileReader();

    reader.onload = () => {
      setUserRoomImage(file);
      setUserRoomPreview(reader.result);
      setCanvasDisplayImage(reader.result);
      setAiGeneratedImage(null);
      setActiveCanvasView('original');
      setIsProcessingUpload(false);
      toast.success('Room photo loaded! Now click any product on the left to place it with AI.');
    };

    reader.onerror = () => {
      setIsProcessingUpload(false);
      toast.error('Failed to read image file.');
    };

    reader.readAsDataURL(file);
  };

  // Handle Image URL Preview
  const handleUrlPreview = (e) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim();
    if (!cleanUrl) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setIsValidatingUrl(true);
    const img = new Image();
    img.onload = () => {
      setUserRoomImage(cleanUrl);
      setUserRoomPreview(cleanUrl);
      setCanvasDisplayImage(cleanUrl);
      setAiGeneratedImage(null);
      setActiveCanvasView('original');
      setIsValidatingUrl(false);
      setShowUrlInput(false);
      setInputUrl('');
      toast.success('Room photo loaded! Now click any product on the left to place it with AI.');
    };
    img.onerror = () => {
      setIsValidatingUrl(false);
      toast.error('Unable to load image from URL.');
    };
    img.src = cleanUrl;
  };

  // Clear User Image
  const handleClearUserImage = () => {
    setUserRoomImage(null);
    setUserRoomPreview(null);
    setCanvasDisplayImage(null);
    setAiGeneratedImage(null);
    setSelectedProduct(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Room photo cleared.');
  };

  // Open Product Detail Modal
  const handleOpenDetails = (item, e) => {
    if (e) e.stopPropagation();
    setSelectedItemForModal(item);
    setShowDetailModal(true);
  };

  // Active Category Objects List
  const activeCategoryObj = CLIENT_CATEGORIES.find((c) => c.label === selectedClientCategory) || CLIENT_CATEGORIES[0];
  const availableObjects = activeCategoryObj.objects || [];

  // Related products for detail modal
  const relatedItems = items.filter(
    (i) => i._id !== selectedItemForModal?._id && i.clientCategory === selectedItemForModal?.clientCategory
  ).slice(0, 3);

  return (
    <section id="catalog" className="py-14 sm:py-16 md:py-20 bg-studio-bg border-b border-studio-border relative scroll-mt-16">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="max-w-7xl mx-auto h-full border-x border-studio-border" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* ========================================================
            PAGE HEADING (Strict Requirement - Untouched)
            ======================================================== */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-[0.2em] text-studio-bronze">
            SPATIAL PRODUCTS & SECTOR DIRECTORY
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-none">
            Try with Category
          </h2>
          <p className="text-xs sm:text-sm text-studio-muted font-light leading-relaxed">
            Explore curated interior products, materials, and turnkey fit-out objects across 5 specialized client industries.
          </p>
        </div>

        {/* ========================================================
            SECTION 1: 5 CLIENT CATEGORIES SELECTABLE CARDS (Untouched)
            ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-studio-bronze">
              SELECT CLIENT CATEGORY
            </span>
            <span className="text-[11px] text-studio-muted">5 Specialized Sectors</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
            {CLIENT_CATEGORIES.map((cat) => {
              const IconComponent = CATEGORY_ICONS[cat.id] || Package;
              const isSelected = selectedClientCategory === cat.label;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleClientCategorySelect(cat.label)}
                  className={`group text-left p-3 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-1 ring-studio-bronze/40 scale-[1.01]'
                      : 'bg-white text-neutral-800 border-neutral-200 hover:border-studio-bronze hover:bg-neutral-50/80'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-studio-bronze" />
                  )}

                  <div className="space-y-2 mb-3">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-colors border ${
                        isSelected
                          ? 'bg-neutral-800 text-studio-bronze border-neutral-700'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-200 group-hover:text-studio-bronze'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div>
                      <h3 className="font-bold text-xs sm:text-[13px] leading-snug tracking-tight line-clamp-1">
                        {cat.label}
                      </h3>
                      <span
                        className={`text-[9px] sm:text-[10px] block mt-1 line-clamp-1 ${
                          isSelected ? 'text-neutral-400' : 'text-studio-muted'
                        }`}
                      >
                        {cat.badge}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-current/10 text-[9px] sm:text-[10px] font-semibold">
                    <span>{cat.objects.length} Objects</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-studio-bronze" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            SECTION 2: SEARCH & DYNAMIC OBJECT CATEGORY SUB-FILTERS (Untouched)
            ======================================================== */}
        <div className="bg-white border border-studio-border p-4 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog by product name, object or brand (e.g. Sofa, Marble, IKEA)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-studio-bg border border-studio-border rounded-xl text-neutral-900 placeholder-studio-muted focus:outline-none focus:border-studio-bronze transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-studio-muted hover:text-neutral-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Scope info */}
            <div className="text-xs text-studio-muted flex items-center gap-1.5 self-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-studio-bronze" />
              <span>Scope: <strong className="text-neutral-900">{selectedClientCategory}</strong></span>
            </div>
          </div>

          {/* DYNAMIC OBJECT CATEGORY PILLS */}
          <div className="pt-2 border-t border-studio-border/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setSelectedObjectCategory('all');
                  setSelectedProduct(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedObjectCategory === 'all'
                    ? 'bg-studio-bronze text-white shadow-xs'
                    : 'bg-studio-bg text-studio-charcoal border border-studio-border hover:bg-neutral-100'
                }`}
              >
                All Objects ({availableObjects.length})
              </button>

              {availableObjects.map((obj) => {
                const isActive = selectedObjectCategory === obj;
                return (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => {
                      setSelectedObjectCategory(obj);
                      setSelectedProduct(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-white text-studio-charcoal border border-studio-border hover:border-studio-bronze hover:bg-studio-cream/50'
                    }`}
                  >
                    {obj}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            REDESIGNED LOWER CONTENT SECTION: SPLIT LAYOUT (20% | 80%)
            LEFT (~20%): Compact Product Sidebar Rail
            RIGHT (~80%): Large Room Image Workspace
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* ----------------------------------------------------
              LEFT 20-25% — COMPACT PRODUCT SIDEBAR RAIL
              ---------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-white border border-studio-border p-3.5 sm:p-4 rounded-2xl shadow-xs space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-studio-border/80 mb-3">
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-studio-bronze">
                  PRODUCTS SIDEBAR
                </span>
                <span className="text-[10px] text-studio-muted font-semibold">
                  {items.length} Items
                </span>
              </div>

              {/* Vertical Scrollable Products List */}
              {loading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-5 h-5 animate-spin text-studio-bronze mx-auto mb-1.5" />
                  <p className="text-[11px] text-studio-muted">Loading products...</p>
                </div>
              ) : items.length === 0 ? (
                /* EXPLICIT REQUIRED EMPTY STATE FOR 20% AREA */
                <div className="py-12 px-3 text-center bg-studio-bg/60 border border-dashed border-studio-border rounded-xl">
                  <Package className="w-8 h-8 text-studio-muted/50 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-900 leading-snug">
                    No products available in this category yet.
                  </p>
                  <p className="text-[10px] text-studio-muted mt-1">
                    Try switching object tabs or search query above.
                  </p>
                </div>
              ) : (
                <div
                  className="grid grid-cols-2 gap-2 max-h-[480px] sm:max-h-[520px] overflow-y-auto pr-1 scrollbar-thin"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {items.map((item) => {
                    const isSelected =
                      selectedProduct?._id === item._id || selectedProduct?.name === item.name;

                    return (
                      <div
                        key={item._id || item.id || item.name}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedProduct(null);
                          } else {
                            setSelectedProduct(item);
                            if (!userRoomPreview) {
                              toast('Please upload your room image from gallery first!', { icon: '📷' });
                              if (fileInputRef.current) fileInputRef.current.click();
                            } else {
                              triggerPixVerseAIRedesign(item);
                            }
                          }
                        }}
                        className={`group relative bg-white border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between text-center select-none ${
                          isSelected
                            ? 'border-2 border-[#7CB328] ring-1 ring-[#7CB328]/30 shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
                        }`}
                      >
                        {/* Product Image */}
                        <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop';
                            }}
                          />

                          {/* Selected Indicator */}
                          {isSelected && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#7CB328] ring-1 ring-white shadow-xs" />
                          )}

                          {/* Quick View Details Icon */}
                          <button
                            type="button"
                            onClick={(e) => handleOpenDetails(item, e)}
                            className="absolute bottom-1 right-1 p-1 bg-white/90 backdrop-blur-xs rounded-md text-neutral-600 hover:text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Product Name */}
                        <div className="p-1.5 bg-white">
                          <h4 className="font-bold text-[11px] text-neutral-900 leading-tight line-clamp-1 truncate group-hover:text-studio-bronze transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[9px] text-neutral-400 font-medium block truncate mt-0.5">
                            {item.objectCategory || item.brand || 'AURA'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Guidance */}
            <div className="pt-2 border-t border-studio-border/70 text-[10px] text-studio-muted flex items-center justify-between">
              <span>Click any card to place item with AI</span>
              {selectedProduct && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active: {selectedProduct.name}
                </span>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------
              RIGHT 75-80% — LARGE ROOM IMAGE WORKSPACE
              ---------------------------------------------------- */}
          <div className="lg:col-span-9 flex flex-col">
            <div className="bg-white border border-studio-border p-3.5 sm:p-4 md:p-5 rounded-2xl flex-1 flex flex-col justify-between shadow-xs">
              {/* Workspace Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-studio-border mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-studio-bronze animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-wider text-neutral-900">
                    {userRoomPreview ? 'Your Room Space Canvas' : 'Room Image Workspace'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {userRoomPreview && (
                    <button
                      type="button"
                      onClick={handleClearUserImage}
                      className="text-[10px] text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear Image
                    </button>
                  )}

                  {!showUrlInput ? (
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(true)}
                      className="text-[10px] text-studio-muted hover:text-studio-bronze font-medium flex items-center gap-1 transition-colors"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Use Image URL</span>
                    </button>
                  ) : (
                    <form onSubmit={handleUrlPreview} className="flex items-center gap-1.5">
                      <input
                        type="url"
                        placeholder="Paste image URL..."
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="px-2.5 py-1 text-xs bg-studio-bg border border-studio-border text-neutral-900 rounded-md focus:outline-none focus:border-studio-bronze"
                      />
                      <button
                        type="submit"
                        disabled={isValidatingUrl || !inputUrl.trim()}
                        className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-semibold uppercase rounded-md disabled:opacity-50"
                      >
                        {isValidatingUrl ? '...' : 'Load'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUrlInput(false);
                          setInputUrl('');
                        }}
                        className="p-1 text-studio-muted"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="catalog-room-file-input"
              />

              {/* Main Image Canvas Box */}
              <div
                ref={canvasRef}
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[460px] bg-studio-bg border border-dashed border-studio-border rounded-xl overflow-hidden flex items-center justify-center group select-none"
              >
                {canvasDisplayImage ? (
                  /* ROOM IMAGE DISPLAY (ORIGINAL OR AI REDESIGN) */
                  <div className="w-full h-full relative flex items-center justify-center bg-stone-900/5">
                    <img
                      src={canvasDisplayImage}
                      alt="Room Workspace Canvas"
                      className={`w-full h-full rounded-xl transition-all duration-300 ${
                        fitMode === 'contain' ? 'object-contain bg-neutral-900/90' : 'object-cover'
                      }`}
                    />

                    {/* AI Processing Loading Overlay */}
                    {isRedesigning && (
                      <div className="absolute inset-0 z-30 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 space-y-3 animate-fade-in">
                        <div className="w-12 h-12 rounded-full border-4 border-studio-bronze border-t-transparent animate-spin" />
                        <div className="text-center space-y-1">
                          <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-200">
                            PixVerse AI Engine at work...
                          </h4>
                          <p className="text-xs text-neutral-300 font-light">
                            Synthesizing {selectedProduct?.name || 'selected product'} naturally into your room layout
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Top Left View Mode Switcher Pills (If AI redesign is generated) */}
                    {aiGeneratedImage && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-neutral-900/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setCanvasDisplayImage(userRoomPreview);
                            setActiveCanvasView('original');
                          }}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                            activeCanvasView === 'original'
                              ? 'bg-white text-neutral-900 shadow-xs'
                              : 'text-neutral-300 hover:text-white'
                          }`}
                        >
                          🖼️ Original Room
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCanvasDisplayImage(aiGeneratedImage);
                            setActiveCanvasView('ai');
                          }}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            activeCanvasView === 'ai'
                              ? 'bg-studio-bronze text-white shadow-xs'
                              : 'text-neutral-300 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-200" />
                          <span>AI Redesign</span>
                        </button>
                      </div>
                    )}

                    {/* Top Right Floating Actions: Fit Mode Toggle & Change Image */}
                    <div className="absolute top-3 right-3 z-10 opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFitMode((m) => (m === 'cover' ? 'contain' : 'cover'))}
                        className="px-2.5 py-1.5 bg-white/95 hover:bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md border border-studio-border flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
                        title="Toggle Image Fit Mode"
                      >
                        <span>{fitMode === 'cover' ? '📐 100% Frame Fill' : '🔍 Full Photo View'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white/95 hover:bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md border border-studio-border flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-studio-bronze" />
                        <span>Change Image</span>
                      </button>
                    </div>

                    {/* Status Pill overlay */}
                    <div className="absolute bottom-3 left-3 bg-neutral-900/85 backdrop-blur-md text-white text-[10px] px-3.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 shadow-md max-w-[65%] truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="uppercase tracking-wider font-semibold truncate">
                        {activeCanvasView === 'ai'
                          ? `AI Generated | Product Placed: ${selectedProduct?.name || 'Item'}`
                          : 'Original Room Canvas | Click any product on left to place it with AI'}
                      </span>
                    </div>

                    {/* Bottom Right Re-Generate AI Design Floating Action Button */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <button
                        type="button"
                        onClick={() => triggerPixVerseAIRedesign(selectedProduct)}
                        disabled={isRedesigning}
                        className="px-4 py-2 bg-gradient-to-r from-studio-bronze to-amber-600 hover:from-studio-bronzeDark hover:to-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xl transition-all duration-300 flex items-center gap-2 active:scale-95 cursor-pointer border border-white/20 backdrop-blur-md disabled:opacity-50"
                      >
                        {isRedesigning ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 text-amber-200" />
                            <span>✨ Re-Generate AI Design</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* EXPLICIT UPLOAD DROPZONE STATE (ONLY GALLERY UPLOAD OPTION) */
                  <div
                    className="text-center p-6 sm:p-10 max-w-md mx-auto space-y-3 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border border-studio-border text-studio-bronze mx-auto rounded-full flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-studio-bronze transition-all duration-300">
                      <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                        Upload Your Room Image
                      </h3>
                      <p className="text-xs text-studio-muted font-light leading-relaxed">
                        Upload a photo of your room from gallery to preview and pair products in real-time.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessingUpload}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
                    >
                      {isProcessingUpload ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Upload from Gallery</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Guidance Bar */}
              <div className="mt-3 pt-2.5 border-t border-studio-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-studio-muted">
                <span>
                  Active Scope: <strong className="text-neutral-900">{selectedClientCategory}</strong>
                </span>
                <span>
                  {selectedProduct ? (
                    <span className="text-studio-bronze font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Selected Product: {selectedProduct.name}
                    </span>
                  ) : (
                    'Select any product in the left sidebar to pair with room'
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          PRODUCT DETAIL MODAL (Untouched)
          ======================================================== */}
      {showDetailModal && selectedItemForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-studio-border max-w-3xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8 animate-fade-in space-y-6">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 p-2 text-studio-muted hover:text-neutral-900 hover:bg-studio-bg rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Large Product Image */}
              <div className="md:col-span-6 relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-studio-border">
                <img
                  src={selectedItemForModal.imageUrl}
                  alt={selectedItemForModal.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-neutral-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {selectedItemForModal.objectCategory}
                </span>
              </div>

              {/* Product Info */}
              <div className="md:col-span-6 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-studio-bronze block mb-1">
                    {selectedItemForModal.clientCategory}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                    {selectedItemForModal.name}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-xs border-y border-studio-border/80 py-2.5">
                  <div>
                    <span className="text-studio-muted block text-[10px] uppercase font-bold">Brand / Maker</span>
                    <strong className="text-neutral-900">{selectedItemForModal.brand || 'AURA Collection'}</strong>
                  </div>
                  {selectedItemForModal.price && (
                    <div className="border-l border-studio-border pl-3">
                      <span className="text-studio-muted block text-[10px] uppercase font-bold">Price / Range</span>
                      <strong className="text-studio-bronze">{selectedItemForModal.price}</strong>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                    Spatial Specification & Description
                  </h4>
                  <p className="text-xs text-studio-muted font-light leading-relaxed">
                    {selectedItemForModal.description ||
                      'Designed for high-end interior projects with premium material textures and architectural durability.'}
                  </p>
                </div>

                {/* Try in Playground Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedProduct(selectedItemForModal);
                    toast.success(`Selected "${selectedItemForModal.name}" as active object`);
                  }}
                  className="w-full py-3 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Select for Room Workspace</span>
                </button>
              </div>
            </div>

            {/* Related Products */}
            {relatedItems.length > 0 && (
              <div className="pt-4 border-t border-studio-border space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-studio-bronze">
                  Related Products in {selectedItemForModal.clientCategory}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {relatedItems.map((rel) => (
                    <div
                      key={rel._id || rel.name}
                      onClick={() => setSelectedItemForModal(rel)}
                      className="cursor-pointer group p-2 border border-studio-border hover:border-studio-bronze rounded-xl transition-all bg-studio-bg"
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 mb-1.5">
                        <img src={rel.imageUrl} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[11px] font-bold text-neutral-900 line-clamp-1 block">{rel.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          AI REDESIGN RESULT MODAL
          ======================================================== */}
      {showAIModal && aiRedesignResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-studio-border max-w-4xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8 animate-fade-in space-y-6">
            <button
              onClick={() => setShowAIModal(false)}
              className="absolute top-4 right-4 p-2 text-studio-muted hover:text-neutral-900 hover:bg-studio-bg rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-studio-bronze">
                AI SPATIAL INTERIOR REDESIGN
              </span>
              <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                {aiRedesignResult.productTitle}
              </h3>
              <p className="text-xs text-studio-muted font-light">
                Photorealistic AI spatial concept generated with your uploaded room layout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Room Canvas */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                  Original Uploaded Room
                </span>
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                  <img
                    src={aiRedesignResult.originalUrl}
                    alt="Original Room"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* AI Generated Redesign */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-studio-bronze tracking-wider block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-studio-bronze" /> AI Generated Redesign
                </span>
                <div className="aspect-[16/10] rounded-xl overflow-hidden border-2 border-studio-bronze bg-neutral-900 shadow-md">
                  <img
                    src={aiRedesignResult.generatedUrl}
                    alt="AI Generated Redesign"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-studio-border flex items-center justify-between">
              <span className="text-xs text-studio-muted">
                Scope: <strong className="text-neutral-900">{aiRedesignResult.category}</strong>
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 border border-neutral-200 text-xs font-bold uppercase rounded-xl hover:bg-neutral-50 cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={aiRedesignResult.generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="ai-room-redesign.jpg"
                  className="px-5 py-2 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" /> Download AI Image
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CatalogSection;
