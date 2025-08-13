import { api } from "@/app/services/api";

// Define the response status structure
export interface ApiResponseStatus {
  code: string;
  message: string;
}

// Define types based on OpenAPI specification
export interface LookupItem {
  id: number;
  name: string;
  type: LookupType;
}

export interface LookupResponse {
  data: LookupItem;
  status: ApiResponseStatus;
}

export interface LookupListResponse {
  data: LookupItem[];
  status: ApiResponseStatus;
}

// Available lookup types from the OpenAPI spec
export type LookupType = 
  | 'EducationLevel'
  | 'EmploymentType'
  | 'ExperienceLevel'
  | 'LanguageSkills'
  | 'Location'
  | 'WorkSchedule';

// Extend the API with lookup endpoints
export const lookupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get lookup by ID
    getLookupById: builder.query<LookupResponse, { id: number; type?: LookupType }>({
      query: ({ id, type }) => {
        const params = new URLSearchParams();
        params.append('id', id.toString());
        if (type) {
          params.append('type', type);
        }
        return {
          url: `v1/lookups?${params.toString()}`,
          method: 'GET',
        };
      },
    }),

    // Get all lookups of a specific type
    getLookupsByType: builder.query<LookupListResponse, LookupType>({
      query: (type) => ({
        url: `v1/lookups/all?type=${type}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetLookupByIdQuery,
  useGetLookupsByTypeQuery,
  useLazyGetLookupByIdQuery,
  useLazyGetLookupsByTypeQuery
} = lookupApi; 