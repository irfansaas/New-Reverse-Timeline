import React from 'react';
import { BusinessCaseProvider } from './contexts/BusinessCaseContext';
import BusinessCaseWizard from './components/business-case/BusinessCaseWizard';

export default function TestBusinessCaseWizard() {
  return (
    <BusinessCaseProvider>
      <BusinessCaseWizard />
    </BusinessCaseProvider>
  );
}
