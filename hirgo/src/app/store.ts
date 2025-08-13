import { configureStore } from '@reduxjs/toolkit';
import { api } from "@/app/services/api";
import { authSlice } from "@/app/features/auth/authSlice";
import lookupReducer from '@/app/features/lookup/lookupSlice';
import categoryReducer from '@/app/features/category/categorySlice';
import vacancyReducer from './features/vacancy/vacancySlice';
import jobseekerVacancyReducer from './features/jobseeker/jobseekerVacancySlice';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authSlice.reducer,
        lookup: lookupReducer,
        category: categoryReducer,
        vacancy: vacancyReducer,
        jobseekerVacancy: jobseekerVacancyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
