import { Link } from "wouter";
import {
  ArrowRight,
  Wind,
  Zap,
  Globe,
  Users,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  CheckCircle2,
  Sparkles,
  Eye,
  Shield,
} from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Landing() {
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y2 = useSpring(mouseY, springConfig);

  useEffect(() => {
    mouseX.set((mousePosition.x - window.innerWidth / 2) / 25);
    mouseY.set((mousePosition.y - window.innerHeight / 2) / 25);
  }, [mousePosition, mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40 relative overflow-hidden">
      {/* Ultra-Premium Background System */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-200/10 to-teal-100/20 animate-gradient-y" />

        {/* Morphing Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[40%] -right-[20%] w-[1000px] h-[1000px] bg-gradient-to-br from-emerald-200/30 to-teal-300/20 rounded-full blur-3xl animate-blob"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] -left-[30%] w-[800px] h-[800px] bg-gradient-to-br from-sky-200/30 to-blue-300/20 rounded-full blur-3xl animate-blob"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-gradient-to-br from-violet-200/20 to-purple-300/10 rounded-full blur-3xl"
        />

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(46,125,50,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(46,125,50,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Ultra-Premium Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 w-full z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl shadow-black/5 px-6 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-primary to-teal-400 p-2.5 rounded-2xl text-white shadow-lg">
                      <Wind className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-2xl font-display font-black bg-gradient-to-r from-primary via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    VisionAQI
                  </span>
                </motion.div>
              </Link>

              <div className="hidden md:flex items-center gap-8 text-sm font-bold">
                {["Home", "Impact", "About", "Contact"].map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative text-slate-700 hover:text-primary transition-colors group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-teal-500 transition-all duration-300 group-hover:w-full" />
                  </motion.a>
                ))}
              </div>

              <Link href="/auth">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(46,125,50,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-primary via-teal-500 to-emerald-500 text-white font-bold shadow-lg shadow-primary/25"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-2">
                    Sign Up/ Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Ultra Premium */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              style={{ y, opacity }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 shadow-lg shadow-emerald-100/50 mb-8"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="flex"
                >
                  {/* <Sparkles className="w-4 h-4 text-emerald-600" /> */}
                </motion.span>
                {/* <span className="text-sm font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  AI-Powered Environmental Intelligence
                </span> */}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl md:text-8xl font-display font-black tracking-tight leading-[0.95] mb-8"
              >
                <span className="block text-slate-900">Breathe</span>
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 animate-gradient-x text-glow">
                    Better.
                  </span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 blur-2xl bg-gradient-to-r from-emerald-400 to-teal-400 -z-10"
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed font-light max-w-xl"
              >
                Transform any smartphone into a powerful air quality monitoring station.
                <span className="font-semibold text-primary"> Instant AI analysis</span> from just a photo of the sky.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-primary via-emerald-600 to-teal-500 text-white font-bold text-lg shadow-2xl shadow-primary/30 overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative flex items-center gap-3">
                      <Eye className="w-5 h-5" />
                      Analyze Air Quality
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </motion.button>
                </Link>
                <Link href="/how-it-works">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-primary/30 text-slate-900 font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-6"
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                      className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 20})`,
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  {/* <p className="text-sm font-semibold text-slate-700">
                    Trusted by <span className="text-primary">15,000+</span> users worldwide
                  </p> */}
                </div>
              </motion.div>
            </motion.div>

            {/* Right - 3D Floating Card System */}
            <motion.div
              style={{ x, y: y2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                {/* Main Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1, type: "spring" }}
                  className="relative z-10 card-3d"
                >
                  <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm">
                    <img
                      src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80"
                      alt="Clear sky"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Floating Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-xl">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 font-medium">Air Quality Index</p>
                            <p className="text-2xl font-black text-green-600">Good</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-black text-slate-900">42</p>
                          <p className="text-xs text-slate-500">AQI</p>
                        </div>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "42%" }}
                          transition={{ delay: 0.8, duration: 1 }}
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 z-20 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      {/* <Zap className="w-5 h-5 text-blue-600" /> */}
                    </div>
                    <span className="font-bold text-slate-900">Instant Analysis</span>
                  </div>
                  <p className="text-sm text-slate-600">Results in &lt;30 seconds</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -left-6 z-20 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">98.5% Accuracy</p>
                      <p className="text-xs text-slate-600">AI Verified</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 -z-10"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-dashed border-primary/20 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section - Premium Cards */}
      <section id="impact" className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6"
            >
              Global Impact
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-display font-black mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Why It Matters
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Air pollution affects <span className="font-bold text-primary">7 million lives</span> annually.
              We're democratizing air quality monitoring for everyone, everywhere.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Coverage",
                desc: "Monitor air quality anywhere on Earth without expensive sensor infrastructure.",
                color: "from-blue-500 to-cyan-500",
                bg: "from-blue-50 to-cyan-50",
              },
              {
                icon: Users,
                title: "Crowd Intelligence",
                desc: "Join 15,000+ contributors building the world's largest community air quality database.",
                color: "from-purple-500 to-pink-500",
                bg: "from-purple-50 to-pink-50",
              },
              {
                icon: Zap,
                title: "Instant Results",
                desc: "Advanced computer vision delivers professional-grade analysis in under 2 seconds.",
                color: "from-amber-500 to-orange-500",
                bg: "from-amber-50 to-orange-50",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10"
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                />
                <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${feature.bg} border border-white/60 shadow-xl group-hover:shadow-2xl transition-all duration-500 h-full`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="about" className="relative py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-display font-black mb-12">
                Traditional vs. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  VisionAQI
                </span>
              </h2>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-slate-300 text-3xl">Uses physical air quality sensors</h4>
                      <h4 className="font-bold mb-2 text-slate-300 text-3xl">Measures pollutants like PM2.5, PM10, NO₂, SO₂</h4>
                      <h4 className="font-bold mb-2 text-slate-300 text-3xl">Sensors are installed at fixed locations</h4>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border-2 border-emerald-400/30 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-start gap-4">
                    <div className="p-2 bg-emerald-400/30 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-slate-300 text-3xl">Applies computer vision + atmospheric physics</h4>
                      <h4 className="font-bold mb-2 text-slate-300 text-3xl">Analyzes haze, contrast loss, and light scattering</h4>
                      <h4 className="font-bold mb-2 text-slate-300 text-3xl">Estimates PM2.5 & AQI using AI models</h4>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-3xl opacity-20" />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQTp--8sXvwqY7bKAkE2FYs4txcP4sloXqWA&s"
                alt="Air Quality Index Map"
                className="relative w-full h-auto max-h-[500px] object-contain rounded-3xl shadow-2xl border-4 border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>



    </div>
  );
}
