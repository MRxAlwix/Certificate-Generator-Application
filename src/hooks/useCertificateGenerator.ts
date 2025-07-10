import { useState, useEffect, useCallback } from 'react';
import { CertificateData, TextElement, ImageElement, CertificateConfig } from '../types';
import { saveConfigToStorage, loadConfigFromStorage } from '../utils/storageUtils';

const createDefaultElements = (): TextElement[] => [
  {
    id: 'title',
    text: '',
    type: 'title',
    x: 200,
    y: 80,
    width: 441,
    height: 60,
    fontSize: 36,
    fontFamily: 'Playfair Display',
    color: '#1e40af',
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
    opacity: 1,
    letterSpacing: 1,
    lineHeight: 1.2,
  },
  {
    id: 'recipientName',
    text: '',
    type: 'recipientName',
    x: 200,
    y: 200,
    width: 441,
    height: 50,
    fontSize: 28,
    fontFamily: 'Crimson Text',
    color: '#0f172a',
    fontWeight: 'normal',
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 1,
    letterSpacing: 0.5,
    lineHeight: 1.3,
  },
  {
    id: 'description',
    text: '',
    type: 'description',
    x: 100,
    y: 280,
    width: 641,
    height: 120,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#374151',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
    opacity: 1,
    letterSpacing: 0,
    lineHeight: 1.5,
  },
  {
    id: 'signerName',
    text: '',
    type: 'signerName',
    x: 550,
    y: 450,
    width: 200,
    height: 40,
    fontSize: 18,
    fontFamily: 'Inter',
    color: '#0f172a',
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
    opacity: 1,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  {
    id: 'signerTitle',
    text: '',
    type: 'signerTitle',
    x: 550,
    y: 480,
    width: 200,
    height: 30,
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#6b7280',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
    opacity: 1,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  {
    id: 'date',
    text: '',
    type: 'date',
    x: 100,
    y: 460,
    width: 150,
    height: 30,
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#6b7280',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    opacity: 1,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
];

export const useCertificateGenerator = () => {
  const [data, setData] = useState<CertificateData>({
    recipientName: '',
    title: '',
    description: '',
    signerName: '',
    signerTitle: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [elements, setElements] = useState<TextElement[]>(createDefaultElements());
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<TextElement | null>(null);
  const [selectedImageElement, setSelectedImageElement] = useState<ImageElement | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [watermark, setWatermark] = useState({
    text: 'CERTIFICATE',
    enabled: false,
    opacity: 0.1,
    fontSize: 72,
    color: '#000000',
    rotation: -45,
  });
  const [showGrid, setShowGrid] = useState(true);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [history, setHistory] = useState<CertificateConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-save to localStorage
  useEffect(() => {
    const config: CertificateConfig = {
      elements,
      imageElements,
      backgroundImage: null,
      backgroundType: 'default',
      watermark,
      canvasSettings: {
        width: 841,
        height: 595,
        padding: 40,
        showGrid,
        showSafeMargins,
      },
    };
    
    const timeoutId = setTimeout(() => {
      saveConfigToStorage(config);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [elements, imageElements, backgroundImage, watermark, showGrid, showSafeMargins]);

  // Load saved configuration on mount
  useEffect(() => {
    const savedConfig = loadConfigFromStorage();
    if (savedConfig) {
      setElements(savedConfig.elements || createDefaultElements());
      setImageElements(savedConfig.imageElements || []);
      setBackgroundImage(savedConfig.backgroundImage);
      if (savedConfig.watermark) {
        setWatermark(savedConfig.watermark);
      }
      if (savedConfig.canvasSettings) {
        setShowGrid(savedConfig.canvasSettings.showGrid ?? true);
        setShowSafeMargins(savedConfig.canvasSettings.showSafeMargins ?? true);
      }
    }
  }, []);

  // Add to history when elements change
  const addToHistory = useCallback((config: CertificateConfig) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(config);
      return newHistory.slice(-20); // Keep last 20 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const updateElement = useCallback((updatedElement: TextElement) => {
    setElements(prev => {
      const newElements = prev.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      );
      
      // Add to history
      const config: CertificateConfig = {
        elements: newElements,
        imageElements,
        backgroundImage,
        backgroundType: backgroundImage ? 'custom' : 'default',
        watermark,
        canvasSettings: {
          width: 841,
          height: 595,
          padding: 40,
          showGrid,
          showSafeMargins,
        },
      };
      addToHistory(config);
      
      return newElements;
    });
    setSelectedElement(updatedElement);
    setSelectedImageElement(null);
  }, [imageElements, backgroundImage, watermark, showGrid, showSafeMargins, addToHistory]);

  const updateImageElement = useCallback((updatedElement: ImageElement) => {
    setImageElements(prev => {
      const newElements = prev.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      );
      
      // Add to history
      const config: CertificateConfig = {
        elements,
        imageElements: newElements,
        backgroundImage,
        backgroundType: backgroundImage ? 'custom' : 'default',
        watermark,
        canvasSettings: {
          width: 841,
          height: 595,
          padding: 40,
          showGrid,
          showSafeMargins,
        },
      };
      addToHistory(config);
      
      return newElements;
    });
    setSelectedImageElement(updatedElement);
    setSelectedElement(null);
  }, [elements, backgroundImage, watermark, showGrid, showSafeMargins, addToHistory]);
  const selectElement = useCallback((element: TextElement) => {
    setSelectedElement(element);
    setSelectedImageElement(null);
  }, []);

  const selectImageElement = useCallback((element: ImageElement) => {
    setSelectedImageElement(element);
    setSelectedElement(null);
  }, []);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
  }, []);

  const deleteImageElement = useCallback((elementId: string) => {
    setImageElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedImageElement(null);
  }, []);

  const addElement = useCallback((element: TextElement) => {
    setElements(prev => [...prev, element]);
    setSelectedElement(element);
    setSelectedImageElement(null);
  }, []);

  const addImageElement = useCallback((element: ImageElement) => {
    setImageElements(prev => [...prev, element]);
    setSelectedImageElement(element);
    setSelectedElement(null);
  }, []);

  const uploadLogo = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const logoElement: ImageElement = {
        id: `logo-${Date.now()}`,
        type: 'logo',
        src: e.target?.result as string,
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        opacity: 1,
        rotation: 0,
      };
      addImageElement(logoElement);
    };
    reader.readAsDataURL(file);
  }, [addImageElement]);

  const uploadSignature = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const signatureElement: ImageElement = {
        id: `signature-${Date.now()}`,
        type: 'signature',
        src: e.target?.result as string,
        x: 550,
        y: 420,
        width: 150,
        height: 75,
        opacity: 1,
        rotation: 0,
      };
      addImageElement(signatureElement);
    };
    reader.readAsDataURL(file);
  }, [addImageElement]);

  const uploadBackground = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setBackgroundImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const resetLayout = useCallback(() => {
    if (confirm('Are you sure you want to reset everything? This action cannot be undone.')) {
      setElements(createDefaultElements());
      setImageElements([]);
      setSelectedElement(null);
      setSelectedImageElement(null);
      setBackgroundImage(null);
      setWatermark({
        text: 'CERTIFICATE',
        enabled: false,
        opacity: 0.1,
        fontSize: 72,
        color: '#000000',
        rotation: -45,
      });
      setShowGrid(true);
      setShowSafeMargins(true);
      setHistory([]);
      setHistoryIndex(-1);
    }
  }, []);

  const saveConfig = useCallback(() => {
    const config: CertificateConfig = {
      elements,
      imageElements,
      backgroundImage,
      backgroundType: backgroundImage ? 'custom' : 'default',
      watermark,
      canvasSettings: {
        width: 841,
        height: 595,
        padding: 40,
        showGrid,
        showSafeMargins,
      },
    };
    
    if (saveConfigToStorage(config)) {
      // Create a temporary success notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; 
                    padding: 12px 24px; border-radius: 8px; z-index: 10000; font-family: Inter, sans-serif;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slideIn 0.3s ease-out;">
          ✅ Configuration saved successfully!
        </div>
        <style>
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        </style>
      `;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    } else {
      alert('Failed to save configuration. Please try again.');
    }
  }, [elements, imageElements, backgroundImage, watermark, showGrid, showSafeMargins]);

  const loadConfig = useCallback((config: CertificateConfig) => {
    setElements(config.elements || createDefaultElements());
    setImageElements(config.imageElements || []);
    setBackgroundImage(config.backgroundImage);
    setSelectedElement(null);
    setSelectedImageElement(null);
    
    if (config.watermark) {
      setWatermark(config.watermark);
    }
    
    if (config.canvasSettings) {
      setShowGrid(config.canvasSettings.showGrid ?? true);
      setShowSafeMargins(config.canvasSettings.showSafeMargins ?? true);
    }

    // Success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #3b82f6; color: white; 
                  padding: 12px 24px; border-radius: 8px; z-index: 10000; font-family: Inter, sans-serif;
                  box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slideIn 0.3s ease-out;">
        📁 Configuration loaded successfully!
      </div>
      <style>
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      </style>
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  }, []);

  const getCurrentConfig = useCallback((): CertificateConfig => ({
    elements,
    imageElements,
    backgroundImage,
    backgroundType: backgroundImage ? 'custom' : 'default',
    watermark,
    canvasSettings: {
      width: 841,
      height: 595,
      padding: 40,
      showGrid,
      showSafeMargins,
    },
  }), [elements, imageElements, backgroundImage, watermark, showGrid, showSafeMargins]);

  const updateWatermark = useCallback((newWatermark: typeof watermark) => {
    setWatermark(newWatermark);
  }, []);

  const toggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const toggleSafeMargins = useCallback(() => {
    setShowSafeMargins(prev => !prev);
  }, []);

  return {
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
  };
};