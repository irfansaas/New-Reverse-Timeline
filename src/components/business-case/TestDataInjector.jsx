import React from 'react';
import { Zap } from 'lucide-react';

export default function TestDataInjector({ onInject }) {
  const testData = {
    customerProfile: {
      companyName: 'Acme Corporation',
      industry: 'Financial Services',
      companySize: 'medium',
      totalUsers: 1000,
      userProfile: 'medium',
      locations: ['New York, NY', 'Chicago, IL'],
      currentPlatform: 'citrix',
      currentServerCount: 15,
      onPremiseDataCenter: false,
      targetGoLiveDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      compellingEvent: 'Citrix contract renewal',
      primaryContact: 'John Smith, CIO',
      technicalContact: 'Jane Doe, IT Director',
      financialContact: 'Mike Johnson, CFO'
    },
    currentStateConfig: {
      platform: 'citrix',
      serverCount: 15,
      customCosts: null,
      additionalNotes: 'Legacy Citrix environment'
    },
    futureStateConfig: {
      userProfile: 'medium',
      storageType: 'premiumSSD',
      storagePerUserGB: 100,
      includeNerdio: true,
      timeHorizonYears: 3,
      additionalNotes: ''
    }
  };

  const handleInject = () => {
    if (window.confirm('Load test data and generate business case?')) {
      onInject(testData);
    }
  };

  return (
    <button
      onClick={handleInject}
      className="fixed bottom-6 right-6 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 z-50"
      title="Load test data"
    >
      <Zap size={20} />
      Quick Test
    </button>
  );
}
