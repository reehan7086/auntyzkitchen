import React, { useState, useEffect  } from 'react';
import { 
  User, ChefHat, Calculator, Utensils, Shield, Mail, Check, 
  ArrowRight, ArrowLeft, Flame, Pizza, Cookie, Droplets, Egg, 
  Target, Clock, MessageCircle, ShieldCheck, UtensilsCrossed, 
  Sparkles, Heart, Zap, Star, TrendingUp, Award 
} from 'lucide-react';
import { supabase } from "./config/supabaseClient";

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
    specialInstructions: '',
    oilType: 'olive',
  saltType: 'regular',
  sweetenerType: 'sugar',
  healthConditions: [],
  healthNotes: '',
  ingredientQuality: 'standard',
  texturePreference: 'regular',
  meatPreparation: 'cubed',
  vegetableCut: 'medium',
  deliveryWindow: 'evening',
  packagingType: 'microwave',
  separateComponents: false,
  familyMembers: 1,
  kidsVersion: false,
  elderlyFriendly: false,
  weeklyVariety: true,
  seasonalPreference: true,
  reheatingInstructions: true,
  subscriptionPlan: 'monthly'
  });
  const [calculatedData, setCalculatedData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [notification, setNotification] = useState('');
  const [expandedLead, setExpandedLead] = useState(null);
  const [vendorPassword, setVendorPassword] = useState('');
  const [isVendorAuthenticated, setIsVendorAuthenticated] = useState(false);

  // Auto-scroll to top when step changes
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [step]);

  useEffect(() => {
    if (userType === 'vendor') {
      loadLeads();
    }
  }, [userType]);

  // Data Arrays
 // Existing arrays (keep as is)
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

// NEW ARRAYS - Advanced Customization
const oilTypes = [
  { id: 'olive', label: 'Olive Oil', icon: '🫒', desc: 'Heart-healthy Mediterranean' },
  { id: 'coconut', label: 'Coconut Oil', icon: '🥥', desc: 'High-heat cooking' },
  { id: 'avocado', label: 'Avocado Oil', icon: '🥑', desc: 'Neutral & versatile' },
  { id: 'ghee', label: 'Ghee/Butter', icon: '🧈', desc: 'Traditional rich flavor' },
  { id: 'vegetable', label: 'Vegetable Oil', icon: '🌻', desc: 'Light & economical' },
  { id: 'sesame', label: 'Sesame Oil', icon: '🫘', desc: 'Aromatic Asian style' }
];

const saltTypes = [
  { id: 'regular', label: 'Regular Salt', desc: 'Standard iodized', icon: '🧂' },
  { id: 'low', label: 'Low Sodium', desc: 'Heart-friendly', icon: '💚' },
  { id: 'sea', label: 'Sea Salt', desc: 'Mineral-rich', icon: '🌊' },
  { id: 'pink', label: 'Pink Himalayan', desc: 'Trace minerals', icon: '💗' },
  { id: 'none', label: 'No Added Salt', desc: 'Natural only', icon: '🚫' }
];

const sweetenerTypes = [
  { id: 'sugar', label: 'White Sugar', icon: '🍬', desc: 'Standard' },
  { id: 'brown', label: 'Brown Sugar', icon: '🟤', desc: 'Molasses flavor' },
  { id: 'honey', label: 'Honey', icon: '🍯', desc: 'Natural sweetness' },
  { id: 'stevia', label: 'Stevia', icon: '🌿', desc: 'Zero calorie' },
  { id: 'dates', label: 'Date Syrup', icon: '🫐', desc: 'Traditional Arabic' },
  { id: 'jaggery', label: 'Jaggery', icon: '🟫', desc: 'Unrefined cane' },
  { id: 'none', label: 'No Sweetener', icon: '🚫', desc: 'Sugar-free' }
];

const healthConditions = [
  { id: 'diabetes', label: 'Diabetes', icon: '💉', color: 'from-blue-400 to-blue-600', desc: 'Blood sugar management' },
  { id: 'hypertension', label: 'High BP', icon: '❤️', color: 'from-red-400 to-red-600', desc: 'Low sodium needs' },
  { id: 'cholesterol', label: 'High Cholesterol', icon: '🫀', color: 'from-orange-400 to-orange-600', desc: 'Heart-healthy fats' },
  { id: 'thyroid', label: 'Thyroid', icon: '🦋', color: 'from-purple-400 to-purple-600', desc: 'Metabolic support' },
  { id: 'pcos', label: 'PCOS', icon: '🌸', color: 'from-pink-400 to-pink-600', desc: 'Hormone balance' },
  { id: 'ibs', label: 'IBS/Digestive', icon: '🌀', color: 'from-green-400 to-green-600', desc: 'Gut-friendly' },
  { id: 'kidney', label: 'Kidney Issues', icon: '💚', color: 'from-teal-400 to-teal-600', desc: 'Low potassium' },
  { id: 'pregnancy', label: 'Pregnancy', icon: '🤰', color: 'from-rose-400 to-rose-600', desc: 'Prenatal nutrition' }
];

const ingredientQuality = [
  { 
    id: 'standard', 
    label: 'Standard', 
    desc: 'Quality ingredients, economical choice',
    price: '+AED 0',
    priceMultiplier: 1.0,
    icon: '⭐',
    features: ['Fresh produce', 'Quality meats', 'Good value']
  },
  { 
    id: 'premium', 
    label: 'Premium', 
    desc: 'Higher quality, select organic items',
    price: '+AED 7/meal',
    priceMultiplier: 1.3,
    icon: '⭐⭐',
    features: ['Better cuts', 'Some organic', 'Specialty items']
  },
  { 
    id: 'organic', 
    label: 'Organic', 
    desc: 'Certified organic ingredients',
    price: '+AED 13/meal',
    priceMultiplier: 1.6,
    icon: '⭐⭐⭐',
    features: ['100% organic produce', 'Free-range', 'No pesticides']
  },
  { 
    id: 'luxury', 
    label: 'Luxury', 
    desc: 'Premium organic, grass-fed, wild-caught',
    price: '+AED 22/meal',
    priceMultiplier: 2.0,
    icon: '⭐⭐⭐⭐',
    features: ['Grass-fed meats', 'Wild fish', 'Artisanal quality']
  }
];

const texturePreferences = [
  { id: 'soft', label: 'Soft & Tender', icon: '☁️', desc: 'Easy to chew, gentle' },
  { id: 'regular', label: 'Regular', icon: '👌', desc: 'Balanced texture' },
  { id: 'firm', label: 'Firm & Chunky', icon: '💪', desc: 'More substantial bite' },
  { id: 'crispy', label: 'Crispy', icon: '✨', desc: 'Crunchy elements' }
];

const meatPreparations = [
  { id: 'ground', label: 'Ground/Minced', icon: '🥩', desc: 'Fine texture' },
  { id: 'cubed', label: 'Cubed', icon: '🔲', desc: 'Bite-sized pieces' },
  { id: 'strips', label: 'Strips', icon: '📏', desc: 'Sliced thin' },
  { id: 'whole', label: 'Whole Pieces', icon: '🍗', desc: 'Full cuts' }
];

const vegetableCuts = [
  { id: 'fine', label: 'Finely Diced', icon: '▪️', desc: 'Small pieces' },
  { id: 'medium', label: 'Medium Dice', icon: '◼️', desc: 'Standard cut' },
  { id: 'chunky', label: 'Chunky', icon: '⬛', desc: 'Large pieces' },
  { id: 'whole', label: 'Whole/Halved', icon: '🟫', desc: 'Minimal cutting' }
];

const deliveryWindows = [
  { id: 'early', label: 'Early Morning', time: '5-7 AM', icon: '🌅', desc: 'Before work' },
  { id: 'morning', label: 'Morning', time: '7-10 AM', icon: '☀️', desc: 'Breakfast time' },
  { id: 'midday', label: 'Midday', time: '11 AM-1 PM', icon: '🌤️', desc: 'Lunch time' },
  { id: 'afternoon', label: 'Afternoon', time: '2-5 PM', icon: '🌆', desc: 'After lunch' },
  { id: 'evening', label: 'Evening', time: '6-8 PM', icon: '🌙', desc: 'Dinner time' },
  { id: 'night', label: 'Late Night', time: '8-10 PM', icon: '⭐', desc: 'After work' }
];

const packagingTypes = [
  { id: 'eco', label: 'Eco-Friendly', icon: '♻️', desc: 'Biodegradable containers', extra: '+AED 0' },
  { id: 'glass', label: 'Glass Jars', icon: '🫙', desc: 'Returnable & reusable', extra: '+AED 5/meal' },
  { id: 'microwave', label: 'Microwave-Safe', icon: '📦', desc: 'Easy reheat plastic', extra: '+AED 0' },
  { id: 'traditional', label: 'Traditional Tiffin', icon: '🥘', desc: 'Steel containers', extra: '+AED 8/meal' }
];

const familyOptions = [
  { value: 1, label: 'Just Me', icon: '👤', desc: 'Individual portions' },
  { value: 2, label: '2 People', icon: '👥', desc: 'Couple/Pair' },
  { value: 3, label: '3-4 People', icon: '👨‍👩‍👦', desc: 'Small family' },
  { value: 5, label: '5+ People', icon: '👨‍👩‍👧‍👦', desc: 'Large family' }
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
  const submitMealPlan = async () => {
    const macros = calculateMacrosFromInput();
    const qualityMultiplier = ingredientQuality.find(q => q.id === mealData.ingredientQuality)?.priceMultiplier || 1;
    const adjustedMonthlyCost = Math.round(macros.monthlyCost * qualityMultiplier);
    
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
      monthly_cost: adjustedMonthlyCost,
      status: 'pending',
      meal_details: {
        // Basic nutrition
        goal: mealData.goal,
        mealsPerDay: mealData.mealsPerDay,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        
        // Cooking preferences
        cookingStyle: mealData.cookingStyle.map(id => 
          cookingStyles.find(s => s.id === id)?.label
        ),
        spiceLevel: mealData.spiceLevel,
        mealTiming: mealData.mealTiming.map(id => 
          mealTimings.find(t => t.id === id)?.label
        ),
        portionSize: mealData.portionSize,
        
        // NEW - Ingredient customizations
        oilType: oilTypes.find(o => o.id === mealData.oilType)?.label,
        saltType: saltTypes.find(s => s.id === mealData.saltType)?.label,
        sweetenerType: sweetenerTypes.find(s => s.id === mealData.sweetenerType)?.label,
        
        // NEW - Health information
        healthConditions: mealData.healthConditions.map(id =>
          healthConditions.find(h => h.id === id)?.label
        ),
        healthNotes: mealData.healthNotes,
        
        // NEW - Quality & preparation
        ingredientQuality: ingredientQuality.find(q => q.id === mealData.ingredientQuality)?.label,
        texturePreference: texturePreferences.find(t => t.id === mealData.texturePreference)?.label,
        meatPreparation: meatPreparations.find(m => m.id === mealData.meatPreparation)?.label,
        vegetableCut: vegetableCuts.find(v => v.id === mealData.vegetableCut)?.label,
        
        // NEW - Delivery & family
        deliveryWindow: deliveryWindows.find(d => d.id === mealData.deliveryWindow)?.label,
        packagingType: packagingTypes.find(p => p.id === mealData.packagingType)?.label,
        familyMembers: mealData.familyMembers,
        
        // NEW - Special options
        kidsVersion: mealData.kidsVersion,
        elderlyFriendly: mealData.elderlyFriendly,
        separateComponents: mealData.separateComponents,
        weeklyVariety: mealData.weeklyVariety,
        seasonalPreference: mealData.seasonalPreference,
        reheatingInstructions: mealData.reheatingInstructions,
        
        specialInstructions: mealData.specialInstructions
      }
    };
  
    console.log('Submitting enhanced lead:', leadData);
  
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select();
  
      if (error) throw error;
  
      const newLead = { ...data[0], timestamp: new Date(data[0].created_at).toLocaleString() };
      setLeads(prev => [newLead, ...prev]);
      
      setNotification('Success! Your customized meal plan request has been submitted.');
      
      setTimeout(() => {
        setStep(0);
        setUserType(null);
        // Reset to default state
        setMealData({
          name: '', email: '', phone: '', height: '', weight: '', age: '', 
          gender: 'male', activityLevel: '1.2', goal: 'maintain',
          targetCalories: '', proteinGrams: '', carbsGrams: '', 
          fatGrams: '', mealsPerDay: 3,
          cuisines: [], dietType: [], allergens: [], cookingStyle: [], 
          spiceLevel: 'medium', mealTiming: [], portionSize: 'regular', 
          specialInstructions: '',
          oilType: 'olive', saltType: 'regular', sweetenerType: 'sugar',
          healthConditions: [], healthNotes: '',
          ingredientQuality: 'standard', texturePreference: 'regular',
          meatPreparation: 'cubed', vegetableCut: 'medium',
          deliveryWindow: 'evening', packagingType: 'microwave',
          separateComponents: false, familyMembers: 1,
          kidsVersion: false, elderlyFriendly: false,
          weeklyVariety: true, seasonalPreference: true, reheatingInstructions: true
        });
        setCalculatedData(null);
        setNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error saving lead:', error);
      setNotification('Error submitting request. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  // Claim Lead
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
      console.error('Error claiming lead:', error);
      setNotification('Error claiming lead. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (error) throw error;
  
      const formattedLeads = data.map(lead => ({
        ...lead,
        timestamp: new Date(lead.created_at).toLocaleString()
      }));
      setLeads(formattedLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
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
// HOME PAGE RENDER - COMPACT SPACING
if (!userType) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Logo and Title Section - Compact */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <img 
            src="/logo.png" 
            alt="Auntyz Kitchen" 
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-1">
              Auntyz Kitchen
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium italic">Ghar Ka Khana</p>
          </div>
        </div>

        {/* Subtitle - Reduced spacing */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold mb-1">Home-style meals for UAE expats</p>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">Your personalized meal planning platform</p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <button
            onClick={() => setUserType('eater')}
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-orange-300 text-left transform hover:scale-105"
          >
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <div className="p-4 sm:p-5 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl sm:rounded-3xl">
                <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
              </div>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Get Healthy Meals</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Personalized nutrition plans crafted for your goals</p>
            <div className="space-y-2 sm:space-y-3">
              {[
                { icon: Sparkles, text: 'AI-powered nutrition' },
                { icon: Heart, text: 'Authentic home cooking' },
                { icon: Shield, text: 'Allergen-safe meals' },
                { icon: Award, text: 'Premium ingredients' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </button>

          <button
  onClick={() => setUserType('vendor')}
  className="group relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-300 text-left transform hover:scale-105"
>
  <div className="flex items-start justify-between mb-6 sm:mb-8">
    <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl sm:rounded-3xl">
      <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
    </div>
    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
  </div>
  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Partner With Us</h2>
  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Turn your kitchen into a profitable business</p>
  <div className="space-y-2 sm:space-y-3">
    {[
      { icon: TrendingUp, text: 'Earn AED 15,000+ monthly' },
      { icon: Target, text: 'Ready-to-convert customers' },
      { icon: Zap, text: 'Zero marketing costs' },
      { icon: Star, text: 'Flexible schedule control' }
    ].map((item, i) => (
      <div key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
        <span>{item.text}</span>
      </div>
    ))}
  </div>
</button>
        </div>
      </div>

      {notification && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-8 sm:right-8 bg-white border-l-4 border-green-500 px-4 sm:px-8 py-3 sm:py-5 rounded-xl sm:rounded-2xl shadow-2xl z-50 max-w-md">
          <div className="flex items-start gap-3 sm:gap-4">
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
            <div className="text-sm sm:text-base">{notification}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// VENDOR DASHBOARD RENDER - WITH PASSWORD PROTECTION - COMPLETE
if (userType === 'vendor') {
  // Password gate
  if (!isVendorAuthenticated) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-5 sm:p-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl sm:rounded-3xl mb-6">
              <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Vendor Access</h2>
            <p className="text-sm sm:text-base text-gray-600">Enter password to view customer leads</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={vendorPassword}
              onChange={(e) => setVendorPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (vendorPassword === 'auntyz2025') {
                    setIsVendorAuthenticated(true);
                  } else {
                    alert('Incorrect password. Contact admin for access.');
                  }
                }
              }}
              placeholder="Enter vendor password"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-sm sm:text-base"
            />
            
            <button
              onClick={() => {
                if (vendorPassword === 'auntyz2025') {
                  setIsVendorAuthenticated(true);
                } else {
                  alert('Incorrect password. Contact admin for access.');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl transition-all"
            >
              Access Dashboard
            </button>
            
            <button
              onClick={() => setUserType(null)}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 text-sm sm:text-base"
            >
              Back to Home
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              <strong className="text-blue-700">Vendors:</strong> Contact support to get access credentials
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated vendor dashboard
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <button 
            onClick={() => setUserType(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium px-2"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          
          <button
            onClick={() => {
              setIsVendorAuthenticated(false);
              setVendorPassword('');
            }}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Vendor Dashboard</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                {leads.filter(l => l.status === 'pending').length} available leads
              </p>
            </div>
            <div className="p-3 sm:p-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl sm:rounded-3xl">
              <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
              <p className="text-gray-500 text-lg sm:text-xl font-medium">No leads yet</p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">Check back soon</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {leads.map(lead => (
                <div 
                  key={lead.id}
                  className={`border-2 rounded-xl sm:rounded-2xl transition-all overflow-hidden ${
                    lead.status === 'claimed'
                      ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                      : 'border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                          {lead.cuisine?.split(',')[0] ? cuisines.find(c => c.label === lead.cuisine.split(',')[0].trim())?.icon || '🍽️' : '🍽️'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                            #{lead.id.slice(-6).toUpperCase()}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{lead.timestamp}</p>
                        </div>
                      </div>
                      <span className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-1 ${
                        lead.status === 'claimed' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-orange-200 text-orange-800'
                      }`}>
                        {lead.status === 'claimed' ? '✓ Claimed' : '● Available'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-gray-200">
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 truncate">AED {lead.monthly_cost}</div>
                        <div className="text-xs text-gray-600">Monthly</div>
                      </div>
                      <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-gray-200">
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">{lead.calories}</div>
                        <div className="text-xs text-gray-600">Cal</div>
                      </div>
                      <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-gray-200">
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{lead.meal_details?.mealsPerDay || 3}</div>
                        <div className="text-xs text-gray-600">Meals</div>
                      </div>
                      <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-gray-200">
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">{lead.meal_details?.familyMembers || 1}</div>
                        <div className="text-xs text-gray-600">People</div>
                      </div>
                      <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-gray-200 col-span-2 sm:col-span-1">
                        <div className="text-base sm:text-lg font-bold text-gray-800 capitalize truncate">{lead.meal_details?.goal || 'N/A'}</div>
                        <div className="text-xs text-gray-600">Goal</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {lead.cuisine && lead.cuisine.split(',').slice(0, 2).map((c, i) => (
                        <span key={i} className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium truncate max-w-[120px]">
                          {c.trim()}
                        </span>
                      ))}
                      {lead.meal_details?.ingredientQuality && lead.meal_details.ingredientQuality !== 'Standard' && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                          ⭐ {lead.meal_details.ingredientQuality}
                        </span>
                      )}
                      {lead.meal_details?.healthConditions && lead.meal_details.healthConditions.length > 0 && (
                        <span className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                          💊 {lead.meal_details.healthConditions.length}
                        </span>
                      )}
                      {lead.allergens !== 'None' && (
                        <span className="bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                          ⚠️
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                      className="w-full py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base text-gray-700 transition-all flex items-center justify-center gap-2"
                    >
                      {expandedLead === lead.id ? (
                        <>
                          <span>Hide</span>
                          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" />
                        </>
                      ) : (
                        <>
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" />
                        </>
                      )}
                    </button>
                  </div>

                  {expandedLead === lead.id && (
                    <div className="border-t-2 border-gray-200 bg-gray-50 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="font-bold text-sm sm:text-base text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                          Macros
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                          <div>
                            <div className="text-lg sm:text-xl font-bold text-orange-600">{lead.meal_details?.protein || 0}g</div>
                            <div className="text-xs text-gray-600">Protein</div>
                          </div>
                          <div>
                            <div className="text-lg sm:text-xl font-bold text-yellow-600">{lead.meal_details?.carbs || 0}g</div>
                            <div className="text-xs text-gray-600">Carbs</div>
                          </div>
                          <div>
                            <div className="text-lg sm:text-xl font-bold text-blue-600">{lead.meal_details?.fat || 0}g</div>
                            <div className="text-xs text-gray-600">Fat</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {(lead.meal_details?.oilType || lead.meal_details?.saltType) && (
                          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <div className="font-bold text-sm sm:text-base text-gray-800 mb-2 flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-amber-600" />
                              Ingredients
                            </div>
                            <div className="text-xs sm:text-sm space-y-1">
                              {lead.meal_details?.oilType && (
                                <div className="truncate">🫒 <span className="text-gray-600">Oil:</span> <span className="font-medium">{lead.meal_details.oilType}</span></div>
                              )}
                              {lead.meal_details?.saltType && (
                                <div className="truncate">🧂 <span className="text-gray-600">Salt:</span> <span className="font-medium">{lead.meal_details.saltType}</span></div>
                              )}
                              {lead.meal_details?.sweetenerType && (
                                <div className="truncate">🍯 <span className="text-gray-600">Sweet:</span> <span className="font-medium">{lead.meal_details.sweetenerType}</span></div>
                              )}
                            </div>
                          </div>
                        )}

                        {(lead.meal_details?.texturePreference || lead.meal_details?.meatPreparation) && (
                          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <div className="font-bold text-sm sm:text-base text-gray-800 mb-2 flex items-center gap-2">
                              <Utensils className="w-4 h-4 text-green-600" />
                              Prep
                            </div>
                            <div className="text-xs sm:text-sm space-y-1">
                              {lead.meal_details?.texturePreference && (
                                <div className="truncate">☁️ <span className="text-gray-600">Texture:</span> <span className="font-medium">{lead.meal_details.texturePreference}</span></div>
                              )}
                              {lead.meal_details?.meatPreparation && (
                                <div className="truncate">🥩 <span className="text-gray-600">Meat:</span> <span className="font-medium">{lead.meal_details.meatPreparation}</span></div>
                              )}
                              {lead.meal_details?.vegetableCut && (
                                <div className="truncate">🥕 <span className="text-gray-600">Veg:</span> <span className="font-medium">{lead.meal_details.vegetableCut}</span></div>
                              )}
                            </div>
                          </div>
                        )}

                        {lead.meal_details?.deliveryWindow && (
                          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <div className="font-bold text-sm sm:text-base text-gray-800 mb-2 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              Delivery
                            </div>
                            <div className="text-xs sm:text-sm space-y-1">
                              <div className="truncate">🕐 {lead.meal_details.deliveryWindow}</div>
                              {lead.meal_details?.packagingType && (
                                <div className="truncate">📦 {lead.meal_details.packagingType}</div>
                              )}
                            </div>
                          </div>
                        )}

                        {lead.meal_details?.spiceLevel && (
                          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <div className="font-bold text-sm sm:text-base text-gray-800 mb-2 flex items-center gap-2">
                              <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                              Cooking
                            </div>
                            <div className="text-xs sm:text-sm space-y-1">
                              <div className="truncate">🌶️ <span className="capitalize">{lead.meal_details.spiceLevel}</span></div>
                              {lead.meal_details?.cookingStyle && lead.meal_details.cookingStyle.length > 0 && (
                                <div className="truncate">🍳 {lead.meal_details.cookingStyle.slice(0, 2).join(', ')}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {lead.meal_details?.healthConditions && lead.meal_details.healthConditions.length > 0 && (
                        <div className="bg-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-red-200">
                          <div className="font-bold text-sm sm:text-base text-red-800 mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                            Health
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                            {lead.meal_details.healthConditions.map((condition, i) => (
                              <span key={i} className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                {condition}
                              </span>
                            ))}
                          </div>
                          {lead.meal_details?.healthNotes && (
                            <div className="text-xs sm:text-sm text-gray-700 bg-white rounded-lg p-2 sm:p-3 mt-2">
                              <strong>Notes:</strong> {lead.meal_details.healthNotes}
                            </div>
                          )}
                        </div>
                      )}

                      {(lead.meal_details?.kidsVersion || lead.meal_details?.elderlyFriendly || lead.meal_details?.separateComponents) && (
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="font-bold text-sm sm:text-base text-gray-800 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            Special
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {lead.meal_details?.kidsVersion && (
                              <span className="bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                👶 Kids
                              </span>
                            )}
                            {lead.meal_details?.elderlyFriendly && (
                              <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                👴 Elderly
                              </span>
                            )}
                            {lead.meal_details?.separateComponents && (
                              <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                📦 Separate
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {lead.meal_details?.specialInstructions && (
                        <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-200">
                          <div className="font-bold text-sm sm:text-base text-yellow-900 mb-2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Notes
                          </div>
                          <div className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                            {lead.meal_details.specialInstructions}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-3 sm:p-4 md:p-6 pt-0">
                    {lead.status === 'pending' ? (
                      <button 
                        onClick={() => claimLead(lead.id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:shadow-xl transition-all"
                      >
                        Claim Lead
                      </button>
                    ) : (
                      <div className="bg-white border-2 border-green-300 rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="font-bold text-sm sm:text-base text-green-800 mb-2 sm:mb-3 flex items-center gap-2">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          Contact
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700 truncate">{lead.name}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                            <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline truncate">{lead.email}</a>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">{lead.phone}</a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-8 sm:right-8 bg-white border-l-4 border-green-500 px-4 sm:px-8 py-3 sm:py-5 rounded-xl sm:rounded-2xl shadow-2xl z-50 max-w-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
            <div className="text-sm sm:text-base">{notification}</div>
          </div>
        </div>
      )}
    </div>
  );
}
  // PART 4: Customer Wizard - Steps 0, 1, 2
// Add this after the vendor dashboard (continuing the main return statement)

  // CUSTOMER WIZARD
// CUSTOMER WIZARD
return (
  <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => step === 0 ? setUserType(null) : setStep(step - 1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <WizardProgress current={step + 1} total={10} />
{/* STEP 0: Personal Info - MOBILE RESPONSIVE */}
{step === 0 && (
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
        <User className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 px-4">Let's Get Started</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4">Tell us about yourself</p>
    </div>

    <div className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Full Name</label>
        <input 
          type="text"
          value={mealData.name}
          onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
          placeholder="John Doe"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Email</label>
          <input 
            type="email"
            value={mealData.email}
            onChange={(e) => setMealData({ ...mealData, email: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Phone</label>
          <input 
            type="tel"
            value={mealData.phone}
            onChange={(e) => setMealData({ ...mealData, phone: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
            placeholder="+971 50 123 4567"
          />
        </div>
      </div>
    </div>

    <button 
      onClick={() => setStep(1)}
      disabled={!mealData.name || !mealData.email || !mealData.phone}
      className="w-full mt-8 sm:mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
    >
      Continue to Body Metrics
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  </div>
)}

{/* STEP 1: Body Metrics - MOBILE RESPONSIVE */}
{step === 1 && (
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
        <Calculator className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 px-4">Body Metrics</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4">Help us calculate your nutrition</p>
    </div>

    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Height (cm)</label>
          <input 
            type="number"
            value={mealData.height}
            onChange={(e) => setMealData({ ...mealData, height: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
            placeholder="170"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Weight (kg)</label>
          <input 
            type="number"
            value={mealData.weight}
            onChange={(e) => setMealData({ ...mealData, weight: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
            placeholder="70"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Age</label>
          <input 
            type="number"
            value={mealData.age}
            onChange={(e) => setMealData({ ...mealData, age: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
            placeholder="30"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Gender</label>
          <select 
            value={mealData.gender}
            onChange={(e) => setMealData({ ...mealData, gender: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all appearance-none bg-white text-sm sm:text-base"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Activity Level</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {activityLevels.map(level => (
            <button
              key={level.value}
              type="button"
              onClick={() => setMealData({ ...mealData, activityLevel: level.value })}
              className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all ${
                mealData.activityLevel === level.value
                  ? 'border-orange-400 bg-orange-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{level.icon}</div>
              <div className="font-bold text-xs sm:text-sm text-gray-800 mb-0.5 sm:mb-1">{level.label}</div>
              <div className="text-xs text-gray-600 hidden sm:block">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Your Goal</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {goals.map(goal => {
            const Icon = goal.icon;
            return (
              <button
                key={goal.value}
                type="button"
                onClick={() => setMealData({ ...mealData, goal: goal.value })}
                className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  mealData.goal === goal.value
                    ? 'border-orange-400 bg-gradient-to-br ' + goal.color + ' text-white shadow-xl scale-105'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 ${
                  mealData.goal === goal.value ? 'text-white' : 'text-gray-400'
                }`} />
                <div className={`font-bold text-sm sm:text-base mb-1 ${
                  mealData.goal === goal.value ? 'text-white' : 'text-gray-800'
                }`}>{goal.label}</div>
                <div className={`text-xs sm:text-sm ${
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
      className="w-full mt-8 sm:mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
    >
      Calculate My Nutrition
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  </div>
)}

        {/* STEP 2: Nutrition Customization */}
{/* STEP 2: Nutrition Customization - WITH NEW FEATURES */}
{step === 2 && calculatedData && (
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
        <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 px-4">Your Nutrition Plan</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4">Customize your daily targets</p>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        Recommended Plan
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-gray-800">{calculatedData.tdee}</div>
          <div className="text-xs text-gray-600">Calories</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
          <Egg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-gray-800">{calculatedData.protein}g</div>
          <div className="text-xs text-gray-600">Protein</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
          <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-gray-800">{calculatedData.carbs}g</div>
          <div className="text-xs text-gray-600">Carbs</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
          <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-xl sm:text-2xl font-bold text-gray-800">{calculatedData.fat}g</div>
          <div className="text-xs text-gray-600">Fat</div>
        </div>
      </div>
    </div>

    {/* NEW FEATURE 1: PRICE COMPARISON */}
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-green-200">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        Your Monthly Savings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-green-300">
          <div className="text-xs text-gray-600 mb-1">Auntyz Kitchen</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600">AED {calculatedData.monthlyCost}</div>
          <div className="text-xs text-green-700 font-medium mt-1">✓ Best Value</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="text-xs text-gray-600 mb-1">Restaurant Eating</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-700">AED {Math.round(calculatedData.monthlyCost * 1.8)}</div>
          <div className="text-xs text-red-600 font-medium mt-1">+80% more</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="text-xs text-gray-600 mb-1">Grocery Shopping</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-700">AED {Math.round(calculatedData.monthlyCost * 1.3)}</div>
          <div className="text-xs text-orange-600 font-medium mt-1">+30% more</div>
        </div>
      </div>
      <div className="bg-green-600 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
        <div className="text-sm sm:text-base font-medium mb-1">You Save Monthly</div>
        <div className="text-2xl sm:text-3xl font-bold">AED {Math.round(calculatedData.monthlyCost * 0.8)}</div>
        <div className="text-xs sm:text-sm opacity-90 mt-1">vs. eating out + No cooking time!</div>
      </div>
    </div>

    {/* NEW FEATURE 2: SUBSCRIPTION OPTIONS */}
    <div className="space-y-6 sm:space-y-8">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Subscription Plan</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          {[
            { id: 'weekly', label: 'Weekly Trial', days: 7, discount: 0, badge: 'Try it out' },
            { id: 'monthly', label: 'Monthly', days: 30, discount: 15, badge: 'Popular' },
            { id: 'quarterly', label: '3 Months', days: 90, discount: 25, badge: 'Best Value' }
          ].map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setMealData({ ...mealData, subscriptionPlan: plan.id })}
              className={`relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                mealData.subscriptionPlan === plan.id
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              {plan.discount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{plan.discount}%
                </div>
              )}
              {plan.badge && (
                <div className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full mb-2">
                  {plan.badge}
                </div>
              )}
              <div className="font-bold text-base sm:text-lg text-gray-900 mb-1">{plan.label}</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-2">{plan.days} days</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                AED {Math.round((calculatedData?.monthlyCost || 1980) * (plan.days / 30) * (1 - plan.discount / 100))}
              </div>
              {mealData.subscriptionPlan === plan.id && (
                <Check className="absolute bottom-3 right-3 w-5 h-5 text-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Meals Per Day</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {[
            { value: 2, label: '2 Meals', desc: 'Lunch + Dinner' },
            { value: 3, label: '3 Meals', desc: 'Most Popular' },
            { value: 4, label: '4 Meals', desc: 'Full Day' },
            { value: 'lunch', label: 'Lunch Only', desc: 'Weekdays' }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMealData({ ...mealData, mealsPerDay: option.value })}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
                mealData.mealsPerDay === option.value
                  ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-lg'
                  : 'border-gray-200 hover:border-orange-200 bg-white'
              }`}
            >
              <div className="font-bold text-sm sm:text-base">{option.label}</div>
              <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ORIGINAL MACRO INPUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Target Calories</label>
          <input 
            type="number"
            value={mealData.targetCalories}
            onChange={(e) => setMealData({ ...mealData, targetCalories: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Protein (g)</label>
          <input 
            type="number"
            value={mealData.proteinGrams}
            onChange={(e) => setMealData({ ...mealData, proteinGrams: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Carbs (g)</label>
          <input 
            type="number"
            value={mealData.carbsGrams}
            onChange={(e) => setMealData({ ...mealData, carbsGrams: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Fat (g)</label>
          <input 
            type="number"
            value={mealData.fatGrams}
            onChange={(e) => setMealData({ ...mealData, fatGrams: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all text-sm sm:text-base"
          />
        </div>
      </div>
    </div>

    <button 
      onClick={() => setStep(3)}
      className="w-full mt-8 sm:mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
    >
      Continue to Cuisine
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  </div>
)}
{/* STEP 3: Cuisine - MOBILE RESPONSIVE */}
{/* STEP 3: Cuisine Preferences - WITH MEAL PREVIEWS */}
{step === 3 && (
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
    <div className="text-center mb-8 sm:mb-10">
      <div className="inline-block p-4 sm:p-5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
        <Pizza className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 px-4">Cuisine Preferences</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4">Select your favorites</p>
    </div>

    <div className="space-y-6 sm:space-y-8">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Cuisines</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
          {cuisines.map(cuisine => (
            <button
              key={cuisine.id}
              type="button"
              onClick={() => toggleSelection(cuisine.id, 'cuisines')}
              className={`p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${
                mealData.cuisines.includes(cuisine.id)
                  ? 'border-orange-400 bg-orange-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl sm:text-5xl mb-1 sm:mb-3">{cuisine.icon}</div>
              <div className="font-bold text-xs sm:text-sm text-gray-800">{cuisine.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* NEW FEATURE 3: MEAL PREVIEW IMAGES */}
      {mealData.cuisines.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-purple-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            Your Meal Previews
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {mealData.cuisines.slice(0, 6).map(cuisineId => {
              const cuisine = cuisines.find(c => c.id === cuisineId);
              return (
                <div key={cuisineId} className="relative group">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    {/* Placeholder - Replace with actual images later */}
                    <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl md:text-7xl">
                      {cuisine?.icon}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <div className="text-white font-bold text-sm sm:text-base mb-1">{cuisine?.label}</div>
                        <div className="text-white/90 text-xs">Fresh & Authentic</div>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    New
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
            <p className="text-xs sm:text-sm text-gray-700 text-center">
              <strong className="text-purple-700">Note:</strong> Actual meals will be prepared fresh by your chosen vendor based on these cuisines
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Diet Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {dietTypes.map(diet => (
            <button
              key={diet.id}
              type="button"
              onClick={() => toggleSelection(diet.id, 'dietType')}
              className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all ${
                mealData.dietType.includes(diet.id)
                  ? 'border-green-400 bg-green-50 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{diet.icon}</div>
              <span className="font-bold text-gray-800 text-xs sm:text-sm">{diet.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Allergens to Avoid</label>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {allergens.map(allergen => (
            <button
              key={allergen}
              type="button"
              onClick={() => toggleSelection(allergen, 'allergens')}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full border-2 font-medium transition-all text-xs sm:text-sm ${
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
      className="w-full mt-8 sm:mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
    >
      Continue to Cooking Style
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  </div>
)}
{/* STEP 4: Cooking - MOBILE RESPONSIVE */}
{step === 4 && (
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
    <div className="text-center mb-8 sm:mb-10">
      <div className="inline-block p-4 sm:p-5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
        <UtensilsCrossed className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 px-4">Cooking Preferences</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4">How you like your meals</p>
    </div>

    <div className="space-y-6 sm:space-y-8">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Cooking Styles</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {cookingStyles.map(style => {
            const Icon = style.icon;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleSelection(style.id, 'cookingStyle')}
                className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  mealData.cookingStyle.includes(style.id)
                    ? 'border-orange-400 bg-orange-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 ${
                  mealData.cookingStyle.includes(style.id) ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <div className="font-bold text-sm sm:text-base text-gray-800 mb-1">{style.label}</div>
                <div className="text-xs sm:text-sm text-gray-600">{style.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Spice Level</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {spiceLevels.map(level => (
            <button
              key={level.value}
              type="button"
              onClick={() => setMealData({ ...mealData, spiceLevel: level.value })}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
                mealData.spiceLevel === level.value
                  ? 'border-orange-400 bg-orange-50 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{level.emoji}</div>
              <div className="text-xs sm:text-sm font-bold text-gray-800">{level.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Meal Timing</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {mealTimings.map(timing => (
            <button
              key={timing.id}
              type="button"
              onClick={() => toggleSelection(timing.id, 'mealTiming')}
              className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-between ${
                mealData.mealTiming.includes(timing.id)
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-2xl sm:text-3xl">{timing.icon}</div>
                <div className="text-left">
                  <div className="font-bold text-sm sm:text-base text-gray-800">{timing.label}</div>
                  <div className="text-xs text-gray-600">{timing.time}</div>
                </div>
              </div>
              {mealData.mealTiming.includes(timing.id) && (
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4">Portion Size</label>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {['small', 'regular', 'large'].map(size => (
            <button
              key={size}
              type="button"
              onClick={() => setMealData({ ...mealData, portionSize: size })}
              className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all ${
                mealData.portionSize === size
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-bold text-sm sm:text-base text-gray-800 capitalize">{size}</div>
            </button>
          ))}
        </div>
      </div>
    </div>

    <button 
      onClick={() => setStep(6)}
      className="w-full mt-8 sm:mt-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
    >
      Continue to Ingredients
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  </div>
)}


{/* STEP 10: Review & Submit - WITH SOCIAL PROOF & CALENDAR */}
{step === 10 && (() => {
  const macros = calculateMacrosFromInput();
  const qualityMultiplier = ingredientQuality.find(q => q.id === mealData.ingredientQuality)?.priceMultiplier || 1;
  const adjustedMonthlyCost = Math.round(macros.monthlyCost * qualityMultiplier);
  
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl max-w-6xl mx-auto">
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 animate-bounce">
          <Check className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
          Your Perfect Plan
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 px-4">Review your customized meal experience</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Pricing Hero Card */}
        <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-white opacity-10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="text-sm font-bold mb-2 opacity-90">Your Monthly Investment</div>
            <div className="text-5xl sm:text-7xl font-black mb-2 sm:mb-3">AED {adjustedMonthlyCost}</div>
            <div className="text-base sm:text-lg opacity-90">{mealData.mealsPerDay} meals/day × 30 days × {mealData.familyMembers} {mealData.familyMembers > 1 ? 'people' : 'person'}</div>
            {qualityMultiplier > 1 && (
              <div className="mt-3 sm:mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                <span className="text-sm font-bold">
                  {ingredientQuality.find(q => q.id === mealData.ingredientQuality)?.label} Quality Selected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* NEW FEATURE 5: MEAL CALENDAR VIEW */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-indigo-200 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            Your 7-Day Meal Preview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const cuisine = mealData.cuisines[index % mealData.cuisines.length];
              const cuisineData = cuisines.find(c => c.id === cuisine);
              return (
                <div key={day} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border-2 border-blue-200 hover:shadow-lg transition-all hover:scale-105">
                  <div className="font-bold text-xs sm:text-sm text-gray-700 mb-2">{day}</div>
                  <div className="text-3xl sm:text-4xl mb-2">{cuisineData?.icon || '🍽️'}</div>
                  <div className="text-xs text-gray-600 truncate font-medium">{cuisineData?.label || 'Variety'}</div>
                  <div className="text-xs text-blue-600 font-bold mt-1 bg-blue-100 rounded px-2 py-1 inline-block">
                    {mealData.mealsPerDay} meals
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-indigo-200">
            <p className="text-xs sm:text-sm text-gray-700 text-center">
              <strong className="text-indigo-700">Smart Rotation:</strong> We automatically rotate through your selected cuisines to keep meals exciting all month!
            </p>
          </div>
        </div>

        {/* Nutrition Overview */}
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-orange-200">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5 sm:w-7 sm:h-7 text-orange-600" />
            Daily Nutrition Targets
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: Flame, value: macros.calories, label: 'Calories', color: 'text-orange-500', bg: 'from-orange-100 to-orange-50' },
              { icon: Egg, value: `${macros.protein}g`, label: 'Protein', color: 'text-red-500', bg: 'from-red-100 to-red-50' },
              { icon: Cookie, value: `${macros.carbs}g`, label: 'Carbs', color: 'text-yellow-500', bg: 'from-yellow-100 to-yellow-50' },
              { icon: Droplets, value: `${macros.fat}g`, label: 'Fat', color: 'text-blue-500', bg: 'from-blue-100 to-blue-50' }
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.bg} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border-2 border-white shadow-md`}>
                <item.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${item.color} mx-auto mb-2 sm:mb-3`} />
                <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">{item.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal & Preferences - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-200">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Personal
            </h4>
            <div className="space-y-1.5 text-xs">
              <div><span className="text-gray-600">Name:</span> <span className="font-medium text-gray-900">{mealData.name}</span></div>
              <div><span className="text-gray-600">Email:</span> <span className="font-medium text-gray-900 truncate block">{mealData.email}</span></div>
              <div><span className="text-gray-600">Phone:</span> <span className="font-medium text-gray-900">{mealData.phone}</span></div>
              <div><span className="text-gray-600">Goal:</span> <span className="font-medium text-gray-900 capitalize">{mealData.goal}</span></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 border border-purple-200">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <Pizza className="w-4 h-4 text-purple-600" />
              Cuisine
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex flex-wrap gap-1">
                {mealData.cuisines.slice(0, 4).map(id => (
                  <span key={id} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                    {cuisines.find(c => c.id === id)?.label}
                  </span>
                ))}
              </div>
              {mealData.dietType.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {mealData.dietType.map(id => (
                    <span key={id} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                      {dietTypes.find(d => d.id === id)?.label}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2"><span className="text-gray-600">Spice:</span> <span className="font-medium capitalize">{mealData.spiceLevel}</span></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 border border-amber-200">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <Droplets className="w-4 h-4 text-amber-600" />
              Ingredients
            </h4>
            <div className="space-y-1.5 text-xs">
              <div><span className="text-gray-600">Oil:</span> <span className="font-medium">{oilTypes.find(o => o.id === mealData.oilType)?.label}</span></div>
              <div><span className="text-gray-600">Salt:</span> <span className="font-medium">{saltTypes.find(s => s.id === mealData.saltType)?.label}</span></div>
              <div><span className="text-gray-600">Sweet:</span> <span className="font-medium">{sweetenerTypes.find(s => s.id === mealData.sweetenerType)?.label}</span></div>
              <div><span className="text-gray-600">Quality:</span> <span className="font-medium">{ingredientQuality.find(q => q.id === mealData.ingredientQuality)?.label}</span></div>
            </div>
          </div>
        </div>

        {/* Health Conditions if any */}
        {mealData.healthConditions.length > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 sm:p-6 border-2 border-red-200">
            <h4 className="font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Health Considerations
            </h4>
            <div className="flex flex-wrap gap-2">
              {mealData.healthConditions.map(id => {
                const condition = healthConditions.find(h => h.id === id);
                return (
                  <span key={id} className={`bg-gradient-to-r ${condition?.color} text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg`}>
                    {condition?.icon} {condition?.label}
                  </span>
                );
              })}
            </div>
            {mealData.healthNotes && (
              <div className="mt-3 sm:mt-4 bg-white rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-gray-700">
                <strong>Notes:</strong> {mealData.healthNotes}
              </div>
            )}
          </div>
        )}

        {/* Allergens if any */}
        {mealData.allergens.length > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 sm:p-6 border-2 border-red-200">
            <h4 className="font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              Allergens to Avoid
            </h4>
            <div className="flex flex-wrap gap-2">
              {mealData.allergens.map(allergen => (
                <span key={allergen} className="bg-red-100 text-red-700 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  🚫 {allergen}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Any Final Notes? (Optional)
          </label>
          <textarea
            value={mealData.specialInstructions}
            onChange={(e) => setMealData({ ...mealData, specialInstructions: e.target.value })}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all resize-none text-sm sm:text-base"
            rows="4"
            placeholder="Any additional preferences, delivery notes, or special requests..."
          />
        </div>

        {/* NEW FEATURE 4: SOCIAL PROOF ELEMENTS */}
        <div className="mt-6 sm:mt-8 mb-4 sm:mb-6">
          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 sm:p-4 text-center border-2 border-orange-200 shadow-md hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">247+</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Happy Families</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 text-center border-2 border-green-200 shadow-md hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">4.8★</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Avg Rating</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 text-center border-2 border-blue-200 shadow-md hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">12</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Trusted Vendors</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 text-center border-2 border-purple-200 shadow-md hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Support</div>
            </div>
          </div>

          {/* Live Activity */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-medium text-gray-800">
                  <span className="text-orange-600 font-bold">Sarah M.</span> from Dubai Marina just placed an order
                </div>
                <div className="text-xs text-gray-500">2 minutes ago</div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="font-medium">Allergen Safe</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-200">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="font-medium">Hygiene Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-full border border-red-200">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <span className="font-medium">Home-Style</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              <span className="font-medium">Fresh Daily</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button 
            onClick={() => setStep(4)}
            className="flex-1 bg-gray-100 text-gray-700 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 order-2 sm:order-1"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Back to Edit</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <button 
            onClick={submitMealPlan}
            className="flex-[2] bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden order-1 sm:order-2"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <Check className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
            <span className="relative z-10">Submit My Plan</span>
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 text-xs sm:text-sm text-gray-600 bg-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-green-200">
        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
        <span className="font-medium">Qualified vendors will review and contact you within 24 hours</span>
      </div>
    </div>
  );
})()}

{/* STEP 6: Ingredients - MOBILE RESPONSIVE */}
{step === 6 && (
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
        <Droplets className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
      </div>
      <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
        Your Kitchen, Your Way
      </h2>
      <p className="text-base sm:text-xl text-gray-600 px-4">Choose your ingredients</p>
    </div>

    <div className="space-y-6 sm:space-y-10">
      {/* Oil Selection */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-8 border-2 border-amber-200">
        <div className="relative">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-amber-100 rounded-xl sm:rounded-2xl">
              <Droplets className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Cooking Oil</h3>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Select your preferred oil</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {oilTypes.map(oil => (
              <button
                key={oil.id}
                type="button"
                onClick={() => setMealData({ ...mealData, oilType: oil.id })}
                className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                  mealData.oilType === oil.id
                    ? 'border-amber-500 bg-white shadow-2xl scale-105'
                    : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-lg'
                }`}
              >
                <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">{oil.icon}</div>
                <div className="font-bold text-gray-900 text-sm sm:text-lg mb-1">{oil.label}</div>
                <div className="text-xs sm:text-sm text-gray-600">{oil.desc}</div>
                {mealData.oilType === oil.id && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <div className="bg-amber-500 rounded-full p-1">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Salt Selection */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-8 border-2 border-blue-200">
        <div className="relative">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl sm:rounded-2xl">
              <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Salt Type</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {saltTypes.map(salt => (
              <button
                key={salt.id}
                type="button"
                onClick={() => setMealData({ ...mealData, saltType: salt.id })}
                className={`relative p-3 sm:p-5 rounded-xl border-2 transition-all text-center ${
                  mealData.saltType === salt.id
                    ? 'border-blue-500 bg-white shadow-xl scale-105'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{salt.icon}</div>
                <div className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1">{salt.label}</div>
                <div className="text-xs text-gray-600 hidden sm:block">{salt.desc}</div>
                {mealData.saltType === salt.id && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-blue-500 rounded-full p-1 sm:p-1.5">
                    <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sweetener Selection */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 p-4 sm:p-8 border-2 border-pink-200">
        <div className="relative">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-pink-100 rounded-xl sm:rounded-2xl">
              <Cookie className="w-5 h-5 sm:w-7 sm:h-7 text-pink-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Sweetener</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
            {sweetenerTypes.map(sweet => (
              <button
                key={sweet.id}
                type="button"
                onClick={() => setMealData({ ...mealData, sweetenerType: sweet.id })}
                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  mealData.sweetenerType === sweet.id
                    ? 'border-pink-500 bg-white shadow-xl scale-110'
                    : 'border-gray-200 bg-white hover:border-pink-300'
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{sweet.icon}</div>
                <div className="font-bold text-gray-900 text-xs truncate">{sweet.label}</div>
                {mealData.sweetenerType === sweet.id && (
                  <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-0.5 sm:p-1">
                    <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    <button 
      onClick={() => setStep(7)}
      className="w-full mt-8 sm:mt-10 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
    >
      Continue to Health Profile
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  </div>
)}

{/* STEP 7: Health - MOBILE RESPONSIVE */}
{step === 7 && (
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
        <Shield className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
      </div>
      <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
        Your Health Matters
      </h2>
      <p className="text-base sm:text-xl text-gray-600 px-4">Help us accommodate your needs</p>
      <p className="text-xs sm:text-sm text-gray-500 mt-2">(Confidential)</p>
    </div>

    <div className="space-y-6 sm:space-y-8">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-5 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          Health Conditions (Optional)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {healthConditions.map(condition => (
            <button
              key={condition.id}
              type="button"
              onClick={() => toggleSelection(condition.id, 'healthConditions')}
              className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                mealData.healthConditions.includes(condition.id)
                  ? `border-transparent bg-gradient-to-br ${condition.color} text-white shadow-2xl scale-105`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{condition.icon}</div>
              <div className={`font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 ${
                mealData.healthConditions.includes(condition.id) ? 'text-white' : 'text-gray-900'
              }`}>
                {condition.label}
              </div>
              <div className={`text-xs sm:text-sm ${
                mealData.healthConditions.includes(condition.id) ? 'text-white opacity-90' : 'text-gray-600'
              }`}>
                {condition.desc}
              </div>
              {mealData.healthConditions.includes(condition.id) && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white rounded-full p-1 sm:p-1.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          Health Notes (Optional)
        </label>
        <textarea
          value={mealData.healthNotes}
          onChange={(e) => setMealData({ ...mealData, healthNotes: e.target.value })}
          className="w-full px-4 sm:px-6 py-3 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all resize-none bg-gradient-to-br from-gray-50 to-white text-sm sm:text-base"
          rows="4"
          placeholder="e.g., Diabetic - low sugar meals needed, dental issues - prefer softer foods, etc."
        />
        <p className="text-xs text-gray-500 mt-2 italic">Helps vendors prepare safe meals for you</p>
      </div>
    </div>

    <button 
      onClick={() => setStep(8)}
      className="w-full mt-8 sm:mt-10 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
    >
      Continue to Premium Options
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  </div>
)}


{/* STEP 8: Premium Customization - MOBILE RESPONSIVE */}
{step === 8 && (
  <div className="bg-white rounded-3xl p-4 md:p-10 shadow-2xl w-full max-w-6xl mx-auto">
    <div className="text-center mb-8 md:mb-10">
      <div className="inline-block p-4 md:p-5 bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 rounded-3xl mb-3 md:mb-4">
        <Star className="w-10 h-10 md:w-12 md:h-12 text-white" />
      </div>
      <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 md:mb-3 px-4">
        Premium Experience
      </h2>
      <p className="text-base md:text-lg text-gray-600 px-4">Customize quality & preparation</p>
    </div>

    <div className="space-y-6 md:space-y-8 px-2">
      {/* Ingredient Quality - MOBILE FIRST */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 md:mb-4 px-2">Ingredient Quality</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {ingredientQuality.map(quality => (
            <button
              key={quality.id}
              type="button"
              onClick={() => setMealData({ ...mealData, ingredientQuality: quality.id })}
              className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all text-left w-full ${
                mealData.ingredientQuality === quality.id
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              {/* Star Rating - CONTAINED */}
              <div className="text-2xl md:text-3xl mb-2 md:mb-3 truncate">{quality.icon}</div>
              <div className="font-bold text-gray-900 text-base md:text-lg mb-1 md:mb-2">{quality.label}</div>
              <div className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">{quality.desc}</div>
              
              {/* Features - Compact */}
              <div className="space-y-1 mb-2 md:mb-3">
                {quality.features.slice(0, 2).map((feature, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs">
                    <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 line-clamp-1">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className={`text-sm md:text-base font-bold ${
                mealData.ingredientQuality === quality.id ? 'text-purple-700' : 'text-gray-500'
              }`}>
                {quality.price}
              </div>
              
              {mealData.ingredientQuality === quality.id && (
                <div className="absolute -top-2 -right-2 bg-purple-600 rounded-full p-1.5 shadow-lg">
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Texture & Preparation - MOBILE STACKED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Texture */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-orange-200">
          <div className="flex items-center gap-2 md:gap-3 mb-4">
            <div className="p-2 md:p-3 bg-orange-100 rounded-xl md:rounded-2xl">
              <Utensils className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Texture</h3>
              <p className="text-xs text-gray-600 hidden md:block">Food texture</p>
            </div>
          </div>
          
          <div className="space-y-2 md:space-y-3">
            {texturePreferences.map(texture => (
              <button
                key={texture.id}
                type="button"
                onClick={() => setMealData({ ...mealData, texturePreference: texture.id })}
                className={`w-full p-3 md:p-4 rounded-xl border-2 transition-all flex items-center gap-3 md:gap-4 ${
                  mealData.texturePreference === texture.id
                    ? 'border-orange-500 bg-white shadow-lg'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="text-2xl md:text-3xl">{texture.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-sm md:text-base text-gray-900">{texture.label}</div>
                  <div className="text-xs text-gray-600 hidden sm:block">{texture.desc}</div>
                </div>
                {mealData.texturePreference === texture.id && (
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Meat & Veg - MOBILE OPTIMIZED */}
        <div className="space-y-4 md:space-y-6">
          {/* Meat */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-red-200">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-red-100 rounded-xl md:rounded-2xl">
                <Egg className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Meat Cut</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {meatPreparations.map(meat => (
                <button
                  key={meat.id}
                  type="button"
                  onClick={() => setMealData({ ...mealData, meatPreparation: meat.id })}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all ${
                    mealData.meatPreparation === meat.id
                      ? 'border-red-500 bg-white shadow-lg'
                      : 'border-gray-200 bg-white hover:border-red-300'
                  }`}
                >
                  <div className="text-2xl md:text-3xl mb-1 md:mb-2">{meat.icon}</div>
                  <div className="font-bold text-xs md:text-sm text-gray-900 truncate">{meat.label}</div>
                  {mealData.meatPreparation === meat.id && (
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-red-600 mx-auto mt-1 md:mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Vegetables */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-green-100 rounded-xl md:rounded-2xl">
                <Pizza className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Veggie Cut</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {vegetableCuts.map(veg => (
                <button
                  key={veg.id}
                  type="button"
                  onClick={() => setMealData({ ...mealData, vegetableCut: veg.id })}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all ${
                    mealData.vegetableCut === veg.id
                      ? 'border-green-500 bg-white shadow-lg'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl md:text-3xl mb-1 md:mb-2">{veg.icon}</div>
                  <div className="font-bold text-xs md:text-sm text-gray-900 truncate">{veg.label}</div>
                  {mealData.vegetableCut === veg.id && (
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600 mx-auto mt-1 md:mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <button 
      onClick={() => setStep(9)}
      className="w-full mt-8 md:mt-10 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white py-4 md:py-6 rounded-2xl font-bold text-lg md:text-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 group mx-2"
    >
      Next: Delivery & Family
      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
)}

{/* STEP 9: Delivery - MOBILE RESPONSIVE */}
{step === 9 && (
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl max-w-6xl mx-auto">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-indigo-400 via-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
        <Clock className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
      </div>
      <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
        Delivery & Household
      </h2>
      <p className="text-base sm:text-xl text-gray-600 px-4">When and how you want meals</p>
    </div>

    <div className="space-y-6 sm:space-y-10">
      {/* Delivery Windows */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-xl sm:rounded-2xl">
            <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Delivery Window</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {deliveryWindows.map(window => (
            <button
              key={window.id}
              type="button"
              onClick={() => setMealData({ ...mealData, deliveryWindow: window.id })}
              className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                mealData.deliveryWindow === window.id
                  ? 'border-blue-500 bg-white shadow-2xl scale-105'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{window.icon}</div>
              <div className="font-bold text-gray-900 text-sm sm:text-lg mb-1">{window.label}</div>
              <div className="text-xs sm:text-sm text-blue-600 font-semibold mb-1 sm:mb-2">{window.time}</div>
              <div className="text-xs text-gray-600 hidden sm:block">{window.desc}</div>
              {mealData.deliveryWindow === window.id && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-blue-500 rounded-full p-1 sm:p-1.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Packaging */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-green-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-green-100 rounded-xl sm:rounded-2xl">
            <Award className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Packaging</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {packagingTypes.map(pkg => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setMealData({ ...mealData, packagingType: pkg.id })}
              className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${
                mealData.packagingType === pkg.id
                  ? 'border-green-500 bg-white shadow-2xl scale-105'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">{pkg.icon}</div>
              <div className="font-bold text-gray-900 text-xs sm:text-base mb-1">{pkg.label}</div>
              <div className="text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-2">{pkg.desc}</div>
              <div className="text-xs sm:text-sm font-bold text-green-600">{pkg.extra}</div>
              {mealData.packagingType === pkg.id && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-500 rounded-full p-1 sm:p-1.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Family & Special - Two Columns on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Family Size */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 border-purple-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-xl sm:rounded-2xl">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Family Size</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {familyOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMealData({ ...mealData, familyMembers: option.value })}
                className={`p-3 sm:p-5 rounded-xl border-2 transition-all ${
                  mealData.familyMembers === option.value
                    ? 'border-purple-500 bg-white shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{option.icon}</div>
                <div className="font-bold text-gray-900 text-xs sm:text-sm">{option.label}</div>
                <div className="text-xs text-gray-600 hidden sm:block mt-1">{option.desc}</div>
                {mealData.familyMembers === option.value && (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 mx-auto mt-1 sm:mt-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Special Needs - Toggle Switches */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 border-orange-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-xl sm:rounded-2xl">
              <Heart className="w-5 h-5 sm:w-6sm:h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Special Needs</h3>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <button
              type="button"
              onClick={() => setMealData({ ...mealData, kidsVersion: !mealData.kidsVersion })}
              className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                mealData.kidsVersion
                  ? 'border-orange-500 bg-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-xl sm:text-2xl">👶</div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">Kids Version</div>
                  <div className="text-xs text-gray-600 hidden sm:block">Milder, simpler</div>
                </div>
              </div>
              <div className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all relative ${
                mealData.kidsVersion ? 'bg-orange-500' : 'bg-gray-300'
              }`}>
                <div className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full top-0.5 transition-all ${
                  mealData.kidsVersion ? 'right-0.5' : 'left-0.5'
                }`} />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMealData({ ...mealData, elderlyFriendly: !mealData.elderlyFriendly })}
              className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                mealData.elderlyFriendly
                  ? 'border-orange-500 bg-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-xl sm:text-2xl">👴</div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">Elderly-Friendly</div>
                  <div className="text-xs text-gray-600 hidden sm:block">Softer, low sodium</div>
                </div>
              </div>
              <div className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all relative ${
                mealData.elderlyFriendly ? 'bg-orange-500' : 'bg-gray-300'
              }`}>
                <div className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full top-0.5 transition-all ${
                  mealData.elderlyFriendly ? 'right-0.5' : 'left-0.5'
                }`} />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMealData({ ...mealData, separateComponents: !mealData.separateComponents })}
              className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                mealData.separateComponents
                  ? 'border-orange-500 bg-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-xl sm:text-2xl">📦</div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">Separate Pack</div>
                  <div className="text-xs text-gray-600 hidden sm:block">Curry separate</div>
                </div>
              </div>
              <div className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all relative ${
                mealData.separateComponents ? 'bg-orange-500' : 'bg-gray-300'
              }`}>
                <div className={`absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full top-0.5 transition-all ${
                  mealData.separateComponents ? 'right-0.5' : 'left-0.5'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Smart Preferences - Mobile Grid */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-gray-200">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          Smart Preferences
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setMealData({ ...mealData, weeklyVariety: !mealData.weeklyVariety })}
            className={`p-4 sm:p-5 rounded-xl border-2 transition-all flex items-center justify-between ${
              mealData.weeklyVariety
                ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="text-left">
              <div className="font-bold text-gray-900 text-sm sm:text-base mb-1">Weekly Variety</div>
              <div className="text-xs text-gray-600 hidden sm:block">Rotate dishes</div>
            </div>
            <div className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all relative ${
              mealData.weeklyVariety ? 'bg-indigo-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full top-0.5 transition-all shadow-lg ${
                mealData.weeklyVariety ? 'right-0.5' : 'left-0.5'
              }`} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMealData({ ...mealData, seasonalPreference: !mealData.seasonalPreference })}
            className={`p-4 sm:p-5 rounded-xl border-2 transition-all flex items-center justify-between ${
              mealData.seasonalPreference
                ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <div className="text-left">
              <div className="font-bold text-gray-900 text-sm sm:text-base mb-1">Seasonal</div>
              <div className="text-xs text-gray-600 hidden sm:block">Fresh produce</div>
            </div>
            <div className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all relative ${
              mealData.seasonalPreference ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full top-0.5 transition-all shadow-lg ${
                mealData.seasonalPreference ? 'right-0.5' : 'left-0.5'
              }`} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMealData({ ...mealData, reheatingInstructions: !mealData.reheatingInstructions })}
            className={`p-4 sm:p-5 rounded-xl border-2 transition-all flex items-center justify-between sm:col-span-2 ${
              mealData.reheatingInstructions
                ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-orange-300'
            }`}
          >
            <div className="text-left">
              <div className="font-bold text-gray-900 text-sm sm:text-base mb-1">Reheating Guide</div>
              <div className="text-xs text-gray-600 hidden sm:block">Include instructions</div>
            </div>
            <div className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all relative ${
              mealData.reheatingInstructions ? 'bg-orange-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full top-0.5 transition-all shadow-lg ${
                mealData.reheatingInstructions ? 'right-0.5' : 'left-0.5'
              }`} />
            </div>
          </button>
        </div>
      </div>
    </div>

    <button 
      onClick={() => setStep(10)}
      className="w-full mt-8 sm:mt-10 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
    >
      Review Complete Plan
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
)}

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