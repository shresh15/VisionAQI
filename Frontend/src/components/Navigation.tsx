import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { Leaf, Menu, X, Wind, Activity, Info, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/analyze", label: "Analyze", icon: Wind },
    { href: "/health", label: "Health", icon: Leaf },
    { href: "/how-it-works", label: "Learn", icon: Info },
  ];

  if (location === "/" || location === "/auth") return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Wind className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-primary font-display tracking-tight">
              VisionAQI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 text-sm font-semibold transition-all duration-200
                    ${isActive 
                      ? "text-primary bg-primary/5 px-4 py-2 rounded-full" 
                      : "text-muted-foreground hover:text-primary"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                  {link.label}
                </Link>
              );
            })}
            <div className="h-6 w-px bg-border mx-2" />
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground hidden lg:block">
                Hi, {user?.name}
              </span>
              <button
                onClick={logout}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground p-2 hover:bg-muted rounded-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <div className="py-2 px-4 text-sm text-muted-foreground border-b border-border mb-2">
                Signed in as <span className="font-bold text-primary">{user?.name}</span>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-4 py-3 rounded-lg text-base font-medium
                    ${location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </div>
                </Link>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 flex items-center gap-3"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
