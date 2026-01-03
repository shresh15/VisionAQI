import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Navigation } from "./components/Navigation";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "./hooks/use-auth";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Results from "./pages/Results";
import Health from "./pages/Health";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/not-found";

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/auth");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <Component />;
}

function Router() {
  const [location] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const isHomeOrAuth = location === "/" || location === "/auth";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navigation />
      <div className={`flex-1 ${!isHomeOrAuth ? "pt-16" : ""}`}>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/auth">
            {!loading && isAuthenticated ? <Redirect to="/dashboard" /> : <Auth />}
          </Route>
          <Route path="/how-it-works" component={HowItWorks} />

          {/* Protected Routes */}
          <Route path="/dashboard">
            <ProtectedRoute component={Dashboard} />
          </Route>
          <Route path="/analyze">
            <ProtectedRoute component={Analyze} />
          </Route>
          <Route path="/results">
            <ProtectedRoute component={Results} />
          </Route>
          <Route path="/health">
            <ProtectedRoute component={Health} />
          </Route>

          <Route component={NotFound} />
        </Switch>
      </div>

      {/* Footer for all pages except Auth/Landing might be nicer here, but keeping it simple */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <p>© 2024 VisionAQ. AI-Powered Air Quality Monitoring.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
