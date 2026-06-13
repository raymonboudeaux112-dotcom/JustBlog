import React from "react";
import { LifeBuoy, Search, Book, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-secondary tracking-tight mb-6">How can we help?</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Search our knowledge base or browse categories below to find answers to your questions.
        </p>
        <div className="mt-8 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for articles..."
            className="w-full px-6 py-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm pl-14 text-lg"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <Book className="text-primary" size={32} />, title: "Getting Started", desc: "Learn the basics of creating and managing your blog.", link: "/writers-guide" },
          { icon: <MessageCircle className="text-primary" size={32} />, title: "Community Guidelines", desc: "Understand our rules and how to interact safely.", link: "/community" },
          { icon: <LifeBuoy className="text-primary" size={32} />, title: "Account Support", desc: "Manage your account settings, billing, and access.", link: "/contact" },
        ].map((item, i) => (
          <Link to={item.link} key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left block">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
            <p className="text-slate-500 leading-relaxed">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
