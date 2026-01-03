import { useState, useEffect, createContext, useContext } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  name: string;
}

// Since we are frontend-only, we'll mock the auth context
export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("visionaq_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [, setLocation] = useLocation();

  const login = async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
    };
    
    setUser(mockUser);
    localStorage.setItem("visionaq_user", JSON.stringify(mockUser));
    setLocation("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("visionaq_user");
    setLocation("/auth");
  };

  return { user, login, logout, isAuthenticated: !!user };
}
