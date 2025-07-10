import React from 'react';
import { CertificateData } from '../types';
import { Calendar, User, FileText, Award, Briefcase, Sparkles } from 'lucide-react';

interface FormSectionProps {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
}

const FormSection: React.FC<FormSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof CertificateData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Certificate Details</h3>
        </div>
        
        <div className="space-y-3">
          <div className="group">
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-4 h-4 text-blue-500" />
              Recipient Name
            </label>
            <input
              type="text"
              value={data.recipientName}
              onChange={(e) => handleChange('recipientName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm"
              placeholder="Enter recipient name"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Award className="w-4 h-4 text-purple-500" />
              Certificate Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-sm"
              placeholder="e.g., Certificate of Achievement"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4 text-green-500" />
              Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 resize-none text-sm"
              placeholder="Enter certificate description or reason for awarding"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="group">
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <User className="w-4 h-4 text-indigo-500" />
                Signer Name
              </label>
              <input
                type="text"
                value={data.signerName}
                onChange={(e) => handleChange('signerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-sm"
                placeholder="Enter signer name"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-orange-500" />
                Signer Title
              </label>
              <input
                type="text"
                value={data.signerTitle}
                onChange={(e) => handleChange('signerTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-sm"
                placeholder="e.g., Director, CEO, Manager"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-red-500" />
              Date
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSection;