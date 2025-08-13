import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { 
  useGetJobSeekerVacancyByIdQuery,
  useGetAllJobSeekerVacanciesQuery,
  useFilterJobSeekerVacanciesMutation,
  JobSeekerVacancyFilterRequest,
  JobSeekerVacancyTableItem
} from './jobseekerVacancyApi';
import { 
  setVacancies,
  setSelectedVacancy,
  clearSelectedVacancy,
  setLoading,
  setError,
  setPagination,
  setCurrentPage,
  setPageSize,
  setFilter
} from './jobseekerVacancySlice';
import { Job } from '@/types/job';

// Adapter to transform API response to Job type for compatibility
const transformToJob = (vacancy: JobSeekerVacancyTableItem): Job => {
  console.log("Transforming vacancy:", vacancy);
  
  if (!vacancy || typeof vacancy !== 'object') {
    console.error("Invalid vacancy object:", vacancy);
    return createDefaultJob("invalid-id");
  }
  
  try {
    return {
      id: vacancy.id || "unknown-id",
      title: vacancy.title || "Untitled Job",
      companyName: vacancy.company_name || "Unknown Company",
      companyLogo: vacancy.company_logo || '/placeholder.svg',
      views: typeof vacancy.views === 'number' ? vacancy.views : 0,
      postedAt: vacancy.posted_at ? new Date(vacancy.posted_at) : new Date(),
      isFavorite: false, // Default value, would need to come from user preferences
      grade: '', // Not available in the API response
      type: '', // Not available in the API response
      salary: '', // Not available in the API response
      location: '', // Not available in the API response
      postingType: '', // Not available in the API response
      description: {
        duties: [],
        education: [],
        experience: [],
        requiredSkills: [],
        preferredSkills: []
      },
      applicationDeadline: new Date(), // Not available in list response
      category: '', // Not available in list response
      schedule: '' // Not available in list response
    };
  } catch (error) {
    console.error("Error transforming vacancy:", error, vacancy);
    return createDefaultJob(vacancy.id || "error-id", vacancy.title);
  }
};

// Helper function to create a default job object
const createDefaultJob = (id: string, title = "Error loading job"): Job => {
  return {
    id,
    title,
    companyName: "Unknown company",
    companyLogo: '/placeholder.svg',
    views: 0,
    postedAt: new Date(),
    isFavorite: false,
    grade: '',
    type: '',
    salary: '',
    location: '',
    postingType: '',
    description: {
      duties: [],
      education: [],
      experience: [],
      requiredSkills: [],
      preferredSkills: []
    },
    applicationDeadline: new Date(),
    category: '',
    schedule: ''
  };
};

// Adapter for vacancy details
const transformVacancyDetails = (vacancy: any): Job => {
  return {
    id: vacancy.id,
    title: vacancy.title,
    companyName: vacancy.company_name,
    companyLogo: '/placeholder.svg', // Not included in detail response
    views: 0, // Not included in detail response
    postedAt: new Date(vacancy.posted_at),
    isFavorite: false,
    grade: vacancy.experience_level,
    type: '', // Not directly mapped
    salary: vacancy.salary?.toString() || '',
    location: '', // Not directly mapped
    postingType: '',
    description: {
      duties: vacancy.responsibilities || [],
      education: vacancy.education || [],
      experience: vacancy.experience || [],
      requiredSkills: vacancy.required_skills || [],
      preferredSkills: vacancy.preferred_skills || []
    },
    applicationDeadline: new Date(vacancy.application_deadline),
    category: vacancy.category_name,
    schedule: ''
  };
};

