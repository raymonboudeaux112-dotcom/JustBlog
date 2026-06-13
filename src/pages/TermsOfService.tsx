import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-slate">
      <h1 className="text-4xl font-extrabold text-secondary mb-8">Terms of Service</h1>
      <p className="text-slate-500 mb-8 italic">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 text-slate-600">
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-4">1. Terms</h2>
          <p>
            By accessing the website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on the website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-4">3. Content Guidelines</h2>
          <p>
            When utilizing our platform for publishing, you agree not to submit material that is unlawful, defamatory, harassing, or otherwise objectionable. We reserve the right to remove any content that violates these terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-4">4. Limitations</h2>
          <p>
            In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our platform.
          </p>
        </section>
      </div>
    </div>
  );
}
