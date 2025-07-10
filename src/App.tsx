import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { useCertificateGenerator } from './hooks/useCertificateGenerator';
import FormSection from './components/FormSection';
import StyleControls from './components/StyleControls';
import ImageControls from './components/ImageControls';
import WatermarkControls from './components/WatermarkControls';
import ActionButtons from './components/ActionButtons';
import CertificateCanvas from './components/CertificateCanvas';

function App() {
  const {
    data,
    setData,
    elements,
    imageElements,
    selectedElement,
    selectedImageElement,
    backgroundImage,
    watermark,
    showGrid,
    showSafeMargins,
    updateElement,
    updateImageElement,
    selectElement,
    selectImageElement,
    deleteElement,
    deleteImageElement,
    addElement,
    addImageElement,
    uploadLogo,
    uploadSignature,
    uploadBackground,
    updateWatermark,
    resetLayout,
    saveConfig,
    loadConfig,
    getCurrentConfig,
    toggleGrid,
    toggleSafeMargins,
  } = useCertificateGenerator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Certificate Generator Pro
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Professional Certificate Creator
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Auto-saving enabled
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Panel - Form and Controls */}
          <div className="xl:col-span-1 space-y-4">
            <FormSection data={data} onChange={setData} />
            <StyleControls 
              selectedElement={selectedElement} 
              onElementUpdate={updateElement}
            />
            <ImageControls
              selectedImageElement={selectedImageElement}
              onImageElementUpdate={updateImageElement}
              onLogoUpload={uploadLogo}
              onSignatureUpload={uploadSignature}
            />
            <WatermarkControls
              watermark={watermark}
              onWatermarkUpdate={updateWatermark}
            />
            <ActionButtons
              config={getCurrentConfig()}
              onConfigLoad={loadConfig}
              onBackgroundUpload={uploadBackground}
              onReset={resetLayout}
              onSave={saveConfig}
              onToggleGrid={toggleGrid}
              onToggleSafeMargins={toggleSafeMargins}
              showGrid={showGrid}
              showSafeMargins={showSafeMargins}
            />
          </div>

          {/* Right Panel - Certificate Preview */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Live Preview
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Real-time certificate preview</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {elements.length} elements
                  </div>
                  {selectedElement && (
                    <div className="flex items-center gap-1 text-purple-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      {selectedElement.type} selected
                    </div>
                  )}
                </div>
              </div>
              
              <CertificateCanvas
                elements={elements}
                imageElements={imageElements}
                data={data}
                backgroundImage={backgroundImage}
                watermark={watermark}
                onElementUpdate={updateElement}
                onImageElementUpdate={updateImageElement}
                onElementSelect={selectElement}
                onImageElementSelect={selectImageElement}
                onElementDelete={deleteElement}
                onImageElementDelete={deleteImageElement}
                onElementAdd={addElement}
                onImageElementAdd={addImageElement}
                selectedElement={selectedElement}
                selectedImageElement={selectedImageElement}
                showGrid={showGrid}
                showSafeMargins={showSafeMargins}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center gap-2">
              Made with <span className="text-red-500">❤️</span> using React + TypeScript + Tailwind CSS
            </p>
            <p className="text-sm mt-2 opacity-75">
              Professional certificate generator with advanced customization features
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;