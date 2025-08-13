import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { 
  useGetAllVacanciesQuery, 
  useGetVacancyByIdQuery,
  useGetCompanyVacanciesQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
  useFilterVacanciesMutation,
  CreateVacancyRequest,
  UpdateVacancyRequest,
  VacancyFilterRequest,
  Pageable
} from './vacancyApi';
import { 
  setVacancies, 
  setSelectedVacancy,
  updateVacancyInList,
  removeVacancyFromList,
  setFilter,
  setPagination,
  setPaginationMetadata,
  setLoading,
  setError
} from './vacancySlice';
import { useToast } from '@/hooks/use-toast';

// Hook for working with all vacancies
export const useVacancies = () => {
  const dispatch = useDispatch();
  const { vacancies, loading, error } = useSelector((state: RootState) => state.vacancy);
  const { data, isLoading, refetch } = useGetAllVacanciesQuery();
  
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);
  
  useEffect(() => {
    if (data?.data?.vacancies) {
      dispatch(setVacancies(data.data.vacancies));
    }
  }, [data, dispatch]);
  
  return {
    vacancies,
    loading,
    error,
    refetch
  };
};

// Hook for working with a single vacancy
export const useVacancy = (id?: string) => {
  const dispatch = useDispatch();
  const { selectedVacancy } = useSelector((state: RootState) => state.vacancy);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  
  const { data, isLoading, error, refetch: apiRefetch } = useGetVacancyByIdQuery(id || '', { 
    skip: !id,
    // Prevent automatic refetching on window focus which can cause rendering issues
    refetchOnFocus: false,
    // Ensure refetching occurs on mount
    refetchOnMountOrArgChange: true,
  });
  
  // Debug logging
  useEffect(() => {
    console.log(`[useVacancy] Loading vacancy with id: ${id}, isLoading: ${isLoading}`);
    console.log(`[useVacancy] Data received:`, data?.data ? 'yes' : 'no');
    console.log(`[useVacancy] Has initial fetch:`, hasInitialFetch);
  }, [id, isLoading, data, hasInitialFetch]);
  
  useEffect(() => {
    if (data?.data) {
      console.log(`[useVacancy] Updating vacancy in redux store: ${data.data.id}`);
      dispatch(setSelectedVacancy(data.data));
      setHasInitialFetch(true);
    }
  }, [data, dispatch]);
  
  // Enhanced refetch function
  const refetch = useCallback(() => {
    console.log(`[useVacancy] Force refreshing vacancy with id: ${id}`);
    setHasInitialFetch(false);
    return apiRefetch();
  }, [id, apiRefetch]);
  
  return {
    vacancy: selectedVacancy,
    loading: isLoading,
    error,
    refetch
  };
};

