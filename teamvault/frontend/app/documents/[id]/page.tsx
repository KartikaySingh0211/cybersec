'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getDocumentById, getUser, UserSession } from '../../../lib/api';
import {
  User,
  Calendar,
  ArrowLeft,
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
                  <strong className="text-slate-200">
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
    </div>
  );
}

