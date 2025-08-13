import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LookupItem, LookupType } from './lookupApi';

interface LookupState {
  selectedLookups: Record<LookupType, LookupItem[]>;
  initialized: boolean;
}

const initialState: LookupState = {
  selectedLookups: {
    EducationLevel: [],
    EmploymentType: [],
    ExperienceLevel: [],
    LanguageSkills: [],
    Location: [],
    WorkSchedule: []
  },
  initialized: false
};

export const lookupSlice = createSlice({
  name: 'lookup',
  initialState,
  reducers: {
    setLookups: (state, action: PayloadAction<{ type: LookupType, lookups: LookupItem[] }>) => {
      state.selectedLookups[action.payload.type] = action.payload.lookups;
    },
    addLookup: (state, action: PayloadAction<{ type: LookupType, lookup: LookupItem }>) => {
      if (!state.selectedLookups[action.payload.type].some(l => l.id === action.payload.lookup.id)) {
        state.selectedLookups[action.payload.type].push(action.payload.lookup);
      }
    },
    removeLookup: (state, action: PayloadAction<{ type: LookupType, id: number }>) => {
      state.selectedLookups[action.payload.type] = state.selectedLookups[action.payload.type]
        .filter(lookup => lookup.id !== action.payload.id);
    },
    clearLookups: (state, action: PayloadAction<LookupType | undefined>) => {
      if (action.payload) {
        state.selectedLookups[action.payload] = [];
      } else {
        // Reset all lookups
        Object.keys(state.selectedLookups).forEach(key => {
          state.selectedLookups[key as LookupType] = [];
        });
      }
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    }
  }
});

export const { 
  setLookups, 
  addLookup, 
  removeLookup, 
  clearLookups, 
  setInitialized 
} = lookupSlice.actions;

export default lookupSlice.reducer; 