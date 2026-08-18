'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-6">
      <div className="space-y-1">
        <span className="text-[#92400E] font-oswald text-xs font-bold uppercase tracking-widest">
          Direct Secretariat Enquiry
        </span>
        <h3 className="font-oswald text-2xl font-bold uppercase text-[#0F172A]">
          Send an Official Message
        </h3>
        <p className="text-xs text-slate-500">
          Our secretariat staff will review your submission and respond via email or telephone.
        </p>
      </div>

      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3 text-green-800 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Message Sent Successfully</p>
            <p className="mt-0.5 text-green-700">
              Thank you for contacting the Salem District Weightlifting Association. We will reply to your enquiry promptly.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-xs sm:text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Transmission Error</p>
            <p className="mt-0.5 text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Shanmugam"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@domain.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="09944301212"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Enquiry / Message Details <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Describe your inquiry regarding championship entries, affiliation registration, or coach certification..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-gold w-full sm:w-auto px-8 py-3.5 rounded-xl font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow hover:shadow-md transition disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>TRANSMITTING MESSAGE...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>TRANSMIT ENQUIRY</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
