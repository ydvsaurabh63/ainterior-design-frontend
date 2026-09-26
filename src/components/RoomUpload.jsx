import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 10;

const RoomUpload = ({ selectedFile, imagePreview, onSelectFile, onRemoveFile }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndProcessFile = (file) => {
    if (!file) return;

    if (!ALLOWED_FORMATS.includes(file.type.toLowerCase())) {
      toast.error('Unsupported file format! Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image size exceeds ${MAX_FILE_SIZE_MB}MB! Please upload a smaller photo.`);
      return;
    }

    onSelectFile(file);
    toast.success('Room photo loaded successfully!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndProcessFile(file);
    // reset input so re-selecting same file triggers change
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-[0.2em] text-studio-charcoal font-bold flex items-center gap-2">
          <Upload className="w-4 h-4 text-studio-bronze" />
          <span>Upload Room Photo</span>
        </label>
        <span className="text-[10px] text-studio-muted uppercase tracking-wider font-light">
          JPG, JPEG, PNG, WEBP (Max 10MB)
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {!imagePreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed transition-all p-8 sm:p-10 text-center cursor-pointer group rounded-none ${
            isDragging
              ? 'border-studio-bronze bg-studio-sand/90 scale-[0.99]'
              : 'border-studio-border hover:border-studio-bronze bg-studio-sand/30 hover:bg-studio-sand/60'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-white border border-studio-border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <ImageIcon className="w-7 h-7 text-studio-bronze" />
          </div>
          <p className="text-xs font-bold text-studio-charcoal uppercase tracking-widest mb-1.5">
            Select Your Room Photo
          </p>
          <p className="text-[11px] text-studio-muted font-light mb-4 max-w-xs mx-auto leading-relaxed">
            Drag & drop your photo here, or browse your device to upload.
          </p>
          <button
            type="button"
            className="inline-flex px-5 py-2.5 bg-studio-charcoal text-white text-[11px] uppercase tracking-[0.2em] font-semibold group-hover:bg-studio-bronze transition-colors shadow-sm cursor-pointer"
          >
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="relative border border-studio-border bg-stone-900 group shadow-md overflow-hidden">
          <img
            src={imagePreview}
            alt="Room Preview"
            className="w-full h-64 sm:h-72 object-cover transition-all"
          />
          <div className="absolute top-3 left-3 bg-black/75 text-white text-[10px] uppercase tracking-widest px-3 py-1 font-semibold backdrop-blur-sm border border-white/10">
            {selectedFile ? selectedFile.name : 'Uploaded Room Photo'}
          </div>

          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white text-studio-charcoal text-[10px] sm:text-[11px] uppercase font-bold tracking-wider shadow-md hover:bg-studio-sand transition-colors cursor-pointer inline-flex items-center gap-1 sm:gap-1.5"
            >
              <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-studio-bronze" />
              <span>Change</span>
            </button>

            <button
              type="button"
              onClick={onRemoveFile}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-red-600 text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-wider shadow-md hover:bg-red-700 transition-colors cursor-pointer inline-flex items-center gap-1 sm:gap-1.5"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomUpload;
