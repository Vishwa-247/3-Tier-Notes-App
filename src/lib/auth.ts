const JWT_STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'notes_app_token';

export const authService = {
  setToken: (token: string): void => {
    localStorage.setItem(JWT_STORAGE_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(JWT_STORAGE_KEY);
  },

  removeToken: (): void => {
    localStorage.removeItem(JWT_STORAGE_KEY);
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;
    
    try {
      // Basic JWT expiration check (optional)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      // If token is malformed, consider it invalid
      return false;
    }
  },

  // Mock login for UI-only implementation
  mockLogin: (email: string, password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // Generate a mock JWT token
          const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
          const payload = btoa(JSON.stringify({ 
            sub: '1234567890', 
            email, 
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
          }));
          const signature = 'mock_signature';
          const token = `${header}.${payload}.${signature}`;
          resolve(token);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }
};