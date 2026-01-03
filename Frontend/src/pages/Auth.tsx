import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { motion } from "framer-motion";
import { Wind, ArrowRight, Mail, Lock, User } from "lucide-react";
import { Link } from "wouter";

export default function Auth() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;
    if (!isLogin && !name) return;

    setLoading(true);

    if (isLogin) {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-emerald-600/80 to-teal-600/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1511497584788-876760111969?w=1600&q=80"
          alt="Misty Forest"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 p-16 flex flex-col justify-between h-full text-white">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 font-display text-3xl font-bold cursor-pointer"
            >
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Wind className="w-8 h-8" />
              </div>
              VisionAQ
            </motion.div>
          </Link>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-display font-black mb-6 leading-tight"
            >
              See the air<br />you breathe.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 max-w-md leading-relaxed"
            >
              Join thousands of users monitoring their local air quality through the power of AI-driven computer vision.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-display font-black text-slate-900 mb-3">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-lg text-slate-600">
              {isLogin
                ? "Enter your credentials to access your dashboard."
                : "Start your journey to healthier living today."
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-slate-500 mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary via-emerald-600 to-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-primary font-bold hover:underline transition-all"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
