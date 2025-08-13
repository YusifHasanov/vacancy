import { api } from "@/app/services/api";

// Define the response status structure
export interface ApiResponseStatus {
  code: string;
  message: string;
}

// Vacancy description model
export interface VacancyDescription {
  responsibilities: string[];
  education: string[];
  experience: string[];
  requiredSkills: string[];
  preferredSkills: string[];
}

// Vacancy model
export interface VacancyItem {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  postedAt: string;
  experienceLevelId: number;
  locationTypeId: number;
  employmentTypeId: number;
  educationLevelId: number;
  salary: number;
  applicationDeadline: string;
  categoryName: string;
  categoryId: number;
  languageSkillsIds: number[];
  workScheduleId: number;
  description: VacancyDescription;
}

// Response interfaces
export interface VacancyResponse {
  data: VacancyItem;
  status: ApiResponseStatus;
}

export interface VacancyListResponse {
  data: {
    vacancies: VacancyItem[];
  };
  status: ApiResponseStatus;
}

export interface VacancyCreateResponse {
  data: VacancyItem;
  status: ApiResponseStatus;
}

// Request interfaces
export interface CreateVacancyRequest {
  title: string;
  experienceLevelId: number;
  locationTypeId: number;
  employmentTypeId: number;
  educationLevelId: number;
  languageSkillsIds: number[];
  workScheduleId: number;
  salary: number;
  applicationDeadline: string;
  categoryId: number;
  description: VacancyDescription;
}

export interface UpdateVacancyRequest {
  title?: string;
  experienceLevelId?: number;
  employmentTypeId?: number;
  educationLevelId?: number;
  locationTypeId?: number;
  workScheduleId?: number;
  salary?: number;
  applicationDeadline?: string;
  categoryId?: number;
  languageSkillsIds?: number[];
  description?: VacancyDescription;
}

export interface VacancyFilterRequest {
  locationTypeId?: number;
  categoryIds?: number[];
  employmentTypeId?: number;
  workScheduleId?: number;
  minSalary?: number;
  maxSalary?: number;
  postedAfter?: string;
  postedBefore?: string;
  title?: string;
  status?: string[];
}

// Define pagination interface
export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

// Updated response format for the filter endpoint
export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  pagination: PaginationInfo;
  status: ApiResponseStatus;
}

// Keep old format for backward compatibility
export interface PagedResponse<T> {
  data: {
    content: T[];
    page: PageMetadata;
  } | T[];
  pagination?: PaginationInfo;
  status: ApiResponseStatus;
}

// Extend the API with vacancy endpoints
export const vacancyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all vacancies
    getAllVacancies: builder.query<VacancyListResponse, void>({
      query: () => ({
        url: "v1/vacancies",
        method: "GET",
      }),
    }),

    // Get vacancy by ID
    getVacancyById: builder.query<VacancyResponse, string>({
      query: (id) => ({
        url: `v1/vacancies/${id}`,
        method: "GET",
      }),
      // Improve caching behavior
      keepUnusedDataFor: 300, // Keep data for 5 minutes
      // Add transformResponse to handle potential error cases
      transformResponse: (response: VacancyResponse) => {
        // Add some validation to ensure we have a valid response
        if (!response || !response.data) {
          console.error("[vacancyApi] Invalid vacancy response:", response);
          // Return a basic structure to prevent UI errors
          return {
            data: {
              id: "",
              title: "",
              companyName: "",
              companyLogo: "",
              postedAt: "",
              experienceLevelId: 0,
              locationTypeId: 0,
              employmentTypeId: 0,
              educationLevelId: 0,
              salary: 0,
              applicationDeadline: "",
              categoryId: 0,
              categoryName: "",
              languageSkillsIds: [],
              workScheduleId: 0,
              description: {
                responsibilities: [],
                education: [],
                experience: [],
                requiredSkills: [],
                preferredSkills: []
              }
            },
            status: {
              code: "ERROR",
              message: "Failed to load vacancy data"
            }
          };
        }
        return response;
      },
      // Add error handling
      transformErrorResponse: (response, meta, arg) => {
        console.error(`[vacancyApi] Error fetching vacancy ${arg}:`, response);
        return response;
      }
    }),
    
    // Get vacancies for authenticated company
    getCompanyVacancies: builder.query<VacancyListResponse, void>({
      query: () => ({
        url: "v1/vacancies/company",
        method: "GET",
      }),
    }),

    // Create a new vacancy (requires auth)
    createVacancy: builder.mutation<VacancyCreateResponse, CreateVacancyRequest>({
      query: (data) => ({
        url: "v1/vacancies",
        method: "POST",
        body: data,
      }),
    }),

    // Update a vacancy (requires auth)
    updateVacancy: builder.mutation<VacancyResponse, { id: string; data: UpdateVacancyRequest }>({
      query: ({ id, data }) => ({
        url: `v1/vacancies/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete a vacancy (requires auth)
    deleteVacancy: builder.mutation<void, string>({
      query: (id) => ({
        url: `v1/vacancies/${id}`,
        method: "DELETE",
      }),
    }),

    // Filter vacancies
    filterVacancies: builder.mutation<ApiResponse<VacancyItem[]>, { 
      filter: VacancyFilterRequest; 
      pageable: Pageable 
    }>({
      query: ({ filter, pageable }) => {
        // Construct query string for pagination
        const pageParams = new URLSearchParams();
        pageParams.append("page", pageable.page.toString());
        pageParams.append("size", pageable.size.toString());
        
        if (pageable.sort && pageable.sort.length > 0) {
          pageable.sort.forEach(sortParam => {
            pageParams.append("sort", sortParam);
          });
        }
        
        // Deep copy the filter to ensure we don't modify the original
        const requestBody = { ...filter };
        
        console.log(`[vacancyApi] Filtering vacancies with params: ${pageParams.toString()}`, JSON.stringify(requestBody));
        
        return {
          url: `v1/vacancies/filter?${pageParams.toString()}`,
          method: "POST",
          body: requestBody,
        };
      },
      // Add error handling
      transformErrorResponse: (response, meta, arg) => {
        console.error(`[vacancyApi] Error filtering vacancies:`, response);
        return response;
      }
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllVacanciesQuery,
  useGetVacancyByIdQuery,
  useGetCompanyVacanciesQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
  useFilterVacanciesMutation,
  useLazyGetAllVacanciesQuery,
  useLazyGetVacancyByIdQuery,
} = vacancyApi; 