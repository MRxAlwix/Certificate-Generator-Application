import React, { useRef } from 'react';
import { ImageElement } from '../types';
import { Image, Upload, RotateCw, Eye, Palette } from 'lucide-react';

interface ImageControlsProps {
  selectedImageElement: ImageElement | null;
  onImageElementUpdate: (element: ImageElement) => void;
  onLogoUpload: (file: File) => void;
  onSignatureUpload: (file: File) => void;
}

const ImageControls: React.FC<ImageControlsProps> = ({ 
  selectedImageElement, 
  onImageElementUpdate,
  onLogoUpload,
  onSignatureUpload 
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size too large. Please choose a file smaller than 5MB.');
        return;
      }
      onLogoUpload(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size too large. Please choose a file smaller than 5MB.');
        return;
      }
      onSignatureUpload(file);
    }
  };

  const handleStyleChange = (property: keyof ImageElement, value: any) => {
    if (selectedImageElement) {
      onImageElementUpdate({ ...selectedImageElement, [property]: value });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <Image className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Images</h3>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => logoInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Logo
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />

          <button
            onClick={() => signatureInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-md hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Signature
          </button>
          <input
            ref={signatureInputRef}
            type="file"
            accept="image/*"
            onChange={handleSignatureUpload}
            className="hidden"
          />

          <p className="text-xs text-gray-500 text-center">
            Supports JPG, PNG, WebP (max 5MB)
          </p>
        </div>
      </div>

      {/* Image Style Controls */}
      {selectedImageElement && (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Image Styling</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedImageElement.opacity || 1}
                onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {Math.round((selectedImageElement.opacity || 1) * 100)}%
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Rotation</label>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={selectedImageElement.rotation || 0}
                onChange={(e) => handleStyleChange('rotation', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {selectedImageElement.rotation || 0}°
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Width</label>
                <input
                  type="number"
                  min="20"
                  max="400"
                  value={selectedImageElement.width}
                  onChange={(e) => handleStyleChange('width', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Height</label>
                <input
                  type="number"
                  min="20"
                  max="400"
                  value={selectedImageElement.height}
                  onChange={(e) => handleStyleChange('height', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedImageElement && (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <div className="text-center text-gray-500">
            <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold mb-1">No Image Selected</h3>
            <p className="text-xs">Click any image element to customize</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageControls;