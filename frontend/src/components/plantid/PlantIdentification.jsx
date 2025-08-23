import React, { useState, useRef } from 'react';
import { realPlantMatcher } from '../../services/realPlantMatcher';
import { aiChatService } from '../../services/aiChatService';

const PlantIdentification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [features, setFeatures] = useState([]);
  const [identificationSource, setIdentificationSource] = useState('');
  const fileInputRef = useRef(null);

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate image
    const validation = realPlantMatcher.validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    
    // Reset previous results
    setMatches([]);
    setSelectedPlant(null);
    setShowChat(false);
    setChatMessages([]);
    setIdentificationSource('');
  };

  // Handle plant identification
  const identifyPlant = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    
    try {
      const result = await realPlantMatcher.matchPlant(selectedImage, features);
      
      if (result.success && result.matches.length > 0) {
        setMatches(result.matches);
        setIdentificationSource(result.source || 'Unknown');
        
        // Auto-select highest confidence match
        if (result.matches[0].confidence >= 0.7) {
          setSelectedPlant(result.matches[0].plant);
        }
      } else {
        alert('No matching plants found. Try a clearer image or add more features.');
      }
    } catch (error) {
      console.error('Identification error:', error);
      alert('Error processing image. Please try again.');
    }
    
    setIsProcessing(false);
  };

  // Handle feature input
  const addFeature = (feature) => {
    if (feature && !features.includes(feature)) {
      setFeatures([...features, feature]);
    }
  };

  const removeFeature = (feature) => {
    setFeatures(features.filter(f => f !== feature));
  };

  // Handle plant selection
  const selectPlant = (plant) => {
    setSelectedPlant(plant);
    setShowChat(true);
    
    const welcomeMessage = plant.apiData 
      ? `I've identified your plant as ${plant.name} with ${Math.round(plant.apiConfidence * 100)}% confidence using real AI! Ask me anything about its care.`
      : `I've identified your plant as ${plant.name}! Ask me anything about its care.`;
    
    setChatMessages([{
      type: 'system',
      content: welcomeMessage,
      timestamp: new Date()
    }]);
  };

  // Handle AI chat
  const askAI = async () => {
    if (!userQuestion.trim() || !selectedPlant) return;

    const question = userQuestion.trim();
    setUserQuestion('');
    setIsAskingAI(true);

    // Add user message
    const userMsg = {
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const response = await aiChatService.askQuestion(selectedPlant, question);
      
      const aiMsg = {
        type: response.isRelevant ? 'ai' : 'warning',
        content: response.response,
        source: response.source || 'AI',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        type: 'error',
        content: 'Sorry, I could not process your question. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    }
    
    setIsAskingAI(false);
  };

  // Quick question buttons
  const askQuickQuestion = (question) => {
    setUserQuestion(question);
    setTimeout(() => askAI(), 100);
  };

  // Get care guide
  const getCareGuide = () => {
    if (!selectedPlant) return;
    
    const guide = aiChatService.getQuickCareGuide(selectedPlant);
    const guideMsg = {
      type: 'system',
      content: guide,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, guideMsg]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">🔍 Plant Identification</h1>
          <p className="text-gray-600">Upload a plant image to identify the species and get AI-powered care advice</p>
          {identificationSource && (
            <p className="text-sm text-blue-600 mt-2">✨ Powered by: {identificationSource}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Image Upload and Features */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Plant Image</h2>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Plant preview" 
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl">📷</div>
                    <div>
                      <p className="text-lg font-medium">Upload Plant Photo</p>
                      <p className="text-sm text-gray-500">JPEG, PNG, WebP up to 10MB</p>
                      <p className="text-xs text-green-600 mt-2">✨ Real AI identification available</p>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Additional Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add Plant Features (Optional)</h3>
              <p className="text-sm text-gray-600 mb-4">Describe what you see to improve accuracy</p>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    'thorny stems', 'split leaves', 'white flowers', 'climbing vine', 
                    'thick leaves', 'serrated edges', 'glossy surface', 'colorful bracts',
                    'needle-like leaves', 'heart-shaped leaves', 'variegated', 'succulent'
                  ].map(feature => (
                    <button
                      key={feature}
                      onClick={() => addFeature(feature)}
                      disabled={features.includes(feature)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        features.includes(feature)
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-green-50 text-gray-700'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
                
                {features.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {features.map(feature => (
                        <span
                          key={feature}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {feature}
                          <button
                            onClick={() => removeFeature(feature)}
                            className="text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Identify Button */}
            <button
              onClick={identifyPlant}
              disabled={!selectedImage || isProcessing}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Identifying Plant...
                </div>
              ) : (
                '🔍 Identify Plant'
              )}
            </button>
          </div>

          {/* Right Side - Results and Chat */}
          <div className="space-y-6">
            {/* Identification Results */}
            {matches.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Identification Results</h2>
                
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div
                      key={match.plant.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlant?.id === match.plant.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => selectPlant(match.plant)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{match.plant.name}</h3>
                        <div className="flex items-center gap-2">
                          {match.confidence >= 0.9 && <span className="text-green-500 text-xl">✅</span>}
                          {match.plant.apiData && <span className="text-blue-500 text-sm">🤖 AI</span>}
                          <span className={`text-sm px-2 py-1 rounded ${
                            match.confidence >= 0.9 ? 'bg-green-100 text-green-700' :
                            match.confidence >= 0.7 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {Math.round(match.confidence * 100)}% match
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2 italic">{match.plant.scientificName}</p>
                      <p className="text-gray-700 text-sm mb-3">{match.plant.description}</p>
                      
                      {match.matchedFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {match.matchedFeatures.map((feature, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plant Information */}
            {selectedPlant && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold">{selectedPlant.name}</h2>
                  <span className="text-green-500 text-2xl">✅</span>
                  {selectedPlant.apiData && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      AI Identified
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Scientific Name</p>
                    <p className="font-medium italic">{selectedPlant.scientificName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Family</p>
                    <p className="font-medium">{selectedPlant.family}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Care Level</p>
                    <p className="font-medium">{selectedPlant.care}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{selectedPlant.type}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">☀️</div>
                      <p className="text-xs text-gray-600">Light</p>
                      <p className="text-sm font-medium">{selectedPlant.sunlight}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">💧</div>
                      <p className="text-xs text-gray-600">Water</p>
                      <p className="text-sm font-medium">{selectedPlant.water}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">🌱</div>
                      <p className="text-xs text-gray-600">Soil</p>
                      <p className="text-sm font-medium">{selectedPlant.soil}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Key Benefits</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlant.benefits.map((benefit, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={getCareGuide}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📋 Get Quick Care Guide
                  </button>
                </div>
              </div>
            )}

            {/* AI Chat Interface */}
            {showChat && selectedPlant && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">💬 Ask AI About Your Plant</h3>
                
                {/* Chat Messages */}
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg max-w-xs ${
                        message.type === 'user' 
                          ? 'bg-green-500 text-white' 
                          : message.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : message.type === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-white border'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                          {message.source && (
                            <p className="text-xs opacity-70">
                              {message.source}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isAskingAI && (
                    <div className="text-left mb-3">
                      <div className="inline-block p-3 rounded-lg bg-white border">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Questions */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quick Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "How often should I water this plant?",
                      "What light does it need?",
                      "How do I care for it?",
                      "What pests should I watch for?",
                      "How do I propagate it?",
                      "Is it safe for pets?"
                    ].map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => askQuickQuestion(question)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                        disabled={isAskingAI}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askAI()}
                    placeholder="Ask about watering, care, problems..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isAskingAI}
                  />
                  <button
                    onClick={askAI}
                    disabled={!userQuestion.trim() || isAskingAI}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantIdentification;