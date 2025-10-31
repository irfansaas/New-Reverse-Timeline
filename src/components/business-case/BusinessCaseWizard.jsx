import React from 'react';
import { useBusinessCase } from '../../contexts/BusinessCaseContext';
import ProgressStepper from './ProgressStepper';
import CustomerProfileForm from './CustomerProfile/CustomerProfileForm';
import CurrentStateConfig from './CurrentStateConfig';
import FutureStateConfig from './FutureStateConfig';

export default function BusinessCaseWizard() {
  const {
    currentStep,
    customerProfile,
    setProfile,
    setCurrentState,
    setFutureState,
    goToStep,
    canProceed
  } = useBusinessCase();

  const steps = [
    { title: 'Customer Profile', subtitle: 'Company & user info' },
    { title: 'Current State', subtitle: 'Existing environment' },
    { title: 'Future State', subtitle: 'Azure + Nerdio config' },
    { title: 'Results', subtitle: 'Business case analysis' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              Nerdio Business Case Builder
            </h1>
            <p className="text-gray-600">
              Create comprehensive TCO and ROI analysis for Azure Virtual Desktop with Nerdio Manager
            </p>
          </div>

          {/* Progress Stepper */}
          <ProgressStepper 
            currentStep={currentStep} 
            steps={steps}
            onStepClick={(step) => canProceed(step) && goToStep(step)}
          />

          {/* Step Content */}
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

            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  🎉 Business Case Complete!
                </h2>
                <p className="text-gray-600">
                  Results component will be displayed here
                </p>
                <button
                  onClick={() => goToStep(1)}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Start New Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
