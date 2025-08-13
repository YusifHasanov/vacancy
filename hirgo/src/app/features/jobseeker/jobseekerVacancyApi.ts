import { api } from "@/app/services/api";

// Define the API response structures based on the documentation
export interface VacancyDescription {
  responsibilities: string[];
  education: string[];
  experience: string[];
  requiredSkills: string[];
  preferredSkills: string[];
}

export interface VacancyData {
  id: string;
  title: string;
  companyName?: string;
  company_name?: string;
  companyLogo?: string;
  company_logo?: string;
  views?: number;
  postedAt?: string;
  posted_at?: string;
  experienceLevel?: string;
  experience_level?: string;
  educationLevel?: string;
  education_level?: string;
  salary?: number;
  applicationDeadline?: string;
  application_deadline?: string;
  categoryName?: string;
  category_name?: string;
  languageSkills?: string[];
  language_skills?: string[];
  description?: VacancyDescription;
  responsibilities?: string[];
  education?: string[];
  experience?: string[];
  requiredSkills?: string[];
  required_skills?: string[];
  preferredSkills?: string[];
  preferred_skills?: string[];
}

export interface JobSeekerVacancyDetailsResponse {
  id?: string;
  title?: string;
  companyName?: string;
  company_name?: string;
  companyLogo?: string;
  company_logo?: string;
  views?: number;
  postedAt?: string;
  posted_at?: string;
  experienceLevel?: string;
  experience_level?: string;
  educationLevel?: string;
  education_level?: string;
  salary?: number;
  applicationDeadline?: string;
  application_deadline?: string;
  categoryName?: string;
  category_name?: string;
  languageSkills?: string[];
  language_skills?: string[];
  description?: VacancyDescription;
  responsibilities?: string[];
  education?: string[];
  experience?: string[];
  requiredSkills?: string[];
  required_skills?: string[];
  preferredSkills?: string[];
  preferred_skills?: string[];
  data?: VacancyData;
  status?: {
    code: string;
    message: string;
  };
}

export interface JobSeekerVacancyTableItem {
  id: string;
  title: string;
  company_name: string;
  company_logo: string;
  posted_at: string;
  views: number;
  is_new: boolean;
}

export interface PageInfo {
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginatedResponse<T> {
  content?: T[];
  data?: T[];
  pageable?: PageInfo;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
  };
  status?: {
    code: string;
    message: string;
  };
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  numberOfElements?: number;
  first?: boolean;
  size?: number;
  number?: number;
  sort?: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty?: boolean;
}

// Define the filter request structure
export interface JobSeekerVacancyFilterRequest {
  locationTypeId?: number;
  categoryId?: number;
  employmentTypeId?: number;
  workScheduleId?: number;
  minSalary?: number;
  maxSalary?: number;
  postedTime?: 'NEW' | 'LAST_WEEK' | 'LAST_MONTH';
}

// Extend the API with jobseeker vacancy endpoints
export const jobseekerVacancyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get vacancy details - GET /api/v1/jobseeker/vacancies/{id}
    getJobSeekerVacancyById: builder.query<JobSeekerVacancyDetailsResponse, string>({
      query: (id) => ({
        url: `v1/jobseeker/vacancies/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        console.log("Raw vacancy details response:", response);
        // Support both formats - data inside response or direct data
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error(`[jobseekerVacancyApi] Error fetching vacancy ${arg}:`, response);
        return response;
      }
    }),

    // Get all vacancies - GET /api/v1/jobseeker/vacancies
    getAllJobSeekerVacancies: builder.query<PaginatedResponse<JobSeekerVacancyTableItem>, { 
      page?: number; 
      size?: number; 
      sort?: string;
    }>({
      query: (params = { page: 0, size: 20 }) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append("page", params.page.toString());
        if (params.size !== undefined) queryParams.append("size", params.size.toString());
        if (params.sort) queryParams.append("sort", params.sort);
        
        return {
          url: `v1/jobseeker/vacancies?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformErrorResponse: (response) => {
        console.error("[jobseekerVacancyApi] Error fetching all vacancies:", response);
        return response;
      }
    }),

    // Filter vacancies - POST /api/v1/jobseeker/vacancies/filter
    filterJobSeekerVacancies: builder.mutation<PaginatedResponse<JobSeekerVacancyTableItem>, {
      filter: JobSeekerVacancyFilterRequest;
      page?: number;
      size?: number;
      sort?: string;
    }>({
      query: ({ filter, page = 0, size = 20, sort }) => {
        console.log("Filter request:", { filter, page, size, sort });
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("size", size.toString());
        if (sort) queryParams.append("sort", sort);
        
        const url = `v1/jobseeker/vacancies/filter?${queryParams.toString()}`;
        console.log("Making API call to URL:", url);
        
        return {
          url,
          method: "POST",
          body: filter
        };
      },
      transformResponse: (response: any, meta: any) => {
        console.log("Raw API response:", response);
        
        // Safely access headers if they exist
        if (meta && meta.response) {
          console.log("Response headers:", meta.response.headers);
          console.log("Full response object:", meta.response);
        }
        
        // Handle new API format with data, pagination and status properties
        if (response && response.data && Array.isArray(response.data) && response.pagination) {
          console.log("Response has new format with data and pagination");
          return {
            content: response.data,
            totalPages: response.pagination.totalPages || 0,
            totalElements: response.pagination.totalElements || 0,
            number: (response.pagination.page || 1) - 1, // Convert 1-based to 0-based
            size: response.pagination.size || 10
          };
        }
        
        // If we don't have a standard response format, create one
        if (!response.content && Array.isArray(response)) {
          console.log("Response is an array, adapting to expected format");
          return {
            content: response,
            totalPages: 1,
            totalElements: response.length,
            number: 0,
            size: response.length
          };
        }
        
        // If response is empty but valid, ensure it has the expected structure
        if (response && typeof response === 'object' && !response.content) {
          console.log("Response has no content property, adding empty array");
          return {
            ...response,
            content: [],
            totalPages: response.totalPages || 0,
            totalElements: response.totalElements || 0,
            number: response.number || 0,
            size: response.size || 0
          };
        }
        
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("[jobseekerVacancyApi] Error filtering vacancies:", response);
        return response;
      }
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useGetJobSeekerVacancyByIdQuery,
  useGetAllJobSeekerVacanciesQuery,
  useFilterJobSeekerVacanciesMutation
} = jobseekerVacancyApi; 