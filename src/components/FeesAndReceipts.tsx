import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Wallet,
  Printer,
  User,
  Filter,
  Calendar,
  Activity,
  Shield
} from 'lucide-react';
import { jsPDF } from "jspdf";

interface Student {
  id: string;
  surname: string;
  firstname: string;
  student_class: string;
  admin_code: string;
}

interface FeeItem {
  detail: string;
  amount: string;
}

interface Fee {
  id: string;
  student_id: string;
  fee_name: string;
  items: FeeItem[];
  is_paid: boolean;
  created_at: string;
  type: 'FEE';
}

interface Receipt {
  id: string;
  student_id: string;
  receipt_title: string;
  items: FeeItem[];
  created_at: string;
  type: 'RECEIPT';
  signature_data?: string;
}

type CombinedHistory = Fee | Receipt;

interface FeesAndReceiptsProps {
  adminCode: string;
}

export default function FeesAndReceipts({ adminCode }: FeesAndReceiptsProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
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

  if (activeStudent) {
    return (
      <FeeAndHistoryView 
        student={activeStudent} 
        onBack={() => setActiveStudent(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search student..." 
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
            <Wallet size={20} className="text-indigo-600" />
            Financial Management
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredStudents.length} Students</p>
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
                onClick={() => setActiveStudent(student)}
                className="p-6 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                    {student.surname[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">
                      {student.surname} {student.firstname}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      Class {student.student_class}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className="text-xs font-bold text-emerald-600">Active Account</p>
                  </div>
                  <ChevronRight className="text-slate-300" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold">No students matched your query</p>
            <p className="text-sm text-slate-400 mt-1">Try a different search term or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FeeAndHistoryView({ student, onBack }: { student: Student, onBack: () => void }) {
  const [view, setView] = useState<'history' | 'generate'>('history');
  const [history, setHistory] = useState<CombinedHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [student.id]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data: fees } = await supabase.from('student_fees').select('*').eq('student_id', student.id);
    const { data: receipts } = await supabase.from('student_receipts').select('*').eq('student_id', student.id);
    
    const combined: CombinedHistory[] = [
      ...(fees || []).map(f => ({ ...f, type: 'FEE' as const })),
      ...(receipts || []).map(r => ({ ...r, type: 'RECEIPT' as const }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setHistory(combined);
    setLoading(false);
  };

  const markAsPaid = async (fee: Fee) => {
    try {
      // 1. Update fee status
      const { error: feeError } = await supabase
        .from('student_fees')
        .update({ is_paid: true })
        .eq('id', fee.id);
      
      if (feeError) throw feeError;

      // 2. Generate Receipt
      const { error: receiptError } = await supabase
        .from('student_receipts')
        .insert([{
          student_id: student.id,
          admin_code: localStorage.getItem('current_admin_code'),
          receipt_title: `Receipt for ${fee.fee_name}`,
          items: fee.items
        }]);

      if (receiptError) throw receiptError;

      alert("Fee marked as paid and receipt generated!");
      fetchHistory();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm"
        >
          <ChevronLeft size={18} />
          Back to Students
        </button>
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          <button 
            onClick={() => setView('history')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'history' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            History
          </button>
          <button 
            onClick={() => setView('generate')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'generate' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Generate Fee
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-100 italic font-serif text-3xl text-indigo-600 shadow-inner">
              {student.surname[0]}
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-900 leading-tight">
              {student.surname} {student.firstname}
            </h2>
            <p className="text-center text-slate-400 font-bold tracking-widest uppercase text-[10px] mt-2 group-hover:text-indigo-600">
              Class {student.student_class}
            </p>
            
            <div className="mt-8 space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</span>
                <span className="text-sm font-mono text-slate-600">#{student.id.slice(0, 8)}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {view === 'history' ? (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-lg">Transaction History</h3>
                  <button onClick={fetchHistory} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                    <Activity size={18} />
                  </button>
                </div>

                {loading ? (
                  <div className="p-20 flex justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                  </div>
                ) : history.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {history.map((item) => (
                      <HistoryItem 
                        key={item.id} 
                        item={item} 
                        onMarkPaid={() => item.type === 'FEE' && markAsPaid(item)} 
                        institutionName={localStorage.getItem('institution_name') || 'Institution'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-32 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FileText className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-500 font-bold">No transactions found</p>
                    <p className="text-sm text-slate-400 mt-1">Generate a fee to start the financial record.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="generate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FeeGenerationPage 
                  student={student} 
                  onSuccess={() => {
                    setView('history');
                    fetchHistory();
                  }} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface HistoryItemProps {
  item: CombinedHistory;
  onMarkPaid: () => void | Promise<any>;
  institutionName: string;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onMarkPaid, institutionName }) => {
  const isFee = item.type === 'FEE';
  const title = isFee ? (item as Fee).fee_name : (item as Receipt).receipt_title;
  const date = new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const total = item.items.reduce((acc, curr) => acc + parseFloat(curr.amount || '0'), 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let total = 0;
    
    // Design Header
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(institutionName, 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("INSTITUTIONAL ADMINISTRATION SYSTEM", 20, 32);
    
    // Body Background
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.rect(0, 40, 210, 257, 'F');

    // Document Info
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(isFee ? "DEBIT ADVICE / FEE" : "OFFICIAL RECEIPT", 20, 60);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Reference: #${item.id.slice(0, 12).toUpperCase()}`, 20, 68);
    doc.text(`Date: ${date}`, 20, 73);

    // Main Content Box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 85, 180, 150, 10, 10, 'F');
    
    // Table Headers
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text("ITEM DESCRIPTION", 20, 100);
    doc.text("AMOUNT (NGN)", 150, 100);
    
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(20, 105, 190, 105);

    // Table Content
    let yPos = 115;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105); // Slate-600
    
    if (item.items && Array.isArray(item.items)) {
      item.items.forEach((line) => {
        doc.text(line.detail, 20, yPos);
        doc.text(`N${parseFloat(line.amount).toLocaleString()}`, 150, yPos);
        total += parseFloat(line.amount);
        yPos += 10;
      });
    }

    // Total Section
    doc.line(20, 200, 190, 200);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text("TOTAL AMOUNT DUE", 20, 215);
    doc.setFontSize(18);
    doc.text(`N${total.toLocaleString()}`, 145, 215);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text("This is an electronically generated document. No physical signature is required unless otherwise stated.", 105, 280, { align: 'center' });
    doc.text(`Generated for Institutional Code: ${localStorage.getItem('current_admin_code')}`, 105, 285, { align: 'center' });

    doc.save(`${isFee ? 'FEE' : 'RECEIPT'}_${item.id.slice(0, 8)}.pdf`);
  };

  return (
    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${isFee ? (item.is_paid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100') : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
          {isFee ? (item.is_paid ? <CheckCircle2 size={24} /> : <Clock size={24} />) : <Printer size={24} />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-800">{title}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${isFee ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
              {item.type}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5"><Calendar size={12} /> {date}</span>
            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <span className="text-slate-900">₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isFee && !(item as Fee).is_paid && (
          <button 
            onClick={onMarkPaid}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 transition-all"
          >
            Mark Paid
          </button>
        )}
        <button 
          onClick={downloadPDF}
          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
          title="Download PDF"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
}

function FeeGenerationPage({ student, onSuccess }: { student: Student, onSuccess: () => void }) {
  const [feeName, setFeeName] = useState('');
  const [items, setItems] = useState<FeeItem[]>([{ detail: '', amount: '' }]);
  const [loading, setLoading] = useState(false);

  const addItemRow = () => setItems([...items, { detail: '', amount: '' }]);
  
  const removeItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSendFee = async () => {
    if (!feeName) return alert("Please enter a fee title.");
    if (items.some(i => !i.detail || !i.amount)) return alert("Please fill all details and amounts.");

    setLoading(true);
    try {
      const { error } = await supabase.from('student_fees').insert([{
        student_id: student.id,
        admin_code: localStorage.getItem('current_admin_code'),
        fee_name: feeName,
        items: items,
        is_paid: false
      }]);

      if (error) throw error;
      alert("Fee generated successfully!");
      onSuccess();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  const total = items.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Generate Fee Notice</h3>
        <p className="text-sm text-slate-500">Creating debit advice for {student.firstname} {student.surname}</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notice Title</label>
          <input 
            placeholder="e.g. 2024 First Term School Fees" 
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-bold text-slate-800"
            onChange={(e) => setFeeName(e.target.value)} 
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Line Items</label>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{items.length} Items</span>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={index} 
                className="flex gap-4 group"
              >
                <div className="relative flex-1">
                  <input 
                    placeholder="Item Detail (e.g. Tuition)" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none"
                    value={item.detail}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].detail = e.target.value;
                      setItems(newItems);
                    }} 
                  />
                </div>
                <div className="relative w-32 md:w-48">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₦</span>
                  <input 
                    placeholder="0.00" 
                    type="number" 
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-mono focus:outline-none"
                    value={item.amount}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].amount = e.target.value;
                      setItems(newItems);
                    }} 
                  />
                </div>
                {items.length > 1 && (
                  <button 
                    onClick={() => removeItemRow(index)}
                    className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <button 
            onClick={addItemRow}
            className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold hover:border-indigo-200 hover:text-indigo-600 transition-all hover:bg-indigo-50 flex items-center justify-center gap-2 text-xs"
          >
            <Plus size={16} /> Add Another Detail
          </button>
        </div>

        <div className="p-8 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Fee Amount</p>
            <p className="text-4xl font-extrabold tracking-tight">₦{total.toLocaleString()}</p>
          </div>
          <button 
            onClick={handleSendFee}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={20} />
                Confirm & Issue Fee
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

