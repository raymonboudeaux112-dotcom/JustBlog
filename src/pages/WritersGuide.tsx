import React from "react";
import { PenTool, Target, Zap } from "lucide-react";

export default function WritersGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-secondary tracking-tight mb-6 text-center">Writer's Guide</h1>
      <p className="text-xl text-slate-500 text-center mb-16">
        Everything you need to know to write compelling stories on our platform.
      </p>

      <div className="space-y-12">
        <section className="flex gap-6 items-start">
          <div className="bg-primary/10 p-4 rounded-2xl flex-shrink-0">
            <PenTool className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-secondary mb-3">1. Formatting Basics</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Use clean, descriptive headings properly formatted with H2 and H3 tags. Break long paragraphs into shorter, more readable chunks. White space is your friend.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-mono text-sm text-slate-600 space-y-2">
              <p># Main Title</p>
              <p>## Section Heading</p>
              <p>* Bullet points help structure lists</p>
            </div>
          </div>
        </section>

        <section className="flex gap-6 items-start">
          <div className="bg-primary/10 p-4 rounded-2xl flex-shrink-0">
            <Target className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-secondary mb-3">2. Engaging Your Audience</h3>
            <p className="text-slate-600 leading-relaxed">
              Start with a strong hook. Ask questions to encourage comments. Use high-quality images to break up text and illustrate your points naturally. Always attribute your sources!
            </p>
          </div>
        </section>

        <section className="flex gap-6 items-start">
          <div className="bg-primary/10 p-4 rounded-2xl flex-shrink-0">
            <Zap className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-secondary mb-3">3. SEO Best Practices</h3>
            <p className="text-slate-600 leading-relaxed">
              Include relevant keywords organically in your title, headings, and first paragraph. Craft a compelling meta description (excerpt) that summarizes the article's value.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
