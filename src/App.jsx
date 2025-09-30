// PART 1: Imports, State Setup, and Data Arrays
// Copy this into your App.js file

import React, { useState } from 'react';
import { 
  User, ChefHat, Calculator, Utensils, Shield, Mail, Check, 
  ArrowRight, ArrowLeft, Flame, Pizza, Cookie, Droplets, Egg, 
  Target, Clock, MessageCircle, ShieldCheck, UtensilsCrossed, 
  Sparkles, Heart, Zap, Star, TrendingUp, Award 
} from 'lucide-react';

const App = () => {
  // State Management
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(0);
  const [mealData, setMealData] = useState({
    name: '', email: '', phone: '',
    height: '', weight: '', age: '', gender: 'male', 
    activityLevel: '1.2', goal: 'maintain',
    targetCalories: '', proteinGrams: '', carbsGrams: '', 
    fatGrams: '', mealsPerDay: 3,
    cuisines: [], dietType: [], allergens: [], 
    cookingStyle: [], spiceLevel: 'medium',
    mealTiming: [], portionSize: 'regular', 
    specialInstructions: ''
  });
  const [calculatedData, setCalculatedData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [notification, setNotification] = useState('');

  // Data Arrays
  const cuisines = [
    { id: 'indian', label: 'Indian', icon: '🍛' },
    { id: 'filipino', label: 'Filipino', icon: '🍲' },
    { id: 'british', label: 'British', icon: '🥧' },
    { id: 'arabic', label: 'Arabic', icon: '🫓' },
    { id: 'chinese', label: 'Chinese', icon: '🥡' },
    { id: 'italian', label: 'Italian', icon: '🍝' },
    { id: 'thai', label: 'Thai', icon: '🍜' },
    { id: 'mexican', label: 'Mexican', icon: '🌮' },
    { id: 'japanese', label: 'Japanese', icon: '🍱' },
    { id: 'korean', label: 'Korean', icon: '🍚' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🥙' },
    { id: 'american', label: 'American', icon: '🍔' }
  ];

  const dietTypes = [
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'keto', label: 'Keto', icon: '🥑' },
    { id: 'paleo', label: 'Paleo', icon: '🍖' },
    { id: 'lowcarb', label: 'Low-Carb', icon: '🥩' },
    { id: 'glutenfree', label: 'Gluten-Free', icon: '🌾' },
    { id: 'halal', label: 'Halal', icon: '☪️' },
    { id: 'kosher', label: 'Kosher', icon: '✡️' }
  ];

  const allergens = [
    'Nuts', 'Dairy', 'Eggs', 'Soy', 'Shellfish', 'Wheat', 
    'Fish', 'Sesame', 'Peanuts', 'Tree Nuts', 'Gluten', 'Lactose'
  ];

  const cookingStyles = [
    { id: 'grilled', label: 'Grilled', desc: 'Smoky & charred', icon: Flame },
    { id: 'baked', label: 'Baked', desc: 'Oven-roasted', icon: Pizza },
    { id: 'steamed', label: 'Steamed', desc: 'Light & healthy', icon: Droplets },
    { id: 'stirfry', label: 'Stir-Fry', desc: 'Quick & crispy', icon: Sparkles },
    { id: 'slowcooked', label: 'Slow-Cooked', desc: 'Tender & rich', icon: Clock },
    { id: 'raw', label: 'Raw/Fresh', desc: 'Salads & fresh', icon: Heart }
  ];

  const spiceLevels = [
    { value: 'none', label: 'None', emoji: '😊' },
    { value: 'mild', label: 'Mild', emoji: '😌' },
    { value: 'medium', label: 'Medium', emoji: '🙂' },
    { value: 'hot', label: 'Hot', emoji: '😅' },
    { value: 'extra', label: 'Extra Hot', emoji: '🥵' }
  ];

  const mealTimings = [
    { id: 'breakfast', label: 'Breakfast', time: '7-10 AM', icon: '🌅' },
    { id: 'brunch', label: 'Brunch', time: '10 AM-12 PM', icon: '☕' },
    { id: 'lunch', label: 'Lunch', time: '12-2 PM', icon: '☀️' },
    { id: 'snack', label: 'Snacks', time: '3-5 PM', icon: '🍿' },
    { id: 'dinner', label: 'Dinner', time: '7-9 PM', icon: '🌙' },
    { id: 'latenight', label: 'Late Night', time: '9 PM+', icon: '⭐' }
  ];

  const activityLevels = [
    { value: '1.2', label: 'Sedentary', desc: 'Little/no exercise', icon: '🛋️' },
    { value: '1.375', label: 'Light', desc: '1-3 days/week', icon: '🚶' },
    { value: '1.55', label: 'Moderate', desc: '3-5 days/week', icon: '🏃' },
    { value: '1.725', label: 'Active', desc: '6-7 days/week', icon: '💪' },
    { value: '1.9', label: 'Very Active', desc: 'Athlete level', icon: '🏋️' }
  ];

  const goals = [
    { 
      value: 'loss', 
      label: 'Weight Loss', 
      desc: 'Caloric deficit', 
      icon: TrendingUp, 
      color: 'from-red-400 to-orange-500' 
    },
    { 
      value: 'maintain', 
      label: 'Maintain', 
      desc: 'Stay balanced', 
      icon: Target, 
      color: 'from-blue-400 to-cyan-500' 
    },
    { 
      value: 'gain', 
      label: 'Muscle Gain', 
      desc: 'Caloric surplus', 
      icon: Zap, 
      color: 'from-green-400 to-emerald-500' 
    }
  ];

// PART 2: Helper Functions
// Add these functions inside your App component (after the data arrays)

  // BMR and Macro Calculation
  const calculateBMRandMacros = () => {
    const weight = parseFloat(mealData.weight);
    const height = parseFloat(mealData.height);
    const age = parseFloat(mealData.age);
    const activity = parseFloat(mealData.activityLevel);

    let bmr;
    if (mealData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    let tdee = Math.round(bmr * activity);
    
    if (mealData.goal === 'loss') tdee = Math.round(tdee * 0.85);
    if (mealData.goal === 'gain') tdee = Math.round(tdee * 1.15);

    const protein = Math.round((tdee * 0.3) / 4);
    const carbs = Math.round((tdee * 0.4) / 4);
    const fat = Math.round((tdee * 0.3) / 9);
    
    const mealsPerDay = mealData.mealsPerDay;
    const costPerMeal = 22;
    const monthlyCost = mealsPerDay * costPerMeal * 30;

    setCalculatedData({ 
      bmr: Math.round(bmr), 
      tdee, 
      protein, 
      carbs, 
      fat, 
      monthlyCost 
    });
    
    setMealData(prev => ({
      ...prev,
      targetCalories: tdee.toString(),
      proteinGrams: protein.toString(),
      carbsGrams: carbs.toString(),
      fatGrams: fat.toString()
    }));
  };

  // Calculate Macros from User Input
  const calculateMacrosFromInput = () => {
    const calories = parseInt(mealData.targetCalories) || calculatedData.tdee;
    const protein = parseInt(mealData.proteinGrams) || calculatedData.protein;
    const carbs = parseInt(mealData.carbsGrams) || calculatedData.carbs;
    const fat = parseInt(mealData.fatGrams) || calculatedData.fat;
    const mealsPerDay = mealData.mealsPerDay;
    const costPerMeal = 22;
    const monthlyCost = mealsPerDay * costPerMeal * 30;
    return { calories, protein, carbs, fat, monthlyCost };
  };

  // Toggle Selection Helper
  const toggleSelection = (item, key) => {
    const current = mealData[key];
    if (current.includes(item)) {
      setMealData({ ...mealData, [key]: current.filter(i => i !== item) });
    } else {
      setMealData({ ...mealData, [key]: [...current, item] });
    }
  };

  // Submit Meal Plan
  const submitMealPlan = () => {
    const macros = calculateMacrosFromInput();
    const leadData = {
      name: mealData.name,
      email: mealData.email,
      phone: mealData.phone,
      cuisine: mealData.cuisines.map(id => 
        cuisines.find(c => c.id === id)?.label
      ).join(', '),
      diet_type: mealData.dietType.map(id => 
        dietTypes.find(d => d.id === id)?.label
      ).join(', '),
      allergens: mealData.allergens.join(', ') || 'None',
      calories: macros.calories,
      monthly_cost: macros.monthlyCost,
      status: 'pending',
      meal_details: {
        goal: mealData.goal,
        mealsPerDay: mealData.mealsPerDay,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        cookingStyle: mealData.cookingStyle.map(id => 
          cookingStyles.find(s => s.id === id)?.label
        ),
        spiceLevel: mealData.spiceLevel,
        mealTiming: mealData.mealTiming.map(id => 
          mealTimings.find(t => t.id === id)?.label
        ),
        portionSize: mealData.portionSize,
        specialInstructions: mealData.specialInstructions
      },
      timestamp: new Date().toLocaleString()
    };

    const newLead = { ...leadData, id: `lead_${Date.now()}` };
    setLeads(prev => [newLead, ...prev]);
    setNotification('Success! Your meal plan request has been submitted.');
    
    setTimeout(() => {
      setStep(0);
      setUserType(null);
      setMealData({
        name: '', email: '', phone: '', height: '', weight: '', age: '', 
        gender: 'male', activityLevel: '1.2', goal: 'maintain',
        targetCalories: '', proteinGrams: '', carbsGrams: '', 
        fatGrams: '', mealsPerDay: 3,
        cuisines: [], dietType: [], allergens: [], cookingStyle: [], 
        spiceLevel: 'medium', mealTiming: [], portionSize: 'regular', 
        specialInstructions: ''
      });
      setCalculatedData(null);
      setNotification('');
    }, 3000);
  };

  // Claim Lead
  const claimLead = (leadId) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: 'claimed' } : lead
    ));
    setNotification('Lead claimed successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  // Progress Bar Component
  const WizardProgress = ({ current, total }) => (
    <div className="flex items-center justify-center mb-10">
      {Array.from({ length: total }, (_, i) => i + 1).map((num) => (
        <React.Fragment key={num}>
          <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
            current >= num 
              ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-lg scale-110' 
              : current === num - 1
              ? 'bg-orange-200 text-orange-600'
              : 'bg-gray-200 text-gray-400'
          }`}>
            {current > num ? <Check className="w-6 h-6" /> : num}
          </div>
          {num < total && (
            <div className={`w-12 h-1.5 mx-2 rounded-full transition-all ${
              current > num ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
// PART 3: Home Page and Vendor Dashboard Renders
// Add these render conditions after the functions in your App component

  // HOME PAGE RENDER
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Auntyz Kitchen
            </h1>
            <p className="text-2xl text-gray-700 font-medium mb-4">Home-style meals for UAE expats</p>
            <p className="text-gray-600 max-w-2xl mx-auto">Your personalized meal planning platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <button
              onClick={() => setUserType('eater')}
              className="group relative bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-orange-300 text-left transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="p-5 bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl">
                  <Utensils className="w-10 h-10 text-orange-500" />
                </div>
                <ArrowRight className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Meals</h2>
              <p className="text-gray-600 mb-8">Get personalized meal plans based on your preferences</p>
              <div className="space-y-3">
                {[
                  { icon: Sparkles, text: 'AI-powered nutrition' },
                  { icon: Heart, text: 'Authentic home cooking' },
                  { icon: Shield, text: 'Allergen-safe' },
                  { icon: Award, text: 'Premium quality' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <item.icon className="w-4 h-4 text-green-600" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </button>

            <button
              onClick={() => setUserType('vendor')}
              className="group relative bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-300 text-left transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="p-5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl">
                  <ChefHat className="w-10 h-10 text-blue-500" />
                </div>
                <ArrowRight className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">For Vendors</h2>
              <p className="text-gray-600 mb-8">Access qualified leads and grow your business</p>
              <div className="space-y-3">
                {[
                  { icon: Target, text: 'Pre-qualified leads' },
                  { icon: Star, text: 'Detailed preferences' },
                  { icon: Zap, text: 'Instant notifications' },
                  { icon: TrendingUp, text: 'Growth tools' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <item.icon className="w-4 h-4 text-green-600" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </button>
          </div>
        </div>

        {notification && (
          <div className="fixed top-8 right-8 bg-white border-l-4 border-green-500 px-8 py-5 rounded-2xl shadow-2xl z-50">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600" />
              <div>{notification}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // VENDOR DASHBOARD RENDER
  if (userType === 'vendor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 py-12">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setUserType(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Vendor Dashboard</h2>
                <p className="text-gray-600 text-lg">
                  {leads.filter(l => l.status === 'pending').length} available leads
                </p>
              </div>
              <div className="p-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-20">
                <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-500 text-xl font-medium">No leads available yet</p>
                <p className="text-gray-400 mt-2">Check back soon for new requests</p>
              </div>
            ) : (
              <div className="space-y-6">
                {leads.map(lead => (
                  <div 
                    key={lead.id}
                    className={`border-2 rounded-3xl p-8 transition-all ${
                      lead.status === 'claimed'
                        ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                        : 'border-gray-200 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Order #{lead.id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-gray-500">{lead.timestamp}</p>
                      </div>
                      <span className={`px-6 py-3 rounded-full text-sm font-bold ${
                        lead.status === 'claimed' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-orange-200 text-orange-800'
                      }`}>
                        {lead.status === 'claimed' ? 'Claimed' : 'Available'}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-5 text-center">
                        <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{lead.calories}</div>
                        <div className="text-sm text-gray-600">Cal/day</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 text-center">
                        <Pizza className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {lead.cuisine?.split(',').length || 1}
                        </div>
                        <div className="text-sm text-gray-600">Cuisines</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 text-center">
                        <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {lead.meal_details?.mealsPerDay || 3}
                        </div>
                        <div className="text-sm text-gray-600">Meals/day</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 text-center">
                        <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold capitalize">
                          {lead.meal_details?.goal || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Goal</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Monthly Value</span>
                        <span className="text-4xl font-bold text-green-600">
                          AED {lead.monthly_cost}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-2">CUISINES</div>
                        <div className="text-gray-800 font-medium">
                          {lead.cuisine || 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-2">DIET TYPE</div>
                        <div className="text-gray-800 font-medium">
                          {lead.diet_type || 'None'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-2">ALLERGENS</div>
                        <div className="text-gray-800 font-medium">{lead.allergens}</div>
                      </div>
                      {lead.meal_details?.cookingStyle?.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 mb-2">COOKING</div>
                          <div className="text-gray-800 font-medium">
                            {lead.meal_details.cookingStyle.join(', ')}
                          </div>
                        </div>
                      )}
                      {lead.meal_details?.spiceLevel && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 mb-2">SPICE</div>
                          <div className="text-gray-800 font-medium capitalize">
                            {lead.meal_details.spiceLevel}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-2">MACROS</div>
                        <div className="text-gray-800 font-medium text-sm">
                          P:{lead.meal_details?.protein}g C:{lead.meal_details?.carbs}g F:{lead.meal_details?.fat}g
                        </div>
                      </div>
                    </div>

                    {lead.meal_details?.specialInstructions && (
                      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                        <div className="text-xs font-bold text-gray-500 mb-2">
                          SPECIAL INSTRUCTIONS
                        </div>
                        <div className="text-gray-700">
                          {lead.meal_details.specialInstructions}
                        </div>
                      </div>
                    )}

                    {lead.status === 'pending' ? (
                      <button 
                        onClick={() => claimLead(lead.id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
                      >
                        Claim This Lead
                      </button>
                    ) : (
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl p-6">
                        <div className="font-bold text-green-800 mb-3">Contact Customer</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">{lead.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-green-600" />
                            <span className="text-green-700">{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-3">
                              <MessageCircle className="w-5 h-5 text-green-600" />
                              <span className="text-green-700">{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {notification && (
          <div className="fixed top-8 right-8 bg-white border-l-4 border-green-500 px-8 py-5 rounded-2xl shadow-2xl z-50">
            <div className="flex items-center gap-4">
              <Check className="w-6 h-6 text-green-600" />
              <div>{notification}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // PART 4: Customer Wizard - Steps 0, 1, 2
// Add this after the vendor dashboard (continuing the main return statement)

  // CUSTOMER WIZARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => step === 0 ? setUserType(null) : setStep(step - 1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <WizardProgress current={step + 1} total={6} />

        {/* STEP 0: Personal Info */}
        {step === 0 && (
          <div className="bg-white rounded-3xl p-10 md:p-14 shadow-2xl">
            <div className="text-center mb-12">
              <div className="inline-block p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Let's Get Started</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Full Name</label>
                <input 
                  type="text"
                  value={mealData.name}
                  onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Email</label>
                  <input 
                    type="email"
                    value={mealData.email}
                    onChange={(e) => setMealData({ ...mealData, email: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Phone</label>
                  <input 
                    type="tel"
                    value={mealData.phone}
                    onChange={(e) => setMealData({ ...mealData, phone: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(1)}
              disabled={!mealData.name || !mealData.email || !mealData.phone}
              className="w-full mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              Continue to Body Metrics
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* STEP 1: Body Metrics */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-10 md:p-14 shadow-2xl">
            <div className="text-center mb-12">
              <div className="inline-block p-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl mb-6">
                <Calculator className="w-12 h-12 text-orange-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Body Metrics</h2>
              <p className="text-gray-600">Help us calculate your nutrition plan</p>
            </div>

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Height (cm)</label>
                  <input 
                    type="number"
                    value={mealData.height}
                    onChange={(e) => setMealData({ ...mealData, height: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Weight (kg)</label>
                  <input 
                    type="number"
                    value={mealData.weight}
                    onChange={(e) => setMealData({ ...mealData, weight: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Age</label>
                  <input 
                    type="number"
                    value={mealData.age}
                    onChange={(e) => setMealData({ ...mealData, age: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Gender</label>
                  <select 
                    value={mealData.gender}
                    onChange={(e) => setMealData({ ...mealData, gender: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all appearance-none bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Activity Level</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activityLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setMealData({ ...mealData, activityLevel: level.value })}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        mealData.activityLevel === level.value
                          ? 'border-orange-400 bg-orange-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{level.icon}</div>
                      <div className="font-bold text-gray-800 mb-1">{level.label}</div>
                      <div className="text-xs text-gray-600">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Your Goal</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {goals.map(goal => {
                    const Icon = goal.icon;
                    return (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => setMealData({ ...mealData, goal: goal.value })}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${
                          mealData.goal === goal.value
                            ? 'border-orange-400 bg-gradient-to-br ' + goal.color + ' text-white shadow-xl scale-105'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <Icon className={`w-10 h-10 mb-3 ${
                          mealData.goal === goal.value ? 'text-white' : 'text-gray-400'
                        }`} />
                        <div className={`font-bold mb-1 ${
                          mealData.goal === goal.value ? 'text-white' : 'text-gray-800'
                        }`}>{goal.label}</div>
                        <div className={`text-sm ${
                          mealData.goal === goal.value ? 'text-white opacity-90' : 'text-gray-600'
                        }`}>{goal.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                calculateBMRandMacros();
                setStep(2);
              }}
              disabled={!mealData.height || !mealData.weight || !mealData.age}
              className="w-full mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              Calculate My Nutrition
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* STEP 2: Nutrition Customization */}
        {step === 2 && calculatedData && (
          <div className="bg-white rounded-3xl p-10 md:p-14 shadow-2xl">
            <div className="text-center mb-12">
              <div className="inline-block p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mb-6">
                <Flame className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Your Nutrition Plan</h2>
              <p className="text-gray-600">Customize your daily targets</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Recommended Plan
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{calculatedData.tdee}</div>
                  <div className="text-xs text-gray-600">Calories</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Egg className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{calculatedData.protein}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Cookie className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{calculatedData.carbs}g</div>
                  <div className="text-xs text-gray-600">Carbs</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{calculatedData.fat}g</div>
                  <div className="text-xs text-gray-600">Fat</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Target Calories</label>
                  <input 
                    type="number"
                    value={mealData.targetCalories}
                    onChange={(e) => setMealData({ ...mealData, targetCalories: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Protein (g)</label>
                  <input 
                    type="number"
                    value={mealData.proteinGrams}
                    onChange={(e) => setMealData({ ...mealData, proteinGrams: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Carbs (g)</label>
                  <input 
                    type="number"
                    value={mealData.carbsGrams}
                    onChange={(e) => setMealData({ ...mealData, carbsGrams: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Fat (g)</label>
                  <input 
                    type="number"
                    value={mealData.fatGrams}
                    onChange={(e) => setMealData({ ...mealData, fatGrams: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Meals Per Day</label>
                <div className="grid grid-cols-4 gap-4">
                  {[2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMealData({ ...mealData, mealsPerDay: num })}
                      className={`py-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                        mealData.mealsPerDay === num
                          ? 'border-orange-400 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(3)}
              className="w-full mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              Continue to Cuisine
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* STEP 3: Cuisine Preferences */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block p-5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl mb-6">
                <Pizza className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Cuisine Preferences</h2>
              <p className="text-gray-600">Select your favorites</p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Cuisines</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {cuisines.map(cuisine => (
                    <button
                      key={cuisine.id}
                      type="button"
                      onClick={() => toggleSelection(cuisine.id, 'cuisines')}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        mealData.cuisines.includes(cuisine.id)
                          ? 'border-orange-400 bg-orange-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-5xl mb-3">{cuisine.icon}</div>
                      <div className="font-bold text-gray-800">{cuisine.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Diet Type (Optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dietTypes.map(diet => (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => toggleSelection(diet.id, 'dietType')}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        mealData.dietType.includes(diet.id)
                          ? 'border-green-400 bg-green-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{diet.icon}</div>
                      <span className="font-bold text-gray-800 text-sm">{diet.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Allergens to Avoid</label>
                <div className="flex flex-wrap gap-3">
                  {allergens.map(allergen => (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => toggleSelection(allergen, 'allergens')}
                      className={`px-6 py-3 rounded-full border-2 font-medium transition-all ${
                        mealData.allergens.includes(allergen)
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(4)}
              disabled={mealData.cuisines.length === 0}
              className="w-full mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              Continue to Cooking Style
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* STEP 4: Cooking Preferences */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block p-5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl mb-6">
                <UtensilsCrossed className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Cooking Preferences</h2>
              <p className="text-gray-600">How you like your meals</p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Cooking Styles</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {cookingStyles.map(style => {
                    const Icon = style.icon;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => toggleSelection(style.id, 'cookingStyle')}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${
                          mealData.cookingStyle.includes(style.id)
                            ? 'border-orange-400 bg-orange-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-10 h-10 mb-3 ${
                          mealData.cookingStyle.includes(style.id) ? 'text-orange-500' : 'text-gray-400'
                        }`} />
                        <div className="font-bold text-gray-800 mb-1">{style.label}</div>
                        <div className="text-sm text-gray-600">{style.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Spice Level</label>
                <div className="grid grid-cols-5 gap-3">
                  {spiceLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setMealData({ ...mealData, spiceLevel: level.value })}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        mealData.spiceLevel === level.value
                          ? 'border-orange-400 bg-orange-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{level.emoji}</div>
                      <div className="text-xs font-bold text-gray-800">{level.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Meal Timing</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {mealTimings.map(timing => (
                    <button
                      key={timing.id}
                      type="button"
                      onClick={() => toggleSelection(timing.id, 'mealTiming')}
                      className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        mealData.mealTiming.includes(timing.id)
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{timing.icon}</div>
                        <div className="text-left">
                          <div className="font-bold text-gray-800">{timing.label}</div>
                          <div className="text-xs text-gray-600">{timing.time}</div>
                        </div>
                      </div>
                      {mealData.mealTiming.includes(timing.id) && (
                        <Check className="w-6 h-6 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Portion Size</label>
                <div className="grid grid-cols-3 gap-4">
                  {['small', 'regular', 'large'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setMealData({ ...mealData, portionSize: size })}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        mealData.portionSize === size
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-gray-800 capitalize">{size}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(5)}
              className="w-full mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              Review & Submit
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {step === 5 && (() => {
          const macros = calculateMacrosFromInput();
          return (
            <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-block p-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl mb-6">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-3">Review Your Plan</h2>
                <p className="text-gray-600">Confirm your meal plan details</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Daily Nutrition</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { icon: Flame, value: macros.calories, label: 'Calories', color: 'text-orange-500' },
                      { icon: Egg, value: `${macros.protein}g`, label: 'Protein', color: 'text-orange-600' },
                      { icon: Cookie, value: `${macros.carbs}g`, label: 'Carbs', color: 'text-yellow-600' },
                      { icon: Droplets, value: `${macros.fat}g`, label: 'Fat', color: 'text-blue-600' }
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <div className="inline-block p-4 bg-white rounded-2xl mb-3 shadow-sm">
                          <item.icon className={`w-8 h-8 ${item.color}`} />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{item.value}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
                  <div className="text-sm font-bold text-green-700 mb-2">Monthly Investment</div>
                  <div className="text-5xl font-bold text-green-600 mb-2">AED {macros.monthlyCost}</div>
                  <div className="text-sm text-green-700">{mealData.mealsPerDay} meals per day × 30 days</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-800 mb-4">Personal Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-800">{mealData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-800">{mealData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-800">{mealData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-800 mb-4">Preferences</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cuisines:</span>
                        <span className="font-medium text-gray-800">{mealData.cuisines.length} selected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spice:</span>
                        <span className="font-medium text-gray-800 capitalize">{mealData.spiceLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Goal:</span>
                        <span className="font-medium text-gray-800 capitalize">{mealData.goal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Special Instructions (Optional)</label>
                  <textarea
                    value={mealData.specialInstructions}
                    onChange={(e) => setMealData({ ...mealData, specialInstructions: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all resize-none"
                    rows="4"
                    placeholder="Any additional preferences, delivery notes, or special requests..."
                  />
                </div>
              </div>

              <button 
                onClick={submitMealPlan}
                className="w-full mt-10 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-6 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
              >
                <Check className="w-7 h-7" />
                Submit Meal Plan Request
              </button>

              <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>Vendors will contact you within 24 hours</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-8 right-8 bg-white border-l-4 border-green-500 px-8 py-5 rounded-2xl shadow-2xl z-50 max-w-md">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-xl">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="font-bold text-gray-800 mb-1">Success!</div>
              <div className="text-gray-600">{notification}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;