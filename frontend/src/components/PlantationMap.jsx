import React, { useState, useEffect } from 'react';

const PlantationMap = () => {
  const [userPlantations, setUserPlantations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  
  // Sample plantation data - replace with real data from your backend
  const [plantations] = useState([
    {
      id: 1,
      name: "Margalla Hills Reforestation",
      location: { lat: 33.7294, lng: 73.0931, city: "Islamabad" },
      treesPlanted: 1500,
      species: ["Pine", "Oak", "Wild Olive"],
      dateInited: "2024-03-15",
      status: "growing",
      image: "🌲"
    },
    {
      id: 2,
      name: "Lahore Green Belt",
      location: { lat: 31.5204, lng: 74.3587, city: "Lahore" },
      treesPlanted: 2300,
      species: ["Neem", "Sheesham", "Jamun"],
      dateInited: "2024-02-20",
      status: "mature",
      image: "🌳"
    },
    {
      id: 3,
      name: "Karachi Coastal Forest",
      location: { lat: 24.8607, lng: 67.0011, city: "Karachi" },
      treesPlanted: 800,
      species: ["Mangroves", "Coconut Palm"],
      dateInited: "2024-04-01",
      status: "growing",
      image: "🌴"
    },
    {
      id: 4,
      name: "Peshawar Urban Forest",
      location: { lat: 34.0151, lng: 71.5249, city: "Peshawar" },
      treesPlanted: 650,
      species: ["Chinar", "Deodar"],
      dateInited: "2024-01-10",
      status: "growing",
      image: "🌲"
    },
    {
      id: 5,
      name: "Quetta Highland Forest",
      location: { lat: 30.1798, lng: 66.9750, city: "Quetta" },
      treesPlanted: 420,
      species: ["Juniper", "Wild Almond"],
      dateInited: "2024-03-25",
      status: "growing",
      image: "🌲"
    }
  ]);

  const [newPlantation, setNewPlantation] = useState({
    name: '',
    city: '',
    treesPlanted: '',
    species: '',
    dateInited: new Date().toISOString().split('T')[0]
  });

  const totalTreesPlanted = plantations.reduce((acc, p) => acc + p.treesPlanted, 0) + 
    userPlantations.reduce((acc, p) => acc + p.treesPlanted, 0);

  const handleAddPlantation = (e) => {
    e.preventDefault();
    if (newPlantation.name && newPlantation.city && newPlantation.treesPlanted) {
      const plantation = {
        id: Date.now(),
        name: newPlantation.name,
        location: { city: newPlantation.city },
        treesPlanted: parseInt(newPlantation.treesPlanted),
        species: newPlantation.species.split(',').map(s => s.trim()),
        dateInited: newPlantation.dateInited,
        status: "growing",
        image: "🌱",
        isUserAdded: true
      };
      
      setUserPlantations([...userPlantations, plantation]);
      setNewPlantation({
        name: '',
        city: '',
        treesPlanted: '',
        species: '',
        dateInited: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
      
      // Success message
      alert(`🌱 Successfully added ${plantation.treesPlanted} trees to ${plantation.name}!`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'growing': return 'bg-green-100 text-green-700 border-green-200';
      case 'mature': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'planted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const allPlantations = [...plantations, ...userPlantations];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-500 text-white p-3 rounded-full mr-4">
            <span className="text-2xl">🗺️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Pakistan Plantation Map
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Track plantation progress across Pakistan and contribute to the Green Pakistan initiative
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="text-2xl font-bold text-green-600">{totalTreesPlanted.toLocaleString()}</div>
            <div className="text-gray-600">Total Trees Planted</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">{allPlantations.length}</div>
            <div className="text-gray-600">Active Plantation Sites</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-teal-100">
            <div className="text-2xl font-bold text-teal-600">{userPlantations.length}</div>
            <div className="text-gray-600">Your Contributions</div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="flex flex-wrap justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setMapView('satellite')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mapView === 'satellite' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setMapView('terrain')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mapView === 'terrain' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏔️ Terrain
          </button>
          <button
            onClick={() => setMapView('roadmap')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mapView === 'roadmap' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🗺️ Roadmap
          </button>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center"
        >
          <span className="mr-2">🌱</span>
          Add Your Plantation
        </button>
      </div>

      {/* Interactive Map Area */}
      <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-2xl border-2 border-green-200 overflow-hidden">
        {/* Map Header */}
        <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-green-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🌍</span>
            Pakistan Plantation Sites ({mapView} view)
          </h3>
        </div>
        
        {/* Map Content */}
        <div className="relative h-96 p-6">
          {/* Map Background */}
          <div className="absolute inset-6 bg-gradient-to-br from-green-200 to-emerald-300 rounded-xl opacity-30"></div>
          
          {/* Plantation Markers */}
          <div className="relative h-full">
            {allPlantations.map((plantation, index) => (
              <div
                key={plantation.id}
                className={`absolute cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                  index % 5 === 0 ? 'top-1/4 left-1/4' :
                  index % 5 === 1 ? 'top-1/3 right-1/4' :
                  index % 5 === 2 ? 'bottom-1/3 left-1/3' :
                  index % 5 === 3 ? 'top-1/2 left-1/2' :
                  'bottom-1/4 right-1/3'
                }`}
                onClick={() => setSelectedLocation(plantation)}
                title={plantation.name}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 ${
                    plantation.isUserAdded 
                      ? 'bg-yellow-400 border-yellow-500' 
                      : 'bg-green-400 border-green-500'
                  }`}>
                    {plantation.image}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                    {plantation.location.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Map Legend */}
        <div className="bg-white/90 backdrop-blur-sm p-4 border-t border-green-200">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-400 border-2 border-green-500 rounded-full mr-2"></div>
              <span>Government Plantations</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-500 rounded-full mr-2"></div>
              <span>Your Plantations</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🌱</span>
              <span>Growing</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🌳</span>
              <span>Mature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plantation List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPlantations.map((plantation) => (
          <div
            key={plantation.id}
            className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
              selectedLocation?.id === plantation.id 
                ? 'border-green-400 shadow-lg scale-105' 
                : 'border-gray-200 hover:border-green-300'
            } ${plantation.isUserAdded ? 'bg-gradient-to-br from-yellow-50 to-amber-50' : ''}`}
            onClick={() => setSelectedLocation(plantation)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{plantation.image}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{plantation.name}</h3>
                    <p className="text-gray-600 text-sm">{plantation.location.city}</p>
                  </div>
                </div>
                {plantation.isUserAdded && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded-full font-medium">
                    Your Plant
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trees Planted:</span>
                  <span className="font-semibold text-green-600">{plantation.treesPlanted.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getStatusColor(plantation.status)}`}>
                    {plantation.status}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">Species:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plantation.species.map((species, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                        {species}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Planted: {new Date(plantation.dateInited).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plantation Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🌱</span>
                Add Your Plantation
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plantation Name
                </label>
                <input
                  type="text"
                  value={newPlantation.name}
                  onChange={(e) => setNewPlantation({...newPlantation, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., My Backyard Forest"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={newPlantation.city}
                  onChange={(e) => setNewPlantation({...newPlantation, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select City</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Gilgit">Gilgit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Trees Planted
                </label>
                <input
                  type="number"
                  value={newPlantation.treesPlanted}
                  onChange={(e) => setNewPlantation({...newPlantation, treesPlanted: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 50"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tree Species (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPlantation.species}
                  onChange={(e) => setNewPlantation({...newPlantation, species: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Oak, Pine, Neem"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plantation Date
                </label>
                <input
                  type="date"
                  value={newPlantation.dateInited}
                  onChange={(e) => setNewPlantation({...newPlantation, dateInited: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddPlantation}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Plantation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantationMap;