import React from 'react';
import { useBusinessCase } from '../../contexts/BusinessCaseContext';
import ProgressStepper from './ProgressStepper';
import CustomerProfileForm from './CustomerProfile/CustomerProfileForm';
import CurrentStateConfig from './CurrentStateConfig';
import FutureStateConfig from './FutureStateConfig';
import ResultsDashboard from './ResultsDashboard';

export default function BusinessCaseWizard() {
  const {
    currentStep,
    customerProfile,
    calculations,
    setProfile,
    setCurrentState,
    setFutureState,
    goToStep,
    canProceed,
    saveScenario,
    reset
  } = useBusinessCase();

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              Nerdio Business Case Builder
            </h1>
            <p className="text-gray-600">
              Create comprehensive TCO and ROI analysis for Azure Virtual Desktop with Nerdio Manager
            </p>
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
      </div>
    </div>
  );
}
