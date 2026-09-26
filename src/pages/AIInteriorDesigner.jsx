import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Download,
  ArrowRight,
  Palette,
  Upload,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

import RoomUpload from '../components/RoomUpload';
import DesignStyleSelector, { DESIGN_STYLES } from '../components/DesignStyleSelector';
import LoadingDesign from '../components/LoadingDesign';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { interiorAIService } from '../services/interiorAIService';

const AIInteriorDesigner = () => {
  const navigate = useNavigate();
  const styleSelectorRef = useRef(null);

  // Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customInstruction, setCustomInstruction] = useState('');

  // Generation & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const hasUploadedImage = Boolean(selectedFile || imagePreview);

  // File Upload Handlers
  const handleSelectFile = (file) => {
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setGeneratedResult(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setGeneratedResult(null);
    setRoomType('');
    setSelectedStyle('');
    setCustomInstruction('');
    toast.success('Room image cleared.');
  };

  // Generate Design API Submission
  const handleGenerateDesign = async () => {
    if (!selectedFile && !imagePreview) {
      toast.error('Please upload a photo of your room first!');
      return;
    }

    if (!roomType) {
      toast.error('Please select a room type!');
      return;
    }

    if (!selectedStyle) {
      toast.error('Please select an interior design style!');
      return;
    }

    setIsGenerating(true);

    try {
      const selectedStyleObj = DESIGN_STYLES.find((s) => s.id === selectedStyle);
      const referenceImage = selectedStyleObj ? selectedStyleObj.image : '';

      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (imagePreview) {
        formData.append('imagePreviewUrl', imagePreview);
      }
      formData.append('roomType', roomType);
      formData.append('style', selectedStyle);
      formData.append('designStyle', selectedStyle);
      formData.append('referenceImage', referenceImage);
      formData.append('customInstruction', customInstruction);
      formData.append('customPrompt', customInstruction);

      const response = await interiorAIService.generateRoomDesign(formData);

      if (response && response.success) {
        const genUrl = response.imageUrl || response.data?.generatedUrl;
        const origUrl = response.originalUrl || response.data?.originalUrl || imagePreview;
        const promptText = response.prompt || response.data?.prompt || `Redesign ${roomType} in ${selectedStyle} style`;
        const styleName = response.style || response.data?.style || selectedStyle;
        const roomTypeName = response.roomType || response.data?.roomType || roomType;

        if (!genUrl) {
          throw new Error('AI service did not return a redesign image URL.');
        }

        setGeneratedResult({
          originalUrl: origUrl,
          generatedUrl: genUrl,
          prompt: promptText,
          roomType: roomTypeName,
          styleName: styleName,
          isMock: response.data?.isMock,
          notice: response.notice || response.data?.notice
        });

        if (response.notice || response.data?.notice) {
          toast(response.notice || response.data?.notice, { icon: 'ℹ️', duration: 6000 });
        } else {
          toast.success(`AI ${styleName} Design Created Successfully!`);
        }
      } else {
        throw new Error(response?.message || 'Failed to generate room design.');
      }
    } catch (error) {
      console.error('Error generating design:', error);
      const errorMessage =
        error.message || 'Network error or AI service timeout. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Handler
  const handleDownloadImage = async () => {
    if (!generatedResult?.generatedUrl) return;
    try {
      toast.loading('Preparing download...', { id: 'downloading' });
      const response = await fetch(generatedResult.generatedUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `AI_${generatedResult.styleName || 'Interior'}_Redesign.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success('Downloaded successfully!', { id: 'downloading' });
    } catch (err) {
      window.open(generatedResult.generatedUrl, '_blank');
      toast.dismiss('downloading');
    }
  };

  // Result Actions
  const handleGenerateAgain = () => {
    setGeneratedResult(null);
    handleGenerateDesign();
  };

  const handleTryAnotherStyle = () => {
    setGeneratedResult(null);
    if (styleSelectorRef.current) {
      styleSelectorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUploadAnotherRoom = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setGeneratedResult(null);
    setRoomType('');
    setSelectedStyle('');
    setCustomInstruction('');
    toast.success('Ready to redesign another room!');
  };

  const handleBookConsultation = () => {
    navigate('/contact', {
      state: {
        aiDesignCategory: roomType,
        aiDesignStyle: selectedStyle,
        aiPrompt: customInstruction
      }
    });
  };

  return (
    <div className="bg-studio-bg min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio-sand border border-studio-border text-studio-charcoal text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-4 h-4 text-studio-bronze animate-pulse" />
            <span>AI Virtual Interior Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-studio-charcoal tracking-tight mb-4">
            AI Room Redesign & <span className="italic font-light text-studio-bronze">Virtual Designer</span>
          </h1>
          <p className="text-sm sm:text-base text-studio-muted font-light leading-relaxed">
            Upload a photo of your existing room, select your preferred architectural aesthetic, and let our AI generate a photorealistic interior redesign in seconds.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Upload & Specifications Form (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-studio-border p-6 sm:p-8 shadow-sm space-y-7">
            {/* STEP 1: Upload Room Photo */}
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-studio-charcoal font-bold block mb-3">
                STEP 1 — UPLOAD ROOM PHOTO
              </label>
              <RoomUpload
                selectedFile={selectedFile}
                imagePreview={imagePreview}
                onSelectFile={handleSelectFile}
                onRemoveFile={handleRemoveFile}
              />
            </div>

            {/* STEP 2 & 3: Room Type & Style (Unlocked after photo upload) */}
            {hasUploadedImage && (
              <div ref={styleSelectorRef} className="pt-4 border-t border-studio-border/60">
                <DesignStyleSelector
                  hasUploadedImage={hasUploadedImage}
                  roomType={roomType}
                  setRoomType={setRoomType}
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                  customInstruction={customInstruction}
                  setCustomInstruction={setCustomInstruction}
                />
              </div>
            )}

            {/* STEP 4: Prominent Generate Design Button (Unlocked after Style selection) */}
            {hasUploadedImage && roomType && selectedStyle && (
              <div className="pt-4 border-t border-studio-border/60 animate-fadeIn">
                <label className="text-xs uppercase tracking-[0.2em] text-studio-charcoal font-bold block mb-3">
                  STEP 4 — GENERATE REDESIGN
                </label>
                <button
                  type="button"
                  onClick={handleGenerateDesign}
                  disabled={isGenerating}
                  className="w-full py-4 bg-studio-charcoal text-white text-xs uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2 hover:bg-studio-bronze transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Designing Your Room...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-400" />
                      <span>Redesign Room</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Visualization Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-studio-border p-4 sm:p-6 md:p-8 shadow-sm">
              <div className="border-b border-studio-border/60 pb-3 sm:pb-4 mb-4 sm:mb-6 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-serif text-studio-charcoal font-semibold uppercase tracking-wider">
                    {generatedResult ? 'YOUR AI GENERATED RESULT' : 'DESIGN VISUALIZATION'}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-studio-muted font-light">
                    {generatedResult
                      ? 'Photorealistic AI interior transformation of your room'
                      : 'Step-by-step room transformation workflow'}
                  </p>
                </div>
                {generatedResult && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Redesign Complete</span>
                  </span>
                )}
              </div>

              {/* State 1: Loading State */}
              {isGenerating ? (
                <LoadingDesign />
              ) : generatedResult ? (
                /* State 2: Result Section with Before/After Slider & Action Buttons */
                <div className="space-y-6">
                  <BeforeAfterSlider
                    originalImage={generatedResult.originalUrl}
                    generatedImage={generatedResult.generatedUrl}
                    roomType={generatedResult.roomType}
                    styleName={generatedResult.styleName}
                  />


                  {/* Result Actions Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateAgain}
                      className="py-2.5 sm:py-3 px-2 sm:px-3 border border-studio-charcoal text-studio-charcoal hover:bg-studio-charcoal hover:text-white text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-1.5 text-center cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-studio-bronze flex-shrink-0" />
                      <span className="truncate">Redesign Again</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      className="py-2.5 sm:py-3 px-2 sm:px-3 border border-studio-charcoal text-studio-charcoal hover:bg-studio-charcoal hover:text-white text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-1.5 text-center cursor-pointer"
                    >
                      <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-studio-bronze flex-shrink-0" />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTryAnotherStyle}
                      className="py-2.5 sm:py-3 px-2 sm:px-3 border border-studio-border bg-white hover:border-studio-bronze text-studio-charcoal text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-1.5 text-center cursor-pointer"
                    >
                      <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-studio-bronze flex-shrink-0" />
                      <span className="truncate">New Style</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleUploadAnotherRoom}
                      className="py-2.5 sm:py-3 px-2 sm:px-3 border border-studio-border bg-white hover:border-studio-bronze text-studio-charcoal text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-1.5 text-center cursor-pointer"
                    >
                      <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-studio-bronze flex-shrink-0" />
                      <span className="truncate">New Room</span>
                    </button>
                  </div>

                  {/* Connect With Designers CTA */}
                  <div className="pt-4 border-t border-studio-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-studio-muted font-light">
                      Like this visualization? Our interior architects can bring this design to life.
                    </p>
                    <button
                      type="button"
                      onClick={handleBookConsultation}
                      className="w-full sm:w-auto px-6 py-3 bg-studio-bronze text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-charcoal transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <span>Connect With Designers</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* State 3: Ready Placeholder State */
                <div className="min-h-[420px] bg-studio-sand/30 border border-dashed border-studio-border flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white border border-studio-border flex items-center justify-center mb-4 text-studio-bronze shadow-sm">
                    <Wand2 className="w-8 h-8 text-studio-bronze" />
                  </div>
                  <h3 className="text-base font-serif text-studio-charcoal font-semibold mb-2">
                    {!hasUploadedImage
                      ? 'Step 1: Upload Your Room Photo'
                      : !roomType
                      ? 'Step 2: Select Room Type'
                      : !selectedStyle
                      ? 'Step 3: Select Design Style Reference'
                      : 'Step 4: Click Redesign Room'}
                  </h3>
                  <p className="text-xs text-studio-muted font-light max-w-md leading-relaxed mb-6">
                    {!hasUploadedImage
                      ? 'Start by uploading a clear photo of your room on the left panel.'
                      : !roomType
                      ? 'Now choose your room type (Living Room, Bedroom, Kitchen, or Full Home).'
                      : !selectedStyle
                      ? 'Select one of our signature interior design style references.'
                      : 'Click "Redesign Room" to transform your existing room with AI!'}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-studio-border text-[11px] text-studio-muted uppercase tracking-wider font-medium">
                    <Layers className="w-3.5 h-3.5 text-studio-bronze" />
                    <span>Interactive Before / After slider included</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInteriorDesigner;
