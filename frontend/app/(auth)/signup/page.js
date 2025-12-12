'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/signup', formData);
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 bg-[var(--bg-primary)]">
      <div className="glass-panel w-full max-w-md animate-slide-up">
        <h1 className="text-3xl font-bold text-center mb-2">Get Started</h1>
        <p className="text-center text-[var(--text-secondary)] mb-8">Create your account to automate replies</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="email"
                className="w-full bg-background/50 border border-input rounded-lg py-3 pl-10 pr-4 text-foreground focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-all placeholder:text-muted-foreground"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="password"
                className="w-full bg-background/50 border border-input rounded-lg py-3 pl-10 pr-4 text-foreground focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-all placeholder:text-muted-foreground"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'} 
            {!loading && <ArrowRight size={18} className="ml-2" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account? <Link href="/login" className="text-[var(--accent-primary)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
