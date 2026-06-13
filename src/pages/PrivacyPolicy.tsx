import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-slate">
      <h1 className="text-4xl font-extrabold text-secondary mb-8">Privacy Policy</h1>
      <p className="text-slate-500 mb-8 italic">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 text-slate-600">
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, profile picture, payment method, and other information you choose to provide.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-4">2. Use of Information</h2>
          <p>We may use the information we collect about you to:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>Provide, maintain, and improve our Services;</li>
            <li>Send you communications we think will be of interest to you;</li>
            <li>Personalize and improve the Services;</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Services;</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-4">3. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>
        </section>
      </div>
    </div>
  );
}
