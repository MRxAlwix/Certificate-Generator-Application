import React, { useState, useRef, useEffect } from 'react';
import { TextElement, ImageElement, CertificateData } from '../types';
import DraggableText from './DraggableText';
import DraggableImage from './DraggableImage';
import { Plus, Maximize2 } from 'lucide-react';

interface CertificateCanvasProps {
  elements: TextElement[];
  imageElements: ImageElement[];
  data: CertificateData;
  backgroundImage: string | null;
  watermark?: {
    text: string;
    enabled: boolean;
    opacity: number;
    fontSize: number;
    color: string;
    rotation: number;
  };
  onElementUpdate: (element: TextElement) => void;
  onImageElementUpdate: (element: ImageElement) => void;
  onElementSelect: (element: TextElement) => void;
  onImageElementSelect: (element: ImageElement) => void;
  onElementDelete?: (elementId: string) => void;
  onImageElementDelete?: (elementId: string) => void;
  onElementAdd?: (element: TextElement) => void;
  onImageElementAdd?: (element: ImageElement) => void;
  selectedElement: TextElement | null;
  selectedImageElement: ImageElement | null;
  showGrid?: boolean;
  showSafeMargins?: boolean;
}

const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  elements,
  imageElements,
  data,
  backgroundImage,
  watermark,
  onElementUpdate,
  onImageElementUpdate,
  onElementSelect,
  onImageElementSelect,
  onElementDelete,
  onImageElementDelete,
  onElementAdd,
  onImageElementAdd,
  selectedElement,
  selectedImageElement,
  showGrid = true,
  showSafeMargins = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getElementText = (element: TextElement): string => {
    switch (element.type) {
      case 'recipientName':
        return data.recipientName || 'Recipient Name';
      case 'title':
        return data.title || 'Certificate Title';
      case 'description':
        return data.description || 'Certificate Description';
      case 'signerName':
        return data.signerName || 'Signer Name';
      case 'signerTitle':
        return data.signerTitle || 'Signer Title';
      case 'date':
        return data.date || new Date().toLocaleDateString();
      default:
        return element.text;
    }
  };

  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onElementAdd) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newElement: TextElement = {
        id: `custom-${Date.now()}`,
        text: 'Double-click to edit',
        type: 'custom',
        x: Math.max(0, x - 50),
        y: Math.max(0, y - 15),
        width: 200,
        height: 40,
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#000000',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
      };
      
      onElementAdd(newElement);
      onElementSelect(newElement);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const defaultBackground = `
    linear-gradient(135deg, 
      #f8fafc 0%, 
      #e2e8f0 25%, 
      #f1f5f9 50%, 
      #e2e8f0 75%, 
      #f8fafc 100%
    )
  `;

  const canvasStyle = isFullscreen ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    backgroundColor: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } : {};

  return (
    <div 
      ref={canvasRef}
      className={`w-full flex justify-center ${isFullscreen ? '' : 'bg-gray-50 p-4'}`}
      style={canvasStyle}
    >
      <div className="relative" style={{ width: isFullscreen ? '841px' : '100%', maxWidth: '841px', height: isFullscreen ? '595px' : 'auto', aspectRatio: '841/595' }}>
        {/* Fullscreen toggle button */}
        <button
          onClick={toggleFullscreen}
          className="absolute -top-10 right-0 z-20 p-2 bg-white rounded-md shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>

        {/* A4 Landscape Canvas */}
        <div
          id="certificate-canvas"
          className="relative w-full h-full bg-white shadow-lg border border-gray-200 overflow-hidden cursor-crosshair"
          style={{
            background: backgroundImage ? `url(${backgroundImage})` : defaultBackground,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '841/595',
          }}
          onDoubleClick={handleCanvasDoubleClick}
        >
          {/* Grid overlay */}
          {showGrid && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(to right, #3b82f6 1px, transparent 1px),
                  linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }} />
            </div>
          )}

          {/* Safe margin guides */}
          {showSafeMargins && (
            <div className="absolute inset-0 border-4 border-dashed border-red-400 opacity-40 pointer-events-none" style={{
              margin: '40px',
            }} />
          )}

          {/* Center guides */}
          {showGrid && (
            <>
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-400 opacity-30 pointer-events-none transform -translate-x-px" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-blue-400 opacity-30 pointer-events-none transform -translate-y-px" />
            </>
          )}

          {/* Draggable text elements */}
          {elements.map((element) => (
            <DraggableText
              key={element.id}
              element={{ ...element, text: getElementText(element) }}
              onUpdate={onElementUpdate}
              onSelect={onElementSelect}
              onDelete={onElementDelete}
              isSelected={selectedElement?.id === element.id}
            />
          ))}

          {/* Draggable image elements */}
          {imageElements.map((element) => (
            <DraggableImage
              key={element.id}
              element={element}
              onUpdate={onImageElementUpdate}
              onSelect={onImageElementSelect}
              onDelete={onImageElementDelete}
              isSelected={selectedImageElement?.id === element.id}
            />
          ))}

          {/* Watermark */}
          {watermark?.enabled && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{
                fontSize: `${watermark.fontSize}px`,
                color: watermark.color,
                opacity: watermark.opacity,
                transform: `rotate(${watermark.rotation}deg)`,
                fontFamily: 'Inter',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                zIndex: 5,
              }}
            >
              {watermark.text}
            </div>
          )}

          {/* Add element hint */}
          {elements.length === 0 && imageElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p className="text-base font-medium">Double-click to add text</p>
                  {selectedImageElement && (
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {selectedImageElement.type} selected
                    </div>
                  )}
                <p className="text-sm">Or use the form to fill certificate data</p>
              </div>
            </div>
          )}

          {/* Canvas info */}
          <div className="absolute bottom-2 left-2 text-xs text-gray-400 pointer-events-none bg-white bg-opacity-75 px-2 py-1 rounded">
            A4 Landscape (841×595px)
          </div>

          {/* Watermark */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none bg-white bg-opacity-75 px-2 py-1 rounded">
            Certificate Generator Pro
          </div>
        </div>

        {/* Instructions */}
        {!isFullscreen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">✨ Pro Tips:</h4>
              <ul className="space-y-1">
                <li>• Click any text to select and customize</li>
                <li>• Drag elements to reposition them</li>
                <li>• Double-click canvas to add custom text</li>
                <li>• Upload logos and signatures</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">🎯 Guidelines:</h4>
              <ul className="space-y-1">
                <li>• Red dashed lines show safe print margins</li>
                <li>• Blue grid helps with precise alignment</li>
                <li>• Add custom watermarks for branding</li>
                <li>• Use corner handles to resize elements</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCanvas;