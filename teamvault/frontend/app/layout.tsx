import React from 'react';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'TeamVault - Vulnerable Target Application',
  description: 'Intentionally vulnerable educational full-stack application for OWASP API demonstration & SecureLens testing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col">
        {/* Warning Banner */}
        <div className="bg-red-950/80 border-b border-red-800/40 text-red-300 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>
            EDUCATIONAL TARGET SYSTEM: Intentionally contains deterministic OWASP API vulnerabilities (API1, API2, API3, API5). Dummy records only.
          </span>
        </div>

        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
          <p>TeamVault &copy; 2025. Academic Cybersecurity Target System for SecureLens Scanner Evaluation.</p>
        </footer>
      </body>
    </html>
  );
}
