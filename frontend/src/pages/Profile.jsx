import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import { User, Mail, Calendar, Shield, ShieldCheck, UserCog, Activity } from 'lucide-react';

const Profile = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("Could not retrieve system identity.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error || !userData) return (
    <div className="max-w-2xl mx-auto p-12 bg-accent/10 rounded-[2.5rem] border border-accent/20 text-center">
      <p className="text-accent font-black uppercase text-xs tracking-widest">{error || "System Identity Not Found"}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">System Identity</h1>
        <p className="text-primary/60 text-[10px] font-bold uppercase tracking-[0.3em]">Core User Authentication Profile</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-primary/5 p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary text-secondary rounded-[2rem] flex items-center justify-center font-black text-3xl mb-6 shadow-xl shadow-primary/20">
              {userData.username.substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-2xl font-black text-primary uppercase italic tracking-tighter">{userData.username}</h2>
            <div className={`mt-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                userData.is_superuser ? 'bg-primary text-secondary' : 'bg-accent/20 text-primary'
              }`}>
              {userData.is_superuser ? <ShieldCheck size={12} /> : <Shield size={12} />}
              {userData.is_superuser ? 'Access: Manager' : 'Access: Staff'}
            </div>
          </div>

          <div className="mt-10 space-y-4 relative z-10">
            <div className="p-4 bg-neutral/10 rounded-2xl border border-primary/5">
              <span className="block text-[9px] font-black text-primary/40 uppercase tracking-widest mb-1">Status Protocol</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase">Active Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details and Metrics */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-primary/5 p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral/20 rounded-xl flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-primary/40 uppercase tracking-widest">Email Address</span>
                    <span className="text-xs font-bold text-primary">{userData.email || "Not Provided"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral/20 rounded-xl flex items-center justify-center text-primary">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-primary/40 uppercase tracking-widest">Registry Date</span>
                    <span className="text-xs font-bold text-primary">{new Date(userData.date_joined).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral/20 rounded-xl flex items-center justify-center text-primary">
                    <UserCog size={18} />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-primary/40 uppercase tracking-widest">Employee UID</span>
                    <span className="text-xs font-mono font-bold text-primary">#{userData.id.toString().padStart(4, '0')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral/20 rounded-xl flex items-center justify-center text-primary">
                    <Activity size={18} />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-primary/40 uppercase tracking-widest">Permission Scope</span>
                    <span className="text-xs font-bold text-primary uppercase">{userData.is_staff ? "Full Matrix Access" : "Read-Only Observer"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions / Info */}
          <div className="bg-primary p-10 rounded-[2.5rem] shadow-2xl text-secondary relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
             <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60 italic">Security Notice</h3>
                <p className="text-xs font-bold leading-relaxed opacity-90 max-w-md">
                  Your identity is secured by the M Core Protocol. Any modifications to system privileges must be authorized by a Senior Manager. Always terminate your session when away from the terminal.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
