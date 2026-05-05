import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  Users, 
  Settings, 
  Shield, 
  ChevronRight,
  Wallet,
  FileText,
  MessageSquare
} from 'lucide-react';
import StudentSection from './StudentSection';
import FeesAndReceipts from './FeesAndReceipts';
import ExamResults from './ExamResults';
import MessageSection from './MessageSection';

type Section = 'students' | 'fees' | 'exams' | 'messages' | 'settings';

export default function Dashboard() {
  const navigate = useNavigate();
  const [adminCode, setAdminCode] = useState<string | null>(null);
  const [institution, setInstitution] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('students');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem('current_admin_code');
    const name = localStorage.getItem('institution_name');
    if (!code) {
      navigate('/login');
    } else {
      setAdminCode(code);
      setInstitution(name);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('current_admin_code');
    localStorage.removeItem('institution_name');
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderSection = () => {
    if (!adminCode) return null;

    switch (activeSection) {
      case 'students':
        return <StudentSection adminCode={adminCode} />;
      case 'fees':
        return <FeesAndReceipts adminCode={adminCode} />;
      case 'exams':
        return <ExamResults adminCode={adminCode} />;
      case 'messages':
        return <MessageSection adminCode={adminCode} />;
      default:
        return <PlaceholderSection title="Under Construction" icon={<Settings size={48} />} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent 
                institution={institution} 
                activeSection={activeSection} 
                onSectionClick={(section) => {
                  setActiveSection(section);
                  closeMobileMenu();
                }} 
                handleLogout={handleLogout} 
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <SidebarContent 
          institution={institution} 
          activeSection={activeSection} 
          onSectionClick={setActiveSection} 
          handleLogout={handleLogout} 
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div className="hidden sm:block lg:hidden w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight capitalize">
              {activeSection}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100 flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="opacity-60 uppercase tracking-wider">PIN:</span>
              <span className="font-mono text-sm tracking-wider">{adminCode}</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ 
  institution, 
  activeSection, 
  onSectionClick, 
  handleLogout 
}: { 
  institution: string | null, 
  activeSection: Section, 
  onSectionClick: (section: Section) => void,
  handleLogout: () => void
}) {
  return (
    <>
      <div className="p-8 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-slate-800 truncate leading-tight tracking-tight">{institution || 'InstiPortal'}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Control</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-6 space-y-2">
        <NavItem 
          icon={<Users size={18} />} 
          label="Students" 
          active={activeSection === 'students'} 
          onClick={() => onSectionClick('students')}
        />
        <NavItem 
          icon={<Wallet size={18} />} 
          label="Fees & Receipts" 
          active={activeSection === 'fees'} 
          onClick={() => onSectionClick('fees')}
        />
        <NavItem 
          icon={<FileText size={18} />} 
          label="Exam Results" 
          active={activeSection === 'exams'} 
          onClick={() => onSectionClick('exams')}
        />
        <NavItem 
          icon={<MessageSquare size={18} />} 
          label="Messages" 
          active={activeSection === 'messages'} 
          onClick={() => onSectionClick('messages')}
        />
        <NavItem 
          icon={<Settings size={18} />} 
          label="Settings" 
          active={activeSection === 'settings'} 
          onClick={() => onSectionClick('settings')}
        />
      </nav>

      <div className="p-6 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-semibold text-sm"
        >
          <LogOut size={18} />
          <span>Logout Account</span>
        </button>
      </div>
    </>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick: () => void 
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PlaceholderSection({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center shadow-sm shadow-slate-200/50">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mx-auto">
        This section is currently under development for your institutional portal. Check back soon for updates.
      </p>
    </div>
  );
}


