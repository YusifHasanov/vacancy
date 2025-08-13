import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VacancyItem, VacancyFilterRequest, Pageable } from './vacancyApi';

interface VacancyState {
  vacancies: VacancyItem[];
  selectedVacancy: VacancyItem | null;
  currentFilter: VacancyFilterRequest;
  pagination: Pageable;
  totalVacancies: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: VacancyState = {
  vacancies: [],
  selectedVacancy: null,
  currentFilter: {},
  pagination: {
    page: 0,
    size: 10,
  },
  totalVacancies: 0,
  totalPages: 0,
  loading: false,
  error: null
};

export const vacancySlice = createSlice({
  name: 'vacancy',
  initialState,
  reducers: {
    setVacancies: (state, action: PayloadAction<VacancyItem[]>) => {
      state.vacancies = action.payload;
      state.error = null;
    },
    
    setSelectedVacancy: (state, action: PayloadAction<VacancyItem | null>) => {
      state.selectedVacancy = action.payload;
    },
    
    updateVacancyInList: (state, action: PayloadAction<VacancyItem>) => {
      const index = state.vacancies.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vacancies[index] = action.payload;
      }
    },
    
    removeVacancyFromList: (state, action: PayloadAction<string>) => {
      state.vacancies = state.vacancies.filter(v => v.id !== action.payload);
      if (state.selectedVacancy && state.selectedVacancy.id === action.payload) {
        state.selectedVacancy = null;
      }
    },
    
    setFilter: (state, action: PayloadAction<VacancyFilterRequest>) => {
      state.currentFilter = action.payload;
    },
    
    setPagination: (state, action: PayloadAction<Pageable>) => {
      state.pagination = action.payload;
    },
    
    setPaginationMetadata: (state, action: PayloadAction<{ total: number, pages: number }>) => {
      state.totalVacancies = action.payload.total;
      state.totalPages = action.payload.pages;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    resetState: (state) => {
      return initialState;
    }
  }
});

export const {
  setVacancies,
  setSelectedVacancy,
  updateVacancyInList,
  removeVacancyFromList,
  setFilter,
  setPagination,
  setPaginationMetadata,
  setLoading,
  setError,
  resetState
} = vacancySlice.actions;

export default vacancySlice.reducer; 