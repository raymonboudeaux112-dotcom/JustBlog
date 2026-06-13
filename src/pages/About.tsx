import { CheckCircle2, TrendingUp, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-secondary mb-8 tracking-tight">
            We are redefining how <br /> <span className="text-primary">stories are told.</span>
          </h1>
          <p className="text-xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
            JustBlog is a premium publishing platform built for creators, engineers, and makers who care deeply about typography, design, and the reading experience.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div>
              <p className="text-4xl font-extrabold text-secondary mb-2">50+</p>
              <p className="text-slate-500 font-medium">Premium Articles</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-secondary mb-2">120K</p>
              <p className="text-slate-500 font-medium">Monthly Readers</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-secondary mb-2">10</p>
              <p className="text-slate-500 font-medium">Key Categories</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-secondary mb-2">100%</p>
              <p className="text-slate-500 font-medium">Independent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-secondary mb-8">Our Mission</h2>
        <div className="prose prose-lg text-slate-600 font-serif leading-relaxed mb-16">
          <p>
            In a world filled with cluttered interfaces, intrusive ads, and pop-ups, reading online has become a chore. We built JustBlog as a sanctuary for thought. A place where the interface steps back, and the content takes center stage.
          </p>
          <p>
            We believe that good design is invisible. By obsessing over line-heights, typography pairings, and whitespace, we've crafted an environment that respects both the writer's time and the reader's attention.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-secondary mb-8">Why Choose JustBlog</h2>
        <div className="space-y-6 mb-16">
          {[
            "Premium distraction-free reading experience",
            "Deep technical articles and architectural insights",
            "Strictly curated content focusing on quality over quantity",
            "Lightning fast performance globally"
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <CheckCircle2 className="text-primary mt-1 shrink-0" />
              <p className="text-lg text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Ready to explore?</h2>
          <Link to="/blog" className="inline-block px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-blue-600 transition-colors">
            Start Reading Articles
          </Link>
        </div>
      </section>
    </div>
  );
}
