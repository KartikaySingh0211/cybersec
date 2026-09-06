'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api';
import { Lock, Mail, User, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Ensure backend server is running and database is seeded.');
    } finally {
      setLoading(false);
    }
  };

  const quickFillAndSubmit = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setLoading(true);

    try {
      await login(demoEmail, demoPass);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Ensure backend server is running and database is seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to TeamVault</h1>
        <p className="text-sm text-slate-400">
          Enter credentials or click any demo persona below for immediate access.
        </p>
      </div>

      {/* Quick Demo Personas */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <User className="w-3.5 h-3.5 text-blue-400" />
          <span>One-Click Demo Personas</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => quickFillAndSubmit('alice@teamvault.demo', 'Password123!')}
            className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/60 text-left transition group"
          >
            <div className="text-xs font-bold text-white group-hover:text-blue-400">Alice</div>
            <div className="text-[10px] text-slate-400">Role: USER</div>
          </button>

          <button
            type="button"
            onClick={() => quickFillAndSubmit('bob@teamvault.demo', 'Password123!')}
            className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/60 text-left transition group"
          >
            <div className="text-xs font-bold text-white group-hover:text-blue-400">Bob</div>
            <div className="text-[10px] text-slate-400">Role: USER</div>
          </button>

          <button
            type="button"
            onClick={() => quickFillAndSubmit('admin@teamvault.demo', 'AdminPassword123!')}
            className="p-2.5 rounded-lg bg-slate-950 border border-purple-900/50 hover:border-purple-500/60 text-left transition group"
          >
            <div className="text-xs font-bold text-purple-300 group-hover:text-purple-200">Admin</div>
            <div className="text-[10px] text-purple-400/80">Role: ADMIN</div>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alice@teamvault.demo"
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password123!"
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
