import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Coffee } from 'lucide-react';

export function Preloader({ onLoadComplete }: { onLoadComplete: () => void }) {
  useEffect(() => {
    const startTime = Date.now();
    const MIN_LOADING_TIME = 1500; // Increased to let the animation play

    const finishLoading = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);
      
      setTimeout(() => {
        onLoadComplete();
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
      return () => window.removeEventListener('load', finishLoading);
    }
  }, [onLoadComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 transition-colors duration-300"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
           animate={{
            y: [0, -8, 0],
            rotate: [0, -3, 3, 0]
           }}
           transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
           }}
           className="bg-primary text-white p-5 rounded-2xl shadow-xl shadow-primary/20 mb-8 relative"
        >
          <Coffee size={48} strokeWidth={2.5} />
          {/* Steam animations */}
          <motion.div
            animate={{ y: [0, -20], opacity: [0, 0.6, 0], x: [0, 5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            className="absolute -top-4 right-5 w-1.5 h-6 bg-white rounded-full blur-[2px]"
          />
          <motion.div
            animate={{ y: [0, -25], opacity: [0, 0.8, 0], x: [0, -5] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}
            className="absolute -top-6 right-9 w-2 h-8 bg-white rounded-full blur-[3px]"
          />
          <motion.div
            animate={{ y: [0, -15], opacity: [0, 0.5, 0], x: [0, 3] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 1.1 }}
            className="absolute -top-4 left-6 w-1 pl-1 h-5 bg-white rounded-full blur-[2px]"
          />
        </motion.div>

        <div className="flex items-center gap-1 overflow-hidden pb-2">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
            className="font-extrabold text-4xl tracking-tight text-secondary"
          >
            Just
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
            className="font-extrabold text-4xl tracking-tight text-primary italic relative"
          >
            Blog
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              className="absolute bottom-1 left-0 w-full h-[4px] bg-accent/30 rounded-full origin-left" 
            />
          </motion.span>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-slate-400 mt-2 text-sm max-w-[200px] text-center"
        >
          Preparing your sanctuary for thought...
        </motion.p>
      </div>
    </motion.div>
  );
}
