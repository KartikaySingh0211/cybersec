'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAdminStatistics, getAdminUsers, getUser, UserSession } from '../../lib/api';
import {
  Lock,
  ShieldAlert,
  Users,
  FileText,
  Activity,
  Server,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [statsData, usersData] = await Promise.all([
          getAdminStatistics(),
          getAdminUsers(),
        ]);
        setStats(statsData.statistics || statsData);
        setUsers(usersData.users || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load administrative data');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [router]);

  const isBflaExploited = currentUser && currentUser.role !== 'ADMIN';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Administrative Control Plane</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Admin Only
            </span>
          </div>
          <p className="text-xs text-slate-400">Restricted system monitoring and user account management</p>
        </div>

        <Link
          href="/admin/users"
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-purple-500/20"
        >
          <Users className="w-4 h-4" />
          <span>Manage Users</span>
        </Link>
      </div>

      {/* BFLA Live Exploitation Banner */}
      {isBflaExploited && (
        <div className="p-5 rounded-xl bg-red-950/40 border-2 border-red-500 text-red-200 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
            <span>🚨 VULNERABILITY CONFIRMED: OWASP API5 - BFLA ACTIVE!</span>
          </div>
          <p className="text-xs leading-relaxed text-red-200">
            You navigated directly to <code className="font-mono text-white bg-slate-900 px-1 py-0.5 rounded">/admin</code> as{' '}
            <strong className="text-white underline">{currentUser?.name}</strong> whose account role is{' '}
            <strong className="text-amber-300 uppercase underline">{currentUser?.role}</strong> (not ADMIN).
          </p>
          <p className="text-[11px] text-red-300/80">
            The backend endpoints <code className="text-red-200">GET /api/admin/users</code> and{' '}
            <code className="text-red-200">GET /api/admin/statistics</code> authenticated your JWT but failed to check if{' '}
            <code className="text-red-200">req.user.role === &apos;ADMIN&apos;</code>, exposing administrative telemetry and all registered users!
          </p>
        </div>
      )}

      {!isBflaExploited && currentUser && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Legitimate Access: You are signed in as an administrator account.</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading admin telemetry...</div>
      ) : error ? (
        <div className="p-4 bg-red-950/30 border border-red-800/40 text-red-300 text-xs rounded-lg">{error}</div>
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">System Admins</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalAdmins}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">Total Documents</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalDocuments}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">System Status</p>
                <p className="text-base font-bold text-emerald-400 mt-1">{stats.systemStatus}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Users List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Registered Platform Users ({users.length})</span>
              </h2>
              <Link
                href="/admin/users"
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-1"
              >
                <span>Full user table</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/60">
              {users.slice(0, 5).map((u) => (
                <div key={u._id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-white">{u.name}</span>
                    <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      ID: {u._id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
