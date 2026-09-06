'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, FileText, ArrowRight, UserCheck, Activity, CheckCircle2 } from 'lucide-react';
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
          <span>Enterprise Document Workspace</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          TeamVault Document Platform
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          A centralized, collaborative enterprise document management platform with robust access controls, fine-grained role governance, and organization telemetry.
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
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/documents"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium transition"
          >
            <FileText className="w-4 h-4" />
            <span>Browse Documents</span>
          </Link>
        </div>
      </div>

      {/* Test Accounts Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Workspace Test Accounts</span>
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
            <p className="text-[11px] text-blue-400 mt-2">Engineering & product roadmap notes</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Bob</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-mono">Role: USER</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">bob@teamvault.demo</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Password: <span className="text-slate-200 font-semibold">Password123!</span></p>
            <p className="text-[11px] text-amber-400 mt-2">Finance & corporate architecture plans</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Admin</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">Role: ADMIN</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">admin@teamvault.demo</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Password: <span className="text-slate-200 font-semibold">AdminPassword123!</span></p>
            <p className="text-[11px] text-purple-400 mt-2">System administration & telemetry</p>
          </div>
        </div>
      </div>

      {/* Core Platform Capabilities */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          <span>Core Platform Capabilities</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/40 transition">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base text-white">Document Isolation & Workspaces</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Dedicated workspaces for team members to draft, organize, and store confidential business records and strategies with granular owner-level visibility.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Enterprise Identity & Sessions</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Stateless JWT authentication and secure bearer session verification designed for high-availability enterprise environments.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/40 transition">
            <div className="flex items-center space-x-2 mb-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-base text-white">Role & Attribute Governance</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Controlled user profiles with deterministic role hierarchy distinctions between standard organization contributors and system administrators.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 transition">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-white">Administrative Control Plane</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Centralized administrative dashboard providing platform-wide telemetry, user directory auditing, and global document metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

