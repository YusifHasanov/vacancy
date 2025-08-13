// Export auth hooks and components
export { useAuth } from './useAuth';
export { withAuth } from './withAuth';

// Export actions from the auth slice
export { setAuthenticated } from './authSlice';

// Export auth API hooks
export {
  useRegisterCompanyMutation,
  useRegisterJobSeekerMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation
} from './authSlice'; 