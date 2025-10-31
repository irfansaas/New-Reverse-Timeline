import React, { useState } from 'react';
import { Building2, Users, MapPin, Calendar, Server, Shield } from 'lucide-react';

/**
 * Customer Profile Form Component
 * Collects essential customer information for business case analysis
 */
export default function CustomerProfileForm({ onComplete, initialData = {} }) {
  const [formData, setFormData] = useState({
    // Company Information
    companyName: initialData.companyName || '',
    industry: initialData.industry || '',
    companySize: initialData.companySize || 'medium',
    
    // User Information
    totalUsers: initialData.totalUsers || 1000,
    userProfile: initialData.userProfile || 'medium',
    locations: initialData.locations || [''],
    
    // Current Environment
    currentPlatform: initialData.currentPlatform || 'citrix',
    currentServerCount: initialData.currentServerCount || 10,
    onPremiseDataCenter: initialData.onPremiseDataCenter || false,
    
    // Timeline
    targetGoLiveDate: initialData.targetGoLiveDate || '',
    compellingEvent: initialData.compellingEvent || '',
    
    // Decision Makers
    primaryContact: initialData.primaryContact || '',
    technicalContact: initialData.technicalContact || '',
    financialContact: initialData.financialContact || ''
  });

  const [errors, setErrors] = useState({});

  const industries = [
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Technology',
    'Education',
    'Government',
    'Professional Services',
    'Media & Entertainment',
    'Other'
  ];

  const companySizes = [
    { value: 'small', label: 'Small (< 500 users)', range: '< 500' },
    { value: 'medium', label: 'Medium (500-2,000 users)', range: '500-2,000' },
    { value: 'large', label: 'Large (2,000-5,000 users)', range: '2,000-5,000' },
    { value: 'enterprise', label: 'Enterprise (5,000+ users)', range: '5,000+' }
  ];

  const userProfiles = [
    { value: 'light', label: 'Light Users', description: 'Office productivity, web browsing' },
    { value: 'medium', label: 'Medium Users', description: 'Multiple apps, moderate workloads' },
    { value: 'heavy', label: 'Heavy Users', description: 'CAD, video editing, intensive apps' },
    { value: 'power', label: 'Power Users', description: 'GPU workloads, rendering, simulation' }
  ];

  const platforms = [
    { value: 'citrix', label: 'Citrix (Cloud, Hybrid, or On-Prem)' },
    { value: 'vmware', label: 'VMware Horizon' },
    { value: 'onpremise', label: 'On-Premise VDI (Other)' },
    { value: 'physical', label: 'Physical Desktops' },
    { value: 'none', label: 'New Implementation' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...formData.locations];
    newLocations[index] = value;
    setFormData(prev => ({ ...prev, locations: newLocations }));
  };

  const addLocation = () => {
    setFormData(prev => ({ 
      ...prev, 
      locations: [...prev.locations, ''] 
    }));
  };

  const removeLocation = (index) => {
    if (formData.locations.length > 1) {
      const newLocations = formData.locations.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, locations: newLocations }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.totalUsers || formData.totalUsers < 1) {
      newErrors.totalUsers = 'Number of users must be at least 1';
    }

    if (formData.locations.filter(loc => loc.trim()).length === 0) {
      newErrors.locations = 'At least one location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Clean up locations (remove empty entries)
      const cleanedData = {
        ...formData,
        locations: formData.locations.filter(loc => loc.trim())
      };
      
      onComplete(cleanedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Building2 className="text-purple-600" size={24} />
          Company Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                errors.companyName 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-300 focus:border-purple-500'
              }`}
              placeholder="Enter company name"
            />
            {errors.companyName && (
              <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Industry *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                errors.industry 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-300 focus:border-purple-500'
              }`}
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-red-600 text-sm mt-1">{errors.industry}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Size
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {companySizes.map(size => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => handleInputChange('companySize', size.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.companySize === size.value
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{size.label.split('(')[0]}</div>
                  <div className="text-xs text-gray-600">{size.range}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="text-purple-600" size={24} />
          User Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Number of Users *
            </label>
            <input
              type="number"
              value={formData.totalUsers}
              onChange={(e) => handleInputChange('totalUsers', parseInt(e.target.value))}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                errors.totalUsers 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-300 focus:border-purple-500'
              }`}
              min="1"
              placeholder="1000"
            />
            {errors.totalUsers && (
              <p className="text-red-600 text-sm mt-1">{errors.totalUsers}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              User Profile Type
            </label>
            <select
              value={formData.userProfile}
              onChange={(e) => handleInputChange('userProfile', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {userProfiles.map(profile => (
                <option key={profile.value} value={profile.value}>
                  {profile.label} - {profile.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="text-purple-600" size={24} />
          Locations
        </h3>

        <div className="space-y-3">
          {formData.locations.map((location, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder={`Location ${index + 1} (e.g., New York, NY)`}
              />
              {formData.locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addLocation}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-semibold"
          >
            + Add Location
          </button>

          {errors.locations && (
            <p className="text-red-600 text-sm">{errors.locations}</p>
          )}
        </div>
      </div>

      {/* Current Environment Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Server className="text-purple-600" size={24} />
          Current Environment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Platform
            </label>
            <select
              value={formData.currentPlatform}
              onChange={(e) => handleInputChange('currentPlatform', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Server Count
            </label>
            <input
              type="number"
              value={formData.currentServerCount}
              onChange={(e) => handleInputChange('currentServerCount', parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              min="0"
              placeholder="10"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.onPremiseDataCenter}
                onChange={(e) => handleInputChange('onPremiseDataCenter', e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-semibold text-gray-700">
                On-Premise Data Center
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-purple-600" size={24} />
          Timeline & Drivers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Go-Live Date
            </label>
            <input
              type="date"
              value={formData.targetGoLiveDate}
              onChange={(e) => handleInputChange('targetGoLiveDate', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Compelling Event
            </label>
            <input
              type="text"
              value={formData.compellingEvent}
              onChange={(e) => handleInputChange('compellingEvent', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="e.g., Contract renewal, datacenter lease expiration"
            />
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="text-purple-600" size={24} />
          Key Contacts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Contact
            </label>
            <input
              type="text"
              value={formData.primaryContact}
              onChange={(e) => handleInputChange('primaryContact', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Name, Title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Technical Contact
            </label>
            <input
              type="text"
              value={formData.technicalContact}
              onChange={(e) => handleInputChange('technicalContact', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Name, Title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Financial Contact
            </label>
            <input
              type="text"
              value={formData.financialContact}
              onChange={(e) => handleInputChange('financialContact', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Name, Title"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-lg"
        >
          Continue to Cost Analysis →
        </button>
      </div>
    </form>
  );
}
