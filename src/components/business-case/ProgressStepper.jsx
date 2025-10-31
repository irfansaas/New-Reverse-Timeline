import React from 'react';
import { Check } from 'lucide-react';

export default function ProgressStepper({ currentStep, steps, onStepClick }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = stepNumber <= currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    isCompleted
                      ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700'
                      : isActive
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? <Check size={24} /> : stepNumber}
                </button>
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-semibold ${
                      isActive
                        ? 'text-purple-600'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.subtitle}</div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 mt-[-24px] transition-all ${
                    stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
