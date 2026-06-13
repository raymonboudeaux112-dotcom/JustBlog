import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail } from "lucide-react";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenNewsletterPopup");
    
    if (!hasSeenPopup) {
      // Show popup after a delay, e.g., 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenNewsletterPopup", "true");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-secondary hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="p-8 sm:p-10 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="text-primary" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-secondary mb-3">Join our newsletter</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Get the finest stories from top creators delivered directly to your inbox every week. No spam, ever.
                </p>
                
                {isSubscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 text-green-700 py-4 px-6 rounded-xl font-medium border border-green-100"
                  >
                    Thanks for subscribing!
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-secondary"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
                <p className="text-xs text-slate-400 mt-6">
                  By subscribing, you agree to our Terms of Service.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
