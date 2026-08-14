const TOKEN_KEY = 'MTATOKEN';

export const TokenService = {
    // Get token from storage
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Save token to storage
    setToken: (token) => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Remove token from storage
    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Check if token exists
    hasToken: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    // Parse token (JWT)
    parseToken: () => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) return null;
            
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    },

    // Check if token is expired
    isTokenExpired: () => {
        const payload = TokenService.parseToken();
        if (!payload) return true;
        
        const expiry = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expiry;
    },

    // Clear all auth related data
    clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY);
        // Add any other auth-related cleanup here
    }
};

export default TokenService;
