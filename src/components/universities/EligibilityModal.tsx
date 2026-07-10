import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Building2 } from 'lucide-react';
import { DetailedUniversity } from '../../lib/types';

interface EligibilityData {
  courseLevel: string;
  targetIntake: string;
  gpa: string;
  englishTest: string;
  englishScore: string;
  name: string;
  email: string;
  phone: string;
}

interface EligibilityModalProps {
  eligibilityUni: DetailedUniversity;
  eligibilityStep: number;
  eligibilityData: EligibilityData;
  formLoading: boolean;
  formSuccess: boolean;
  eligibilityMatchScore: number;
  eligibilityMessage: string;
  handleCloseEligibilityModal: () => void;
  handleFormInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleNextStep: (e: React.FormEvent) => void;
  handlePrevStep: () => void;
  handleEligibilitySubmit: (e: React.FormEvent) => void;
  submissionError?: boolean;
}

export default function EligibilityModal({
  eligibilityUni,
  eligibilityStep,
  eligibilityData,
  formLoading,
  formSuccess,
  eligibilityMatchScore,
  eligibilityMessage,
  handleCloseEligibilityModal,
  handleFormInputChange,
  handleNextStep,
  handlePrevStep,
  handleEligibilitySubmit,
  submissionError = false,
}: EligibilityModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001F3F]/40 backdrop-blur-md">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={handleCloseEligibilityModal} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl p-6 md:p-8 relative z-10 overflow-hidden text-left"
      >
        {/* Top luxury header accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#001F3F] via-[#FF0000] to-[#001F3F]" />
        
        {/* Close Button */}
        <button
          onClick={handleCloseEligibilityModal}
          className="absolute top-5.5 right-5.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-slate-400 hover:text-[#001F3F] transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Modal Title header */}
          <div>
            <span className="text-[10px] font-mono font-black tracking-widest text-[#FF0000] uppercase block mb-1">
              PROFILE EVALUATION ENGINE v1.2
            </span>
            <h3 className="text-xl md:text-2xl font-black text-[#001F3F] leading-tight">
              Evaluate Eligibility
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Calculate your match score for <strong className="text-[#001F3F]">{eligibilityUni.name}</strong>.
            </p>
          </div>

          {/* Progress bar steps */}
          {!formSuccess && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/50 p-1.5 rounded-2xl select-none">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-lg transition-all duration-300 ${
                    eligibilityStep >= step ? 'bg-[#001F3F]' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          )}

          {/* FORM WRAPPERS */}
          {!formSuccess ? (
            <div className="min-h-[290px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {/* Step 1: Course & Timing */}
                {eligibilityStep === 1 && (
                <motion.form
                  key="eligibility-step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleNextStep}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase pl-2">Desired Course Level</label>
                    <select
                      name="courseLevel"
                      value={eligibilityData.courseLevel}
                      onChange={handleFormInputChange}
                      className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="bachelor">Bachelor's Degree (UG)</option>
                      <option value="master">Master's Degree (MS / MBA / PG)</option>
                      <option value="diploma">Postgraduate Diploma (PGD)</option>
                      <option value="phd">PhD / Research Doctorate</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase pl-2">Preferred Intake Period</label>
                    <select
                      name="targetIntake"
                      value={eligibilityData.targetIntake}
                      onChange={handleFormInputChange}
                      className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all cursor-pointer"
                    >
                      {eligibilityUni.intakes.map((month) => (
                        <option key={month} value={`${month} 2027`}>
                          {month} 2027
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full py-4.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Next: Academic Profile</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 2: Academic & Language Scores */}
              {eligibilityStep === 2 && (
                <motion.form
                  key="eligibility-step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleNextStep}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase pl-2">Current CGPA / Percentage</label>
                      <input
                        type="text"
                        name="gpa"
                        required
                        placeholder="e.g. 8.5/10 or 3.6/4.0"
                        value={eligibilityData.gpa}
                        onChange={handleFormInputChange}
                        className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase pl-2">English Proficiency Exam</label>
                      <select
                        name="englishTest"
                        value={eligibilityData.englishTest}
                        onChange={handleFormInputChange}
                        className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="IELTS">IELTS Academic</option>
                        <option value="TOEFL">TOEFL iBT</option>
                        <option value="Duolingo">Duolingo Test (DET)</option>
                        <option value="Waived">Waived (MOI Document)</option>
                      </select>
                    </div>
                  </div>

                  {eligibilityData.englishTest !== 'Waived' && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase pl-2">Test Score Obtained</label>
                      <input
                        type="text"
                        name="englishScore"
                        required
                        placeholder={
                          eligibilityData.englishTest === 'IELTS'
                            ? 'e.g. 7.0'
                            : eligibilityData.englishTest === 'TOEFL'
                            ? 'e.g. 100'
                            : 'e.g. 125'
                        }
                        value={eligibilityData.englishScore}
                        onChange={handleFormInputChange}
                        className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 pt-6">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="col-span-1 py-4.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="col-span-2 py-4.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Next: Contact Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: Contact details & Submit */}
              {eligibilityStep === 3 && (
                <motion.form
                  key="eligibility-step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleEligibilitySubmit}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase pl-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter your name"
                      value={eligibilityData.name}
                      onChange={handleFormInputChange}
                      className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase pl-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@example.com"
                        value={eligibilityData.email}
                        onChange={handleFormInputChange}
                        className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase pl-2">Contact Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        value={eligibilityData.phone}
                        onChange={handleFormInputChange}
                        className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-6">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="col-span-1 py-4.5 border border-slate-200 hover:bg-slate-50 text-slate-655 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="col-span-2 py-4.5 bg-gradient-to-r from-[#001F3F] to-[#FF0000] hover:shadow-red-500/20 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {formLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>CALCULATE ELIGIBILITY</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
              </AnimatePresence>
            </div>
          ) : (
            /* SUCCESS SCREEN WITH ELIGIBILITY ANALYSIS */
            <motion.div
              key="eligibility-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6"
            >
              {/* Score gauge */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - eligibilityMatchScore / 100) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#001F3F]">{eligibilityMatchScore}%</span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Match Score</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-[#001F3F] text-lg">Evaluation Generated</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                  {eligibilityMessage}
                </p>
              </div>

              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto text-left space-y-2">
                <div className="font-bold text-[#001F3F] uppercase font-mono tracking-wider text-xs border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Admissions Dossier Registered</span>
                </div>
                <p><strong>Candidate:</strong> {eligibilityData.name} ({eligibilityData.phone})</p>
                <p><strong>Selected Target:</strong> {eligibilityUni.name} ({eligibilityUni.country})</p>
                <p><strong>Verification:</strong> {submissionError ? "Offline calculation only. Connection to counselor failed." : "Google Sheets synced. Outbound email alert routed to counselor."}</p>
              </div>

              <button
                onClick={handleCloseEligibilityModal}
                className="px-6 py-3 bg-slate-50 border border-slate-200 hover:text-[#001F3F] hover:bg-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
