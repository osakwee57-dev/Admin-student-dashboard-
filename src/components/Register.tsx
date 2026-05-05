import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'motion/react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    institution: '',
    username: '',
    password: '',
    passcode: ''
  });

  const handleRegister = async () => {
    if (!formData.institution || !formData.username || !formData.password || !formData.passcode) {
      alert("Please fill in all fields.");
      return;
    }

    if (formData.passcode !== "PASS") {
      alert("Invalid Registration Passcode!");
      return;
    }

    setLoading(true);
    const adminCode = Math.floor(100000 + Math.random() * 900000).toString();

    const { error } = await supabase
      .from('admins')
      .insert([
        { 
          institution_name: formData.institution, 
          username: formData.username, 
          password: formData.password, 
          admin_code: adminCode 
        }
      ]);

    setLoading(false);

    if (error) {
      alert("Error registering: " + error.message);
    } else {
      alert(`Registration Successful! YOUR 6-DIGIT CODE IS: ${adminCode}. Write it down!`);
      navigate('/login');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 flex flex-col"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Create Admin Account</h2>
        <p className="text-sm text-slate-400">New Institution Registration</p>
      </div>
      
      <div className="space-y-5 flex-1">
        <div className="group">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-1.5 transition-colors group-focus-within:text-indigo-600">
            Institution Name
          </label>
          <input 
            type="text" 
            placeholder="e.g. Oakridge Academy" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
            onChange={(e) => setFormData({...formData, institution: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-1.5 transition-colors group-focus-within:text-indigo-600">
              Admin Username
            </label>
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="group">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-1.5 transition-colors group-focus-within:text-indigo-600">
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-1.5 transition-colors group-focus-within:text-indigo-600">
            Registration Passcode
          </label>
          <input 
            type="text" 
            placeholder="Enter 'PASS'" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
            onChange={(e) => setFormData({...formData, passcode: e.target.value})}
          />
        </div>
      </div>

      <button 
        onClick={handleRegister}
        disabled={loading}
        className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Create Institution Account"
        )}
      </button>
    </motion.div>
  );
}

