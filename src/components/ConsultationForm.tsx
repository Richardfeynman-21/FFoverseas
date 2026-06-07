import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, BookmarkCheck, PhoneCall, ChevronRight, User, Mail, ShieldAlert, BadgeInfo, CheckCircle } from 'lucide-react';
import { DESTINATIONS } from '../data';

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'usa',
    degree: 'master',
    gpa: '3.5',
    englishScore: '7.5',
    budget: 'mid'
  });

  const [evaluationResult, setEvaluationResult] = useState<null | {
    score: number;
    grade: string;
    advice: string;
    visaProbability: string;
  }>(null);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Simple formula based on scores to display custom outcomes (highly informative and professional)
      const gpaNum = parseFloat(formData.gpa) || 3.0;
      const eltsNum = parseFloat(formData.englishScore) || 6.5;
      
      let baseScore = 65;
      if (gpaNum >= 3.8) baseScore += 15;
      else if (gpaNum >= 3.4) baseScore += 10;
      else baseScore += 5;

      if (eltsNum >= 7.5) baseScore += 15;
      else if (eltsNum >= 6.5) baseScore += 10;
      else baseScore += 5;

      if (formData.budget === 'high') baseScore += 5;

      // Bound between 40 and 99
      const score = Math.min(Math.max(baseScore, 45), 98);
      
      let grade = 'Excellent Eligibility';
      let advice = 'Highly competitive for top tier universities. Fully recommended for express direct application paths.';
      let visaProbability = '98.2%';

      if (score < 80) {
        grade = 'High Eligibility';
        advice = 'A strong applicant pool. We recommend targeting a combination of ambitious research schools and 1-2 fallback options.';
        visaProbability = '94.5%';
      }
      if (score < 65) {
        grade = 'Standard Eligibility';
        advice = 'Advisable to support applications with strong SOPs, LORs, and early applications to maximize acceptance chances.';
        visaProbability = '88.9%';
      }

      setEvaluationResult({
        score,
        grade,
        advice,
        visaProbability
      });
      setLoading(false);
    }, 1200);
  };

  const submitAppointment = () => {
    setLoading(true);
    setTimeout(() => {
      setBookingConfirmed(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full relative py-8 px-4 md:px-0" id="consultation-hub">
      {/* Decorative Shifting Iridescent Gradient Backing */}
      <div 
        className="absolute inset-0 rounded-3.5xl bg-gradient-to-tr from-sky-300/10 via-red-200/5 to-purple-400/5 blur-3xl pointer-events-none -z-10 animate-[pulse_10s_infinite]" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side Info Panel (4 columns) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF0000]/5 border border-[#FF0000]/15 rounded-full text-xs text-[#FF0000] font-mono mb-3 backdrop-blur-sm">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>ORBIT DIRECT DEPLOYMENT</span>
            </div>

            <h3 className="text-3xl md:text-4.5xl font-extrabold tracking-tight text-[#001F3F]">
              Configure Your Flight Path
            </h3>

            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Input your academic coordinates to calculate your direct admissions compatibility score and reserve an exclusive counseling seminar.
            </p>
          </div>

          {/* Core Support Guidelines */}
          <div className="space-y-4 mt-8 bg-white/20 backdrop-blur-xs p-5 rounded-2xl border border-dashed border-[#001F3F]/20">
            <h4 className="text-xs font-mono font-bold text-[#001F3F] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF0000]" />
              Commitment to Transparency
            </h4>
            <ul className="text-xs text-gray-500 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] mt-1 shrink-0" />
                <span>Zero hidden service handling charges.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#001F3F] mt-1 shrink-0" />
                <span>100% security on confidential documents translation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] mt-1 shrink-0" />
                <span>Authorized global immigration lawyers verifying files.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Interactive Form Area (8 columns) */}
        <div className="lg:col-span-8">
          <div className="relative rounded-3xl bg-white/35 backdrop-blur-md border border-white/60 shadow-2xl p-6 md:p-8"
            style={{
              boxShadow: '0 30px 60px rgba(0,31,63,0.08), inset 0 2px 10px rgba(255,255,255,1)'
            }}
          >
            {/* Inner Refracting glow */}
            <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-[#FF0000]/5 blur-2xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {/* State 1: Form Fill up */}
              {!evaluationResult && !bookingConfirmed && (
                <motion.form
                  key="form"
                  onSubmit={calculateCompatibility}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Student Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Priyan Roy"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] placeholder-[#001F3F]/45 focus:bg-white/70 focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. roy.priyan@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] placeholder-[#001F3F]/45 focus:bg-white/70 focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Choice of Country */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Dream Destination</label>
                      <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] focus:bg-white/70 focus:border-[#FF0000] outline-none transition-all cursor-pointer"
                      >
                        {DESTINATIONS.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.flag} {d.name} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Target Degree */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Target Study Track</label>
                      <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] focus:bg-white/70 focus:border-[#FF0000] outline-none transition-all cursor-pointer"
                      >
                        <option value="bachelor">Post-Secondary / Bachelor's</option>
                        <option value="master">Post-Graduate / Master's</option>
                        <option value="doctorate">Doctorate / Ph.D.</option>
                        <option value="diploma">Executive Specialist Diploma</option>
                      </select>
                    </div>

                    {/* CGPA GPA */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Academic GPA (4.0 scale) / % Score</label>
                      <select
                        name="gpa"
                        value={formData.gpa}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] focus:bg-white/70 focus:border-[#FF0000] outline-none transition-all cursor-pointer"
                      >
                        <option value="3.9">3.80 - 4.00 (Outstanding / 90%+)</option>
                        <option value="3.5">3.40 - 3.79 (Deans List / 80%+)</option>
                        <option value="3.1">3.00 - 3.39 (Competitive / 70%+)</option>
                        <option value="2.7">Below 3.00 (Standard Progress)</option>
                      </select>
                    </div>

                    {/* IELTS/TOEFL Score */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">English Proficiency (IELTS Equivalency)</label>
                      <select
                        name="englishScore"
                        value={formData.englishScore}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] focus:bg-white/70 focus:border-[#FF0000] outline-none transition-all cursor-pointer"
                      >
                        <option value="8.0">Band 8.0 - 9.0 (Expert)</option>
                        <option value="7.5">Band 7.0 - 7.5 (Advised)</option>
                        <option value="6.5">Band 6.0 - 6.5 (Standard)</option>
                        <option value="5.5">Below Band 6.0 (Awaiting Prep)</option>
                      </select>
                    </div>
                  </div>

                  {/* Submission triggers evaluation */}
                  <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
                    <span className="text-[10px] text-gray-400 font-mono max-w-sm">
                      *By submitting coordinates, your algorithmic compatibility index evaluates instantly.
                    </span>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-55 active:scale-97 cursor-pointer"
                    >
                      {loading ? (
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

              {/* State 2: Displaying Compatibility results */}
              {evaluationResult && !bookingConfirmed && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="relative inline-flex items-center justify-center p-1 rounded-full bg-[#001F3F]/5">
                    {/* Ring score */}
                    <div className="w-32 h-32 rounded-full border-4 border-[#001F3F]/10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm relative shadow-inner">
                      <span className="text-4xl font-extrabold text-[#001F3F] font-mono leading-none">
                        {evaluationResult.score}%
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider mt-1">COMPATIBILITY</span>

                      {/* Animated orbiting highlight dot */}
                      <div className="absolute inset-0 rounded-full border border-dashed border-[#FF0000] animate-[spin_10s_linear_infinite]" />
                    </div>
                  </div>

                  <div className="max-w-md mx-auto space-y-2">
                    <span className="px-3 py-1 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-md text-[10px] font-mono text-[#FF0000] font-bold uppercase">
                      {evaluationResult.grade}
                    </span>
                    <h4 className="text-2xl font-black text-[#001F3F] tracking-tight">Congratulations {formData.name}!</h4>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                      {evaluationResult.advice}
                    </p>
                  </div>

                  {/* Core indices stats */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-white/55 border border-white/70 backdrop-blur-xs p-4 rounded-2xl">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-mono uppercase">Visa Success Core</p>
                      <p className="text-lg font-bold text-[#FF0000] font-mono">{evaluationResult.visaProbability}</p>
                    </div>
                    <div className="text-center border-l border-slate-200">
                      <p className="text-[10px] text-gray-400 font-mono uppercase">Partner Matching Speed</p>
                      <p className="text-lg font-bold text-[#001F3F] font-mono">EXPRESS</p>
                    </div>
                  </div>

                  {/* Action triggers: final consultation booking */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
                    <button
                      onClick={() => setEvaluationResult(null)}
                      className="px-5 py-2.5 bg-white/50 hover:bg-white/85 border border-white/70 rounded-xl text-xs font-semibold text-[#001F3F] backdrop-blur-xs transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      Refine Profile Coords
                    </button>
                    
                    <button
                      onClick={submitAppointment}
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#001F3F] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>RESERVE COUNSELING ORBIT</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* State 3: Booking Success */}
              {bookingConfirmed && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/35 flex items-center justify-center text-[#FF0000] mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div className="max-w-md mx-auto space-y-2">
                    <h4 className="text-2xl font-black text-[#001F3F] tracking-tight">Your Session is Logged!</h4>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                      We have designated a senior Admissions Architect for you. A secure video invite, profiling handbook, and checklists have been routed to:
                    </p>
                    <p className="text-xs font-mono font-bold text-[#001F3F] bg-white/75 border border-white/80 p-2.5 rounded-xl inline-block backdrop-blur-xs">
                      {formData.email}
                    </p>
                  </div>

                  <div className="max-w-sm mx-auto bg-white/55 border border-white/70 p-4 rounded-xl text-left text-xs text-gray-400 font-mono space-y-1 backdrop-blur-xs">
                    <p>・ AGENT ID: <span className="text-[#001F3F] font-semibold">FLYFLOURISH_ADM_ARCT_05</span></p>
                    <p>・ DISPATCH: <span className="text-[#001F3F] font-semibold">Express Queue Enabled</span></p>
                    <p>・ CONTACT WHATSAPP: <span className="text-[#FF0000] font-bold">+1 (800) ORBIT-FLY</span></p>
                  </div>

                  <button
                    onClick={() => {
                      setEvaluationResult(null);
                      setBookingConfirmed(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        destination: 'usa',
                        degree: 'master',
                        gpa: '3.5',
                        englishScore: '7.5',
                        budget: 'mid'
                      });
                    }}
                    className="px-5 py-2.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                  >
                    Calculate New Coords
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
