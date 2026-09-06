import React from 'react';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'TeamVault — Secure Enterprise Document Management',
  description: 'Multi-user collaborative document management and enterprise workspace.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
          <p>TeamVault Platform &copy; 2025. Enterprise Document Management System.</p>
        </footer>
      </body>
    </html>
  );
}