// Hook for working with all vacancies using the filter endpoint
export const useJobSeekerVacancies = (initialPage = 0, initialSize = 20) => {
  const dispatch = useDispatch();
  const { vacancies, loading, error, currentPage, pageSize, totalPages, totalItems, filter } = 
    useSelector((state: RootState) => state.jobseekerVacancy);
  
  // State for filter and pagination params
  const [queryParams, setQueryParams] = useState({ 
    page: initialPage, 
    size: initialSize, 
    sort: 'posted_at,desc' 
  });
  
  // Use filterVacancies mutation for all operations
  const [filterVacancies, { isLoading: isFiltering }] = useFilterJobSeekerVacanciesMutation();
  
  // Set the initial loading state
  useEffect(() => {
    dispatch(setLoading(isFiltering));
  }, [isFiltering, dispatch]);
  
  // Fetch data on initial load and when params change
  useEffect(() => {
    // Load initial data with empty filter
    const loadInitialData = async () => {
      try {
        const result = await filterVacancies({
          filter: filter || {},
          page: queryParams.page,
          size: queryParams.size,
          sort: queryParams.sort
        }).unwrap();
        
        console.log("API response structure:", {
          hasContent: !!result.content,
          isContentArray: Array.isArray(result.content),
          isResultArray: Array.isArray(result),
          resultType: typeof result
        });
        
        // Determine what type of data we have
        let content: any[] = [];
        
        if (Array.isArray(result.content)) {
          // Standard paginated response with content array
          content = result.content;
          console.log("Using standard content array, length:", content.length);
        } else if (result.data && Array.isArray(result.data)) {
          // New API format with data array
          content = result.data;
          console.log("Using data array from new API format, length:", content.length);
        } else if (Array.isArray(result)) {
          // Direct array response
          content = result;
          console.log("Using direct array response, length:", content.length);
        } else if (result.content === null || (result.empty === true)) {
          // Empty response from Spring
          content = [];
          console.log("Empty response from API");
        } else {
          // Unknown format, try to extract data or use empty array
          content = [];
          console.log("Unknown response format, using empty array");
        }
        
        // Store the raw data directly in Redux
        dispatch(setVacancies(content));
        
        // Handle pagination info
        let paginationInfo = {
          totalPages: 0,
          totalItems: 0,
          currentPage: 0,
          pageSize: queryParams.size
        };
        
        // Handle different pagination formats
        if (result.pagination) {
          // New API format
          paginationInfo.totalPages = result.pagination.totalPages || 0;
          paginationInfo.totalItems = result.pagination.totalElements || 0;
          paginationInfo.currentPage = result.pagination.page ? result.pagination.page - 1 : 0; // Convert from 1-based to 0-based
          paginationInfo.pageSize = result.pagination.size || queryParams.size;
        } else if (result.totalPages !== undefined) {
          // Old Spring Boot format
          paginationInfo.totalPages = result.totalPages;
          paginationInfo.totalItems = result.totalElements || 0;
          paginationInfo.currentPage = result.number || 0;
          paginationInfo.pageSize = result.size || queryParams.size;
        } else if (Array.isArray(result)) {
          // If direct array, we just have one page
          paginationInfo.totalPages = content.length > 0 ? 1 : 0;
          paginationInfo.totalItems = content.length;
        }
        
        dispatch(setPagination(paginationInfo));
      } catch (err: any) {
        console.error("Error loading initial vacancies:", err);
        dispatch(setError(err.data?.message || 'Failed to load vacancies'));
      }
    };
    
    loadInitialData();
  }, [queryParams.page, queryParams.size, queryParams.sort, dispatch, filterVacancies, filter]);
  
  // Function to change page
  const changePage = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
    setQueryParams(prev => ({ ...prev, page }));
  }, [dispatch]);
  
  // Function to change page size
  const changePageSize = useCallback((size: number) => {
    dispatch(setPageSize(size));
    setQueryParams(prev => ({ ...prev, size }));
  }, [dispatch]);
  
  // Function to apply filters
  const applyFilter = useCallback(async (filterData: JobSeekerVacancyFilterRequest) => {
    try {
      dispatch(setFilter(filterData));
      dispatch(setLoading(true));
      
      const result = await filterVacancies({
        filter: filterData,
        page: currentPage,
        size: pageSize,
        sort: queryParams.sort
      }).unwrap();
      
      console.log("Filter result structure:", {
        hasContent: !!result.content,
        hasData: !!result.data,
        isContentArray: Array.isArray(result.content),
        isDataArray: Array.isArray(result.data),
        isResultArray: Array.isArray(result),
        resultType: typeof result
      });
      
      // Determine what type of data we have
      let content: any[] = [];
      
      if (Array.isArray(result.content)) {
        // Standard paginated response with content array
        content = result.content;
        console.log("Using standard content array, length:", content.length);
      } else if (result.data && Array.isArray(result.data)) {
        // New API format with data array
        content = result.data;
        console.log("Using data array from new API format, length:", content.length);
      } else if (Array.isArray(result)) {
        // Direct array response
        content = result;
        console.log("Using direct array response, length:", content.length);
      } else if (result.content === null || (result.empty === true)) {
        // Empty response from Spring
        content = [];
        console.log("Empty response from API");
      } else {
        // Unknown format, try to extract data or use empty array
        content = [];
        console.log("Unknown response format, using empty array");
      }
      
      // Store the raw data directly in Redux
      dispatch(setVacancies(content));
      
      // Handle pagination info
      let paginationInfo = {
        totalPages: 0,
        totalItems: 0,
        currentPage: 0,
        pageSize: pageSize
      };
      
      // Handle different pagination formats
      if (result.pagination) {
        // New API format
        paginationInfo.totalPages = result.pagination.totalPages || 0;
        paginationInfo.totalItems = result.pagination.totalElements || 0;
        paginationInfo.currentPage = result.pagination.page ? result.pagination.page - 1 : 0;
        paginationInfo.pageSize = result.pagination.size || pageSize;
      } else if (result.totalPages !== undefined) {
        // Old Spring Boot format
        paginationInfo.totalPages = result.totalPages;
        paginationInfo.totalItems = result.totalElements || 0;
        paginationInfo.currentPage = result.number || 0;
        paginationInfo.pageSize = result.size || pageSize;
      } else if (Array.isArray(result)) {
        // If direct array, we just have one page
        paginationInfo.totalPages = content.length > 0 ? 1 : 0;
        paginationInfo.totalItems = content.length;
      }
      
      dispatch(setPagination(paginationInfo));
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to filter vacancies';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filterVacancies, currentPage, pageSize, queryParams.sort]);
  
  // Function to refresh data
  const refetch = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      const result = await filterVacancies({
        filter: filter || {},
        page: currentPage,
        size: pageSize,
        sort: queryParams.sort
      }).unwrap();
      
      console.log("Refetch result structure:", {
        hasContent: !!result.content,
        hasData: !!result.data,
        isContentArray: Array.isArray(result.content),
        isDataArray: Array.isArray(result.data),
        isResultArray: Array.isArray(result),
        resultType: typeof result
      });
      
      // Determine what type of data we have
      let content: any[] = [];
      
      if (Array.isArray(result.content)) {
        // Standard paginated response with content array
        content = result.content;
      } else if (result.data && Array.isArray(result.data)) {
        // New API format with data array
        content = result.data;
      } else if (Array.isArray(result)) {
        // Direct array response
        content = result;
      } else {
        // Empty or unknown format
        content = [];
      }
      
      // Store the raw data
      dispatch(setVacancies(content));
      
      // Handle pagination info
      let paginationInfo = {
        totalPages: 0,
        totalItems: 0,
        currentPage: 0,
        pageSize: pageSize
      };
      
      // Handle different pagination formats
      if (result.pagination) {
        // New API format
        paginationInfo.totalPages = result.pagination.totalPages || 0;
        paginationInfo.totalItems = result.pagination.totalElements || 0;
        paginationInfo.currentPage = result.pagination.page ? result.pagination.page - 1 : 0;
        paginationInfo.pageSize = result.pagination.size || pageSize;
      } else if (result.totalPages !== undefined) {
        // Old Spring Boot format
        paginationInfo.totalPages = result.totalPages;
        paginationInfo.totalItems = result.totalElements || 0;
        paginationInfo.currentPage = result.number || 0;
        paginationInfo.pageSize = result.size || pageSize;
      } else if (Array.isArray(result)) {
        // If direct array, we just have one page
        paginationInfo.totalPages = content.length > 0 ? 1 : 0;
        paginationInfo.totalItems = content.length;
      }
      
      dispatch(setPagination(paginationInfo));
      
      return result;
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to refresh vacancies';
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentPage, dispatch, filter, filterVacancies, pageSize, queryParams.sort]);
  
  // For now, just return the raw vacancies array directly to avoid transformation issues
  const returnVacancies = Array.isArray(vacancies) ? vacancies : [];
  
  console.log("Returning vacancies directly:", {
    count: returnVacancies.length,
    sample: returnVacancies.length > 0 ? returnVacancies[0] : null
  });
  
  return {
    vacancies: returnVacancies,
    loading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    filter,
    changePage,
    changePageSize,
    applyFilter,
    refetch
  };
};

