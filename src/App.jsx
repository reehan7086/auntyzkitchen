import React, { useState, useEffect } from 'react';
import { Camera, User, ChefHat, Calculator, Mic, TrendingUp, ShoppingCart, Bell, CheckCircle, Coffee, Globe, Heart } from 'lucide-react';

const App = () => {
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [eaterData, setEaterData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: '1.2',
    cuisine: [],
    dietType: [],
    allergens: [],
    email: ''
  });
  const [calculatedData, setCalculatedData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [notification, setNotification] = useState('');
  const [nutritionData, setNutritionData] = useState(null);

  const cuisines = ['Indian', 'Filipino', 'British', 'Arabic', 'Chinese', 'Italian', 'Thai', 'Mexican'];
  const dietTypes = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Low-Carb', 'Gluten-Free', 'Halal'];
  const allergensList = ['Nuts', 'Dairy', 'Eggs', 'Soy', 'Shellfish', 'Wheat', 'Fish'];
  const activityLevels = [
    { value: '1.2', label: 'Sedentary (little or no exercise)' },
    { value: '1.375', label: 'Lightly active (1-3 days/week)' },
    { value: '1.55', label: 'Moderately active (3-5 days/week)' },
    { value: '1.725', label: 'Very active (6-7 days/week)' },
    { value: '1.9', label: 'Extra active (physical job + exercise)' }
  ];

  const calculateBMR = () => {
    const weight = parseFloat(eaterData.weight);
    const height = parseFloat(eaterData.height);
    const age = parseFloat(eaterData.age);
    const activity = parseFloat(eaterData.activityLevel);

    let bmr;
    if (eaterData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = Math.round(bmr * activity);
    const protein = Math.round((tdee * 0.3) / 4);
    const carbs = Math.round((tdee * 0.4) / 4);
    const fat = Math.round((tdee * 0.3) / 9);
    
    const mealsPerDay = 3;
    const costPerMeal = 20;
    const monthlyCost = mealsPerDay * costPerMeal * 30;

    setCalculatedData({
      bmr: Math.round(bmr),
      tdee,
      protein,
      carbs,
      fat,
      monthlyCost
    });
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processVoiceCommand(transcript);
      };

      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser. Please use Chrome.');
    }
  };

  const processVoiceCommand = (text) => {
    const words = text.split(' ');
    
    if (text.includes('indian')) {
      setEaterData(prev => ({ ...prev, cuisine: [...prev.cuisine, 'Indian'] }));
    }
    if (text.includes('vegan')) {
      setEaterData(prev => ({ ...prev, dietType: [...prev.dietType, 'Vegan'] }));
    }
    if (text.includes('nut')) {
      setEaterData(prev => ({ ...prev, allergens: [...prev.allergens, 'Nuts'] }));
    }
    
    const calorieMatch = text.match(/(\d+)\s*calorie/);
    if (calorieMatch) {
      const targetCalories = parseInt(calorieMatch[1]);
      const estimatedWeight = targetCalories / 25;
      setEaterData(prev => ({ ...prev, weight: estimatedWeight.toString() }));
    }

    setNotification(`Voice command processed: "${text}"`);
    setTimeout(() => setNotification(''), 3000);
  };

  const toggleSelection = (array, item, key) => {
    const current = eaterData[key];
    if (current.includes(item)) {
      setEaterData({ ...eaterData, [key]: current.filter(i => i !== item) });
    } else {
      setEaterData({ ...eaterData, [key]: [...current, item] });
    }
  };

  const submitQuote = () => {
    const newLead = {
      id: Date.now(),
      cuisine: eaterData.cuisine.join(', '),
      dietType: eaterData.dietType.join(', '),
      allergens: eaterData.allergens.join(', ') || 'None',
      calories: calculatedData.tdee,
      monthlyCost: calculatedData.monthlyCost,
      email: eaterData.email,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    };
    
    setLeads(prev => [...prev, newLead]);
    setNotification('✓ Quote submitted! Vendors will contact you soon.');
    setTimeout(() => {
      setStep(0);
      setEaterData({
        height: '', weight: '', age: '', gender: 'male', activityLevel: '1.2',
        cuisine: [], dietType: [], allergens: [], email: ''
      });
      setCalculatedData(null);
    }, 2000);
  };

  const claimLead = (leadId) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: 'claimed' } : lead
    ));
    setNotification('✓ Lead claimed! Contact the customer via email.');
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">🍽️ Home Away From Home</h1>
          <p className="text-lg text-gray-600">UAE's Cloud Kitchen Mediation Platform</p>
          <p className="text-sm text-gray-500 mt-2">Connecting 88% of UAE expats with country-specific cuisines</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div 
            onClick={() => setUserType('eater')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-orange-400"
          >
            <User className="w-12 h-12 text-orange-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">I'm an Eater</h2>
            <p className="text-gray-600 mb-4">Get personalized meal plans tailored to your diet, culture, and budget</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>✓ BMR & calorie calculations</li>
              <li>✓ Country-specific cuisines</li>
              <li>✓ Allergen-free options</li>
              <li>✓ AED 15-25 per meal</li>
            </ul>
          </div>

          <div 
            onClick={() => setUserType('vendor')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-blue-400"
          >
            <ChefHat className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">I'm a Vendor</h2>
            <p className="text-gray-600 mb-4">Access qualified leads and grow your cloud kitchen business</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>✓ Realtime lead notifications</li>
              <li>✓ Detailed customer preferences</li>
              <li>✓ Direct WhatsApp connection</li>
              <li>✓ {leads.length} active leads now</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span>150+ users created personalized plans this month</span>
            <span className="mx-2">•</span>
            <span>UAE market valued at AED 1.58B (USD 430M)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEaterWizard = () => {
    if (step === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setUserType(null)}
              className="text-gray-600 mb-6 hover:text-gray-800"
            >
              ← Back
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Step 1: Your Basics</h2>
                <button 
                  onClick={startVoiceInput}
                  className={`p-3 rounded-full ${isListening ? 'bg-red-500' : 'bg-orange-500'} text-white hover:opacity-80`}
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input 
                    type="number"
                    value={eaterData.height}
                    onChange={(e) => setEaterData({ ...eaterData, height: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="e.g., 170"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input 
                    type="number"
                    value={eaterData.weight}
                    onChange={(e) => setEaterData({ ...eaterData, weight: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="e.g., 70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input 
                    type="number"
                    value={eaterData.age}
                    onChange={(e) => setEaterData({ ...eaterData, age: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="e.g., 30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select 
                    value={eaterData.gender}
                    onChange={(e) => setEaterData({ ...eaterData, gender: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                  <select 
                    value={eaterData.activityLevel}
                    onChange={(e) => setEaterData({ ...eaterData, activityLevel: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  >
                    {activityLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setStep(1)}
                disabled={!eaterData.height || !eaterData.weight || !eaterData.age}
                className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Preferences
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setStep(0)}
              className="text-gray-600 mb-6 hover:text-gray-800"
            >
              ← Back
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2: Your Preferences</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Cuisines (select all that apply)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {cuisines.map(cuisine => (
                      <button
                        key={cuisine}
                        onClick={() => toggleSelection(eaterData.cuisine, cuisine, 'cuisine')}
                        className={`p-3 rounded-lg border-2 transition ${
                          eaterData.cuisine.includes(cuisine)
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Diet Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {dietTypes.map(diet => (
                      <button
                        key={diet}
                        onClick={() => toggleSelection(eaterData.dietType, diet, 'dietType')}
                        className={`p-3 rounded-lg border-2 transition ${
                          eaterData.dietType.includes(diet)
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Allergens to Avoid</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allergensList.map(allergen => (
                      <button
                        key={allergen}
                        onClick={() => toggleSelection(eaterData.allergens, allergen, 'allergens')}
                        className={`p-3 rounded-lg border-2 transition ${
                          eaterData.allergens.includes(allergen)
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {allergen}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email"
                    value={eaterData.email}
                    onChange={(e) => setEaterData({ ...eaterData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  calculateBMR();
                  setStep(2);
                }}
                disabled={eaterData.cuisine.length === 0 || !eaterData.email}
                className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Calculate & Review
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2 && calculatedData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => setStep(1)}
              className="text-gray-600 mb-6 hover:text-gray-800"
            >
              ← Back
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 3: Your Personalized Plan</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <Calculator className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Calories</h3>
                  <p className="text-3xl font-bold text-blue-600">{calculatedData.tdee} kcal</p>
                  <p className="text-sm text-gray-600 mt-2">BMR: {calculatedData.bmr} kcal</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <ShoppingCart className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Monthly Cost</h3>
                  <p className="text-3xl font-bold text-green-600">AED {calculatedData.monthlyCost}</p>
                  <p className="text-sm text-gray-600 mt-2">~AED 20/meal × 3 meals/day</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Daily Macros Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{calculatedData.protein}g</p>
                    <p className="text-sm text-gray-600">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{calculatedData.carbs}g</p>
                    <p className="text-sm text-gray-600">Carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{calculatedData.fat}g</p>
                    <p className="text-sm text-gray-600">Fat</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Your Selections</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Cuisines:</strong> {eaterData.cuisine.join(', ')}</p>
                  <p><strong>Diet:</strong> {eaterData.dietType.join(', ') || 'No restrictions'}</p>
                  <p><strong>Allergens:</strong> {eaterData.allergens.join(', ') || 'None'}</p>
                  <p><strong>Email:</strong> {eaterData.email}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Calculations are estimates based on Mifflin-St Jeor equation. 
                  Consult a healthcare professional for personalized advice. Compliant with Dubai Municipality allergen guidelines.
                </p>
              </div>

              <button 
                onClick={submitQuote}
                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Quote Request
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderVendorDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => setUserType(null)}
          className="text-gray-600 mb-6 hover:text-gray-800"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h2>
              <p className="text-gray-600 mt-1">Browse and claim qualified leads</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active leads yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map(lead => (
                <div 
                  key={lead.id}
                  className={`border-2 rounded-xl p-6 transition ${
                    lead.status === 'claimed'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">Lead #{lead.id}</h3>
                      <p className="text-sm text-gray-500">{lead.timestamp}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lead.status === 'claimed'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {lead.status === 'claimed' ? '✓ Claimed' : 'Available'}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Cuisines:</strong></p>
                      <p className="text-gray-800">{lead.cuisine}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Diet Type:</strong></p>
                      <p className="text-gray-800">{lead.dietType || 'No restrictions'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Allergens:</strong></p>
                      <p className="text-gray-800">{lead.allergens}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1"><strong>Daily Calories:</strong></p>
                      <p className="text-gray-800">{lead.calories} kcal</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Monthly Value:</strong> <span className="text-blue-600 font-bold">AED {lead.monthlyCost}</span>
                    </p>
                  </div>

                  {lead.status === 'pending' ? (
                    <button 
                      onClick={() => claimLead(lead.id)}
                      className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Claim Lead & Contact Customer
                    </button>
                  ) : (
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <strong>Customer Email:</strong> {lead.email}
                      </p>
                      <p className="text-xs text-green-700 mt-2">
                        Contact the customer directly via email or WhatsApp to finalize the order.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}

      {!userType && renderHome()}
      {userType === 'eater' && renderEaterWizard()}
      {userType === 'vendor' && renderVendorDashboard()}
    </div>
  );
};

export default App;