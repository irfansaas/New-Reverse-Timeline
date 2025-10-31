import React, { useState } from 'react';
import CustomerProfileForm from './components/business-case/CustomerProfile/CustomerProfileForm';

export default function TestCustomerProfile() {
  const [profileData, setProfileData] = useState(null);

  const handleComplete = (data) => {
    console.log('Customer Profile Data:', data);
    setProfileData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              Customer Profile Form Test
            </h1>
            <p className="text-gray-600">
              Fill out the customer information to test the form
            </p>
          </div>

          {!profileData ? (
            <CustomerProfileForm onComplete={handleComplete} />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                ✓ Profile Complete!
              </h2>
              <div className="bg-gray-50 rounded p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(profileData, null, 2)}
                </pre>
              </div>
              <button
                onClick={() => setProfileData(null)}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                ← Back to Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
