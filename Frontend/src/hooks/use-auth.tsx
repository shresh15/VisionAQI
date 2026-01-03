import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useLocation } from "wouter";
import { useToast } from "./use-toast";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("visionaq_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("visionaq_token");
          localStorage.removeItem("visionaq_user");
          setUser(null);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("visionaq_token");
        localStorage.removeItem("visionaq_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      localStorage.setItem("visionaq_token", data.token);
      localStorage.setItem("visionaq_user", JSON.stringify(data.user));
      setUser(data.user);

      toast({
        title: "Account created!",
        description: "Welcome to VisionAQ",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem("visionaq_token", data.token);
      localStorage.setItem("visionaq_user", JSON.stringify(data.user));
      setUser(data.user);

      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.name}`,
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("visionaq_token");
    localStorage.removeItem("visionaq_user");

    toast({
      title: "Logged out",
      description: "See you soon!",
    });

    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
