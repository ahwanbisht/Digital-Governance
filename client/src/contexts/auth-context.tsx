import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  fullName?: string;
  role: string;
  email?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // In a real application, we would check if user is already logged in
  // For demo purposes, we'll skip this effect as we set a default user in another effect

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        username,
        password,
      });
      
      const userData = await response.json();
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.fullName || userData.username}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // For demo purposes, always set a default admin user immediately
  useEffect(() => {
    setIsLoading(false);
    setUser({
      id: 1,
      username: "admin",
      fullName: "Alex Thompson",
      role: "admin",
      email: "admin@example.com",
      department: "Administration"
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Create a default context for development
    return {
      user: {
        id: 1,
        username: "admin",
        fullName: "Alex Thompson",
        role: "admin",
        email: "admin@example.com",
        department: "Administration"
      },
      isLoading: false,
      login: async () => {},
      logout: async () => {},
      isAuthenticated: true
    };
    // In production, we would use:
    // throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
