import { CertificateConfig } from '../types';

const STORAGE_KEY = 'certificate-generator-config';
const TEMPLATES_KEY = 'certificate-generator-templates';

export const saveConfigToStorage = (config: CertificateConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config to storage:', error);
    return false;
  }
};

export const loadConfigFromStorage = (): CertificateConfig | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading config from storage:', error);
  }
  return null;
};

export const clearStorageConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing storage config:', error);
    return false;
  }
};

export const saveTemplateToStorage = (template: any) => {
  try {
    const templates = getTemplatesFromStorage();
    const updatedTemplates = [...templates, template];
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
    return true;
  } catch (error) {
    console.error('Error saving template:', error);
    return false;
  }
};

export const getTemplatesFromStorage = (): any[] => {
  try {
    const templates = localStorage.getItem(TEMPLATES_KEY);
    return templates ? JSON.parse(templates) : [];
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
};

export const deleteTemplateFromStorage = (templateId: string) => {
  try {
    const templates = getTemplatesFromStorage();
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
    return true;
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
};