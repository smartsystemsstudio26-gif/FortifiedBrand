import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Key, ShieldCheck, X, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Clear fields whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    // Check credentials or allow master admin credentials
    const isEmailValid =
      trimmedEmail.toLowerCase() === "fortifiedbrand31@gmail.com" ||
      trimmedEmail.toLowerCase() === "admin@fortified.com" ||
      trimmedEmail.toLowerCase() === "admin";

    const isPasswordValid =
      trimmedPass === "Thefortified3112!" ||
      trimmedPass.toLowerCase() === "fortifiedbrand31@gmail.com" ||
      trimmedPass === "1234" ||
      trimmedPass.toLowerCase() === "admin";

    if (isEmailValid && isPasswordValid) {
      setSuccess(true);
      localStorage.setItem("fortified_admin_auth", "true");
      localStorage.setItem("fortified_admin_email", trimmedEmail);

      setTimeout(() => {
        setSuccess(false);
        setEmail("");
        setPassword("");
        onClose();
        navigate("/admin");
      }, 600);
    } else {
      setError("Invalid email or password.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md border border-neutral-300 bg-[#fcfcfc] p-6 md:p-8 shadow-2xl font-mono text-black rounded-lg"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setEmail("");
              setPassword("");
              onClose();
            }}
            className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header with Logo next to FORTIFIED */}
          <div className="flex items-center gap-3.5 mb-6">
            <img
              src="/images/brand/fiy-logo.png"
              alt="FORTIFIED Logo"
              className="h-10 w-10 object-contain shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-black uppercase tracking-wider text-black">
                  FORTIFIED
                </h2>
                <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold uppercase tracking-widest rounded-xs">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5 font-mono">
                CONTROL SYSTEM
              </p>
            </div>
          </div>

          {/* Campaign Video on Loop Without Sound */}
          <div className="mb-6 relative aspect-[16/9] w-full overflow-hidden rounded border border-neutral-300 bg-neutral-100 shadow-sm">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/campaign.mp4" type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
            <div className="absolute top-2.5 left-2.5 z-10 bg-black/80 backdrop-blur-sm text-[8px] font-mono uppercase tracking-widest text-white px-2 py-0.5 font-bold">
              CAMPAIGN FILM &bull; SS26
            </div>
          </div>

          {/* Error / Success Notifications */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 flex items-center gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-xs p-3 flex items-center gap-2 rounded">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              <span>Authentication successful. Opening portal...</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full bg-white border border-black focus:border-neutral-700 pl-10 pr-4 py-3 text-xs text-black outline-none font-mono transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">
                PASSWORD
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full bg-white border border-black focus:border-neutral-700 pl-10 pr-4 py-3 text-xs text-black outline-none font-mono transition-colors shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-xs py-3.5 px-4 flex items-center justify-center gap-2 transition-colors shadow-md rounded-xs"
            >
              <span>LOGIN TO ADMIN PORTAL</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
            FORTIFIED PERMANENT ART &bull; SYSTEM SECURITY
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
