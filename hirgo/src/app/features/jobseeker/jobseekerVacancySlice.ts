import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobSeekerVacancyDetailsResponse, JobSeekerVacancyTableItem, JobSeekerVacancyFilterRequest } from './jobseekerVacancyApi';

// Define the slice state interface
interface JobSeekerVacancyState {
  vacancies: JobSeekerVacancyTableItem[];
  selectedVacancy: JobSeekerVacancyDetailsResponse | null;
  loading: boolean;
  error: string | null;
  // Pagination related
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  // Filter related
  filter: JobSeekerVacancyFilterRequest;
}

// Initial state
const initialState: JobSeekerVacancyState = {
  vacancies: [],
  selectedVacancy: null,
  loading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,
  currentPage: 0,
  pageSize: 20,
  filter: {}
};

// Create the slice
export const jobseekerVacancySlice = createSlice({
  name: 'jobseekerVacancy',
  initialState,
  reducers: {
    // Set all vacancies
    setVacancies: (state, action: PayloadAction<JobSeekerVacancyTableItem[]>) => {
      state.vacancies = action.payload;
      state.error = null;
    },
    
    // Set selected vacancy
    setSelectedVacancy: (state, action: PayloadAction<JobSeekerVacancyDetailsResponse>) => {
      state.selectedVacancy = action.payload;
      state.error = null;
    },
    
    // Clear selected vacancy
    clearSelectedVacancy: (state) => {
      state.selectedVacancy = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    // Set pagination data
    setPagination: (state, action: PayloadAction<{
      totalPages: number;
      totalItems: number;
      currentPage: number;
      pageSize: number;
    }>) => {
      const { totalPages, totalItems, currentPage, pageSize } = action.payload;
      state.totalPages = totalPages;
      state.totalItems = totalItems;
      state.currentPage = currentPage;
      state.pageSize = pageSize;
    },
    
    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    // Set page size
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    
    // Set filter criteria
    setFilter: (state, action: PayloadAction<JobSeekerVacancyFilterRequest>) => {
      state.filter = action.payload;
    },
    
    // Update filter criteria (partial update)
    updateFilter: (state, action: PayloadAction<Partial<JobSeekerVacancyFilterRequest>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    
    // Clear filter
    clearFilter: (state) => {
      state.filter = {};
    }
  }
});

// Export actions
export const { 
  setVacancies,
  setSelectedVacancy,
  clearSelectedVacancy,
  setLoading,
  setError,
  setPagination,
  setCurrentPage,
  setPageSize,
  setFilter,
  updateFilter,
  clearFilter
} = jobseekerVacancySlice.actions;

// Export reducer
export default jobseekerVacancySlice.reducer; 