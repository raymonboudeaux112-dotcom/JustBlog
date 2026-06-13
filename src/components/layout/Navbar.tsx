import { Link, NavLink } from "react-router-dom";
import { Coffee, Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const links = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Blog", to: "/blog" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="bg-primary text-white p-2 rounded-xl transition-transform duration-300 shadow-sm"
              >
                <Coffee size={24} />
              </motion.div>
              <span className="font-extrabold text-2xl tracking-tight text-secondary">
                Just<span className="text-primary italic relative">Blog<div className="absolute bottom-1 left-0 w-full h-[3px] bg-accent/30 rounded-full"></div></span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-slate-600 hover:text-secondary"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Link
              to="/blog"
              className="group flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Start Reading
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            <button 
              onClick={toggleTheme}
              className="text-slate-600 hover:text-primary p-2 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-secondary p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-20 left-0 w-full glass border-b border-gray-200/50"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-3 rounded-lg text-base font-medium ${
                      isActive ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 flex flex-col gap-3">

                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-primary text-white rounded-xl text-base font-medium shadow-sm hover:shadow"
                >
                  Start Reading
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