// Hook for working with a single vacancy
export const useJobSeekerVacancy = (id?: string) => {
  const dispatch = useDispatch();
  const { selectedVacancy } = useSelector((state: RootState) => state.jobseekerVacancy);
  
  // Query for vacancy details
  const { data: apiResponse, isLoading, error, refetch } = useGetJobSeekerVacancyByIdQuery(id || '', { 
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  
  // Update state when data changes
  useEffect(() => {
    if (apiResponse) {
      console.log("Raw vacancy detail response:", apiResponse);
      
      // Handle both formats - direct and nested in data property
      const vacancyData = apiResponse.data ? apiResponse.data : apiResponse;
      console.log("Using vacancy data:", vacancyData);
      
      dispatch(setSelectedVacancy(vacancyData));
    }
    return () => {
      // Clear selected vacancy when unmounting
      dispatch(clearSelectedVacancy());
    };
  }, [apiResponse, dispatch]);
  
  // Transform the API response to Job type for compatibility
  let transformedVacancy = null;
  
  if (selectedVacancy && Object.keys(selectedVacancy).length > 0) {
    try {
      console.log("Transforming vacancy with structure:", Object.keys(selectedVacancy));
      
      // Create a compatible job object from the API data
      transformedVacancy = {
        id: selectedVacancy.id || "unknown-id",
        title: selectedVacancy.title || "Untitled Job",
        companyName: selectedVacancy.companyName || selectedVacancy.company_name || "Unknown Company",
        companyLogo: selectedVacancy.companyLogo || selectedVacancy.company_logo || '/placeholder.svg',
        views: typeof selectedVacancy.views === 'number' ? selectedVacancy.views : 0,
        postedAt: new Date(selectedVacancy.postedAt || selectedVacancy.posted_at || Date.now()),
        isFavorite: false,
        grade: selectedVacancy.experienceLevel || selectedVacancy.experience_level || '',
        type: '',
        salary: (selectedVacancy.salary || '').toString(),
        location: '',
        postingType: '',
        description: {
          duties: selectedVacancy.description?.responsibilities || 
                 selectedVacancy.responsibilities || [],
          education: selectedVacancy.description?.education || 
                    selectedVacancy.education || [],
          experience: selectedVacancy.description?.experience || 
                     selectedVacancy.experience || [],
          requiredSkills: selectedVacancy.description?.requiredSkills || 
                         selectedVacancy.required_skills || [],
          preferredSkills: selectedVacancy.description?.preferredSkills || 
                          selectedVacancy.preferred_skills || []
        },
        applicationDeadline: new Date(selectedVacancy.applicationDeadline || 
                                    selectedVacancy.application_deadline || Date.now()),
        category: selectedVacancy.categoryName || selectedVacancy.category_name || '',
        schedule: ''
      };
      
      console.log("Transformed vacancy:", transformedVacancy);
    } catch (error) {
      console.error("Error transforming vacancy details:", error);
      transformedVacancy = null;
    }
  }
  
  return {
    vacancy: transformedVacancy,
    loading: isLoading,
    error,
    refetch
  };
}; 