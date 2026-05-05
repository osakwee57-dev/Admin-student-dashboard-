import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            InstiPortal <span className="text-indigo-600 font-medium">Admin</span>
          </span>
        </div>
        <div className="hidden sm:flex gap-4">
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            DB_CONNECTED: SUPABASE_LIVE
          </span>
        </div>
      </nav>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 md:p-12 gap-12 items-center justify-center max-w-7xl mx-auto w-full">
        
        {/* Branding & Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/3 space-y-6 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Manage your institution <span className="text-indigo-600">securely.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md mx-auto lg:mx-0">
            Register your academic facility or sign in to your dashboard using your unique 6-digit administrator PIN.
          </p>
          <div className="pt-4 space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 mt-1 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <p className="text-sm text-slate-600">Automatic 6-digit generation for secure admin access.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 mt-1 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <p className="text-sm text-slate-600">Supabase-backed encrypted credential management.</p>
            </div>
          </div>
        </motion.div>

        {/* Auth Container */}
        <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-6 lg:h-[520px]">
          {children}
        </div>
      </main>

      {/* Footer Status */}
      <footer className="h-12 bg-white border-t border-slate-100 flex items-center justify-center gap-4 md:gap-8 px-4 text-center">
        <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-semibold tracking-tighter">
          © 2026 Admin Central Portal
        </p>
        <div className="hidden md:block h-4 w-[1px] bg-slate-200"></div>
        <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-semibold tracking-tighter">
          Powered by Supabase v2.39
        </p>
        <div className="hidden md:block h-4 w-[1px] bg-slate-200"></div>
        <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-semibold tracking-tighter">
          Secure SSL Encryption Active
        </p>
      </footer>
    </div>
  );
}
