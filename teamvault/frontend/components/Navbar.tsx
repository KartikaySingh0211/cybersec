'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, clearSession, UserSession } from '../lib/api';
import { Shield, FileText, LayoutDashboard, UserCheck, LogOut, Lock } from 'lucide-react';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const update = () => setCurrentUser(getUser());
    update();
    window.addEventListener('auth-change', update);
    return () => window.removeEventListener('auth-change', update);
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition">
                  TeamVault
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">Enterprise Document Workspace</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {currentUser && (
            <>
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 ${
                  pathname === '/dashboard'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/documents"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 ${
                  pathname.startsWith('/documents')
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </Link>
              <Link
                href="/profile"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 ${
                  pathname.startsWith('/profile')
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              {/* Admin link shown if client has ADMIN role, though BFLA allows anyone to hit /admin */}
              {currentUser.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center space-x-1.5 ${
                    pathname.startsWith('/admin')
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                      : 'text-purple-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* User Status / Login */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="flex items-center justify-end space-x-1">
                  <span
                    className={`inline-block px-1.5 py-0.2 text-[10px] font-bold rounded ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
