'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, FileText, Terminal, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import { getUser, UserSession } from '../lib/api';

export default function HomePage() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Controlled Academic Target Application</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          TeamVault Document Platform
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          A multi-user enterprise document workspace built with intentional, deterministic OWASP API vulnerabilities for static security scanner detection and automated patching.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/20 transition"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/20 transition"
            >
              <span>Sign In as Demo User</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/security-demo"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium transition"
          >
            <Terminal className="w-4 h-4" />
            <span>Interactive Security Demo</span>
          </Link>
        </div>
      </div>

      {/* Demo Credentials Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Deterministic Demo Accounts</span>
          </h2>
          <span className="text-xs text-slate-500">Seed with: <code>npm run seed</code></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Alice</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-mono">Role: USER</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">alice@teamvault.demo</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Password: <span className="text-slate-200 font-semibold">Password123!</span></p>
            <p className="text-[11px] text-blue-400 mt-2">Owns 2 confidential roadmap documents</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Bob</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-mono">Role: USER</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">bob@teamvault.demo</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Password: <span className="text-slate-200 font-semibold">Password123!</span></p>
            <p className="text-[11px] text-amber-400 mt-2">Owns financial & architecture records</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Admin</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">Role: ADMIN</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">admin@teamvault.demo</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Password: <span className="text-slate-200 font-semibold">AdminPassword123!</span></p>
            <p className="text-[11px] text-purple-400 mt-2">Full system administrator access</p>
          </div>
        </div>
      </div>

      {/* The 4 OWASP Vulnerabilities Matrix */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>The Four Intentional OWASP API Vulnerabilities</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vulnerability 1: BOLA */}
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-red-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30">
                OWASP API1:2023
              </span>
              <span className="text-xs text-slate-400 font-mono">GET /api/documents/:id</span>
            </div>
            <h3 className="font-bold text-base text-white">Broken Object Level Authorization (BOLA)</h3>
            <p className="text-sm text-slate-400 mt-1">
              Alice accesses her document in the browser. By simply replacing the document ID in the URL with Bob&apos;s document ID, Bob&apos;s confidential file is exposed without ownership verification.
            </p>
          </div>

          {/* Vulnerability 2: Broken Auth */}
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                OWASP API2:2023
              </span>
              <span className="text-xs text-slate-400 font-mono">GET /api/demo-auth/impersonate</span>
            </div>
            <h3 className="font-bold text-base text-white">Broken Authentication (Identity Parameter Bypass)</h3>
            <p className="text-sm text-slate-400 mt-1">
              A demo authentication route blindly accepts a user ID query parameter and establishes a full session without password or credential verification.
            </p>
          </div>

          {/* Vulnerability 3: BOPLA */}
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                OWASP API3:2023
              </span>
              <span className="text-xs text-slate-400 font-mono">PATCH /api/users/profile</span>
            </div>
            <h3 className="font-bold text-base text-white">Broken Object Property Level Authorization (BOPLA)</h3>
            <p className="text-sm text-slate-400 mt-1">
              The profile update endpoint blindly applies <code className="text-slate-300">req.body</code> into the database model, allowing a standard user to escalate privileges by injecting <code className="text-purple-300">{`"role": "ADMIN"`}</code>.
            </p>
          </div>

          {/* Vulnerability 4: BFLA */}
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                OWASP API5:2023
              </span>
              <span className="text-xs text-slate-400 font-mono">GET /api/admin/users</span>
            </div>
            <h3 className="font-bold text-base text-white">Broken Function Level Authorization (BFLA)</h3>
            <p className="text-sm text-slate-400 mt-1">
              The admin route verifies that the requester is authenticated, but fails to check if their role is <code className="text-slate-300">ADMIN</code>. A regular user can view the full administrative records simply by browsing to <code className="text-blue-300">/admin</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
