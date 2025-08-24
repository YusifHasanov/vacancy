import { api } from "@/app/services/api";
import Cookies from 'js-cookie';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define response types
interface AuthResponse {
  data?: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    userRole: string;
  };
  status: {
    code: string;
    message: string;
  };
  error?: string;
}

// Company registration request type
interface CompanyRegisterRequest {
  name: string;
  phone: string;
  email: string;
  password: string;
}

// Job seeker registration request type
interface JobSeekerRegisterRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  phone: string;
}

// Login request type
interface LoginRequest {
  email: string;
  password: string;
}

// Create a Redux slice for auth state
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    authStateChanged: false
  },
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      state.authStateChanged = !state.authStateChanged;
    }
  }
});

export const { setAuthenticated } = authSlice.actions;

// Extend the API with auth endpoints
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerCompany: builder.mutation<AuthResponse, CompanyRegisterRequest>({
      query: (credentials) => ({
        url: 'auth/register/company',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => {
        // Store tokens in cookies if registration is successful
        if (response.status.code === 'SUCCESS' && response.data) {
          Cookies.set('token', response.data.accessToken, { expires: 7 });
          Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 });
          Cookies.set('userRole', response.data.userRole, { expires: 30 });
        }
        return response;
      },
    }),
    registerJobSeeker: builder.mutation<AuthResponse, JobSeekerRegisterRequest>({
      query: (credentials) => ({
        url: 'auth/register/applicant',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => {
        // Store tokens in cookies if registration is successful
        if (response.status.code === 'SUCCESS' && response.data) {
          console.log(response.data)
          Cookies.set('token', response.data.accessToken, { expires: 7 });
          Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 });
          Cookies.set('userRole', response.data.userRole, { expires: 30 });
        }
        return response;
      },
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => {
        // Store tokens in cookies if login is successful
        if (response.status.code === 'SUCCESS' && response.data) {
          // console.log(response.data)
          // console.log(response.data.accessToken)
          // console.log(response.data.refreshToken)
          // console.log(response.data.idToken)
          Cookies.set('token', response.data.accessToken, { expires: 7 });
          Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 });
          Cookies.set('userRole', response.data.userRole, { expires: 30 });
        }
        return response;
      },
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => {
        // Get the refresh token from cookies
        const refreshToken = Cookies.get('refreshToken');

        // Create form data for the request
        const formData = new FormData();
        formData.append('refreshToken', refreshToken || '');

        return {
          url: 'auth/refresh-token',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: AuthResponse) => {
        // Store new tokens in cookies if refresh is successful
        if (response.status.code === 'SUCCESS' && response.data) {
          Cookies.set('token', response.data.accessToken, { expires: 7 });
          Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 });
          Cookies.set('userRole', response.data.userRole, { expires: 30 });
        }
        return response;
      },
      // Handle errors during refresh
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Error refreshing token:', error);
          // Clear tokens and set auth state to logged out
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          Cookies.remove('userRole');
          dispatch(setAuthenticated(false));
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ // <-- REMOVE headers from here
        url: 'auth/logout',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        },
        // No 'headers' explicitely set here for Authorization
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          // Optional: Log the token just before the call if you still want to see it
          // console.log('Token before logout API call (will be picked up by prepareHeaders):', Cookies.get('token'));

          // Wait for the server to respond to the logout request
          await queryFulfilled;
          console.log('Logout successful on server.');
        } catch (error) {
          console.error('Error during server logout:', error);
          // Even if server logout fails, we still want to clear client-side session
        } finally {
          // This block will execute whether queryFulfilled resolves or rejects
          console.log('Clearing client-side tokens and auth state.');
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          Cookies.remove('userRole');
          dispatch(setAuthenticated(false));
          // Optionally, you might want to dispatch api.util.resetApiState()
          // to clear RTK Query cache after logout.
          // dispatch(api.util.resetApiState());
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterCompanyMutation,
  useRegisterJobSeekerMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation
} = authApi;
