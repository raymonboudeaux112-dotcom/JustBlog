import { Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-6 tracking-tight">Get in touch</h1>
          <p className="text-lg text-slate-500">Have a question about publishing, technical issues, or just want to say hi? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-secondary mb-8">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-primary rounded-xl">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-secondary">Email</p>
                    <p className="text-slate-500 mt-1">hello@justblog.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-primary rounded-xl">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-secondary">Office</p>
                    <p className="text-slate-500 mt-1">100 Premium Way, Suite 400<br />San Francisco, CA 94107</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-primary rounded-xl">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-secondary">Phone</p>
                    <p className="text-slate-500 mt-1">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-slate-200 h-64 rounded-3xl overflow-hidden relative border border-slate-100 shadow-sm">
              {!hasValidKey ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-white p-6 text-sm text-center">
                  <span className="font-semibold text-slate-700 mb-2">Google Maps API Key Required</span>
                  <p className="mb-2">1. Get a key from Google Cloud Console.</p>
                  <p>2. Open <strong>Settings &rarr; Secrets</strong>, add <code>GOOGLE_MAPS_PLATFORM_KEY</code>, and hit Enter.</p>
                </div>
              ) : (
                <APIProvider apiKey={API_KEY} version="weekly">
                  <Map
                    defaultCenter={{lat: 37.7749, lng: -122.4194}} // San Francisco
                    defaultZoom={13}
                    mapId="CONTACT_MAP_ID"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{width: '100%', height: '100%'}}
                  >
                    <AdvancedMarker position={{lat: 37.7749, lng: -122.4194}}>
                      <Pin background="#2563eb" glyphColor="#fff" borderColor="#1e40af" />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold text-secondary mb-8">Send a Message</h3>
            
            {submitted ? (
              <div className="p-6 bg-green-50 text-green-700 rounded-2xl border border-green-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-green-600" />
                </div>
                <p className="font-semibold text-lg">Message sent successfully!</p>
                <p className="text-sm mt-2">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea required rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none" placeholder="Your message here..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-sm focus:ring-4 focus:ring-primary/20">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
