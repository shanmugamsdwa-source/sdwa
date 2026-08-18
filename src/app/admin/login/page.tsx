'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      const code = err?.code || '';
      const message = err?.message || '';

      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        message.includes('auth/invalid-credential') ||
        message.includes('auth/wrong-password') ||
        message.includes('INVALID_LOGIN_CREDENTIALS')
      ) {
        setError('Invalid email or password. Please verify your credentials.');
      } else if (
        code === 'auth/user-not-found' ||
        message.includes('auth/user-not-found') ||
        message.includes('EMAIL_NOT_FOUND')
      ) {
        setError('No administrator account found with this email. Please check your email or create the account in Firebase Console.');
      } else if (code === 'auth/invalid-email' || message.includes('auth/invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests' || message.includes('auth/too-many-requests')) {
        setError('Access temporarily disabled due to multiple failed attempts. Please try again later.');
      } else if (message.includes('Not authorized')) {
        setError('This account does not have administrator privileges.');
      } else {
        setError(message || 'Unable to sign in. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)] mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">SDWA Admin</h1>
          <p className="text-slate-400 mt-1">
            Sign in to manage the association
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1e293b] rounded-2xl p-8 shadow-2xl border border-slate-700/50"
        >
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@sdwa.in"
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 px-6 py-3.5 bg-[var(--color-accent)] text-white rounded-xl font-semibold hover:bg-[var(--color-accent-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[#1e293b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          Salem District Weightlifting Association
        </p>
      </div>
    </div>
  );
}
