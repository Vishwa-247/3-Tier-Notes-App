import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Plus, Search, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export const Layout = ({ children, showSearch = false, onSearch }: LayoutProps) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <div>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/notes" className="text-xl font-bold text-primary">
                Notes App
              </Link>
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/notes">
                    <Home className="w-4 h-4 mr-2" />
                    All Notes
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/notes/create">
                    <Plus className="w-4 h-4 mr-2" />
                    New Note
                  </Link>
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            {showSearch && onSearch && (
              <div className="flex-1 max-w-lg mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    onChange={(e) => onSearch(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};