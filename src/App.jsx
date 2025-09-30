import React, { useState, useEffect } from 'react';
import { User, ChefHat, Calculator, Activity, Utensils, Shield, Mail, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from './config/supabaseClient';

const App = () => {
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(0);
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

  const cuisines = ['Indian', 'Filipino', 'British', 'Arabic', 'Chinese', 'Italian', 'Thai', 'Mexican'];
  const dietTypes = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Low-Carb', 'Gluten-Free', 'Halal'];
  const allergensList = ['Nuts', 'Dairy', 'Eggs', 'Soy', 'Shellfish', 'Wheat', 'Fish'];
  const activityLevels = [
    { value: '1.2', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: '1.375', label: 'Light', desc: '1-3 days/week' },
    { value: '1.55', label: 'Moderate', desc: '3-5 days/week' },
    { value: '1.725', label: 'Active', desc: '6-7 days/week' },
    { value: '1.9', label: 'Very Active', desc: 'Athlete level' }
  ];

  useEffect(() => {
    if (userType === 'vendor') {
      loadLeadsFromDatabase();
    }
  }, [userType]);

  const loadLeadsFromDatabase = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const formattedLeads = data.map(lead => ({
        id: lead.id,
        cuisine: lead.cuisine,
        dietType: lead.diet_type,
        allergens: lead.allergens,
        calories: lead.calories,
        monthlyCost: lead.monthly_cost,
        email: lead.email,
        status: lead.status,
        timestamp: new Date(lead.created_at).toLocaleString()
      }));
      setLeads(formattedLeads);
    }
  };

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

  const toggleSelection = (item, key) => {
    const current = eaterData[key];
    if (current.includes(item)) {
      setEaterData({ ...eaterData, [key]: current.filter(i => i !== item) });
    } else {
      setEaterData({ ...eaterData, [key]: [...current, item] });
    }
  };

  const submitQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          cuisine: eaterData.cuisine.join(', '),
          diet_type: eaterData.dietType.join(', '),
          allergens: eaterData.allergens.join(', ') || 'None',
          calories: calculatedData.tdee,
          monthly_cost: calculatedData.monthlyCost,
          email: eaterData.email,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      setNotification('Success! Vendors will contact you soon.');
      
      setTimeout(() => {
        setStep(0);
        setUserType(null);
        setEaterData({
          height: '', weight: '', age: '', gender: 'male', activityLevel: '1.2',
          cuisine: [], dietType: [], allergens: [], email: ''
        });
        setCalculatedData(null);
        setNotification('');
      }, 2000);
    } catch (error) {
      setNotification('Error submitting. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const claimLead = async (leadId) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: 'claimed' })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: 'claimed' } : lead
      ));
      setNotification('Lead claimed successfully!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      setNotification('Error claiming lead.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const ProgressBar = ({ currentStep }) => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
            currentStep >= num ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {num}
          </div>
          {num < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > num ? 'bg-orange-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">Auntyz Kitchen</h1>
          <p className="text-xl text-slate-600">Home-style meals for UAE expats</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <button
            onClick={() => setUserType('eater')}
            className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-400 text-left"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                <Utensils className="w-8 h-8 text-orange-500" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-orange-500 transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Order Meals</h2>
            <p className="text-slate-600 mb-6">Get personalized meal plans based on your preferences and nutritional needs</p>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Custom calorie plans</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Authentic cuisines</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Allergen-safe options</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setUserType('vendor')}
            className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 text-left"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <ChefHat className="w-8 h-8 text-blue-500" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">For Vendors</h2>
            <p className="text-slate-600 mb-6">Access qualified customer leads and grow your cloud kitchen business</p>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Qualified leads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Detailed preferences</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Active leads available</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderEaterWizard = () => {
    if (step === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-12">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setUserType(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <ProgressBar currentStep={1} />

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="text-center mb-10">
                <div className="inline-block p-4 bg-orange-50 rounded-2xl mb-4">
                  <Calculator className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Details</h2>
                <p className="text-slate-600">Help us calculate your ideal nutrition plan</p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
                    <input 
                      type="number"
                      value={eaterData.height}
                      onChange={(e) => setEaterData({ ...eaterData, height: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="170"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                    <input 
                      type="number"
                      value={eaterData.weight}
                      onChange={(e) => setEaterData({ ...eaterData, weight: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="70"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                    <input 
                      type="number"
                      value={eaterData.age}
                      onChange={(e) => setEaterData({ ...eaterData, age: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                    <select 
                      value={eaterData.gender}
                      onChange={(e) => setEaterData({ ...eaterData, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Activity Level</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {activityLevels.map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setEaterData({ ...eaterData, activityLevel: level.value })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          eaterData.activityLevel === level.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-slate-800 mb-1">{level.label}</div>
                        <div className="text-xs text-slate-500">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  calculateBMR();
                  setStep(1);
                }}
                disabled={!eaterData.height || !eaterData.weight || !eaterData.age}
                className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-12">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setStep(0)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <ProgressBar currentStep={2} />

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="text-center mb-10">
                <div className="inline-block p-4 bg-orange-50 rounded-2xl mb-4">
                  <Utensils className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Preferences</h2>
                <p className="text-slate-600">Select your favorite cuisines and dietary requirements</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Cuisines</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {cuisines.map(cuisine => (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => toggleSelection(cuisine, 'cuisine')}
                        className={`p-3 rounded-xl border-2 transition-all font-medium ${
                          eaterData.cuisine.includes(cuisine)
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Diet Type (Optional)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {dietTypes.map(diet => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => toggleSelection(diet, 'dietType')}
                        className={`p-3 rounded-xl border-2 transition-all font-medium ${
                          eaterData.dietType.includes(diet)
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Allergens to Avoid (Optional)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {allergensList.map(allergen => (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => toggleSelection(allergen, 'allergens')}
                        className={`p-3 rounded-xl border-2 transition-all font-medium ${
                          eaterData.allergens.includes(allergen)
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {allergen}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email"
                      value={eaterData.email}
                      onChange={(e) => setEaterData({ ...eaterData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={eaterData.cuisine.length === 0 || !eaterData.email}
                className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <span>Review Plan</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2 && calculatedData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-12">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <ProgressBar currentStep={3} />

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="text-center mb-10">
                <div className="inline-block p-4 bg-green-50 rounded-2xl mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Personalized Plan</h2>
                <p className="text-slate-600">Review your nutrition and pricing details</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                  <div className="text-sm font-medium text-blue-600 mb-2">Daily Calories</div>
                  <div className="text-4xl font-bold text-blue-700 mb-1">{calculatedData.tdee}</div>
                  <div className="text-sm text-blue-600">kcal per day</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                  <div className="text-sm font-medium text-green-600 mb-2">Monthly Cost</div>
                  <div className="text-4xl font-bold text-green-700 mb-1">AED {calculatedData.monthlyCost}</div>
                  <div className="text-sm text-green-600">3 meals per day</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                <div className="font-semibold text-slate-800 mb-4">Daily Macros</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{calculatedData.protein}g</div>
                    <div className="text-sm text-slate-600">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{calculatedData.carbs}g</div>
                    <div className="text-sm text-slate-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{calculatedData.fat}g</div>
                    <div className="text-sm text-slate-600">Fat</div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 mb-8">
                <div className="font-semibold text-slate-800 mb-4">Your Selections</div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cuisines:</span>
                    <span className="font-medium text-slate-800">{eaterData.cuisine.join(', ')}</span>
                  </div>
                  {eaterData.dietType.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Diet:</span>
                      <span className="font-medium text-slate-800">{eaterData.dietType.join(', ')}</span>
                    </div>
                  )}
                  {eaterData.allergens.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Allergens:</span>
                      <span className="font-medium text-slate-800">{eaterData.allergens.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-medium text-slate-800">{eaterData.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Calculations are estimates based on the Mifflin-St Jeor equation. 
                    Consult a healthcare professional for personalized advice.
                  </p>
                </div>
              </div>

              <button 
                onClick={submitQuote}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Submit Request</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderVendorDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-12">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => setUserType(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Lead Dashboard</h2>
              <p className="text-slate-600">{leads.filter(l => l.status === 'pending').length} available leads</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl">
              <ChefHat className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-slate-50 rounded-3xl mb-6">
                <ChefHat className="w-16 h-16 text-slate-300 mx-auto" />
              </div>
              <p className="text-slate-500 text-lg">No leads available yet</p>
              <p className="text-slate-400 text-sm mt-2">Check back soon for new opportunities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map(lead => (
                <div 
                  key={lead.id}
                  className={`border-2 rounded-2xl p-6 transition-all ${
                    lead.status === 'claimed'
                      ? 'border-green-200 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">Order #{lead.id.slice(0, 8).toUpperCase()}</h3>
                      <p className="text-sm text-slate-500 mt-1">{lead.timestamp}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      lead.status === 'claimed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {lead.status === 'claimed' ? 'Claimed' : 'Available'}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-xs font-medium text-slate-500 mb-1">Cuisines</div>
                      <div className="text-slate-800 font-medium">{lead.cuisine}</div>
                    </div>
                    {lead.dietType && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">Diet Type</div>
                        <div className="text-slate-800 font-medium">{lead.dietType}</div>
                      </div>
                    )}
                    {lead.allergens && lead.allergens !== 'None' && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">Allergens</div>
                        <div className="text-slate-800 font-medium">{lead.allergens}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-medium text-slate-500 mb-1">Daily Calories</div>
                      <div className="text-slate-800 font-medium">{lead.calories} kcal</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Monthly Value</span>
                      <span className="text-2xl font-bold text-blue-600">AED {lead.monthlyCost}</span>
                    </div>
                  </div>

                  {lead.status === 'pending' ? (
                    <button 
                      onClick={() => claimLead(lead.id)}
                      className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all"
                    >
                      Claim Lead
                    </button>
                  ) : (
                    <div className="bg-green-100 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-green-800 mb-1">Contact Customer</div>
                          <div className="text-sm text-green-700">{lead.email}</div>
                        </div>
                      </div>
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
        <div className="fixed top-6 right-6 bg-white border-2 border-green-200 text-slate-800 px-6 py-4 rounded-2xl shadow-xl z-50 flex items-center gap-3 animate-pulse">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {!userType && renderHome()}
      {userType === 'eater' && renderEaterWizard()}
      {userType === 'vendor' && renderVendorDashboard()}
    </div>
  );
};

export default App;