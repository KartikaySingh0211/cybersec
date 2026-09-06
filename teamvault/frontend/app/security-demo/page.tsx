'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getUser,
  impersonateUser,
  updateProfile,
  UserSession
} from '../../lib/api';
import {
  ShieldAlert,
  Terminal,
  ExternalLink,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  Code
} from 'lucide-react';

export default function SecurityDemoPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // API2 State
  const [impersonateTargetId, setImpersonateTargetId] = useState('66d000000000000000000002');
  const [impersonateLoading, setImpersonateLoading] = useState(false);
  const [impersonateResult, setImpersonateResult] = useState<any>(null);

  // API3 State
  const [boplaRole, setBoplaRole] = useState<'USER' | 'ADMIN'>('ADMIN');
  const [boplaIsAdmin, setBoplaIsAdmin] = useState(true);
  const [boplaLoading, setBoplaLoading] = useState(false);
  const [boplaResult, setBoplaResult] = useState<any>(null);

  // API1 State
  const [targetDocId, setTargetDocId] = useState('66d200000000000000000001');

  useEffect(() => {
    setCurrentUser(getUser());
    const onAuthChange = () => setCurrentUser(getUser());
    window.addEventListener('auth-change', onAuthChange);
    return () => window.removeEventListener('auth-change', onAuthChange);
  }, []);

  const handleImpersonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setImpersonateLoading(true);
    setImpersonateResult(null);

    try {
      const res = await impersonateUser(impersonateTargetId);
      setImpersonateResult({
        success: true,
        message: `Successfully impersonated ${res.user.name} (${res.user.role})!`,
        data: res,
      });
    } catch (err: any) {
      setImpersonateResult({
        success: false,
        message: err.message || 'Impersonation failed',
      });
    } finally {
      setImpersonateLoading(false);
    }
  };

  const handleBoplaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBoplaLoading(true);
    setBoplaResult(null);

    try {
      // Intentionally sends protected properties role and isAdmin
      const res = await updateProfile({
        role: boplaRole,
        isAdmin: boplaIsAdmin,
      });
      setBoplaResult({
        success: true,
        message: `Privilege escalation executed! Account role is now "${res.user?.role}" (isAdmin: ${res.user?.isAdmin}).`,
        user: res.user,
      });
    } catch (err: any) {
      setBoplaResult({
        success: false,
        message: err.message || 'BOPLA exploit failed',
      });
    } finally {
      setBoplaLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Security Demonstration Lab</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          OWASP API Top 10 Vulnerability Demonstrations
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          This lab explains the four deterministic vulnerabilities implemented in TeamVault. Each vulnerability can be reproduced safely in a browser without external exploit frameworks or Kali Linux.
        </p>

        {currentUser && (
          <div className="mt-4 p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Active Browser Session:{' '}
              <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
            </span>
            <span className="font-mono text-slate-400">
              Role: <strong className={currentUser.role === 'ADMIN' ? 'text-purple-400' : 'text-blue-400'}>{currentUser.role}</strong> &bull; isAdmin: {currentUser.isAdmin ? 'true' : 'false'}
            </span>
          </div>
        )}
      </div>

      {/* ========================================================
          VULNERABILITY 1: API1 - BOLA
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30">
                OWASP API1:2023
              </span>
              <h2 className="text-lg font-bold text-white">Broken Object Level Authorization (BOLA)</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Vulnerable Endpoint: <span className="text-red-300">GET /api/documents/:id</span>
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">// SECURELENS-DEMO-VULN: API1-BOLA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Vulnerability Description &amp; Mechanism</span>
            </h3>
            <p className="leading-relaxed text-slate-400">
              The backend retrieves documents solely by ID (<code className="text-slate-200">Document.findById(documentId)</code>) and fails to verify that the requesting user owns the object (<code className="text-red-300">document.ownerId === authenticatedUser.id</code>).
            </p>

            <h3 className="font-bold text-white text-sm pt-2">Safe Browser Demonstration Steps:</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
              <li>Log in as <strong className="text-white">Alice</strong> (<code className="text-slate-300">alice@teamvault.demo</code>).</li>
              <li>Open Alice&apos;s own document (<code className="text-blue-300">/documents/66d100000000000000000001</code>).</li>
              <li>In your browser address bar, replace Alice&apos;s ID with Bob&apos;s ID: <code className="text-amber-300">66d200000000000000000001</code>.</li>
              <li>Press Enter to navigate.</li>
            </ol>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-white">Expected Vulnerable Result:</strong> Bob&apos;s confidential &quot;Bob Financial Summary&quot; is rendered and displayed to Alice.
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/90 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Direct Browser Test (URL Switcher)
              </h4>
              <p className="text-xs text-slate-400">
                Navigate directly to Bob&apos;s document to test if your current session can read cross-tenant records:
              </p>
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] text-slate-400 font-mono">Target Document ID</label>
                <input
                  type="text"
                  value={targetDocId}
                  onChange={(e) => setTargetDocId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/documents/${targetDocId}`}
                className="w-full py-2.5 px-4 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 text-xs font-semibold flex items-center justify-center space-x-2 transition"
              >
                <span>Navigate to Target Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[10px] text-slate-500 text-center font-mono">
                Known Bob IDs: <code>66d200000000000000000001</code>, <code>66d200000000000000000002</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          VULNERABILITY 2: API2 - BROKEN AUTHENTICATION
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                OWASP API2:2023
              </span>
              <h2 className="text-lg font-bold text-white">Broken Authentication (Identity Parameter Bypass)</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Vulnerable Endpoint: <span className="text-amber-300">GET /api/demo-auth/impersonate?userId=&lt;id&gt;</span>
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">// SECURELENS-DEMO-VULN: API2-BROKEN-AUTH</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Vulnerability Description &amp; Mechanism</span>
            </h3>
            <p className="leading-relaxed text-slate-400">
              The application contains an insecure demo route that directly establishes an authenticated session based entirely on a client-supplied <code className="text-amber-300">userId</code> parameter without requiring or verifying credentials.
            </p>

            <h3 className="font-bold text-white text-sm pt-2">Safe Browser Demonstration Steps:</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
              <li>Review the form on the right.</li>
              <li>Select Bob or Admin from the quick selector.</li>
              <li>Click &quot;Impersonate User Without Password&quot;.</li>
            </ol>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-white">Expected Vulnerable Result:</strong> The backend signs and returns a full JWT token for the chosen user, instantly switching the active session.
            </div>
          </div>

          {/* Demonstration Form */}
          <form
            onSubmit={handleImpersonate}
            className="bg-slate-950 p-5 rounded-xl border border-slate-800/90 space-y-4"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Impersonation Bypass Form
                </h4>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  Demo Only
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                &quot;Intentional educational vulnerability demonstration.&quot;
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400">Quick Select Dummy User:</label>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImpersonateTargetId('66d000000000000000000001')}
                  className={`p-1.5 rounded border text-center transition ${
                    impersonateTargetId === '66d000000000000000000001'
                      ? 'bg-blue-600/30 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Alice
                </button>
                <button
                  type="button"
                  onClick={() => setImpersonateTargetId('66d000000000000000000002')}
                  className={`p-1.5 rounded border text-center transition ${
                    impersonateTargetId === '66d000000000000000000002'
                      ? 'bg-blue-600/30 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Bob
                </button>
                <button
                  type="button"
                  onClick={() => setImpersonateTargetId('66d000000000000000000003')}
                  className={`p-1.5 rounded border text-center transition ${
                    impersonateTargetId === '66d000000000000000000003'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-mono">Target User ID</label>
              <input
                type="text"
                required
                value={impersonateTargetId}
                onChange={(e) => setImpersonateTargetId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={impersonateLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition"
            >
              {impersonateLoading ? (
                <span>Executing bypass...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Impersonate User Without Password</span>
                </>
              )}
            </button>

            {impersonateResult && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  impersonateResult.success
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/40 border border-red-800/60 text-red-300'
                }`}
              >
                {impersonateResult.message}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ========================================================
          VULNERABILITY 3: API3 - BOPLA
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                OWASP API3:2023
              </span>
              <h2 className="text-lg font-bold text-white">
                Broken Object Property Level Authorization (BOPLA)
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Vulnerable Endpoint: <span className="text-purple-300">PATCH /api/users/profile</span>
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">// SECURELENS-DEMO-VULN: API3-BOPLA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-purple-400" />
              <span>Vulnerability Description &amp; Mechanism</span>
            </h3>
            <p className="leading-relaxed text-slate-400">
              The profile update endpoint uses <code className="text-slate-200">User.findByIdAndUpdate(userId, req.body)</code> directly without property allowlisting. Sensitive model properties like <code className="text-purple-300">role</code> and <code className="text-purple-300">isAdmin</code> are not filtered by the backend.
            </p>

            <h3 className="font-bold text-white text-sm pt-2">Safe Browser Demonstration Steps:</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
              <li>Log in as standard user <strong className="text-white">Alice</strong>.</li>
              <li>Observe that Alice has <code className="text-slate-300">role: USER</code> and cannot access the admin portal.</li>
              <li>Using the mass assignment form on the right, toggle <code className="text-purple-300">role = ADMIN</code> and <code className="text-purple-300">isAdmin = true</code>.</li>
              <li>Click &quot;Inject Protected Properties&quot;.</li>
            </ol>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-white">Expected Vulnerable Result:</strong> The backend persists the injected admin role, elevating Alice&apos;s account permissions immediately.
            </div>
          </div>

          {/* Demonstration Form */}
          <form
            onSubmit={handleBoplaSubmit}
            className="bg-slate-950 p-5 rounded-xl border border-slate-800/90 space-y-4"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Mass Assignment Injection Form
                </h4>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                  Demo Only
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                &quot;Intentional educational vulnerability demonstration.&quot;
              </p>
            </div>

            <div className="space-y-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white">Target Role Property:</label>
                <select
                  value={boplaRole}
                  onChange={(e) => setBoplaRole(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                >
                  <option value="ADMIN">ADMIN (Privilege Escalation)</option>
                  <option value="USER">USER (Standard Role)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white">Target isAdmin Property:</label>
                <input
                  type="checkbox"
                  checked={boplaIsAdmin}
                  onChange={(e) => setBoplaIsAdmin(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                />
              </div>

              <div className="text-[11px] font-mono text-purple-300 bg-slate-950 p-2 rounded border border-purple-900/30">
                Payload: {JSON.stringify({ role: boplaRole, isAdmin: boplaIsAdmin })}
              </div>
            </div>

            <button
              type="submit"
              disabled={boplaLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition"
            >
              {boplaLoading ? (
                <span>Submitting payload...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inject Protected Properties (PATCH)</span>
                </>
              )}
            </button>

            {boplaResult && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  boplaResult.success
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/40 border border-red-800/60 text-red-300'
                }`}
              >
                {boplaResult.message}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ========================================================
          VULNERABILITY 4: API5 - BFLA
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                OWASP API5:2023
              </span>
              <h2 className="text-lg font-bold text-white">
                Broken Function Level Authorization (BFLA)
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Vulnerable Endpoints: <span className="text-blue-300">GET /api/admin/users</span>, <span className="text-blue-300">GET /api/admin/statistics</span>
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">// SECURELENS-DEMO-VULN: API5-BFLA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Vulnerability Description &amp; Mechanism</span>
            </h3>
            <p className="leading-relaxed text-slate-400">
              The backend routes for administrative telemetry verify that the user has a valid JWT token, but <strong className="text-white">fail to inspect user.role === &apos;ADMIN&apos;</strong>. An authenticated standard user can execute administrative functions directly.
            </p>

            <h3 className="font-bold text-white text-sm pt-2">Safe Browser Demonstration Steps:</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
              <li>Sign in as normal user <strong className="text-white">Alice</strong> (<code className="text-slate-300">role: USER</code>).</li>
              <li>Notice Alice does not have an &quot;Admin&quot; button in the header.</li>
              <li>Manually type <code className="text-blue-300">/admin</code> in the browser URL bar, or click the button on the right.</li>
            </ol>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-white">Expected Vulnerable Result:</strong> The administrative dashboard loads, revealing system metrics, registered user counts, and user directory without authorization challenge.
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/90 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Direct Administrative Access Test
              </h4>
              <p className="text-xs text-slate-400">
                Test if your current user session can invoke restricted administrative controllers without holding the ADMIN role:
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/admin"
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-500/20"
              >
                <span>Navigate to /admin (BFLA Test)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/users"
                className="w-full py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center space-x-2 transition"
              >
                <span>Navigate to /admin/users</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
