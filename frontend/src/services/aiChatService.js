// Enhanced AI Chat Service for Plant Information
export class AIChatService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.maxTokens = 500;
    this.allowedTopics = [
      'care instructions', 'watering', 'sunlight', 'soil', 'fertilizer',
      'pruning', 'pests', 'diseases', 'propagation', 'growth', 'flowering',
      'repotting', 'humidity', 'temperature', 'toxicity', 'benefits',
      'companion plants', 'seasonal care', 'problems', 'identification',
      'light requirements', 'placement', 'troubleshooting'
    ];
  }

  // Validate if question is plant-related
  isPlantRelatedQuestion(question) {
    const plantKeywords = [
      'plant', 'care', 'water', 'sunlight', 'soil', 'fertilizer', 'prune',
      'pest', 'disease', 'grow', 'flower', 'leaf', 'root', 'stem', 'bloom',
      'repot', 'propagate', 'humidity', 'light', 'shade', 'toxic', 'safe',
      'yellow', 'brown', 'wilting', 'dying', 'healthy', 'green', 'drooping'
    ];

    const questionLower = question.toLowerCase();
    return plantKeywords.some(keyword => questionLower.includes(keyword)) ||
           this.allowedTopics.some(topic => questionLower.includes(topic));
  }

  // Generate enhanced plant-specific prompt
  generatePlantPrompt(plantInfo, userQuestion) {
    const apiInfo = plantInfo.apiData ? 
      `\nThis plant was identified using real AI plant identification technology with ${Math.round(plantInfo.apiConfidence * 100)}% confidence.` : 
      '\nThis plant was identified from our comprehensive plant database.';

    return `You are an expert plant care specialist. Answer questions only about plants, gardening, and plant care.

PLANT IDENTIFICATION:
- Common Name: ${plantInfo.name}
- Scientific Name: ${plantInfo.scientificName}
- Plant Family: ${plantInfo.family}
- Growth Type: ${plantInfo.type}
- Care Difficulty: ${plantInfo.care}${apiInfo}

CARE REQUIREMENTS:
- Light: ${plantInfo.sunlight}
- Watering: ${plantInfo.water}
- Soil Type: ${plantInfo.soil}
- Season: ${plantInfo.season}

PLANT CHARACTERISTICS:
- Description: ${plantInfo.description}
- Key Features: ${plantInfo.features.join(', ')}
- Colors: ${plantInfo.colors.join(', ')}
- Benefits: ${plantInfo.benefits.join(', ')}

COMMON ISSUES & CARE:
- Common Problems: ${plantInfo.commonIssues.join(', ')}
- Care Tips: ${plantInfo.tips.join(', ')}

USER QUESTION: ${userQuestion}

Please provide helpful, accurate, and specific advice about this plant. Keep your response under 200 words and focus on practical care guidance. If the question is not about plants or gardening, politely redirect to plant-related topics only.`;
  }

  // Enhanced fallback responses with your dataset
  getFallbackResponse(plantInfo, question) {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('water')) {
      const wateringTip = plantInfo.tips.find(tip => tip.toLowerCase().includes('water'));
      return `For ${plantInfo.name}, water ${plantInfo.water.toLowerCase()}. ${wateringTip || 'Check soil moisture before watering and ensure good drainage.'}`;
    }
    
    if (questionLower.includes('light') || questionLower.includes('sun')) {
      return `${plantInfo.name} needs ${plantInfo.sunlight.toLowerCase()} light conditions. This ${plantInfo.type.toLowerCase()} thrives best when placed in the right lighting environment.`;
    }
    
    if (questionLower.includes('care') || questionLower.includes('how')) {
      return `${plantInfo.name} is ${plantInfo.care.toLowerCase()} to care for. ${plantInfo.description} Key care tips: ${plantInfo.tips.slice(0, 2).join(', ')}.`;
    }
    
    if (questionLower.includes('soil')) {
      return `Use ${plantInfo.soil.toLowerCase()} soil for ${plantInfo.name}. This ensures proper drainage and healthy root development for optimal growth.`;
    }
    
    if (questionLower.includes('problem') || questionLower.includes('issue') || questionLower.includes('yellow') || questionLower.includes('brown')) {
      return `Common issues with ${plantInfo.name} include: ${plantInfo.commonIssues.join(', ')}. Monitor your plant regularly and adjust care accordingly.`;
    }

    if (questionLower.includes('benefit') || questionLower.includes('good')) {
      return `${plantInfo.name} offers these benefits: ${plantInfo.benefits.join(', ')}. It's a wonderful addition to any indoor garden.`;
    }

    if (questionLower.includes('propagate') || questionLower.includes('cutting')) {
      return `${plantInfo.name} can typically be propagated through standard methods for ${plantInfo.type.toLowerCase()}s. Check specific propagation guides for best results.`;
    }

    return `${plantInfo.name} (${plantInfo.scientificName}) is ${plantInfo.description} Care requirements: ${plantInfo.sunlight.toLowerCase()} light, ${plantInfo.water.toLowerCase()} watering, and ${plantInfo.soil.toLowerCase()} soil. For specific questions about watering, lighting, soil, or problems, please ask!`;
  }

  // Send question to OpenAI API
  async askQuestion(plantInfo, question) {
    try {
      // Validate question
      if (!this.isPlantRelatedQuestion(question)) {
        return {
          success: false,
          response: "I can only answer questions about plants and gardening. Please ask about plant care, watering, sunlight, diseases, or other plant-related topics.",
          isRelevant: false
        };
      }

      // Check if API key is available
      if (!this.apiKey) {
        return {
          success: true,
          response: this.getFallbackResponse(plantInfo, question),
          isRelevant: true,
          source: 'Local Knowledge'
        };
      }

      const prompt = this.generatePlantPrompt(plantInfo, question);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful plant care expert with extensive knowledge of houseplants. Only answer questions related to plants, gardening, and plant care. Provide practical, actionable advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.maxTokens,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        return {
          success: true,
          response: data.choices[0].message.content.trim(),
          isRelevant: true,
          tokensUsed: data.usage?.total_tokens || 0,
          source: 'OpenAI GPT'
        };
      }

      throw new Error('Invalid response format');

    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Fallback to local knowledge
      return {
        success: true,
        response: this.getFallbackResponse(plantInfo, question),
        isRelevant: true,
        error: error.message,
        source: 'Local Fallback'
      };
    }
  }

  // Get comprehensive plant care summary
  getPlantSummary(plantInfo) {
    return {
      identification: {
        name: plantInfo.name,
        scientific: plantInfo.scientificName,
        family: plantInfo.family,
        type: plantInfo.type,
        difficulty: plantInfo.care
      },
      basicCare: {
        light: plantInfo.sunlight,
        water: plantInfo.water,
        soil: plantInfo.soil,
        season: plantInfo.season
      },
      characteristics: {
        features: plantInfo.features,
        colors: plantInfo.colors,
        description: plantInfo.description
      },
      quickTips: plantInfo.tips.slice(0, 3),
      benefits: plantInfo.benefits,
      watchOut: plantInfo.commonIssues.slice(0, 3)
    };
  }

  // Get suggested questions for the plant
  getSuggestedQuestions(plantInfo) {
    const baseQuestions = [
      `How often should I water my ${plantInfo.name}?`,
      `What kind of light does ${plantInfo.name} need?`,
      `How do I care for ${plantInfo.name}?`,
      `What are signs of problems in ${plantInfo.name}?`
    ];

    // Add specific questions based on plant type
    const specificQuestions = [];
    
    if (plantInfo.type.toLowerCase().includes('succulent')) {
      specificQuestions.push(`How little water does ${plantInfo.name} actually need?`);
    }
    
    if (plantInfo.type.toLowerCase().includes('flowering')) {
      specificQuestions.push(`How do I get my ${plantInfo.name} to bloom?`);
    }
    
    if (plantInfo.type.toLowerCase().includes('vine') || plantInfo.type.toLowerCase().includes('climbing')) {
      specificQuestions.push(`How do I support my climbing ${plantInfo.name}?`);
    }

    if (plantInfo.care.toLowerCase() === 'difficult') {
      specificQuestions.push(`What makes ${plantInfo.name} difficult to care for?`);
    }

    return [...baseQuestions, ...specificQuestions.slice(0, 2)];
  }

  // Quick plant care assessment
  getQuickCareGuide(plantInfo) {
    const careLevel = plantInfo.care.toLowerCase();
    const waterFreq = plantInfo.water.toLowerCase();
    const lightReq = plantInfo.sunlight.toLowerCase();

    let guide = `🌱 ${plantInfo.name} Quick Care Guide:\n\n`;
    
    // Difficulty indicator
    const difficultyEmoji = {
      'easy': '😊 Easy',
      'very easy': '😊 Very Easy', 
      'moderate': '😐 Moderate',
      'difficult': '😰 Challenging'
    };
    guide += `Difficulty: ${difficultyEmoji[careLevel] || careLevel}\n`;
    
    // Light requirements
    const lightEmoji = {
      'low': '🌙',
      'bright indirect': '🌤️',
      'bright direct': '☀️',
      'full sun': '☀️☀️'
    };
    guide += `Light: ${lightEmoji[lightReq] || '💡'} ${plantInfo.sunlight}\n`;
    
    // Water requirements  
    const waterEmoji = {
      'low': '💧',
      'very low': '💧',
      'moderate': '💧💧',
      'high': '💧💧💧',
      'regular': '💧💧'
    };
    guide += `Water: ${waterEmoji[waterFreq] || '💧'} ${plantInfo.water}\n`;
    
    guide += `\n✨ Benefits: ${plantInfo.benefits.slice(0, 2).join(', ')}\n`;
    guide += `⚠️ Watch for: ${plantInfo.commonIssues.slice(0, 2).join(', ')}`;
    
    return guide;
  }

  // Rate limiting check
  checkRateLimit() {
    const lastRequest = localStorage.getItem('lastAIRequest');
    const requestCount = parseInt(localStorage.getItem('aiRequestCount') || '0');
    const now = Date.now();
    
    // Reset count every hour
    if (!lastRequest || now - parseInt(lastRequest) > 3600000) {
      localStorage.setItem('aiRequestCount', '1');
      localStorage.setItem('lastAIRequest', now.toString());
      return { allowed: true, remaining: 19 };
    }
    
    if (requestCount >= 20) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: parseInt(lastRequest) + 3600000
      };
    }
    
    localStorage.setItem('aiRequestCount', (requestCount + 1).toString());
    return { allowed: true, remaining: 20 - requestCount };
  }

  // Emergency plant care advice
  getEmergencyAdvice(plantInfo, symptoms) {
    const symptomsLower = symptoms.toLowerCase();
    
    if (symptomsLower.includes('yellow') && symptomsLower.includes('leaves')) {
      return `🚨 Yellow leaves on ${plantInfo.name} often indicate overwatering or poor drainage. Check soil moisture and ensure proper drainage. Let soil dry between waterings.`;
    }
    
    if (symptomsLower.includes('brown') && symptomsLower.includes('tips')) {
      return `🚨 Brown leaf tips on ${plantInfo.name} usually mean low humidity, fluoride in water, or underwatering. Try using filtered water and increasing humidity.`;
    }
    
    if (symptomsLower.includes('drooping') || symptomsLower.includes('wilting')) {
      return `🚨 Drooping ${plantInfo.name} could be under or overwatered. Check soil: if dry, water thoroughly. If wet, improve drainage and reduce watering.`;
    }
    
    if (symptomsLower.includes('spots') && symptomsLower.includes('leaves')) {
      return `🚨 Leaf spots on ${plantInfo.name} may indicate fungal disease. Improve air circulation, avoid overhead watering, and remove affected leaves.`;
    }
    
    return `🚨 For ${plantInfo.name} problems, check these basics: proper light (${plantInfo.sunlight}), appropriate watering (${plantInfo.water}), and good drainage. Monitor for pests and diseases.`;
  }
}

export const aiChatService = new AIChatService();