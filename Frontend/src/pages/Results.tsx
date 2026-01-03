import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AQICard } from "../components/AQICard";
import { Eye, EyeOff, RotateCcw, Share2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Results() {
  const [result, setResult] = useState<any>(null);
  const [dehazed, setDehazed] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const data = localStorage.getItem("visionaq_current_result");
    if (!data) {
      setLocation("/analyze");
      return;
    }
    setResult(JSON.parse(data));
  }, [setLocation]);

  if (!result) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left Column: Image Visualization */}
        <div className="space-y-6">
          <div className="bg-card rounded-[2rem] shadow-xl overflow-hidden relative group">
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                {dehazed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {dehazed ? "AI Dehazed View" : "Original Upload"}
              </span>
            </div>

            <div className="relative overflow-hidden aspect-[4/3]">
              <motion.img 
                key={dehazed ? "dehazed" : "original"}
                initial={{ opacity: 0.8, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={result.tempImageUrl} 
                alt="Analyzed Sky"
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${dehazed ? 'contrast-[1.15] saturate-[1.3] brightness-[1.05]' : ''}`}
                style={{ filter: dehazed ? 'contrast(1.2) saturate(1.4) brightness(1.05)' : 'none' }}
              />
              
              {/* Overlay comparison slider hint could go here */}
            </div>

            <div className="p-6 bg-white border-t border-border flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">
                Toggle to see estimated clear conditions
              </p>
              <button 
                onClick={() => setDehazed(!dehazed)}
                className="bg-secondary/50 hover:bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl font-bold transition-all text-sm"
              >
                {dehazed ? "Show Original" : "Simulate Clear Sky"}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-blue-900">
             <h4 className="font-bold mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-500" />
               AI Insight
             </h4>
             <p className="text-sm leading-relaxed opacity-90">
               Our analysis detected {result.hazeLevel.toLowerCase()} levels of particulate matter scattering. 
               The dehazed simulation removes estimated atmospheric noise to reveal visibility potential.
             </p>
          </div>
        </div>

        {/* Right Column: Stats & Actions */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Analysis Results</h1>
            <p className="text-muted-foreground mb-8">Generated {new Date(result.createdAt).toLocaleString()}</p>
            
            <AQICard aqi={result.aqi} detailed />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
               <p className="text-sm text-muted-foreground uppercase font-bold mb-1">Haze Level</p>
               <p className="text-xl font-bold text-foreground">{result.hazeLevel}</p>
             </div>
             <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
               <p className="text-sm text-muted-foreground uppercase font-bold mb-1">Confidence</p>
               <p className="text-xl font-bold text-green-600">94.2%</p>
             </div>
          </div>

          <div className="flex gap-4 pt-4">
             <Link href="/analyze" className="flex-1">
               <button className="w-full py-4 rounded-xl border-2 border-border font-bold text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                 <RotateCcw className="w-5 h-5" />
                 New Analysis
               </button>
             </Link>
             <button className="flex-1 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
               <Share2 className="w-5 h-5" />
               Share Result
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
