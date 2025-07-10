import React from 'react';
import { TextElement } from '../types';
import { Type, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic, RotateCw, Eye, Zap } from 'lucide-react';

interface StyleControlsProps {
  selectedElement: TextElement | null;
  onElementUpdate: (element: TextElement) => void;
}

const FONT_FAMILIES = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Crimson Text',
  'Libre Baskerville',
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 84, 96];

const PRESET_COLORS = [
  '#000000', '#1f2937', '#374151', '#6b7280',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db',
];

const StyleControls: React.FC<StyleControlsProps> = ({ selectedElement, onElementUpdate }) => {
  if (!selectedElement) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <div className="text-center text-gray-500">
          <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <Type className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-base font-semibold mb-1">No Element Selected</h3>
          <p className="text-xs">Click any text element to customize</p>
        </div>
      </div>
    );
  }

  const handleStyleChange = (property: keyof TextElement, value: any) => {
    onElementUpdate({ ...selectedElement, [property]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
          <Palette className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Text Styling</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Font Family</label>
          <select
            value={selectedElement.fontFamily}
            onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-sm"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Font Size</label>
            <select
              value={selectedElement.fontSize}
              onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-sm"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedElement.opacity || 1}
              onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-xs text-gray-500 mt-1 text-center">
              {Math.round((selectedElement.opacity || 1) * 100)}%
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Color</label>
          <div className="space-y-2">
            <input
              type="color"
              value={selectedElement.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-full h-8 border border-gray-200 rounded-md cursor-pointer"
            />
            <div className="grid grid-cols-8 gap-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleStyleChange('color', color)}
                  className={`w-6 h-6 rounded-md border transition-all duration-200 hover:scale-110 ${
                    selectedElement.color === color ? 'border-purple-500 ring-1 ring-purple-200' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Text Style</label>
          <div className="flex gap-1">
            <button
              onClick={() => handleStyleChange('fontWeight', selectedElement.fontWeight === 'bold' ? 'normal' : 'bold')}
              className={`px-3 py-2 rounded-md border transition-all duration-200 ${
                selectedElement.fontWeight === 'bold'
                  ? 'bg-purple-100 border-purple-300 text-purple-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStyleChange('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')}
              className={`px-3 py-2 rounded-md border transition-all duration-200 ${
                selectedElement.fontStyle === 'italic'
                  ? 'bg-purple-100 border-purple-300 text-purple-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Text Alignment</label>
          <div className="flex gap-1">
            {[
              { value: 'left', icon: AlignLeft },
              { value: 'center', icon: AlignCenter },
              { value: 'right', icon: AlignRight },
            ].map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleStyleChange('textAlign', value)}
                className={`px-3 py-2 rounded-md border transition-all duration-200 ${
                  selectedElement.textAlign === value
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Letter Spacing</label>
            <input
              type="range"
              min="-2"
              max="10"
              step="0.5"
              value={selectedElement.letterSpacing || 0}
              onChange={(e) => handleStyleChange('letterSpacing', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-xs text-gray-500 mt-1 text-center">
              {selectedElement.letterSpacing || 0}px
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Line Height</label>
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.1"
              value={selectedElement.lineHeight || 1.2}
              onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-xs text-gray-500 mt-1 text-center">
              {selectedElement.lineHeight || 1.2}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Text Shadow</label>
          <select
            value={selectedElement.textShadow || 'none'}
            onChange={(e) => handleStyleChange('textShadow', e.target.value === 'none' ? '' : e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-sm"
          >
            <option value="none">No Shadow</option>
            <option value="1px 1px 2px rgba(0,0,0,0.3)">Light Shadow</option>
            <option value="2px 2px 4px rgba(0,0,0,0.5)">Medium Shadow</option>
            <option value="3px 3px 6px rgba(0,0,0,0.7)">Strong Shadow</option>
            <option value="0 0 10px rgba(255,255,255,0.8)">White Glow</option>
            <option value="0 0 10px rgba(59,130,246,0.8)">Blue Glow</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StyleControls;