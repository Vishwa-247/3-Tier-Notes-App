import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const token = await authService.mockLogin(email, password);
      authService.setToken(token);
      setIsAuthenticated(true);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.removeToken();
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};