import { Link } from "wouter";
import {
  ArrowRight,
  Wind,
  Activity,
  Zap,
  Globe,
  Users,
  MapPin,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <nav className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          
          <div className="flex items-center gap-3 font-display text-3xl font-bold text-primary">
            <Wind className="w-9 h-9" />
            VisionAQ
          </div>

         
          <div className="hidden md:flex items-center gap-10 text-base font-semibold">
            <a href="#home" className="hover:text-primary transition">
              Home
            </a>
            <a href="#impact" className="hover:text-primary transition">
              Impact
            </a>
            <a href="#about" className="hover:text-primary transition">
              About Us
            </a>
            <a href="#contact" className="hover:text-primary transition">
              Contact
            </a>
          </div>

          
          <Link href="/auth">
            <button className="px-8 py-3 rounded-full bg-primary text-white font-bold text-base shadow-lg hover:-translate-y-0.5 transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

 
      <section id="home">
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
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
              Powered by computer vision to protect health where sensors don’t exist.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <button className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                  Analyze Image
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="px-8 py-4 rounded-full bg-white border border-border font-bold text-lg">
                  How it works
                </button>
              </Link>
            </div>

            <div className="mt-12 flex gap-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Instant Results
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                High Accuracy
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border-8 border-white/50">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
                alt="Clean sky"
                className="rounded-3xl w-full h-[500px] object-cover"
              />
            </div>
          </motion.div>
        </main>
      </section>

    
      <section id="impact" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-display font-bold mb-12"
          >
            Why This Matters
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[Globe, Users, MapPin].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-8 bg-white rounded-3xl shadow-lg"
              >
                <Icon className="w-10 h-10 text-primary mb-4 mx-auto" />
                <h3 className="font-bold text-lg mb-2">
                  {i === 0
                    ? "Smart Cities"
                    : i === 1
                    ? "Citizen Science"
                    : "Sensor Gaps"}
                </h3>
                <p className="text-muted-foreground">
                  {i === 0 &&
                    "Enable city-wide pollution awareness without installing new sensors."}
                  {i === 1 &&
                    "Empower people to contribute to air-quality awareness using just a phone."}
                  {i === 2 &&
                    "Estimate air quality in regions where monitoring stations don’t exist."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-display font-bold text-center mb-16"
          >
            Why VisionAQ?
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-start relative">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 bg-muted/30 rounded-3xl"
            >
              <h3 className="font-bold text-xl mb-4">Traditional Methods</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Limited air quality sensors</li>
                <li>• Poor hyper-local coverage</li>
                <li>• Expensive infrastructure</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 bg-primary/5 rounded-3xl"
            >
              <h3 className="font-bold text-xl mb-4 text-primary">
                VisionAQ Approach
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Image-based AI estimation</li>
                <li>• Scalable & low-cost</li>
                <li>• Works anywhere with a camera</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border"
            />
          </div>
        </div>
      </section>

     
      <section id="contact" className="py-16 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-display font-bold mb-6">Contact Us</h2>

          <div className="flex justify-center gap-8">
            <a href="#" className="hover:text-primary">
              <Github />
            </a>
            <a href="#" className="hover:text-primary">
              <Linkedin />
            </a>
            <a href="#" className="hover:text-primary">
              <Instagram />
            </a>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            © 2026 VisionAQ • Built for Smart Cities & Public Health
          </p>
        </motion.div>
      </section>
    </div>
  );
}
