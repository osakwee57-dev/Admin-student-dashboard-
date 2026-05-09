import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  ChevronLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  ChevronRight, 
  Shield 
} from 'lucide-react';

interface Student {
  id: string;
  surname: string;
  firstname: string;
  other_names: string;
  student_class: string;
  dob: string;
  state_of_origin: string;
  gender: string;
  guardian_phone: string;
  home_address: string;
  admin_code: string;
}

interface StudentSectionProps {
  adminCode: string;
}

export default function StudentSection({ adminCode }: StudentSectionProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');

  const classes = ['All', 'Jss1', 'Jss2', 'Jss3', 'Sss1', 'Sss2', 'Sss3'];

  useEffect(() => {
    fetchStudents();
  }, [adminCode]);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('admin_code', adminCode)
      .order('student_class', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error.message);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.surname} ${s.firstname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.student_class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || s.student_class === classFilter;
    return matchesSearch && matchesClass;
  });

  const totalStudents = students.length;
  const classCounts = students.reduce((acc, student) => {
    acc[student.student_class] = (acc[student.student_class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (selectedStudent) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button 
            onClick={() => setSelectedStudent(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold py-2 px-4 rounded-xl hover:bg-slate-100"
          >
            <ChevronLeft size={20} />
            Back to List
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {selectedStudent.student_class}
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 bg-indigo-50 rounded-3xl flex items-center justify-center shrink-0 border border-indigo-100 shadow-inner">
              <User size={64} className="text-indigo-300" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-1">
                {selectedStudent.surname} {selectedStudent.firstname}
              </h2>
              <p className="text-slate-500 text-lg mb-6">{selectedStudent.other_names}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={<GraduationCap size={18} />} label="Class" value={selectedStudent.student_class} />
                <InfoItem icon={<Calendar size={18} />} label="Date of Birth" value={selectedStudent.dob} />
                <InfoItem icon={<Shield size={18} />} label="Gender" value={selectedStudent.gender} />
                <InfoItem icon={<BookOpen size={18} />} label="State of Origin" value={selectedStudent.state_of_origin} />
                <InfoItem icon={<Phone size={18} />} label="Guardian Phone" value={selectedStudent.guardian_phone} />
                <InfoItem icon={<MapPin size={18} />} label="Address" value={selectedStudent.home_address} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100 flex flex-col justify-center">
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Total Students</p>
          <h1 className="text-4xl font-extrabold">{totalStudents}</h1>
        </div>
        
        <div className="md:col-span-3 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Class Breakdown</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(classCounts).map(([className, count]) => (
              <div key={className} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{className}</span>
                <span className="text-sm font-extrabold text-slate-700">{count}</span>
              </div>
            ))}
            {Object.keys(classCounts).length === 0 && (
              <p className="text-xs text-slate-400 italic">No classes recorded yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or class..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="w-full md:w-48 px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-sm appearance-none font-bold text-slate-700"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="hidden px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 items-center justify-center gap-2">
            Add Student
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Users size={20} className="text-indigo-600" />
            Enrolled Students
          </h2>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {filteredStudents.map((student) => (
              <motion.div 
                key={student.id}
                whileHover={{ backgroundColor: '#f8fafc' }}
                onClick={() => setSelectedStudent(student)}
                className="p-6 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {student.surname} {student.firstname}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                      Class {student.student_class}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300" size={20} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No students found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or add a new student.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