// Hook for creating a vacancy
export const useCreateVacancy = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [createVacancy, { isLoading, error }] = useCreateVacancyMutation();
  
  const create = async (vacancy: CreateVacancyRequest) => {
    try {
      dispatch(setLoading(true));
      const response = await createVacancy(vacancy).unwrap();
      toast({
        title: 'Success',
        description: 'Vacancy created successfully',
      });
      return response.data;
    } catch (err: any) {
      const errorMessage = err.data?.status?.message || 'Failed to create vacancy';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return {
    createVacancy: create,
    isCreating: isLoading,
    error
  };
};

// Hook for updating a vacancy
export const useUpdateVacancy = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [updateVacancy, { isLoading, error }] = useUpdateVacancyMutation();
  
  const update = async (id: string, data: UpdateVacancyRequest) => {
    try {
      dispatch(setLoading(true));
      const response = await updateVacancy({ id, data }).unwrap();
      
      // Update the vacancy in the list if it exists
      if (response.data) {
        dispatch(updateVacancyInList(response.data));
      }
      
      toast({
        title: 'Success',
        description: 'Vacancy updated successfully',
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.data?.status?.message || 'Failed to update vacancy';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return {
    updateVacancy: update,
    isUpdating: isLoading,
    error
  };
};

// Hook for deleting a vacancy
export const useDeleteVacancy = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [deleteVacancy, { isLoading, error }] = useDeleteVacancyMutation();
  
  const remove = async (id: string) => {
    try {
      dispatch(setLoading(true));
      await deleteVacancy(id).unwrap();
      
      // Remove the vacancy from the list
      dispatch(removeVacancyFromList(id));
      
      toast({
        title: 'Success',
        description: 'Vacancy deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err.data?.status?.message || 'Failed to delete vacancy';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return {
    deleteVacancy: remove,
    isDeleting: isLoading,
    error
  };
};

// Hook for filtering vacancies
export const useFilterVacancies = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { currentFilter, pagination, totalVacancies, totalPages, vacancies, loading, error } = 
    useSelector((state: RootState) => state.vacancy);
  const [filterVacancies, { isLoading }] = useFilterVacanciesMutation();
  
  // Add ref to track the last filter request to prevent duplicates
  const lastRequestRef = useRef<{filter: any, page: any} | null>(null);
  
  const filter = async (filterData?: VacancyFilterRequest, pageData?: Pageable) => {
    try {
      const filterToUse = filterData || currentFilter;
      const pageToUse = pageData || pagination;
      
      // Compare with last request to prevent duplicate API calls
      const currentRequest = {
        filter: JSON.stringify(filterToUse),
        page: JSON.stringify(pageToUse)
      };
      
      const lastRequest = lastRequestRef.current ? {
        filter: JSON.stringify(lastRequestRef.current.filter),
        page: JSON.stringify(lastRequestRef.current.page)
      } : null;
      
      // Skip if this is an exact duplicate of the last request
      if (lastRequest && 
          currentRequest.filter === lastRequest.filter && 
          currentRequest.page === lastRequest.page) {
        console.log('[useFilterVacancies] Skipping duplicate filter request');
        return vacancies;
      }
      
      // Save current request as the last request
      lastRequestRef.current = {
        filter: filterToUse,
        page: pageToUse
      };
      
      console.log('[useFilterVacancies] Applying filters:', { 
        filter: JSON.stringify(filterToUse), 
        page: pageToUse.page, 
        size: pageToUse.size 
      });
      
      dispatch(setLoading(true));
      
      if (filterData) {
        dispatch(setFilter(filterData));
      }
      
      if (pageData) {
        dispatch(setPagination(pageData));
      }
      
      console.log('[useFilterVacancies] Sending API request with filter:', JSON.stringify(filterToUse));
      
      const response = await filterVacancies({ 
        filter: filterToUse, 
        pageable: pageToUse 
      }).unwrap();
      
      console.log('[useFilterVacancies] Filter response:', JSON.stringify(response));
      
      if (response) {
        // Check if response has direct data array (new API format)
        if (Array.isArray(response.data)) {
          console.log(`[useFilterVacancies] Got data array with ${response.data.length} vacancies`);
          dispatch(setVacancies(response.data));
          
          // Check if pagination exists
          if (response.pagination) {
            console.log('[useFilterVacancies] Setting pagination from response:', response.pagination);
            dispatch(setPaginationMetadata({ 
              total: response.pagination.totalElements || 0, 
              pages: response.pagination.totalPages || 0 
            }));
          }
          return response.data;
        }
        
        else {
          // Handle empty or unexpected response format
          console.log('[useFilterVacancies] No valid data in response, setting empty array');
          dispatch(setVacancies([]));
          dispatch(setPaginationMetadata({ total: 0, pages: 0 }));
          return [];
        }
      } else {
        console.log('[useFilterVacancies] No response received');
        dispatch(setVacancies([]));
        dispatch(setPaginationMetadata({ total: 0, pages: 0 }));
        return [];
      }
    } catch (err: any) {
      console.error('[useFilterVacancies] Error during filtering:', err);
      const errorMessage = err.data?.status?.message || 'Failed to filter vacancies';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return {
    filter,
    vacancies,
    pagination,
    totalItems: totalVacancies,
    totalPages,
    isLoading: loading || isLoading,
    error,
    currentFilter
  };
};

// Hook for working with company vacancies
export const useCompanyVacancies = () => {
  const dispatch = useDispatch();
  const { vacancies, loading, error } = useSelector((state: RootState) => state.vacancy);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const initialFetchRef = useRef(false);
  
  const { data, isLoading, refetch, isFetching } = useGetCompanyVacanciesQuery(undefined, {
    // Prevent automatic refetching on window focus which can cause rendering issues
    refetchOnFocus: false,
    // Ensure refetching occurs on mount
    refetchOnMountOrArgChange: true,
    // Don't use skip based on vacancies.length as it causes issues
    skip: false,
  });
  
  // Debug the data loading
  useEffect(() => {
    console.log("⚡ Company vacancies data updated:", data?.data?.vacancies?.length || 0);
    console.log("⚡ Loading state:", isLoading);
    console.log("⚡ Fetching state:", isFetching);
    console.log("⚡ Has initial fetch:", hasInitialFetch);
  }, [data, isLoading, isFetching, hasInitialFetch]);
  
  // Set loading state in Redux, but only when actually loading
  useEffect(() => {
    const isActuallyLoading = isLoading || (isFetching && !hasInitialFetch);
    dispatch(setLoading(isActuallyLoading));
  }, [isLoading, isFetching, dispatch, hasInitialFetch]);
  
  // Update vacancies in Redux only when data changes
  useEffect(() => {
    if (data?.data?.vacancies) {
      console.log("⚡ Updating vacancies in Redux:", data.data.vacancies.length);
      dispatch(setVacancies(data.data.vacancies));
      
      if (!initialFetchRef.current) {
        setHasInitialFetch(true);
        initialFetchRef.current = true;
      }
    }
  }, [data, dispatch]);
  
  // Helper to force immediate data fetch
  const forceRefresh = useCallback(() => {
    console.log("⚡ Force refreshing vacancies data");
    return refetch();
  }, [refetch]);
  
  return {
    vacancies,
    loading: loading,
    error,
    refetch: forceRefresh,
    isFetching
  };
}; 