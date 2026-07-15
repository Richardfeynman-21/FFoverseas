'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Eye, CheckCircle, XCircle, ChevronRight, FileCheck, FileCode, Check, Send, X } from 'lucide-react';
import { DocumentRecord, StudentRecord } from './types';

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
} as const;

interface DocumentsTabProps {
  documents: DocumentRecord[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentRecord[]>>;
  students: StudentRecord[];
  triggerNotification: (text: string, isError?: boolean) => void;
}

export default function DocumentsTab({
  documents,
  setDocuments,
  students,
  triggerNotification
}: DocumentsTabProps) {
  // Selected document for side-by-side audit sandbox
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const selectedDoc = documents.find(d => d.id === selectedDocId) || null;

  // Agent upload states
  const [uploadStudentId, setUploadStudentId] = useState('');
  const [uploadDocType, setUploadDocType] = useState<'passport' | 'transcripts' | 'sop' | 'lor' | 'financial' | 'english' | 'photos'>('passport');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAgentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadStudentId) {
      triggerNotification('Please select a student.', true);
      return;
    }
    if (!uploadFile) {
      triggerNotification('Please select a file to upload.', true);
      return;
    }

    const token = localStorage.getItem('ff_agent_token');
    if (!token) {
      triggerNotification('Session expired. Please log in again.', true);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('student_id', uploadStudentId);
    let backendDocType = uploadDocType as string;
    if (uploadDocType === 'transcripts') backendDocType = 'transcript';
    else if (uploadDocType === 'english' || uploadDocType === 'photos') backendDocType = 'other';

    formData.append('doc_type', backendDocType);
    formData.append('file', uploadFile);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.detail || 'Upload failed.');
      }

      const newDoc = await res.json();
      const student = students.find(s => s.id === uploadStudentId);
      
      let mappedType: DocumentRecord['documentType'] = 'Passport';
      if (uploadDocType === 'transcripts') mappedType = 'Transcript';
      else if (uploadDocType === 'sop') mappedType = 'SOP';
      else if (uploadDocType === 'lor') mappedType = 'LOR';
      else if (uploadDocType === 'financial') mappedType = 'Financial';
      else if (uploadDocType === 'english') mappedType = 'English';
      else if (uploadDocType === 'photos') mappedType = 'Photos';

      const mappedDoc: DocumentRecord = {
        id: newDoc.id,
        studentName: student ? student.name : 'Unknown Student',
        documentType: mappedType,
        fileName: newDoc.file_name,
        status: 'Pending Review',
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      setDocuments(prev => [mappedDoc, ...prev]);
      triggerNotification('Document uploaded successfully.');
      
      setUploadFile(null);
      const fileInput = document.getElementById('agent-file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      console.error(err);
      triggerNotification(err.message || 'Failed to upload document.', true);
    } finally {
      setIsUploading(false);
    }
  };

  // Sandbox states
  const [checklist, setChecklist] = useState({
    signature: true,
    certified: false,
    legible: true,
    notExpired: true
  });
  
  const [auditComment, setAuditComment] = useState('');
  const [commentsLog, setCommentsLog] = useState<string[]>([
    'Uploaded by student on current cycle.',
    'System auto-scanned for virus: clean.'
  ]);

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditComment.trim()) return;
    setCommentsLog(prev => [...prev, auditComment.trim()]);
    setAuditComment('');
    triggerNotification('Audit comment added.');
  };

  const handleApprove = async (docId: string) => {
    const token = localStorage.getItem('ff_agent_token');
    if (!token) {
      triggerNotification('Session expired. Please log in again.', true);
      return;
    }

    try {
      const res = await fetch(`/api/documents/${docId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_verified: true })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.detail || 'Verification failed.');
      }

      setDocuments(documents.map(d => d.id === docId ? { ...d, status: 'Verified' } : d));
      triggerNotification('Document approved & verified.');
      setSelectedDocId(null);
    } catch (err: any) {
      console.error(err);
      triggerNotification(err.message || 'Failed to verify document.', true);
    }
  };

  const handleReject = async (docId: string) => {
    const token = localStorage.getItem('ff_agent_token');
    if (!token) {
      triggerNotification('Session expired. Please log in again.', true);
      return;
    }

    try {
      const res = await fetch(`/api/documents/${docId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_verified: false })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.detail || 'Rejection failed.');
      }

      setDocuments(documents.map(d => d.id === docId ? { ...d, status: 'Rejected' } : d));
      triggerNotification('Document rejected.', true);
      setSelectedDocId(null);
    } catch (err: any) {
      console.error(err);
      triggerNotification(err.message || 'Failed to reject document.', true);
    }
  };

  return (
    <motion.div className="space-y-6 bg-white" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Title */}
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5" variants={staggerItem}>
        <div>
          <h2 className="text-xl sm:text-2.5xl font-black tracking-tight text-[#001F3F] uppercase">Document Audits</h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Verify transcripts, passport scans, and SOP files. Audit compliance checklists.</p>
        </div>
      </motion.div>

      {/* Grid Layout (List vs Sandbox) */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-6" variants={staggerItem}>
        {/* Left Side: Document Cards list */}
        <div className={`${selectedDoc ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4 max-h-[750px] overflow-y-auto pr-1 scrollbar-hide`}>
          {/* Upload card for Agent */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.005)] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FileCode size={14} />
              </div>
              <h3 className="font-extrabold text-[11px] uppercase text-[#001F3F] tracking-wider">Upload Document for Student</h3>
            </div>
            <form onSubmit={handleAgentUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Select Student</label>
                <select
                  value={uploadStudentId}
                  onChange={(e) => setUploadStudentId(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-800 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs cursor-pointer"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Document Type</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-800 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs cursor-pointer"
                >
                  <option value="passport">Passport Copy</option>
                  <option value="transcripts">Academic Transcripts</option>
                  <option value="sop">Statement of Purpose</option>
                  <option value="lor">Letters of Recommendation</option>
                  <option value="financial">Financial Documents</option>
                  <option value="english">English Test Score</option>
                  <option value="photos">Passport Size Photos</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Choose File</label>
                <div className="flex gap-2">
                  <input
                    id="agent-file-upload"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('agent-file-upload')?.click()}
                    className="flex-1 px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-all text-center select-none cursor-pointer truncate max-w-[120px] shadow-2xs border-dashed"
                  >
                    {uploadFile ? uploadFile.name : 'Select File'}
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-3.5 py-2 bg-[#001F3F] hover:bg-slate-800 text-white text-[9.5px] font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-97"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {documents.map(doc => {
            const isSelected = selectedDoc?.id === doc.id;
            
            return (
              <div 
                key={doc.id} 
                onClick={() => setSelectedDocId(doc.id)}
                className={`bg-white rounded-3xl p-5 border text-left flex items-start justify-between gap-4 transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? 'border-[#001F3F] shadow-sm shadow-[#001F3F]/5' 
                    : 'border-slate-100 hover:border-slate-250 shadow-[0_4px_15px_rgba(0,0,0,0.005)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.01)]'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* File Icon */}
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0 shadow-2xs">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">{doc.documentType}</span>
                      <span className={`text-[7px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${
                        doc.status === 'Verified' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        doc.status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                        'bg-amber-50 border-amber-250 text-amber-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-[#001F3F] truncate mt-1.5 leading-none">{doc.studentName}</h4>
                    <p className="text-[10px] text-slate-450 truncate mt-2 font-mono font-semibold">{doc.fileName}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch shrink-0 font-mono">
                  <span className="text-[8px] text-slate-400 font-bold">{doc.uploadedAt}</span>
                  <ChevronRight size={14} className="text-slate-350 group-hover:text-[#001F3F] transition-colors mt-2" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Side-by-Side Audit Sandbox */}
        <AnimatePresence>
          {selectedDoc && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-[0_4px_25px_rgba(0,0,0,0.005)]"
            >
              {/* Sandbox Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-750 shrink-0 shadow-2xs">
                    <FileCheck size={16} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#001F3F] leading-none mt-0.5">Audit Sandbox</h3>
                    <p className="text-[10px] text-slate-400 font-mono font-semibold mt-1.5 leading-none">Compliancy & validation desk</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDocId(null)}
                  className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Side-by-Side panels */}
              <div className="space-y-5">
                {/* 1. Document properties */}
                <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-100 space-y-3">
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">FILE PROPERTIES</span>
                  <div className="text-xs space-y-1.5 font-semibold">
                    <div>Student: <span className="text-[#001F3F] font-bold">{selectedDoc.studentName}</span></div>
                    <div>Type: <span className="text-[#001F3F] font-bold">{selectedDoc.documentType}</span></div>
                    <div className="flex items-center gap-2">
                      <span>Preview URL:</span>
                      <code className="bg-white border border-slate-100 px-2 py-0.5 rounded text-[10px] text-[#001F3F] select-all truncate block max-w-[200px]">
                        {selectedDoc.fileName}
                      </code>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('ff_agent_token');
                            if (!token) return;
                            const res = await fetch(`/api/documents/${selectedDoc.id}`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (!res.ok) throw new Error("Failed to download file");
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = selectedDoc.fileName;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          } catch (err) {
                            console.error(err);
                            triggerNotification("Failed to download document.", true);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-150 hover:bg-slate-200 border border-slate-250 hover:border-slate-300 rounded-xl text-[10px] font-bold text-[#001F3F] cursor-pointer transition-all shadow-2xs"
                      >
                        <Eye size={12} />
                        <span>Download / View Document</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Requirements checklist */}
                <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-100 space-y-3">
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">COMPLIANCE REQUIREMENT CHECKS</span>
                  <div className="space-y-2 text-xs font-semibold">
                    {[
                      { key: 'signature' as const, label: 'Legitimate Seal & Signature verified' },
                      { key: 'certified' as const, label: 'Notarized / certified copy confirmation' },
                      { key: 'legible' as const, label: 'High resolution scanning legibility' },
                      { key: 'notExpired' as const, label: 'Validity expiry duration OK' }
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => toggleChecklist(item.key)}
                        className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-100 hover:border-slate-200/80 rounded-xl cursor-pointer transition-all shadow-2xs"
                      >
                        <span className="text-slate-650 font-medium text-left">{item.label}</span>
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          checklist[item.key] ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-slate-200 text-transparent'
                        }`}>
                          <Check size={10} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Feedback Comments log */}
                <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-100 space-y-4">
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">AUDITING REMARKS & COMMENTS</span>
                  
                  {/* List comments */}
                  <div className="space-y-2.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-hide">
                    {commentsLog.map((c, i) => (
                      <div key={i} className="flex gap-2 text-[10px] font-semibold text-slate-550 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
                        <p>{c}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add comment */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add compliance notes..." 
                      value={auditComment} 
                      onChange={(e) => setAuditComment(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-[#001F3F] text-white hover:bg-slate-800 rounded-xl shadow-2xs cursor-pointer"><Send size={12} /></button>
                  </form>
                </div>

                {/* 4. Action panel */}
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleApprove(selectedDoc.id)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={13} />
                    <span>Approve & Verify</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedDoc.id)}
                    className="flex-1 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={13} />
                    <span>Reject Scan</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
