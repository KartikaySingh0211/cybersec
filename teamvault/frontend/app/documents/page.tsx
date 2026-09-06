'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMyDocuments, createDocument, getUser, UserSession } from '../../lib/api';
import {
  FileText,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Calendar
} from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Document Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);

  // Copy helper
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const current = getUser();
    if (!current) {
      router.push('/login');
      return;
    }
    setUser(current);

    loadDocs();
  }, [router]);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await getMyDocuments();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setCreating(true);
    try {
      await createDocument(newTitle, newContent);
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      await loadDocs();
    } catch (err: any) {
      alert('Error creating document: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Documents Workspace</h1>
          <p className="text-xs text-slate-400">Manage internal enterprise documents securely</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* User's Documents List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>My Documents ({documents.length})</span>
        </h2>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading your documents...</div>
        ) : error ? (
          <div className="p-4 bg-red-950/30 border border-red-800/40 text-red-300 text-xs rounded-lg">{error}</div>
        ) : documents.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-sm">
            You do not own any documents yet. Click &quot;New Document&quot; above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-base">{doc.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-3">{doc.content}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-500 font-mono text-[11px] truncate max-w-[160px]">
                      ID: {doc._id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(doc._id)}
                      title="Copy Document ID"
                      className="text-slate-500 hover:text-slate-300 transition"
                    >
                      {copiedId === doc._id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <Link
                    href={`/documents/${doc._id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
                  >
                    <span>Open Viewer</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Document</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Strategy Review"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Document Content</label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write confidential document content here..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition"
                >
                  {creating ? 'Creating...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
