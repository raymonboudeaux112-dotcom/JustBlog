import React from "react";
import { Users } from "lucide-react";

export default function Community() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-secondary tracking-tight mb-6">Join Our Community</h1>
      <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12">
        Connect with thousands of writers, share ideas, and grow your audience together.
      </p>
      
      <div className="bg-slate-50 p-12 rounded-3xl border border-slate-100 max-w-4xl mx-auto">
        <Users size={64} className="text-primary mx-auto mb-6 text-opacity-80" />
        <h2 className="text-2xl font-bold text-secondary mb-4">Forum coming soon</h2>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto">
          We are currently building a dedicated space for our creators to interact, swap stories, and collaborate. Stay tuned!
        </p>
        <button className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors shadow-sm">
          Join the Waitlist
        </button>
      </div>
    </div>
  );
}
