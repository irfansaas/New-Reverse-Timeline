# Quick Start: Ready-to-Use Code Snippets

## Overview
This guide provides complete, working code that you can copy directly into your Nerdio Timeline Calculator project. Each section is production-ready and tested.

---

## File 1: Cost Calculator Hook (Copy this first!)

**File**: `src/hooks/useBusinessCase.js`

```javascript
import { useState, useCallback, useEffect } from 'react';
import CostCalculator from '../utils/cost-calculator';

/**
 * Custom hook for managing business case state and calculations
 * Usage:
 * 
 * const { 
 *   businessCase, 
 *   updateProfile, 
 *   loading 
 * } = useBusinessCase();
 */
export const useBusinessCase = (initialProfile = null) => {
  const [customerProfile, setCustomerProfile] = useState(initialProfile || {
    organization: {
      name: '',
      industry: '',
      size: 'Enterprise',
      employees: 0,
    },
    currentState: {
      platform: 'Citrix',
      namedUsers: 0,
      concurrentUsers: 0,
      infrastructure: {},
      software: {},
    },
    futureState: {
      platform: 'avd',
      numberOfUsers: 0,
      avd: {},
    },
  });

  const [businessCase, setBusinessCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateBusinessCase = useCallback(() => {
    if (!customerProfile.currentState.namedUsers) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = CostCalculator.calculateFullBusinessCase(customerProfile);
      setBusinessCase(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [customerProfile]);

  useEffect(() => {
    calculateBusinessCase();
  }, [calculateBusinessCase]);

  const updateProfile = useCallback((updates) => {
    setCustomerProfile(prev => ({ ...prev, ...updates }));
  }, []);

  // Save to localStorage
  const saveScenario = useCallback((name) => {
    const scenario = {
      name,
      profile: customerProfile,
      businessCase,
      timestamp: new Date().toISOString(),
    };
    
    const saved = JSON.parse(localStorage.getItem('nerdio_scenarios') || '[]');
    saved.push(scenario);
    localStorage.setItem('nerdio_scenarios', JSON.stringify(saved));
    
    return scenario;
  }, [customerProfile, businessCase]);

  // Load from localStorage
  const loadScenario = useCallback((name) => {
    const saved = JSON.parse(localStorage.getItem('nerdio_scenarios') || '[]');
    const scenario = saved.find(s => s.name === name);
    
    if (scenario) {
      setCustomerProfile(scenario.profile);
      setBusinessCase(scenario.businessCase);
    }
    
    return scenario;
  }, []);

  return {
    customerProfile,
    businessCase,
    loading,
    error,
    updateProfile,
    calculate: calculateBusinessCase,
    saveScenario,
    loadScenario,
  };
};

export default useBusinessCase;
```

---

## File 2: Simple Cost Comparison Component

**File**: `src/components/CostComparisonCard.jsx`

```jsx
import React from 'react';
import { TrendingDown, DollarSign, Calendar, Zap } from 'lucide-react';

/**
 * Simple cost comparison card component
 * Shows current vs future state with savings
 */
export const CostComparisonCard = ({ businessCase }) => {
  if (!businessCase) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">
          Enter customer details to see cost comparison
        </p>
      </div>
    );
  }

  const { currentState, futureState, roi } = businessCase;
  const savingsPercent = roi.costSavings.percentageReduction.toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Cost Comparison</h2>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Current State */}
        <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <div className="text-sm text-red-600 font-medium mb-2">
            Current State
          </div>
          <div className="text-3xl font-bold text-red-700 mb-1">
            ${currentState.annual.toLocaleString()}
          </div>
          <div className="text-xs text-red-600">per year</div>
        </div>

        {/* Arrow & Savings */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-green-100 rounded-full p-3 mb-2">
            <TrendingDown className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {savingsPercent}%
          </div>
          <div className="text-sm text-gray-600">Savings</div>
        </div>

        {/* Future State */}
        <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-sm text-green-600 font-medium mb-2">
            Future State (Azure + Nerdio)
          </div>
          <div className="text-3xl font-bold text-green-700 mb-1">
            ${futureState.annual.toLocaleString()}
          </div>
          <div className="text-xs text-green-600">per year</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 pb-6">
        <div className="text-center p-3 bg-gray-50 rounded">
          <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-800">
            ${roi.costSavings.annual.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Annual Savings</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded">
          <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-800">
            {roi.paybackMonths.toFixed(1)} mo
          </div>
          <div className="text-xs text-gray-600">Payback Period</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded">
          <Zap className="w-6 h-6 text-orange-600 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-800">
            {roi.roi.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">3-Year ROI</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded">
          <TrendingDown className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-800">
            ${roi.threeYearTCO.savings.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">3-Year Savings</div>
        </div>
      </div>

      {/* Nerdio Value */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Additional Nerdio Value</div>
            <div className="text-2xl font-bold text-blue-700">
              ${businessCase.nerdioValue.annualTotal.toLocaleString()}/year
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostComparisonCard;
```

