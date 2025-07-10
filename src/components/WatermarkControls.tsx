import React from 'react';
import { Droplets, Eye, EyeOff, Palette, Type, RotateCw } from 'lucide-react';

interface WatermarkControlsProps {
  watermark: {
    text: string;
    enabled: boolean;
    opacity: number;
    fontSize: number;
    color: string;
    rotation: number;
  };
  onWatermarkUpdate: (watermark: any) => void;
}

const WatermarkControls: React.FC<WatermarkControlsProps> = ({ watermark, onWatermarkUpdate }) => {
  const handleChange = (property: string, value: any) => {
    onWatermarkUpdate({ ...watermark, [property]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
          <Droplets className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Watermark</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700">Enable Watermark</label>
          <button
            onClick={() => handleChange('enabled', !watermark.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              watermark.enabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                watermark.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {watermark.enabled && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Watermark Text</label>
              <input
                type="text"
                value={watermark.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm"
                placeholder="Enter watermark text"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Opacity</label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={watermark.opacity}
                onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {Math.round(watermark.opacity * 100)}%
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Font Size</label>
              <input
                type="range"
                min="24"
                max="120"
                step="4"
                value={watermark.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {watermark.fontSize}px
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Color</label>
              <input
                type="color"
                value={watermark.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-8 border border-gray-200 rounded-md cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Rotation</label>
              <input
                type="range"
                min="-90"
                max="90"
                step="15"
                value={watermark.rotation}
                onChange={(e) => handleChange('rotation', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {watermark.rotation}°
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WatermarkControls;