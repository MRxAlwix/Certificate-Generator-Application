export interface CertificateData {
  recipientName: string;
  title: string;
  description: string;
  signerName: string;
  signerTitle: string;
  date: string;
}

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: string;
  type: 'recipientName' | 'title' | 'description' | 'signerName' | 'signerTitle' | 'date' | 'custom';
  rotation?: number;
  opacity?: number;
  textShadow?: string;
  letterSpacing?: number;
  lineHeight?: number;
}

export interface ImageElement {
  id: string;
  type: 'logo' | 'signature' | 'watermark';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  rotation?: number;
}

export interface CertificateConfig {
  elements: TextElement[];
  imageElements: ImageElement[];
  backgroundImage: string | null;
  backgroundType: 'default' | 'custom' | 'gradient';
  backgroundGradient?: string;
  watermark?: {
    text: string;
    enabled: boolean;
    opacity: number;
    fontSize: number;
    color: string;
    rotation: number;
  };
  canvasSettings: {
    width: number;
    height: number;
    padding: number;
    showGrid: boolean;
    showSafeMargins: boolean;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  config: CertificateConfig;
}