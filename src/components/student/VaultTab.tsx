'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, CheckSquare, Square, FileText, Image, FileSpreadsheet, FileCode, 
  Trash2, Eye, UploadCloud, X, Download, AlertCircle, Check
} from 'lucide-react';
import { UploadedFile } from '../types';
import { DOCUMENTS } from '../constants';

interface VaultTabProps {
  docChecks: Record<string, boolean>;
  setDocChecks: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  uploadedDocs: number;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export const VaultTab: React.FC<VaultTabProps> = ({
  docChecks,
  setDocChecks,
  uploadedDocs,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadIntervalRef = useRef<any>(null);

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    };
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string, size = 16) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText size={size} className="text-rose-500" />;
    if (['jpg', 'jpeg', 'png', 'svg', 'gif'].includes(ext || '')) return <Image size={size} className="text-blue-500" />;
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet size={size} className="text-emerald-500" />;
    return <FileCode size={size} className="text-slate-500" />;
  };

  const startUploadSimulation = (file: File) => {
    if (!selectedDocType) {
      setToastMsg({ text: 'Please select a document category first!', type: 'error' });
      return;
    }

    setUploadingFile({
      name: file.name,
      size: formatSize(file.size)
    });
    setUploadProgress(0);

    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);

    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadIntervalRef.current);
          
          // Add file to list
          const newFile: UploadedFile = {
            id: `doc-${Date.now()}`,
            documentId: selectedDocType,
            name: file.name,
            size: formatSize(file.size),
            uploadedAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
          };

          setUploadedFiles((prevFiles) => {
            // Replace if already exists for this slot, or add
            const filtered = prevFiles.filter((f) => f.documentId !== selectedDocType);
            return [...filtered, newFile];
          });

          // Ensure docChecks gets updated (sync effect in index.tsx handles this)
          setDocChecks((prev) => ({ ...prev, [selectedDocType]: true }));

          setToastMsg({ text: `"${file.name}" uploaded successfully!`, type: 'success' });
          setUploadingFile(null);
          setSelectedDocType('');
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleCancelUpload = () => {
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    setUploadingFile(null);
    setUploadProgress(0);
    setToastMsg({ text: 'Upload cancelled.', type: 'error' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startUploadSimulation(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUploadSimulation(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteFile = (id: string) => {
    const fileToDelete = uploadedFiles.find((f) => f.id === id);
    if (fileToDelete) {
      setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
      setDocChecks((prev) => ({ ...prev, [fileToDelete.documentId]: false }));
      setToastMsg({ text: `Removed document reference.`, type: 'success' });
    }
  };

  const handleDownloadFile = (file: UploadedFile) => {
    const element = document.createElement("a");
    const fileContent = `Fly & Flourish Student Dashboard - Mock Document Download\n\n` +
      `Document ID: ${file.id}\n` +
      `Category: ${DOCUMENTS.find(d => d.id === file.documentId)?.name || 'Custom'}\n` +
      `File Name: ${file.name}\n` +
      `File Size: ${file.size}\n` +
      `Uploaded At: ${file.uploadedAt}\n\n` +
      `This is a mock download file generated by the Fly & Flourish Student Dashboard to verify the document retrieval workflow.`;
    const textFile = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(textFile);
    element.download = file.name.endsWith('.txt') ? file.name : file.name + '.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setToastMsg({ text: `Downloading ${file.name}...`, type: 'success' });
  };

  const handleViewFile = (file: UploadedFile) => {
    setPreviewFile(file);
  };

  const triggerUploadFor = (docId: string) => {
    setSelectedDocType(docId);
    const element = document.getElementById('upload-center');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-blue-500', 'transition-all', 'duration-500');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500');
      }, 1500);
    }
  };

  return (
    <motion.div
      key="vault"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Document Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-900/2">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-[#001F3F]">Document Checklist</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {uploadedDocs} OF {DOCUMENTS.length} UPLOADED
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: `conic-gradient(#10b981 ${(uploadedDocs / DOCUMENTS.length) * 360}deg, #e2e8f0 0deg)`,
            }}
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[11px] font-bold font-mono text-emerald-600">
              {uploadedDocs}/{DOCUMENTS.length}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {DOCUMENTS.map((doc) => {
            const file = uploadedFiles.find((f) => f.documentId === doc.id);
            const isUploaded = docChecks[doc.id];
            return (
              <div
                key={doc.id}
                className="p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 bg-white"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => {
                      setDocChecks((prev) => ({ ...prev, [doc.id]: !prev[doc.id] }));
                    }}
                    className="shrink-0 cursor-pointer text-slate-400 hover:text-[#001F3F] transition-colors"
                  >
                    {isUploaded ? (
                      <CheckSquare size={20} className="text-emerald-500" />
                    ) : (
                      <Square size={20} className="text-slate-300" />
                    )}
                  </button>
                  <span
                    className={`text-sm font-semibold truncate min-w-0 flex-1 ${
                      isUploaded ? 'text-slate-500 line-through font-normal' : 'text-[#001F3F]'
                    }`}
                  >
                    {doc.name}
                  </span>
                  
                  {isUploaded ? (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 ml-auto select-none shrink-0">
                      UPLOADED
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 ml-auto shrink-0">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 select-none">
                        PENDING
                      </span>
                      <button
                        onClick={() => triggerUploadFor(doc.id)}
                        className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </div>

                {isUploaded && (
                  <div className="mt-2 ml-4 sm:ml-8 pl-3 border-l-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 bg-slate-50/50 p-2 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                      <div className="text-slate-400 shrink-0">
                        {file ? getFileIcon(file.name, 14) : <CheckCircle2 size={14} className="text-emerald-500" />}
                      </div>
                      <span className="text-xs text-slate-600 truncate font-medium flex-1 sm:flex-initial">
                        {file ? file.name : 'Verified by Administrator'}
                      </span>
                      {file && (
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">({file.size})</span>
                      )}
                    </div>
                    {file && (
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => handleViewFile(file)}
                          className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer px-1 py-0.5"
                        >
                          View
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-[10px] font-semibold text-red-500 hover:underline cursor-pointer px-1 py-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Upload Center */}
      <div id="upload-center" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 space-y-6 transition-all duration-300 shadow-xl shadow-slate-900/2">
        <div>
          <h3 className="font-bold text-[#001F3F]">Document Upload Hub</h3>
          <p className="text-xs text-slate-400">
            Select a document category below and select or drop a file to upload.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Box (Left Side) */}
          <div className="space-y-4">
             {/* Dropdown to select document type */}
             <div>
               <label className="block text-xs font-bold text-[#001F3F] mb-1.5 uppercase font-mono tracking-wider">
                 1. Select Document Category
               </label>
               <select
                 value={selectedDocType}
                 onChange={(e) => setSelectedDocType(e.target.value)}
                 className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-[#001F3F] outline-none focus:border-[#001F3F] transition-colors cursor-pointer"
               >
                 <option value="">-- Choose a category --</option>
                 {DOCUMENTS.map((doc) => {
                   const hasFile = uploadedFiles.some((f) => f.documentId === doc.id);
                   return (
                     <option key={doc.id} value={doc.id}>
                       {doc.name} {hasFile ? '✓ (Re-upload)' : '(Pending)'}
                     </option>
                   );
                 })}
               </select>
             </div>

             {/* Drag and Drop Zone */}
             <div>
               <label className="block text-xs font-bold text-[#001F3F] mb-1.5 uppercase font-mono tracking-wider">
                 2. Upload File
               </label>
               
               {uploadingFile ? (
                 /* Simulated upload state */
                 <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                   <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-500 animate-pulse">
                     {getFileIcon(uploadingFile.name, 24)}
                   </div>
                   <p className="text-sm font-semibold text-[#001F3F] max-w-[240px] truncate">
                     {uploadingFile.name}
                   </p>
                   <p className="text-xs text-slate-400 font-mono mt-0.5">{uploadingFile.size}</p>
                   
                   {/* Progress bar */}
                   <div className="w-full max-w-xs mt-4">
                     <div className="flex justify-between items-center text-xs font-mono mb-1">
                       <span className="text-blue-600 font-bold">Uploading...</span>
                       <span className="text-slate-500">{uploadProgress}%</span>
                     </div>
                     <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-blue-500 to-[#001F3F] rounded-full transition-all duration-100"
                         style={{ width: `${uploadProgress}%` }}
                       />
                     </div>
                   </div>

                   <button
                     onClick={handleCancelUpload}
                     className="mt-4 px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-650 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                   >
                     Cancel Upload
                   </button>
                 </div>
               ) : (
                 /* Dropzone */
                 <div
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                   onClick={() => fileInputRef.current?.click()}
                   className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                     isDragging
                       ? 'border-blue-500 bg-blue-50/20'
                       : 'border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-slate-50/70'
                   }`}
                 >
                   <input
                     type="file"
                     ref={fileInputRef}
                     onChange={handleFileSelect}
                     className="hidden"
                     disabled={!selectedDocType}
                   />
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                     selectedDocType ? 'bg-slate-150 text-slate-400 hover:text-blue-500' : 'bg-slate-100 text-slate-300'
                   }`}>
                     <UploadCloud size={24} />
                   </div>
                   {selectedDocType ? (
                     <>
                       <p className="text-sm font-semibold text-[#001F3F]">
                         Drag & drop your file here
                       </p>
                       <p className="text-xs text-slate-400 mt-1">
                         or <span className="text-blue-600 font-bold hover:underline">browse files</span> on your device
                       </p>
                     </>
                   ) : (
                     <>
                       <p className="text-sm font-semibold text-slate-400">
                         Select a category first
                       </p>
                       <p className="text-xs text-slate-350 mt-1">
                         The upload area will unlock once a category is selected.
                       </p>
                     </>
                   )}
                   <p className="text-[9px] text-slate-400 font-mono mt-3">
                     SUPPORTED: PDF, JPG, PNG, DOCX (MAX 10MB)
                   </p>
                 </div>
               )}
             </div>

             {/* Toast feedback messages */}
             {toastMsg && (
               <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                 toastMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
               }`}>
                 <AlertCircle size={14} className="shrink-0" />
                 <span>{toastMsg.text}</span>
               </div>
             )}
          </div>

          {/* Uploaded Files Table / List (Right Side) */}
          <div className="space-y-4">
             <label className="block text-xs font-bold text-[#001F3F] uppercase font-mono tracking-wider">
               3. Managed Documents ({uploadedFiles.length})
             </label>

             {uploadedFiles.length === 0 ? (
               <div className="h-[250px] border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-400 bg-slate-50/20">
                 <FileText size={32} className="opacity-40 mb-2 text-slate-405" />
                 <p className="text-xs font-semibold text-slate-400">No uploaded files yet</p>
                 <p className="text-[10px] max-w-[200px] mt-1 text-slate-400">
                   Select a document category and upload a file to get started.
                 </p>
               </div>
             ) : (
               <div className="h-[250px] overflow-y-auto border border-slate-100 rounded-2xl divide-y divide-slate-100 bg-white">
                 {uploadedFiles.map((file) => {
                   const docType = DOCUMENTS.find((d) => d.id === file.documentId);
                   return (
                     <div key={file.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                       <div className="flex items-center gap-3 min-w-0">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-[#001F3F]">
                           {getFileIcon(file.name)}
                         </div>
                         <div className="min-w-0">
                           <p className="text-xs font-bold text-[#001F3F] truncate">
                             {file.name}
                           </p>
                           <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                             <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">
                               {docType?.name || 'Custom Document'}
                             </span>
                             <span className="text-[9px] text-slate-400 font-mono">
                               {file.size}
                             </span>
                           </div>
                         </div>
                       </div>

                       <div className="flex items-center gap-1.5 shrink-0">
                         {/* View button */}
                         <button
                           onClick={() => handleViewFile(file)}
                           className="p-1.5 hover:bg-slate-100 text-[#001F3F] rounded-lg transition-colors cursor-pointer"
                           title="Preview Document"
                         >
                           <Eye size={14} />
                         </button>
                         {/* Download button */}
                         <button
                           onClick={() => handleDownloadFile(file)}
                           className="p-1.5 hover:bg-slate-100 text-[#001F3F] rounded-lg transition-colors cursor-pointer"
                           title="Download Document"
                         >
                           <Download size={14} />
                         </button>
                         {/* Delete button */}
                         <button
                           onClick={() => handleDeleteFile(file.id)}
                           className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
                           title="Delete Document"
                         >
                           <Trash2 size={14} />
                         </button>
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden border border-slate-100 shadow-2xl flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-[#001F3F] text-base truncate max-w-[400px]">
                    {previewFile.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                    Category: {DOCUMENTS.find(d => d.id === previewFile.documentId)?.name || 'Custom Document'}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 hover:bg-slate-200 text-slate-450 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body (High fidelity mock document) */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col items-center justify-center min-h-[300px]">
                <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-8 w-full max-w-md relative overflow-hidden select-none aspect-[1/1.414]">
                  {/* Decorative Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-45 select-none text-[#001F3F] text-4xl font-black tracking-widest text-center">
                    FLY & FLOURISH<br/>OVERSEAS
                  </div>
                  
                  {/* Mock Doc Header */}
                  <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#001F3F]/10 flex items-center justify-center text-[#001F3F]">
                        {getFileIcon(previewFile.name, 16)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-tight text-[#001F3F]">FLY & FLOURISH</p>
                        <p className="text-[8px] text-slate-400 font-mono">VERIFIED DOCUMENT</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 bg-slate-50 border border-slate-200/50 px-1.5 py-0.5 rounded">
                      SHA256 SECURED
                    </span>
                  </div>

                  {/* Mock Doc Lines */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                      <div className="h-2 bg-slate-100 rounded w-1/2" />
                    </div>
                    
                    <div className="border border-dashed border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono border-b border-slate-100 pb-1.5">
                        <span>METADATA KEY</span>
                        <span>VALUE</span>
                      </div>
                      {[
                        { k: 'File Name', v: previewFile.name },
                        { k: 'File Size', v: previewFile.size },
                        { k: 'Upload Date', v: previewFile.uploadedAt },
                        { k: 'Status', v: 'Verified & Approved' }
                      ].map((item) => (
                        <div key={item.k} className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">{item.k}</span>
                          <span className="font-semibold text-[#001F3F] font-mono truncate max-w-[150px]">{item.v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="h-2 bg-slate-100 rounded w-full" />
                      <div className="h-2 bg-slate-100 rounded w-11/12" />
                      <div className="h-2 bg-slate-100 rounded w-4/5" />
                    </div>

                    {/* Stamp illustration */}
                    <div className="pt-6 flex justify-end">
                      <div className="border-2 border-emerald-500/80 rounded-full px-3 py-1 text-emerald-500 text-[10px] font-black uppercase tracking-widest rotate-[-12deg] select-none shadow-sm flex items-center gap-1">
                        <Check size={10} className="stroke-[3]" />
                        <span>FF Approved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => handleDownloadFile(previewFile)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
