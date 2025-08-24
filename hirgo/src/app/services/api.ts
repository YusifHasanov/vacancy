import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

// Define the base URL for your API
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/';

// Base query instance
const baseQuery = fetchBaseQuery({
    baseUrl, // Use the defined base URL
    prepareHeaders: (headers, { endpoint }) => {
        // Don't add auth token for endpoints that don't require authentication
        const noAuthEndpoints = [
            'getAllCategories',
            'getCategoryById',
            'getLookupById',
            'getLookupsByType'
        ];

        // Check if this endpoint should skip authentication
        if (noAuthEndpoints.includes(endpoint)) {
            return headers;
        }

        // Otherwise add the auth token
        const token = Cookies.get('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Response type for refresh token
interface RefreshTokenResponse {
    data?: {
        accessToken: string;
        refreshToken: string;
        idToken: string;
    };
    status: {
        code: string;
        message: string;
    };
}

// Helper function to handle failed auth
const handleAuthFailed = () => {
    // Clear tokens
    Cookies.remove('token');
    Cookies.remove('refreshToken');

    // Redirect to login page
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

// Wrapper for baseQuery that handles automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // Try the initial query
    const result = await baseQuery(args, api, extraOptions);



    // If we get a 401 Unauthorized response, try to refresh the token
    if (result.error && result.error.status === 401) {
        console.log('Got 401 error, attempting to refresh token');

        // Get the refresh token from cookies
        const refreshToken = Cookies.get('refreshToken');

        if (!refreshToken) {
            console.log('No refresh token available, cannot refresh');
            handleAuthFailed();
            return result;
        }

        // Create form data for the refresh token request
        const formData = new FormData();
        formData.append('refreshToken', refreshToken);

        // Attempt to get a new token
        try {
            const refreshResult = await fetch(`${baseUrl}auth/refresh-token`, {
                method: 'POST',
                body: formData,
            });

            const refreshData: RefreshTokenResponse = await refreshResult.json();

            // If we got a new token, update cookies and retry the original request
            if (refreshData.status.code === 'SUCCESS' && refreshData.data) {
                console.log('Token refresh successful, updating tokens and retrying request');

                // Store the new tokens
                Cookies.set('token', refreshData.data.accessToken, { expires: 7 });
                Cookies.set('refreshToken', refreshData.data.refreshToken, { expires: 30 });

                // Retry the original request with the new token
                return baseQuery(args, api, extraOptions);
            } else {
                console.log('Failed to refresh token:', refreshData.status.message);
                handleAuthFailed();
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            handleAuthFailed();
        }
    }

    return result;
};

const RESUME_TAG = 'Resume'; // Tekil bir CV için
const RESUME_LIST_TAG = 'ResumeList'; // CV listesi için

// All API requests will share this configuration
export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}), // Endpoints will be injected
    tagTypes: [RESUME_TAG, RESUME_LIST_TAG],
});
