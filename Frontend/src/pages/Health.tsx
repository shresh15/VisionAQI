import { Link } from "wouter";
import { Heart, Activity, Wind, Info } from "lucide-react";

export default function Health() {
  const recommendations = [
    {
      level: "Good (0-50)",
      color: "bg-green-100 border-green-200 text-green-800",
      advice: "Air quality is considered satisfactory, and air pollution poses little or no risk. Great time for outdoor activities!",
    },
    {
      level: "Moderate (51-100)",
      color: "bg-yellow-100 border-yellow-200 text-yellow-800",
      advice: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
    },
    {
      level: "Unhealthy (101-150)",
      color: "bg-orange-100 border-orange-200 text-orange-800",
      advice: "Members of sensitive groups may experience health effects. The general public is less likely to be affected. Limit prolonged outdoor exertion.",
    },
    {
      level: "Very Unhealthy (200+)",
      color: "bg-purple-100 border-purple-200 text-purple-800",
      advice: "Health alert: The risk of health effects is increased for everyone. Avoid outdoor activities.",
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Health & Safety</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Understanding Air Quality Index (AQI) is crucial for protecting your respiratory health. 
          Here's how to interpret the numbers and stay safe.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
         {/* Featured Advice Card */}
         <div className="bg-white rounded-[2rem] p-8 border border-border shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[4rem] -mr-4 -mt-4 z-0" />
           <div className="relative z-10">
             <div className="p-3 bg-red-100 w-fit rounded-xl mb-6">
                <Heart className="w-8 h-8 text-red-600" />
             </div>
             <h3 className="text-2xl font-bold font-display mb-4">Protect Your Lungs</h3>
             <ul className="space-y-4 text-muted-foreground">
               <li className="flex gap-3">
                 <Activity className="w-5 h-5 text-primary shrink-0" />
                 <span>Monitor AQI before outdoor exercise</span>
               </li>
               <li className="flex gap-3">
                 <Wind className="w-5 h-5 text-primary shrink-0" />
                 <span>Wear masks (N95) during high pollution events</span>
               </li>
               <li className="flex gap-3">
                 <Info className="w-5 h-5 text-primary shrink-0" />
                 <span>Use air purifiers indoors when quality is poor</span>
               </li>
             </ul>
           </div>
         </div>

         {/* General Stats */}
         <div className="bg-primary text-white rounded-[2rem] p-8 shadow-xl shadow-primary/20 flex flex-col justify-center">
            <h3 className="text-2xl font-bold font-display mb-6">Did you know?</h3>
            <p className="text-lg opacity-90 leading-relaxed mb-6">
              "9 out of 10 people worldwide breathe polluted air, according to World Health Organization estimates."
            </p>
            <Link href="/analyze">
              <button className="bg-white text-primary px-6 py-3 rounded-full font-bold w-fit hover:bg-gray-50 transition-colors">
                Check Your Air Now
              </button>
            </Link>
         </div>
      </div>

      <h2 className="text-2xl font-bold font-display mb-6">AQI Scale Guide</h2>
      <div className="space-y-4">
        {recommendations.map((item, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${item.color} flex flex-col md:flex-row gap-4 items-start md:items-center`}>
            <div className="min-w-[180px] font-bold text-lg">{item.level}</div>
            <p className="opacity-90 leading-relaxed">{item.advice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
