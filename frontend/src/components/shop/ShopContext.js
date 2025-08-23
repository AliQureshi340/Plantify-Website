// ShopContext.js - Global shop state management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { products, categories } from './shopData';

const ShopContext = createContext();

const initialState = {
  products: products || [],
  categories,
  cart: [],
  wishlist: [],
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'name',
  currentPage: 1,
  itemsPerPage: 12,
  loading: false,
  orders: [],
  user: null
};

function shopReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };

    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        currentPage: 1
      };

    case 'SET_SEARCH':
      return {
        ...state,
        searchQuery: action.payload,
        currentPage: 1
      };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload
      };

    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
        cart: []
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  const getFilteredProducts = () => {
    let filtered = state.products;

    // Filter by category
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === parseInt(state.selectedCategory)
      );
    }

    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getPaginatedProducts = () => {
    const filtered = getFilteredProducts();
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filtered = getFilteredProducts();
    return Math.ceil(filtered.length / state.itemsPerPage);
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return state.cart.some(item => item.id === productId);
  };

  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item.id === productId);
  };

  const value = {
    ...state,
    dispatch,
    getFilteredProducts,
    getPaginatedProducts,
    getTotalPages,
    getCartTotal,
    getCartItemCount,
    isInCart,
    isInWishlist
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}