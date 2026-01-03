import { useAuth } from "../hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Plus, Clock, ChevronRight } from "lucide-react";
import { AQICard } from "../components/AQICard";
import { useLocalStorage } from "../hooks/use-local-storage";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const [history] = useLocalStorage<any[]>("visionaq_history", []);
  
  // Get most recent reading or default
  const latest = history[0] || { aqi: 42, hazeLevel: "Low", date: new Date().toISOString() };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}. Here's your air quality summary.
          </p>
        </div>
        <Link href="/analyze">
          <button className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Analysis
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main AQI Card */}
        <div className="md:col-span-2">
          <AQICard aqi={latest.aqi} label="Latest Reading" detailed />
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-accent text-white p-6 rounded-3xl shadow-lg shadow-accent/20 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
               <Clock className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-bold font-display mb-2">History</h3>
            <p className="text-white/80 mb-6 text-sm">
              You have performed {history.length} analyses so far.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold bg-white/20 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
              View History
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>

          <Link href="/health">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <h3 className="text-lg font-bold font-display text-foreground mb-2 group-hover:text-primary transition-colors">
                Health Advice
              </h3>
              <p className="text-muted-foreground text-sm">
                Get personalized recommendations based on current air quality levels.
              </p>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Recent History List */}
      <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-display">Recent Activity</h3>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No analysis history yet.</p>
            <Link href="/analyze" className="text-primary font-bold hover:underline mt-2 inline-block">
              Analyze your first photo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 5).map((item: any, i: number) => (
              <div 
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                    {/* Fallback if image isn't stored locally properly, usually we'd store base64 or object URL but that's tricky with localStorage */}
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      IMG
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">AQI {item.aqi}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${item.aqi <= 50 ? 'bg-green-100 text-green-700' : 
                      item.aqi <= 100 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                  `}>
                    {item.hazeLevel} Haze
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
