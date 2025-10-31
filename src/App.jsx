import React, { useState } from 'react';
import MainNavigation from './components/navigation/MainNavigation';
import { BusinessCaseProvider } from './contexts/BusinessCaseContext';
import BusinessCaseWizard from './components/business-case/BusinessCaseWizard';
import TimelineCalculator from './components/TimelineCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="py-8">
        {activeTab === 'timeline' && (
          <div className="container mx-auto px-4">
            <TimelineCalculator />
          </div>
        )}

        {activeTab === 'business-case' && (
          <BusinessCaseProvider>
            <BusinessCaseWizard />
          </BusinessCaseProvider>
        )}
      </div>
    </div>
  );
}

export default App;
