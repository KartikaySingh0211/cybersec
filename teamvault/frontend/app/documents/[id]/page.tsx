'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getDocumentById, getUser, UserSession } from '../../../lib/api';
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  User,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.id as string;

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testInputId, setTestInputId] = useState('');

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    if (documentId) {
      loadDocument(documentId);
    }
  }, [documentId, router]);

  const loadDocument = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocumentById(id);
      setDoc(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve document');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchId = (e: React.FormEvent) => {
    e.preventDefault();
    if (testInputId.trim()) {
      router.push(`/documents/${testInputId.trim()}`);
    }
  };

  const isOwner =
    doc && currentUser && (doc.ownerId?._id === currentUser.id || doc.ownerId === currentUser.id);

  const isBolaBreach = doc && currentUser && !isOwner;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/documents"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Documents</span>
        </Link>

        <span className="text-xs text-slate-500 font-mono">Document ID: {documentId}</span>
      </div>

      {/* Live BOLA Vulnerability Evaluation Callout */}
      {isBolaBreach && (
        <div className="p-5 rounded-xl bg-red-950/40 border-2 border-red-500 text-red-200 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
            <span>🚨 VULNERABILITY CONFIRMED: OWASP API1 - BOLA ACTIVE!</span>
          </div>
          <p className="text-xs leading-relaxed text-red-200">
            You are currently signed in as <strong className="text-white underline">{currentUser?.name}</strong>{' '}
            (ID: <code className="font-mono text-red-300">{currentUser?.id}</code>), but you were able to view{' '}
            <strong className="text-white underline">{doc.ownerId?.name || 'Another User'}&apos;s</strong> document (Owner ID:{' '}
            <code className="font-mono text-red-300">{doc.ownerId?._id || doc.ownerId}</code>).
          </p>
          <p className="text-[11px] text-red-300/80">
            The backend controller <code className="text-red-200">GET /api/documents/:id</code> executed without validating that{' '}
            <code className="text-red-200">document.ownerId === req.user.id</code>.
          </p>
        </div>
      )}

      {isOwner && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Standard Access: You are the verified owner of this document.</span>
        </div>
      )}

      {/* Main Document Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading document record...</div>
      ) : error ? (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="font-bold text-white text-sm">Document Retrieval Failed</h3>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      ) : doc ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800/80 pb-4 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{doc.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  Owner:{' '}
                  <strong className={isBolaBreach ? 'text-red-400' : 'text-slate-200'}>
                    {doc.ownerId?.name || 'User'} ({doc.ownerId?.email || doc.ownerId})
                  </strong>
                </span>
              </span>

              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Created: {new Date(doc.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Document Body</h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
              {doc.content}
            </div>
          </div>
        </div>
      ) : null}

      {/* BOLA Quick Switch Tester Box */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Manual URL Manipulation Tester (BOLA)
        </h3>
        <p className="text-xs text-slate-400">
          Enter any document ID below to test if you can read unauthorized records through URL parameter tampering:
        </p>
        <form onSubmit={handleSwitchId} className="flex gap-2">
          <input
            type="text"
            value={testInputId}
            onChange={(e) => setTestInputId(e.target.value)}
            placeholder="Paste target document ID (e.g. 66d200000000000000000001)"
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
          >
            <span>Navigate</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
