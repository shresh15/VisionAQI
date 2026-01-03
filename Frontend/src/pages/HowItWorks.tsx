import { Camera, Cpu, Smartphone, Cloud } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Camera,
      title: "1. Capture",
      desc: "Take a photo of the sky or open horizon. Ensure there is enough daylight and the sky is clearly visible."
    },
    {
      icon: Cloud,
      title: "2. Upload",
      desc: "Upload the image to VisionAQ. Our system accepts standard formats like JPG and PNG."
    },
    {
      icon: Cpu,
      title: "3. Analysis",
      desc: "Our computer vision algorithm analyzes haze density, light scattering, and color gradients."
    },
    {
      icon: Smartphone,
      title: "4. Result",
      desc: "Receive an instant AQI estimation along with a 'dehazed' simulation of what clear skies would look like."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Technology</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
          Behind the Magic
        </h1>
      </div>

      <div className="relative">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-primary/5 via-primary/30 to-primary/5 -z-10" />

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-white p-8 rounded-3xl shadow-sm border border-border text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-24 h-24 mx-auto bg-background rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-lg">
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white text-center relative overflow-hidden">
        {/* Decorative background effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 to-gray-900 -z-10" />
        <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl font-display font-bold mb-6">Why Computer Vision?</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Traditional AQI stations are expensive and sparsely distributed. VisionAQ democratizes air quality monitoring by turning every smartphone into a sensor.
          </p>
          <div className="grid grid-cols-3 gap-8 border-t border-gray-700 pt-8">
             <div>
               <div className="text-3xl font-bold text-primary mb-1">Low</div>
               <div className="text-xs text-gray-400 uppercase tracking-widest">Cost</div>
             </div>
             <div>
               <div className="text-3xl font-bold text-primary mb-1">Fast</div>
               <div className="text-xs text-gray-400 uppercase tracking-widest">Speed</div>
             </div>
             <div>
               <div className="text-3xl font-bold text-primary mb-1">Anywhere</div>
               <div className="text-xs text-gray-400 uppercase tracking-widest">Access</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
