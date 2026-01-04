import { useState } from "react";
import { UploadZone } from "../components/UploadZone";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useLocalStorage } from "../hooks/use-local-storage";
import { API_URL } from "../config";

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [, setLocation] = useLocation();
  const [history, setHistory] = useLocalStorage<any[]>("visionaq_history", []);

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Use central API URL
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      const getHazeLevel = (aqi: number) => {
        if (aqi <= 50) return "Low";
        if (aqi <= 150) return "Medium";
        return "High";
      };

      const result = {
        id: Math.random().toString(36).substr(2, 9),
        aqi: data.aqi,
        category: data.category,
        hazeLevel: getHazeLevel(data.aqi),
        createdAt: new Date().toISOString(),
      };

      // Store current result for the results page
      localStorage.setItem("visionaq_current_result", JSON.stringify({
        ...result,
        tempImageUrl: URL.createObjectURL(file)
      }));

      // Add to history
      setHistory([result, ...history]);

      setLocation("/results");

    } catch (error) {
      console.error("Analysis Error:", error);
      alert(error instanceof Error ? error.message : "Failed to analyze image");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">
          Analyze Air Quality
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Upload a clear photo of the sky or horizon. Our AI will analyze haze levels,
          visibility, and color distribution to estimate the Air Quality Index.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-primary/5 border border-white/50 relative overflow-hidden">
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <h3 className="mt-6 text-xl font-bold font-display text-primary animate-pulse">
              Analyzing Sky Features...
            </h3>
            <p className="text-muted-foreground mt-2">Extracting haze patterns & visibility depth</p>
          </motion.div>
        )}

        <UploadZone
          onFileSelect={setFile}
          selectedFile={file}
          onClear={() => setFile(null)}
        />

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className={`
              px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2
              transition-all duration-300 shadow-lg
              ${!file
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-1"
              }
            `}
          >
            {analyzing ? "Processing..." : "Analyze Now"}
            {!analyzing && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[
          { title: "Smart Detection", desc: "Identifies sky regions automatically" },
          { title: "Haze Analysis", desc: "Measures atmospheric particulate density" },
          { title: "Instant Results", desc: "Get AQI estimates in seconds" }
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/50 border border-border">
            <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
