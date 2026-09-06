'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAdminUsers, getUser, UserSession } from '../../../lib/api';
import { Users, ArrowLeft, ShieldAlert, Copy, Check, Lock, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await getAdminUsers();
        setUsers(data.users || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load user management records');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [router]);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isBflaActive = currentUser && currentUser.role !== 'ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Link
          href="/admin"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System User Directory</h1>
          <p className="text-xs text-slate-400">View and audit all registered platform accounts</p>
        </div>
      </div>

      {isBflaActive && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>
            BFLA Active: You are viewing confidential user records as standard user <strong className="text-white">{currentUser?.name}</strong>.
          </span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading users list...</div>
      ) : error ? (
        <div className="p-4 bg-red-950/30 border border-red-800/40 text-red-300 text-xs rounded-lg">{error}</div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">isAdmin</th>
                  <th className="px-4 py-3">User ObjectId</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3 font-semibold text-white">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {u.isAdmin ? (
                        <span className="text-emerald-400 font-bold">true</span>
                      ) : (
                        <span className="text-slate-500">false</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <span>{u._id}</span>
                        <button
                          onClick={() => copyId(u._id)}
                          className="hover:text-slate-300 transition"
                          title="Copy ID"
                        >
                          {copiedId === u._id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
