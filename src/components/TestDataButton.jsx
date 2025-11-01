import React from 'react';
import { Zap } from 'lucide-react';

export default function TestDataButton({ onInject }) {
  const testScenarios = {
    simple: {
      name: 'Simple Project',
      data: {
        goLiveDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        users: '1',
        useCases: '1',
        onPremToCloud: '1',
        citrixCloud: '1',
        citrixHybrid: '1',
        citrixOnPrem: '1',
        cloud: '2',
        landingZone: '2',
        os: '1',
        changeControl: '1',
        security: '1',
        apps: '1',
        modernization: '1',
        backend: '1',
        peripherals: '1',
        cloudTesting: '1',
        lastMod: '1'
      }
    },
    complex: {
      name: 'Complex Project',
      data: {
        goLiveDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        users: '3',
        useCases: '3',
        onPremToCloud: '3',
        citrixCloud: '3',
        citrixHybrid: '1',
        citrixOnPrem: '3',
        cloud: '3',
        landingZone: '3',
        os: '3',
        changeControl: '3',
        security: '3',
        apps: '3',
        modernization: '3',
        backend: '3',
        peripherals: '3',
        cloudTesting: '3',
        lastMod: '3'
      }
    },
    medium: {
      name: 'Medium Project',
      data: {
        goLiveDate: new Date(Date.now() + 105 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        users: '2',
        useCases: '2',
        onPremToCloud: '2',
        citrixCloud: '2',
        citrixHybrid: '1',
        citrixOnPrem: '1',
        cloud: '2',
        landingZone: '2',
        os: '2',
        changeControl: '2',
        security: '2',
        apps: '2',
        modernization: '2',
        backend: '2',
        peripherals: '1',
        cloudTesting: '2',
        lastMod: '2'
      }
    }
  };

  const handleInject = (scenarioKey) => {
    const scenario = testScenarios[scenarioKey];
    if (window.confirm(`Load test data: ${scenario.name}?`)) {
      onInject(scenario.data);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      <button
        onClick={() => handleInject('simple')}
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        title="Load simple test data"
      >
        <Zap size={16} />
        Simple Test
      </button>
      <button
        onClick={() => handleInject('medium')}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
        title="Load medium test data"
      >
        <Zap size={16} />
        Medium Test
      </button>
      <button
        onClick={() => handleInject('complex')}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        title="Load complex test data"
      >
        <Zap size={16} />
        Complex Test
      </button>
    </div>
  );
}