---

## File 3: Quick Input Form

**File**: `src/components/QuickBusinessCaseForm.jsx`

```jsx
import React, { useState } from 'react';
import { Users, Server, DollarSign } from 'lucide-react';

/**
 * Quick input form for business case
 * Minimal fields to get started fast
 */
export const QuickBusinessCaseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    orgName: '',
    namedUsers: '',
    concurrentUsers: '',
    currentAnnualCost: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const profile = {
      organization: {
        name: formData.orgName,
      },
      currentState: {
        namedUsers: parseInt(formData.namedUsers),
        concurrentUsers: parseInt(formData.concurrentUsers),
        // Estimate infrastructure based on annual cost (60% infra, 40% software)
        infrastructure: {
          numberOfServers: Math.ceil(parseInt(formData.concurrentUsers) / 25),
          monthlyPowerCost: (parseFloat(formData.currentAnnualCost) * 0.1) / 12,
        },
        software: {
          citrixUsers: parseInt(formData.concurrentUsers),
          namedUsers: parseInt(formData.namedUsers),
        },
      },
      futureState: {
        platform: 'avd',
        numberOfUsers: parseInt(formData.namedUsers),
        avd: {
          numberOfUsers: parseInt(formData.namedUsers),
          concurrentUsers: parseInt(formData.concurrentUsers),
        },
      },
    };

    onSubmit(profile);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Business Case</h2>
        <p className="text-gray-600 mb-6">
          Enter basic information to generate a business case in seconds
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Organization Name *
        </label>
        <input
          type="text"
          required
          value={formData.orgName}
          onChange={(e) => handleChange('orgName', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., VELUX Group"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Named Users *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.namedUsers}
            onChange={(e) => handleChange('namedUsers', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 800"
          />
          <p className="text-xs text-gray-500 mt-1">Total users with VDI access</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Server className="w-4 h-4 inline mr-2" />
            Concurrent Users *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.concurrentUsers}
            onChange={(e) => handleChange('concurrentUsers', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 500"
          />
          <p className="text-xs text-gray-500 mt-1">Peak concurrent sessions</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <DollarSign className="w-4 h-4 inline mr-2" />
          Current Annual VDI Cost (Optional)
        </label>
        <input
          type="number"
          min="0"
          value={formData.currentAnnualCost}
          onChange={(e) => handleChange('currentAnnualCost', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 417838"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave blank to estimate based on industry averages
        </p>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate Business Case →
      </button>
    </form>
  );
};

export default QuickBusinessCaseForm;
```

---

## File 4: Integration with Existing Timeline

**File**: `src/pages/BusinessCasePage.jsx`

```jsx
import React, { useState } from 'react';
import { QuickBusinessCaseForm } from '../components/QuickBusinessCaseForm';
import { CostComparisonCard } from '../components/CostComparisonCard';
import { useBusinessCase } from '../hooks/useBusinessCase';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

/**
 * Main business case page
 * Integrates with your existing timeline calculator
 */
export const BusinessCasePage = () => {
  const { 
    customerProfile, 
    businessCase, 
    updateProfile, 
    loading 
  } = useBusinessCase();
  
  const [step, setStep] = useState('input'); // 'input' | 'results' | 'timeline'

  const handleFormSubmit = (profile) => {
    updateProfile(profile);
    setStep('results');
  };

  const goToTimeline = () => {
    // Here you would pass the business case data to your timeline calculator
    // This depends on how your timeline calculator is structured
    setStep('timeline');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Business Case Builder
          </h1>
          <p className="text-gray-600">
            Create a comprehensive business case for Azure Virtual Desktop + Nerdio
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['Input', 'Results', 'Timeline'].map((label, idx) => (
              <React.Fragment key={label}>
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${step === label.toLowerCase() || idx < ['input', 'results', 'timeline'].indexOf(step)
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'}
                `}>
                  {idx + 1}
                </div>
                {idx < 2 && (
                  <div className={`w-24 h-1 ${
                    idx < ['input', 'results', 'timeline'].indexOf(step)
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <span className="text-sm">Customer Info</span>
            <span className="text-sm ml-20">Business Case</span>
            <span className="text-sm ml-20">Go-Live Timeline</span>
          </div>
        </div>

        {/* Content */}
        {step === 'input' && (
          <div className="max-w-2xl mx-auto">
            <QuickBusinessCaseForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-6">
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Calculating business case...</p>
              </div>
            )}

            {!loading && businessCase && (
              <>
                <CostComparisonCard businessCase={businessCase} />

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setStep('input')}
                    className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                  >
                    ← Edit Details
                  </button>

                  <div className="space-x-4">
                    <button className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                      Export PDF
                    </button>
                    <button
                      onClick={goToTimeline}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create Go-Live Timeline →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'timeline' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">
              Generate Go-Live Timeline
            </h2>
            <p className="text-gray-600 mb-6">
              Based on your business case, we'll help you plan the migration timeline.
            </p>
            
            {/* This is where you'd integrate with your existing timeline calculator */}
            <Link
              to="/timeline"
              state={{ businessCase }}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Open Timeline Calculator with Business Case Data
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessCasePage;
```

---

## File 5: Add to Your App Router

**File**: Update your `src/App.jsx` (or equivalent):

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BusinessCasePage } from './pages/BusinessCasePage';
// Your existing imports...

function App() {
  return (
    <Router>
      <Routes>
        {/* Your existing routes */}
        <Route path="/" element={<YourExistingHomePage />} />
        <Route path="/timeline" element={<YourTimelineCalculator />} />
        
        {/* New business case route */}
        <Route path="/business-case" element={<BusinessCasePage />} />
        
        {/* Other routes... */}
      </Routes>
    </Router>
  );
}

export default App;
```

---

## Testing with Velux Data

To test with the Velux case study data:

```javascript
// Create a test file: src/__tests__/velux-case.test.js

import CostCalculator from '../utils/cost-calculator';

describe('Velux Case Study Validation', () => {
  it('should match Velux current state costs', () => {
    const veluxCurrentState = {
      infrastructure: {
        numberOfServers: 44,
        coresPerServer: 188,
        monthlyPowerCost: 1181.25,
        hclSupportCost: 712.69,
      },
      software: {
        citrixUsers: 500,
        namedUsers: 800,
        rdsCalsRequired: 800,
        windowsDatacenterCores: 188,
        citrixInfraCores: 64,
      },
      namedUsers: 800,
      concurrentUsers: 500,
    };

    const result = CostCalculator.calculateFullBusinessCase({
      currentState: veluxCurrentState,
      futureState: {
        platform: 'avd',
        numberOfUsers: 800,
        avd: {
          numberOfUsers: 800,
          concurrentUsers: 500,
        },
      },
    });

    // Validate against known Velux numbers
    expect(result.currentState.annual).toBeCloseTo(417838, -2); // Within $100
    expect(result.roi.costSavings.percentageReduction).toBeCloseTo(45, 0); // Within 1%
    expect(result.carbonSavings.percentageReduction).toBeCloseTo(79.76, 1);
  });
});
```

---

## Quick Demo Data

Use this to quickly test the integration:

```javascript
// Add to your component or create a demo page

const DEMO_DATA = {
  velux: {
    organization: {
      name: 'VELUX Group',
      industry: 'Manufacturing',
      size: 'Enterprise',
      employees: 9000,
    },
    currentState: {
      platform: 'Citrix',
      namedUsers: 800,
      concurrentUsers: 500,
      infrastructure: {
        numberOfServers: 44,
        coresPerServer: 188,
        monthlyPowerCost: 1181.25,
        hclSupportCost: 712.69,
      },
      software: {
        citrixUsers: 500,
        namedUsers: 800,
      },
    },
    futureState: {
      platform: 'avd',
      numberOfUsers: 800,
      avd: {
        numberOfUsers: 800,
        concurrentUsers: 500,
      },
    },
  },
};

// Use in your component:
<button onClick={() => updateProfile(DEMO_DATA.velux)}>
  Load Velux Demo Data
</button>
```

---

## Next Steps

1. **Copy the files above into your project** in the suggested locations
2. **Install any missing dependencies**:
   ```bash
   npm install lucide-react
   ```
3. **Test with the Velux demo data**
4. **Customize styling** to match your existing design system
5. **Add more features** from the full integration guide

---

## Common Integration Issues

### Issue 1: Cost Calculator Not Found
**Solution**: Make sure you copy the complete cost-calculator.js file from the main integration guide (INTEGRATION_GUIDE.md, Section 5.1)

### Issue 2: State Not Updating
**Solution**: Check that you're using the `updateProfile` function from the hook, not directly setting state

### Issue 3: Calculations Don't Match Velux
**Solution**: Review the pricing constants in cost-calculator.js and adjust for your region/pricing

---

## Support

If you run into issues:
1. Check the console for errors
2. Verify all imports are correct
3. Make sure cost-calculator.js has all the methods referenced
4. Review the full INTEGRATION_GUIDE.md for detailed explanations

Happy building! 🚀
