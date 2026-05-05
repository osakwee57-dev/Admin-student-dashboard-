import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  FileText, 
  Trash2, 
  User, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Student {
  id: string;
  surname: string;
  firstname: string;
  student_class: string;
}

interface ExamResult {
  id: string;
  student_id: string;
  title: string;
  file_url: string;
  created_at: string;
}

interface ExamResultsProps {
  adminCode: string;
}

export default function ExamResults({ adminCode }: ExamResultsProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const classes = ['All', 'Jss1', 'Jss2', 'Jss3', 'Sss1', 'Sss2', 'Sss3'];

  useEffect(() => {
    fetchStudents();
  }, [adminCode]);

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('students')
      .select('id, surname, firstname, student_class')
      .eq('admin_code', adminCode)
      .order('surname', { ascending: true });
    setStudents(data || []);
    setLoading(false);
  };

  const filteredStudents = students.filter(s => {
    const fullName = `${s.surname} ${s.firstname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || s.student_class === classFilter;
    return matchesSearch && matchesClass;
  });

  if (selectedStudent) {
    return <StudentResultManager student={selectedStudent} onBack={() => setSelectedStudent(null)} adminCode={adminCode} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search student for result upload..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm shadow-sm appearance-none min-w-[140px]"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <FileText size={20} className="text-indigo-600" />
            Exam Results Management
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
                id={`student-item-${student.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 italic">
                    {student.surname[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">
                      {student.surname} {student.firstname}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
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
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold">No students found</p>
          </div>
        ) }
      </div>
    </div>
  );
}

function StudentResultManager({ student, onBack, adminCode }: { student: Student, onBack: () => void, adminCode: string }) {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchResults();
  }, [student.id]);

  const fetchResults = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('exam_results')
      .select('*')
      .eq('student_id', student.id)
      .order('created_at', { ascending: false });
    setResults(data || []);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      alert("Please provide both a title and a PDF file.");
      return;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const filePath = `${adminCode}/${student.id}/${timestamp}_${file.name}`;

      const { data, error: uploadError } = await supabase.storage
        .from('exam-results')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('exam-results').getPublicUrl(filePath);

        const { error: insertError } = await supabase.from('exam_results').insert([{
          student_id: student.id,
          admin_code: adminCode,
          title: title,
          file_url: publicUrl
        }]);

        if (insertError) throw insertError;

        alert("Result uploaded successfully!");
        setFile(null);
        setTitle('');
        fetchResults();
      }
    } catch (err: any) {
      alert("Upload failed: " + err.message);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (result: ExamResult) => {
    if (!confirm("Are you sure you want to delete this result?")) return;

    try {
      // 1. Delete from DB
      const { error: deleteDbError } = await supabase
        .from('exam_results')
        .delete()
        .eq('id', result.id);

      if (deleteDbError) throw deleteDbError;

      // Note: We don't necessarily delete from storage here to keep simple, 
      // but in production you would extract path and delete.
      
      fetchResults();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm"
      >
        <ChevronLeft size={18} />
        Back to Students
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 text-center">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-100 text-3xl font-serif text-indigo-600 italic">
                    {student.surname[0]}
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {student.surname} {student.firstname}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Class {student.student_class}</p>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl shadow-slate-200 text-left">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Upload size={18} className="text-indigo-400" />
                    Upload New Result
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Result Title</label>
                        <input 
                            placeholder="e.g. 2024 First Term Summary" 
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder:text-slate-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Select PDF File</label>
                         <input 
                            type="file" 
                            accept=".pdf"
                            className="hidden"
                            id="file-upload"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                         />
                         <label 
                            htmlFor="file-upload"
                            className={`w-full flex items-center justify-center gap-2 px-4 py-6 rounded-2xl border-2 border-dashed border-white/20 cursor-pointer transition-all ${file ? 'bg-emerald-500/10 border-emerald-500/50' : 'hover:bg-white/5 hover:border-white/40'}`}
                         >
                            {file ? (
                                <div className="text-center">
                                    <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-1" />
                                    <p className="text-xs font-bold text-emerald-400 truncate max-w-[150px]">{file.name}</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <FileText size={24} className="text-slate-500 mx-auto mb-1" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Choose PDF</p>
                                </div>
                            )}
                         </label>
                    </div>
                    <button 
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900"
                    >
                        {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Publish Result"}
                    </button>
                    {uploading && (
                        <p className="text-[10px] text-center text-indigo-300 font-bold animate-pulse">SUPABASE_STORAGE_STREAMING...</p>
                    )}
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">Stored Records</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">{results.length} Files</span>
                </div>

                {loading ? (
                    <div className="p-20 flex justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : results.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {results.map((res) => (
                            <div key={res.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 border border-red-100">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{res.title}</h4>
                                        <p className="text-xs font-bold text-slate-400 mt-0.5">Uploaded {new Date(res.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a 
                                        href={res.file_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(res)}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-32 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-slate-500 font-bold">No academic results recorded</p>
                        <p className="text-sm text-slate-400 transition-all">Use the panel on the left to upload PDF results.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
