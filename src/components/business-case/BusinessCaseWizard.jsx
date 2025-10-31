import React, { useState } from 'react';
import { useBusinessCase } from '../../contexts/BusinessCaseContext';
import ProgressStepper from './ProgressStepper';
import CustomerProfileForm from './CustomerProfile/CustomerProfileForm';
import CurrentStateConfig from './CurrentStateConfig';
import FutureStateConfig from './FutureStateConfig';
import ResultsDashboard from './ResultsDashboard';
import SavedScenariosManager from './SavedScenariosManager';
import TestDataInjector from './TestDataInjector';
import { FolderOpen } from 'lucide-react';

export default function BusinessCaseWizard() {
  const {
    currentStep,
    customerProfile,
    calculations,
    savedScenarios,
    setProfile,
    setCurrentState,
    setFutureState,
    goToStep,
    canProceed,
    saveScenario,
    loadScenario,
    deleteScenario,
    reset
  } = useBusinessCase();

  const [showSavedScenarios, setShowSavedScenarios] = useState(false);

  const steps = [
    { title: 'Customer Profile', subtitle: 'Company & user info' },
    { title: 'Current State', subtitle: 'Existing environment' },
    { title: 'Future State', subtitle: 'Azure + Nerdio config' },
    { title: 'Results', subtitle: 'Business case analysis' }
  ];

  const handleSave = (name) => {
    try {
      const scenario = saveScenario(name);
      alert(`✓ Scenario "${scenario.name}" saved successfully!`);
    } catch (error) {
      alert(`Error saving scenario: ${error.message}`);
    }
  };

  const handleLoadScenario = (scenarioId) => {
    try {
      loadScenario(scenarioId);
      setShowSavedScenarios(false);
    } catch (error) {
      alert(`Error loading scenario: ${error.message}`);
    }
  };

  const handleTestDataInjection = (testData) => {
    setProfile(testData.customerProfile);
    setTimeout(() => {
      setCurrentState(testData.currentStateConfig);
      setTimeout(() => {
        setFutureState(testData.futureStateConfig);
      }, 100);
    }, 100);
  };

  if (showSavedScenarios) {
    return (
      <div className="container mx-auto px-4">
        <SavedScenariosManager
          scenarios={savedScenarios}
          onLoad={handleLoadScenario}
          onDelete={deleteScenario}
          onClose={() => setShowSavedScenarios(false)}
        />
        <TestDataInjector onInject={handleTestDataInjection} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-600 mb-2">
                Nerdio Business Case Builder
              </h1>
              <p className="text-gray-600">
                Create comprehensive TCO and ROI analysis for Azure Virtual Desktop with Nerdio Manager
              </p>
            </div>
            {savedScenarios.length > 0 && (
              <button
                onClick={() => setShowSavedScenarios(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FolderOpen size={20} />
                View Saved Scenarios ({savedScenarios.length})
              </button>
            )}
          </div>
        </div>

        <ProgressStepper 
          currentStep={currentStep} 
          steps={steps}
          onStepClick={(step) => canProceed(step) && goToStep(step)}
        />

        <div className="bg-gray-50">
          {currentStep === 1 && (
            <CustomerProfileForm
              onComplete={setProfile}
              initialData={customerProfile}
            />
          )}

          {currentStep === 2 && (
            <CurrentStateConfig
              customerProfile={customerProfile}
              onComplete={setCurrentState}
              onBack={() => goToStep(1)}
            />
          )}

          {currentStep === 3 && (
            <FutureStateConfig
              customerProfile={customerProfile}
              onComplete={setFutureState}
              onBack={() => goToStep(2)}
            />
          )}

          {currentStep === 4 && calculations && (
            <ResultsDashboard
              calculations={calculations}
              onSave={handleSave}
              onStartNew={reset}
              onBack={() => goToStep(3)}
            />
          )}
        </div>
      </div>

      <TestDataInjector onInject={handleTestDataInjection} />
    </div>
  );
}
