import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  Clock, 
  AlertCircle,
  Bell,
  MoreVertical,
  Calendar
} from 'lucide-react';

interface Notice {
  id: string;
  admin_code: string;
  message_text: string;
  created_at: string;
}

interface MessageSectionProps {
  adminCode: string;
}

export default function MessageSection({ adminCode }: MessageSectionProps) {
  const [message, setMessage] = useState('');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, [adminCode]);

  const fetchNotices = async () => {
    setFetching(true);
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('admin_code', adminCode)
      .order('created_at', { ascending: false });

    setNotices(data || []);
    setFetching(false);
  };

  const handlePostMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('announcements')
        .insert([{ 
          admin_code: adminCode, 
          message_text: message 
        }]);

      if (error) throw error;

      setMessage('');
      fetchNotices();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice? This action cannot be undone.")) return;
    
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchNotices();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Compose Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg">Institution Notice Board</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Broadcast to all students</p>
          </div>
        </div>

        <div className="relative group">
          <textarea
            placeholder="Write a message for your institution's bulletin..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-6 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all resize-none text-slate-800 font-medium placeholder:text-slate-400"
          />
          <div className="mt-4 flex items-center justify-between">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {message.length} characters used
             </p>
             <button 
                onClick={handlePostMessage} 
                disabled={loading || !message.trim()}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
             >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Send size={18} />
                        Publish Notice
                    </>
                )}
             </button>
          </div>
        </div>
      </motion.div>

      {/* History Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-600" />
                Active Feed
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {notices.length} Active Posts
            </span>
        </div>

        {fetching ? (
          <div className="p-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : notices.length > 0 ? (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {notices.map((notice) => (
                <div key={notice.id} className="flex items-stretch gap-4 group">
                  <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                  <Clock size={16} />
                              </div>
                              <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Published On</p>
                                  <p className="text-xs font-bold text-slate-600 mt-1">
                                      {new Date(notice.created_at).toLocaleString('en-GB', { 
                                          day: 'numeric', 
                                          month: 'short', 
                                          year: 'numeric', 
                                          hour: '2-digit', 
                                          minute: '2-digit' 
                                      })}
                                  </p>
                              </div>
                          </div>
                      </div>
                      <div className="pl-11">
                          <p className="text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                              {notice.message_text}
                          </p>
                      </div>
                  </motion.div>
                  <button 
                      onClick={() => handleDelete(notice.id)}
                      className="shrink-0 flex items-center justify-center w-12 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-2xl transition-all border border-red-100"
                      title="Delete Notice"
                  >
                      <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-32 text-center bg-white border border-slate-200 rounded-3xl border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <AlertCircle className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-500 font-bold">Bulletin is currently empty</p>
            <p className="text-sm text-slate-400 mt-1 transition-all">Your institutional updates will appear here once published.</p>
          </div>
        )}
      </div>
    </div>
  );
}
