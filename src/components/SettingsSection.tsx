import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'motion/react';
import { Shield, Building2, User, Key, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SettingsSectionProps {
  adminCode: string;
  onUpdateInstitution?: (name: string) => void;
}

export default function SettingsSection({ adminCode, onUpdateInstitution }: SettingsSectionProps) {
  const [settings, setSettings] = useState({
    institution_name: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, [adminCode]);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('admin_code', adminCode)
      .single();

    if (data) {
      setSettings({ 
        institution_name: data.institution_name, 
        username: data.username, 
        password: data.password 
      });
    } else if (error) {
      console.error('Error loading settings:', error.message);
    }
    setLoading(false);
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('admins')
      .update({
        institution_name: settings.institution_name,
        username: settings.username,
        password: settings.password
      })
      .eq('admin_code', adminCode);

    if (!error) {
      setMessage({ type: 'success', text: 'Settings updated successfully! Changes will reflect on future receipts.' });
      localStorage.setItem('institution_name', settings.institution_name);
      if (onUpdateInstitution) {
        onUpdateInstitution(settings.institution_name);
      }
    } else {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm shadow-slate-200/50"
      >
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">System Settings</h2>
              <p className="text-sm text-slate-500">Manage institution profile and admin credentials</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateSettings} className="p-8 space-y-6">
          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p className="text-sm font-bold">{message.text}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Institution Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={settings.institution_name} 
                  onChange={(e) => setSettings({...settings, institution_name: e.target.value})} 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                  placeholder="Enter institution name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Admin Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    value={settings.username} 
                    onChange={(e) => setSettings({...settings, username: e.target.value})} 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Admin Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password" 
                    value={settings.password} 
                    onChange={(e) => setSettings({...settings, password: e.target.value})} 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Credentials
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
      
      <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4">
        <div className="shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-50">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-800">Security Note</h4>
          <p className="text-xs text-amber-600 mt-1 leading-relaxed">
            Changing your institution name will update the branding on all future receipts and certificates. 
            Ensure you keep your new credentials safe as you will need them for your next login.
          </p>
        </div>
      </div>
    </div>
  );
}
