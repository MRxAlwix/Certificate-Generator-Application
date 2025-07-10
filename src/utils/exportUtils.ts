import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export const exportToPDF = async (elementId: string, fileName: string = 'certificate.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate canvas not found');
  }

  try {
    // Show loading state
    const loadingEl = document.createElement('div');
    loadingEl.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; 
                  z-index: 10000; font-family: Inter, sans-serif;">
        <div style="text-align: center;">
          <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                      border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
          <div>Generating PDF...</div>
        </div>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;
    document.body.appendChild(loadingEl);

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 841,
      height: 595,
      logging: false,
      imageTimeout: 15000,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
    pdf.save(fileName);

    document.body.removeChild(loadingEl);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
};

export const exportToPNG = async (elementId: string, fileName: string = 'certificate.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate canvas not found');
  }

  try {
    const loadingEl = document.createElement('div');
    loadingEl.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; 
                  z-index: 10000; font-family: Inter, sans-serif;">
        <div style="text-align: center;">
          <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                      border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
          <div>Generating PNG...</div>
        </div>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;
    document.body.appendChild(loadingEl);

    const canvas = await html2canvas(element, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 841,
      height: 595,
      logging: false,
      imageTimeout: 15000,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, fileName);
        document.body.removeChild(loadingEl);
      }
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    document.body.removeChild(document.body.lastElementChild!);
    throw new Error('Failed to export PNG. Please try again.');
  }
};

export const exportToJPG = async (elementId: string, fileName: string = 'certificate.jpg') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate canvas not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 841,
      height: 595,
      logging: false,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, fileName);
      }
    }, 'image/jpeg', 0.95);
  } catch (error) {
    console.error('Error exporting to JPG:', error);
    throw new Error('Failed to export JPG. Please try again.');
  }
};

export const downloadConfig = (config: any, fileName: string = 'certificate-config.json') => {
  const dataStr = JSON.stringify(config, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  saveAs(dataBlob, fileName);
};

export const uploadConfigFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        resolve(config);
      } catch (error) {
        reject(new Error('Invalid configuration file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};