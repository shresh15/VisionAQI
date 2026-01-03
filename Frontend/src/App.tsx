import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Navigation } from "./components/Navigation";
import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";
import { Footer } from "./components/Footer";

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
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const isHomeOrAuth = location === "/" || location === "/auth";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navigation />
      <div className={`flex-1 ${!isHomeOrAuth ? "pt-16" : ""}`}>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/auth">
            {isAuthenticated ? <Redirect to="/dashboard" /> : <Auth />}
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

      <Footer />
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
