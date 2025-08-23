// shopData.js - Product categories and data
export const categories = [
  { id: 1, name: 'Indoor Plants', icon: '🪴' },
  { id: 2, name: 'Outdoor Plants', icon: '🌳' },
  { id: 3, name: 'Seeds', icon: '🌱' },
  { id: 4, name: 'Fertilizers', icon: '🧪' },
  { id: 5, name: 'Pots & Planters', icon: '🏺' },
  { id: 6, name: 'Tools', icon: '🔧' },
  { id: 7, name: 'Soil & Compost', icon: '🌾' },
  { id: 8, name: 'Plant Care', icon: '💊' }
];

export const products = [
  // Indoor Plants
  { id: 1, name: 'Snake Plant', price: 1500, category: 1, image: '/api/placeholder/300/300', stock: 25, description: 'Low maintenance indoor plant' },
  { id: 2, name: 'Monstera Deliciosa', price: 2500, category: 1, image: '/api/placeholder/300/300', stock: 15, description: 'Popular houseplant with split leaves' },
  { id: 3, name: 'Peace Lily', price: 1200, category: 1, image: '/api/placeholder/300/300', stock: 30, description: 'Beautiful flowering indoor plant' },
  { id: 4, name: 'Rubber Plant', price: 1800, category: 1, image: '/api/placeholder/300/300', stock: 20, description: 'Glossy green leaves indoor plant' },
  { id: 5, name: 'Aloe Vera', price: 800, category: 1, image: '/api/placeholder/300/300', stock: 40, description: 'Medicinal succulent plant' },
  { id: 6, name: 'Spider Plant', price: 600, category: 1, image: '/api/placeholder/300/300', stock: 35, description: 'Easy to grow hanging plant' },
  
  // Outdoor Plants
  { id: 7, name: 'Rose Plant', price: 900, category: 2, image: '/api/placeholder/300/300', stock: 50, description: 'Beautiful flowering rose bush' },
  { id: 8, name: 'Jasmine Plant', price: 700, category: 2, image: '/api/placeholder/300/300', stock: 45, description: 'Fragrant flowering vine' },
  { id: 9, name: 'Bougainvillea', price: 1100, category: 2, image: '/api/placeholder/300/300', stock: 25, description: 'Colorful outdoor flowering plant' },
  { id: 10, name: 'Hibiscus', price: 850, category: 2, image: '/api/placeholder/300/300', stock: 30, description: 'Tropical flowering shrub' },
  { id: 11, name: 'Marigold', price: 300, category: 2, image: '/api/placeholder/300/300', stock: 60, description: 'Bright orange flowering plant' },
  { id: 12, name: 'Sunflower', price: 400, category: 2, image: '/api/placeholder/300/300', stock: 40, description: 'Tall yellow flowering plant' },
  
  // Seeds
  { id: 13, name: 'Tomato Seeds', price: 150, category: 3, image: '/api/placeholder/300/300', stock: 100, description: 'High quality tomato seeds' },
  { id: 14, name: 'Basil Seeds', price: 120, category: 3, image: '/api/placeholder/300/300', stock: 80, description: 'Aromatic herb seeds' },
  { id: 15, name: 'Mint Seeds', price: 100, category: 3, image: '/api/placeholder/300/300', stock: 90, description: 'Fresh mint herb seeds' },
  { id: 16, name: 'Coriander Seeds', price: 80, category: 3, image: '/api/placeholder/300/300', stock: 120, description: 'Fresh coriander seeds' },
  { id: 17, name: 'Chili Seeds', price: 180, category: 3, image: '/api/placeholder/300/300', stock: 70, description: 'Hot chili pepper seeds' },
  { id: 18, name: 'Lettuce Seeds', price: 140, category: 3, image: '/api/placeholder/300/300', stock: 85, description: 'Fresh lettuce seeds' },
  
  // Fertilizers
  { id: 19, name: 'NPK Fertilizer', price: 450, category: 4, image: '/api/placeholder/300/300', stock: 50, description: 'Complete plant nutrition' },
  { id: 20, name: 'Organic Compost', price: 300, category: 4, image: '/api/placeholder/300/300', stock: 40, description: 'Natural organic fertilizer' },
  { id: 21, name: 'Liquid Fertilizer', price: 380, category: 4, image: '/api/placeholder/300/300', stock: 35, description: 'Easy to use liquid plant food' },
  { id: 22, name: 'Bone Meal', price: 250, category: 4, image: '/api/placeholder/300/300', stock: 45, description: 'Organic phosphorus fertilizer' },
  { id: 23, name: 'Vermicompost', price: 320, category: 4, image: '/api/placeholder/300/300', stock: 38, description: 'Worm castings fertilizer' },
  { id: 24, name: 'Urea Fertilizer', price: 200, category: 4, image: '/api/placeholder/300/300', stock: 60, description: 'Nitrogen rich fertilizer' },
  
  // Pots & Planters
  { id: 25, name: 'Ceramic Pot Medium', price: 800, category: 5, image: '/api/placeholder/300/300', stock: 30, description: 'Beautiful ceramic planter' },
  { id: 26, name: 'Plastic Pot Set', price: 500, category: 5, image: '/api/placeholder/300/300', stock: 50, description: 'Set of 5 plastic pots' },
  { id: 27, name: 'Terracotta Pot Large', price: 600, category: 5, image: '/api/placeholder/300/300', stock: 25, description: 'Traditional clay pot' },
  { id: 28, name: 'Hanging Planter', price: 900, category: 5, image: '/api/placeholder/300/300', stock: 20, description: 'Decorative hanging planter' },
  { id: 29, name: 'Window Box Planter', price: 1200, category: 5, image: '/api/placeholder/300/300', stock: 15, description: 'Long rectangular planter' },
  { id: 30, name: 'Self-Watering Pot', price: 1500, category: 5, image: '/api/placeholder/300/300', stock: 18, description: 'Smart self-watering system' },
  
  // Tools
  { id: 31, name: 'Pruning Shears', price: 800, category: 6, image: '/api/placeholder/300/300', stock: 25, description: 'Sharp pruning scissors' },
  { id: 32, name: 'Garden Trowel', price: 400, category: 6, image: '/api/placeholder/300/300', stock: 40, description: 'Small digging tool' },
  { id: 33, name: 'Watering Can', price: 600, category: 6, image: '/api/placeholder/300/300', stock: 30, description: '2 liter watering can' },
  { id: 34, name: 'Garden Gloves', price: 300, category: 6, image: '/api/placeholder/300/300', stock: 50, description: 'Protective gardening gloves' },
  { id: 35, name: 'Plant Sprayer', price: 450, category: 6, image: '/api/placeholder/300/300', stock: 35, description: 'Mist sprayer for plants' },
  { id: 36, name: 'Garden Hose', price: 1200, category: 6, image: '/api/placeholder/300/300', stock: 15, description: '20 feet garden hose' },
  
  // Soil & Compost
  { id: 37, name: 'Potting Mix', price: 350, category: 7, image: '/api/placeholder/300/300', stock: 45, description: 'Premium potting soil' },
  { id: 38, name: 'Coco Peat', price: 200, category: 7, image: '/api/placeholder/300/300', stock: 60, description: 'Natural growing medium' },
  { id: 39, name: 'Perlite', price: 280, category: 7, image: '/api/placeholder/300/300', stock: 40, description: 'Soil drainage improver' },
  { id: 40, name: 'Garden Soil', price: 180, category: 7, image: '/api/placeholder/300/300', stock: 70, description: 'Rich garden soil mix' },
  { id: 41, name: 'Sand', price: 120, category: 7, image: '/api/placeholder/300/300', stock: 80, description: 'Coarse sand for drainage' },
  { id: 42, name: 'Mulch', price: 250, category: 7, image: '/api/placeholder/300/300', stock: 35, description: 'Organic mulch cover' },
  
  // Plant Care
  { id: 43, name: 'Fungicide Spray', price: 400, category: 8, image: '/api/placeholder/300/300', stock: 30, description: 'Plant disease protection' },
  { id: 44, name: 'Insecticide', price: 350, category: 8, image: '/api/placeholder/300/300', stock: 35, description: 'Pest control solution' },
  { id: 45, name: 'Plant Growth Hormone', price: 500, category: 8, image: '/api/placeholder/300/300', stock: 25, description: 'Root development enhancer' },
  { id: 46, name: 'pH Test Kit', price: 300, category: 8, image: '/api/placeholder/300/300', stock: 40, description: 'Soil pH testing kit' },
  { id: 47, name: 'Plant Support Stakes', price: 200, category: 8, image: '/api/placeholder/300/300', stock: 50, description: 'Bamboo plant supports' },
  { id: 48, name: 'Neem Oil', price: 280, category: 8, image: '/api/placeholder/300/300', stock: 45, description: 'Natural pest deterrent' },
  { id: 49, name: 'Plant Ties', price: 150, category: 8, image: '/api/placeholder/300/300', stock: 60, description: 'Soft plant ties set' },
  { id: 50, name: 'Moisture Meter', price: 600, category: 8, image: '/api/placeholder/300/300', stock: 20, description: 'Soil moisture detector' }
];