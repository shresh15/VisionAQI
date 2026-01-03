import { motion } from "framer-motion";
import { Cloud, Sun, Wind, CloudRain, AlertTriangle } from "lucide-react";

interface AQICardProps {
  aqi: number;
  label?: string;
  detailed?: boolean;
}

export function AQICard({ aqi, label = "Current AQI", detailed = false }: AQICardProps) {
  // Determine color and status based on AQI
  const getStatus = (val: number) => {
    if (val <= 50) return { 
      color: "bg-emerald-500", 
      text: "text-emerald-700", 
      bg: "bg-emerald-50",
      status: "Good", 
      desc: "Air quality is satisfactory.",
      Icon: Sun
    };
    if (val <= 100) return { 
      color: "bg-yellow-500", 
      text: "text-yellow-700", 
      bg: "bg-yellow-50",
      status: "Moderate", 
      desc: "Acceptable quality.",
      Icon: Cloud
    };
    if (val <= 150) return { 
      color: "bg-orange-500", 
      text: "text-orange-700", 
      bg: "bg-orange-50",
      status: "Unhealthy for Sensitive Groups", 
      desc: "Members of sensitive groups may experience health effects.",
      Icon: Wind
    };
    if (val <= 200) return { 
      color: "bg-red-500", 
      text: "text-red-700", 
      bg: "bg-red-50",
      status: "Unhealthy", 
      desc: "Everyone may begin to experience health effects.",
      Icon: CloudRain
    };
    return { 
      color: "bg-purple-600", 
      text: "text-purple-700", 
      bg: "bg-purple-50",
      status: "Very Unhealthy", 
      desc: "Health warnings of emergency conditions.",
      Icon: AlertTriangle
    };
  };

  const { color, text, bg, status, desc, Icon } = getStatus(aqi);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass-card rounded-3xl p-6 ${detailed ? 'col-span-full' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {label}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold font-display ${text}`}>
              {aqi}
            </span>
            <span className="text-sm font-medium text-muted-foreground">US AQI</span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${bg}`}>
          <Icon className={`w-8 h-8 ${text}`} />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`font-bold text-lg ${text}`}>{status}</span>
        </div>
        
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((aqi / 300) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${color}`} 
          />
        </div>
        
        {detailed && (
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {desc}
          </p>
        )}
      </div>
    </motion.div>
  );
}
