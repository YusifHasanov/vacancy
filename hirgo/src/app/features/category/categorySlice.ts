import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryItem } from './categoryApi';

interface CategoryState {
  categories: CategoryItem[];
  selectedCategory: CategoryItem | null;
  initialized: boolean;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  initialized: false
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryItem[]>) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<CategoryItem | null>) => {
      state.selectedCategory = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.selectedCategory = null;
    }
  }
});

export const { 
  setCategories, 
  setSelectedCategory, 
  setInitialized, 
  clearCategories 
} = categorySlice.actions;

export default categorySlice.reducer; 