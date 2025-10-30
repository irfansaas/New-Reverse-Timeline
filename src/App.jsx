import { useState } from 'react'
import CostCalculatorTest from './components/CostCalculatorTest'
import './App.css'

function App() {
  const [showTest, setShowTest] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-600">
            Nerdio Timeline & Business Case Calculator
          </h1>
          <button
            onClick={() => setShowTest(!showTest)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {showTest ? 'Hide' : 'Show'} Cost Calculator Test
          </button>
        </div>

        {showTest && (
          <div className="mb-8">
            <CostCalculatorTest />
          </div>
        )}

        {/* Your existing timeline calculator will go here */}
        <div className="text-center text-gray-500 mt-8">
          <p>Timeline Calculator (existing functionality)</p>
        </div>
      </div>
    </div>
  )
}

export default App
