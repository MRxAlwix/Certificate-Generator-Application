import React, { useRef, useState } from 'react';
import { Download, Upload, Save, RotateCcw, FileImage, FileText, Settings, Image, Palette, Grid, Eye, EyeOff } from 'lucide-react';
import { exportToPDF, exportToPNG, exportToJPG, downloadConfig, uploadConfigFile } from '../utils/exportUtils';
import { CertificateConfig } from '../types';

interface ActionButtonsProps {
  config: CertificateConfig;
  onConfigLoad: (config: CertificateConfig) => void;
  onBackgroundUpload: (file: File) => void;
  onReset: () => void;
  onSave: () => void;
  onToggleGrid?: () => void;
  onToggleSafeMargins?: () => void;
  showGrid?: boolean;
  showSafeMargins?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  config,
  onConfigLoad,
  onBackgroundUpload,
  onReset,
  onSave,
  onToggleGrid,
  onToggleSafeMargins,
  showGrid,
  showSafeMargins,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const configInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('certificate-canvas', 'certificate.pdf');
    } catch (error) {
      alert('Error exporting PDF: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      await exportToPNG('certificate-canvas', 'certificate.png');
    } catch (error) {
      alert('Error exporting PNG: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJPG = async () => {
    setIsExporting(true);
    try {
      await exportToJPG('certificate-canvas', 'certificate.jpg');
    } catch (error) {
      alert('Error exporting JPG: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadConfig = () => {
    downloadConfig(config, 'certificate-config.json');
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size too large. Please choose a file smaller than 10MB.');
        return;
      }
      onBackgroundUpload(file);
    }
  };

  const handleConfigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const loadedConfig = await uploadConfigFile(file);
        onConfigLoad(loadedConfig);
      } catch (error) {
        alert('Error loading configuration: ' + (error as Error).message);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Section */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
            <Download className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Export</h3>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            <FileText className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
            >
              <FileImage className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={handleExportJPG}
              disabled={isExporting}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
            >
              <Image className="w-4 h-4" />
              JPG
            </button>
          </div>
        </div>
      </div>

      {/* Background Section */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Background</h3>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Background Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleBackgroundUpload}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-1 text-center">
          Supports JPG, PNG, WebP (max 10MB)
        </p>
      </div>

      {/* View Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">View Options</h3>
        </div>

        <div className="space-y-2">
          {onToggleGrid && (
            <button
              onClick={onToggleGrid}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105 text-sm ${
                showGrid
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
          )}
          
          {onToggleSafeMargins && (
            <button
              onClick={onToggleSafeMargins}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105 text-sm ${
                showSafeMargins
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showSafeMargins ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showSafeMargins ? 'Hide Safe Margins' : 'Show Safe Margins'}
            </button>
          )}
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Configuration</h3>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadConfig}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-md hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => configInputRef.current?.click()}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-md hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 text-sm"
            >
              <Upload className="w-4 h-4" />
              Load
            </button>
          </div>
          <input
            ref={configInputRef}
            type="file"
            accept=".json"
            onChange={handleConfigUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Reset Section */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Everything
        </button>
        <p className="text-xs text-gray-500 mt-1 text-center">
          This will reset all elements and background
        </p>
      </div>
    </div>
  );
};

export default ActionButtons;