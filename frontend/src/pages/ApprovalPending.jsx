import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, CheckCircle2, UserCheck, Mail } from 'lucide-react'; // Added Mail icon
import axios from 'axios';

const ApprovalPending = () => {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(false);
  const username = localStorage.getItem('pendingUsername');

  useEffect(() => {
    if (!username) return;

    const checkStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}user-status/${username.trim()}/`);
        if (res.data.is_active) {
          setIsApproved(true);
        }
      } catch (err) {
        console.error("Status check failed:", err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [username]);

  const handleClearAndLogin = () => {
    localStorage.removeItem('pendingUsername');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-6 font-sans">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl overflow-hidden border border-primary/5 p-12 text-center relative transition-all duration-500">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-[100px] transition-colors duration-1000 ${isApproved ? 'bg-green-500/10' : 'bg-accent/10'}`} />
        
        <div className="relative z-10 flex flex-col items-center">
          {!isApproved ? (
            <>
              <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/5">
                <Clock size={40} className="text-primary animate-pulse" />
              </div>

              <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter mb-4">
                Verification in Progress
              </h1>
              
              <div className="space-y-4 mb-10">
                <p className="text-primary/80 font-bold text-sm leading-relaxed">
                  Your request for <span className="text-accent underline underline-offset-4">{username || 'system access'}</span> is being reviewed.
                </p>
                <div className="bg-neutral/20 p-6 rounded-2xl border border-primary/5">
                  <p className="text-primary font-black text-[11px] uppercase tracking-widest leading-relaxed flex flex-col items-center gap-2">
                    <Mail size={18} className="text-accent" />
                    Wait for manager approval. You will receive an email confirmation once your ID is activated.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/')}
                className="group flex items-center justify-center gap-3 w-full py-5 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Return to Login
              </button>
            </>
          ) : (
            <div className="animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-green-500/20">
                <CheckCircle2 size={40} className="text-green-600 animate-bounce" />
              </div>

              <h1 className="text-3xl font-black text-green-600 italic uppercase tracking-tighter mb-4">
                Identity Verified
              </h1>
              
              <div className="space-y-4 mb-10">
                <p className="text-primary/80 font-bold text-sm leading-relaxed">
                  Welcome, <span className="text-green-600">{username}</span>. Your access protocol is now active.
                </p>
                <div className="bg-green-500/5 p-6 rounded-2xl border border-green-500/10">
                  <p className="text-green-700 font-black text-[11px] uppercase tracking-widest">
                    Confirmation email sent. You may now enter the terminal.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleClearAndLogin}
                className="group flex items-center justify-center gap-3 w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg"
              >
                <UserCheck size={16} />
                Access Terminal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalPending;