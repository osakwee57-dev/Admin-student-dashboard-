import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    adminCode: ''
  });

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password || !loginData.adminCode) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', loginData.username)
      .eq('password', loginData.password)
      .eq('admin_code', loginData.adminCode)
      .single();

    setLoading(false);

    if (data) {
      localStorage.setItem('current_admin_code', data.admin_code);
      localStorage.setItem('institution_name', data.institution_name);
      navigate('/dashboard');
    } else {
      alert("Login failed. Check your credentials and 6-digit code.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200/40 border border-indigo-500 p-8 flex flex-col text-white"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Admin Sign In</h2>
        <p className="text-sm text-indigo-200">Access your dashboard</p>
      </div>

      <div className="space-y-5 flex-1">
        <div className="group">
          <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-[0.1em] mb-1.5 transition-colors group-focus-within:text-white">
            Admin Username
          </label>
          <input 
            type="text" 
            placeholder="Enter username" 
            className="w-full px-4 py-3 rounded-xl border border-indigo-400 bg-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-indigo-300 text-sm transition-all"
            onChange={(e) => setLoginData({...loginData, username: e.target.value})}
          />
        </div>

        <div className="group">
          <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-[0.1em] mb-1.5 transition-colors group-focus-within:text-white">
            Password
          </label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full px-4 py-3 rounded-xl border border-indigo-400 bg-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-indigo-300 text-sm transition-all"
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
          />
        </div>

        <div className="group">
          <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-[0.1em] mb-1.5 transition-colors group-focus-within:text-white">
            Unique 6-Digit Admin PIN
          </label>
          <div className="flex gap-2 justify-between">
             <input 
              type="text" 
              placeholder="000000" 
              maxLength={6} 
              className="w-full tracking-[0.5em] text-center px-4 py-3 rounded-xl border border-indigo-400 bg-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-white/20 font-mono text-lg placeholder:text-indigo-300 transition-all" 
              onChange={(e) => setLoginData({...loginData, adminCode: e.target.value})}
             />
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogin}
        disabled={loading}
        className="w-full mt-8 bg-white text-indigo-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-700/20"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        ) : (
          "Sign In to Portal"
        )}
      </button>
    </motion.div>
  );
}

