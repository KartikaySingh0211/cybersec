'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProfile, getUser, UserSession } from '../../lib/api';
import { UserCheck, Shield, Mail, Calendar, Edit3, Terminal, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const current = getUser();
    if (!current) {
      router.push('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="p-4 bg-red-950/30 border border-red-800/40 text-red-300 text-xs rounded-lg">
        {error || 'Unable to load profile'}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Profile</h1>
          <p className="text-xs text-slate-400">Manage account information & inspect permission attributes</p>
        </div>

        <Link
          href="/profile/edit"
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </Link>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl divide-y divide-slate-800/60">
        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Full Name</span>
          </span>
          <span className="text-sm font-semibold text-white">{profile.name}</span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Email Address</span>
          </span>
          <span className="text-sm font-mono text-slate-200">{profile.email}</span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>System Role</span>
          </span>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
              profile.role === 'ADMIN'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {profile.role}
          </span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>isAdmin Flag (Protected)</span>
          </span>
          <span className="text-sm font-mono text-slate-300">
            {profile.isAdmin ? (
              <span className="text-green-400 font-bold">true</span>
            ) : (
              <span className="text-slate-500">false</span>
            )}
          </span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Account Created</span>
          </span>
          <span className="text-xs font-mono text-slate-400">
            {new Date(profile.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">User ObjectId</span>
          <span className="text-xs font-mono text-slate-500">{profile._id}</span>
        </div>
      </div>

      {/* BOPLA vulnerability educational note */}
      <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-900/30 space-y-2">
        <div className="flex items-center space-x-2 text-purple-300 text-xs font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Notice: BOPLA (API3) Privilege Escalation Vulnerability</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The backend endpoint <code className="text-slate-300">PATCH /api/users/profile</code> does not filter protected properties like <code className="text-purple-300">role</code> and <code className="text-purple-300">isAdmin</code>. You can perform mass assignment via the interactive form on the{' '}
          <Link href="/security-demo" className="text-purple-300 underline hover:text-purple-200">
            Security Demo Page
          </Link>{' '}
          to escalate your role from USER to ADMIN!
        </p>
      </div>
    </div>
  );
}
