/**
 * Decodes a JWT token and returns the payload
 * @param token The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export function decodeJwt(token: string): { [key: string]: never } | null {
  try {
    // JWT tokens are made of three parts: header.payload.signature
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Replace non-url compatible chars with their url-safe version
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode the base64-encoded string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
} 