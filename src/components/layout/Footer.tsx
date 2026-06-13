import { Link } from "react-router-dom";
import { Coffee, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
                <Coffee size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-secondary">
                Just<span className="text-primary italic">Blog</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              A premium blogging platform for creators, makers, and innovators to share their stories with the world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Github size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-secondary mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-500 hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-slate-500 hover:text-primary text-sm transition-colors">Browse Articles</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-primary text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-secondary mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/help-center" className="text-slate-500 hover:text-primary text-sm transition-colors">Help Center</Link></li>
              <li><Link to="/community" className="text-slate-500 hover:text-primary text-sm transition-colors">Community</Link></li>
              <li><Link to="/writers-guide" className="text-slate-500 hover:text-primary text-sm transition-colors">Writers Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-secondary mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy-policy" className="text-slate-500 hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-slate-500 hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} JustBlog. Designed with precision.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 relative"><span className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping"></span></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
