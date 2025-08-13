import { api } from "@/app/services/api";

// Define the response status structure
export interface ApiResponseStatus {
  code: string;
  message: string;
}

// Define types based on OpenAPI specification
export interface CategoryItem {
  id: string;
  name: CategoryName;
}

export interface CategoryResponse {
  data: CategoryItem;
  status: ApiResponseStatus;
}

export interface CategoryListResponse {
  data: {
    categories: CategoryItem[];
  };
  status: ApiResponseStatus;
}

// Available category names from the OpenAPI spec
export type CategoryName = 
  | 'IT'
  | 'MARKETING'
  | 'EDUCATION'
  | 'FINANCE'
  | 'HEALTHCARE'
  | 'ENGINEERING'
  | 'SALES_AND_MARKETING'
  | 'DESIGN_AND_CREATIVITY'
  | 'LAW'
  | 'TOURISM_AND_HOSPITALITY'
  | 'ADMINISTRATIVE_JOBS'
  | 'CONSTRUCTION_AND_ARCHITECTURE'
  | 'TRANSPORT_AND_LOGISTICS'
  | 'CUSTOMER_SERVICE'
  | 'MEDIA_AND_COMMUNICATION';

// Extend the API with category endpoints
export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getAllCategories: builder.query<CategoryListResponse, void>({
      query: () => ({
        url: 'v1/categories',
        method: 'GET',
      }),
    }),

    // Get category by ID
    getCategoryById: builder.query<CategoryResponse, number>({
      query: (id) => ({
        url: `v1/categories/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetAllCategoriesQuery, 
  useGetCategoryByIdQuery,
  useLazyGetAllCategoriesQuery,
  useLazyGetCategoryByIdQuery
} = categoryApi; 