import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Navigation } from "./components/Navigation";
import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";

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
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/auth");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;
  return <Component />;
}

function Router() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navigation />
      <div className="flex-1 pt-16"> {/* pt-16 accounts for fixed navbar */}
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
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
      <Router />
    </QueryClientProvider>
  );
}

export default App;
