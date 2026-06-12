import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, User, Mail, Phone, Globe, BookOpen, ShieldAlert, CheckCircle, PhoneCall } from 'lucide-react';
import { DESTINATIONS } from '../data';

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'usa',
    degree: 'master',
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setBookingConfirmed(true);
      } else {
        setErrorMsg(result.error || 'Failed to submit enquiry credentials. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting admissions enquiry:', err);
      setErrorMsg('Communication error reaching the admissions server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative py-8 px-4 md:px-0" id="consultation-hub">
      <div className="absolute inset-0 rounded-3.5xl bg-gradient-to-tr from-sky-300/10 via-red-200/5 to-purple-400/5 blur-3xl pointer-events-none -z-10 animate-[pulse_10s_infinite]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

        {/* Left Info Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>


            <h3 className="text-3xl md:text-4.5xl font-extrabold tracking-tight text-[#001F3F]">
              Configure Your Flight Path
            </h3>

            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Share your details so our senior Admissions Architects can reach out and guide you toward your dream destination.
            </p>
          </div>

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

        {/* Right Form Area */}
        <div className="lg:col-span-8">
          <div
            className="relative rounded-3xl bg-white/35 backdrop-blur-md border border-white/60 shadow-2xl p-6 md:p-8"
            style={{ boxShadow: '0 30px 60px rgba(0,31,63,0.08), inset 0 2px 10px rgba(255,255,255,1)' }}
          >
            <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-[#FF0000]/5 blur-2xl pointer-events-none" />

            <AnimatePresence mode="wait">

              {/* State 1: Enquiry Form */}
              {!bookingConfirmed && (
                <motion.form
                  key="form"
                  onSubmit={submitEnquiry}
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

                    {/* Mobile — full width */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] placeholder-[#001F3F]/45 focus:bg-white/70 focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Dream Destination */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Dream Destination</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] focus:bg-white/70 focus:border-[#FF0000] outline-none transition-all cursor-pointer"
                        >
                          {DESTINATIONS.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.flag} {d.name} ({d.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Target Study Track */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Target Study Track</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          name="degree"
                          value={formData.degree}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/45 border border-white/60 backdrop-blur-xs rounded-xl text-xs md:text-sm text-[#001F3F] focus:bg-white/70 focus:border-[#FF0000] outline-none transition-all cursor-pointer"
                        >
                          <option value="bachelor">Post-Secondary / Bachelor's</option>
                          <option value="master">Post-Graduate / Master's</option>
                          <option value="doctorate">Doctorate / Ph.D.</option>
                          <option value="diploma">Executive Specialist Diploma</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {errorMsg && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-[#FF0000] text-xs rounded-xl font-mono">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
                    <span className="text-[10px] text-gray-400 font-mono max-w-sm">
                      *Our team will contact you within 24 hours to schedule your consultation.
                    </span>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-55 active:scale-97 cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>SUBMIT ENQUIRY</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* State 2: Success */}
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
                    <h4 className="text-2xl font-black text-[#001F3F] tracking-tight">Your Enquiry is Logged!</h4>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                      We have designated a senior Admissions Architect for you. A confirmation and next-step guide have been routed to:
                    </p>
                    <p className="text-xs font-mono font-bold text-[#001F3F] bg-white/75 border border-white/80 p-2.5 rounded-xl inline-block backdrop-blur-xs">
                      {formData.email}
                    </p>
                  </div>

                  <div className="max-w-sm mx-auto bg-white/55 border border-white/70 p-4 rounded-xl text-left text-xs text-gray-400 font-mono space-y-1 backdrop-blur-xs">
                    <p>・ AGENT ID: <span className="text-[#001F3F] font-semibold">FLYFLOURISH_ADM_ARCT_05</span></p>
                    <p>・ DISPATCH: <span className="text-[#001F3F] font-semibold">Express Queue Enabled</span></p>
                    <p>・ CONTACT WHATSAPP: <a href="https://wa.me/918374740505" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] font-bold hover:underline transition-all">+91 8374740505</a></p>
                  </div>

                  <button
                    onClick={() => {
                      setBookingConfirmed(false);
                      setFormData({ name: '', email: '', phone: '', destination: 'usa', degree: 'master' });
                    }}
                    className="px-5 py-2.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                  >
                    Submit Another Enquiry
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