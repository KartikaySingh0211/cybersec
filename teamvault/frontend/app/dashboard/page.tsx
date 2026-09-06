'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, getMyDocuments, UserSession } from '../../lib/api';
import {
  User,
  Shield,
  FileText,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Lock,
  Terminal,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const fetchDocs = async () => {
      try {
        const data = await getMyDocuments();
        setDocuments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [router]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome, {user.name}</h1>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                user.role === 'ADMIN'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Email: <span className="text-slate-300">{user.email}</span> &bull; User ID:{' '}
            <span className="text-slate-300">{user.id}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/documents"
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Documents</span>
          </Link>

          <Link
            href="/security-demo"
            className="px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center space-x-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Security Demo Lab</span>
          </Link>

          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-md shadow-purple-500/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>
      </div>

      {/* Vulnerability Demo Callouts for Current User */}
      <div className="bg-gradient-to-r from-red-950/30 to-amber-950/20 border border-red-900/30 rounded-xl p-5 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 text-sm font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>Vulnerability Testing Shortcuts For This Session</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          You are currently signed in as <strong className="text-white">{user.name}</strong> ({user.role}). You can test all 4 vulnerabilities right now:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-red-400">1. Test BOLA (API1):</span>
            <p className="text-slate-400">
              Open one of your documents below, then change the ID in the browser URL to Bob&apos;s ID (<code className="text-amber-300">66d200000000000000000001</code>).
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-blue-400">2. Test BFLA (API5):</span>
            <p className="text-slate-400">
              Even if you are a normal USER, manually type <Link href="/admin" className="text-blue-400 underline hover:text-blue-300">/admin</Link> in the browser bar to access protected admin metrics!
            </p>
          </div>
        </div>
      </div>

      {/* My Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>My Documents ({documents.length})</span>
          </h2>
          <Link
            href="/documents"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading documents...</div>
        ) : error ? (
          <div className="p-4 bg-red-950/30 border border-red-800/40 text-red-300 text-xs rounded-lg">{error}</div>
        ) : documents.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-sm">
            No documents found. Click &quot;My Documents&quot; to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-base">{doc.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{doc.content}</p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">ID: {doc._id}</span>
                  <Link
                    href={`/documents/${doc._id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
