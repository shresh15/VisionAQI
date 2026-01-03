import { Link } from "wouter";
import { ArrowRight, Wind, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Navbar Placeholder for Landing */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-display text-2xl font-bold text-primary">
          <Wind className="w-8 h-8" />
          VisionAQ
        </div>
        <Link href="/auth">
          <button className="px-6 py-2.5 rounded-full bg-white text-primary font-bold shadow-lg shadow-primary/5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-primary/10">
            Sign In
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold mb-6 border border-primary/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI-Powered Analysis
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
            Breathe <span className="text-gradient">Better</span>,<br />
            Live Healthier.
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
            Instantly estimate air quality using just a photo of the sky. 
            Powered by advanced computer vision to keep you safe and informed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth">
              <button className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/how-it-works">
              <button className="px-8 py-4 rounded-full bg-white text-foreground font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border">
                How it works
              </button>
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              <span>95% Accuracy</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Abstract Device Mockup */}
          <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl border-8 border-white/50 backdrop-blur-sm">
             {/* unsplash mountain nature landscape with blue sky */}
             <img 
               src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80" 
               alt="Clear sky landscape"
               className="rounded-3xl w-full h-[500px] object-cover"
             />
             
             {/* Floating UI Elements */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-12 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50"
             >
               <div className="flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-lg">
                   <Wind className="w-6 h-6 text-green-600" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground uppercase font-bold">AQI Level</p>
                   <p className="text-xl font-bold text-foreground">42 <span className="text-green-500 text-sm">Good</span></p>
                 </div>
               </div>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-12 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-[200px]"
             >
               <p className="text-sm font-medium text-foreground">
                 "Air quality is great for outdoor activities today!"
               </p>
             </motion.div>
          </div>
          
          {/* Background decoration behind phone */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[3rem] blur-2xl transform rotate-6 scale-105 -z-10" />
        </motion.div>
      </main>
    </div>
  );
}
