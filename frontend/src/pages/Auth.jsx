// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// const Auth = ({ setToken }) => {
//   const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
//   const [formData, setFormData] = useState({ username: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     setError('');
//     const { username, email, password } = formData;

//     // Basic Validation
//     if (!username || !password || (!isLogin && !email)) {
//       setError('Required fields are missing');
//       return;
//     }

//     if (!isLogin) {
//       if (password.length < 6) {
//         setError('Password must be at least 6 characters');
//         return;
//       }
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         setError('Invalid email format');
//         return;
//       }
//     }
    
//     const endpoint = isLogin ? 'token/' : 'register/';
//     const url = `http://127.0.0.1:8000/api/${endpoint}`;

//     try {
//       const res = await axios.post(url, formData);
      
//       if (isLogin) {
//         // Decode token to get roles
//         const decoded = jwtDecode(res.data.access);
//         const isManager = decoded.is_superuser === true;
//         const isStaff = decoded.is_staff === true;
        
//         localStorage.setItem('authToken', res.data.access);
//         localStorage.setItem('refreshToken', res.data.refresh);
//         localStorage.setItem('username', username);
//         localStorage.setItem('isAdmin', isManager ? "true" : "false");
//         localStorage.setItem('isStaff', isStaff ? "true" : "false");
        
//         setToken(res.data.access);
//         navigate("/"); 
//       } else {
//         // Handle Signup Success
//         localStorage.setItem('pendingUsername', username.trim());
//         navigate("/approval-pending");
//       }
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError(isLogin ? 'Invalid Credentials or Pending Approval' : 'Registration Failed');
//       } else {
//         setError(err.response?.data?.error || 'System Error. Try again.');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
//       <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-primary/5 transition-all duration-500">
        
//         {/* Toggle Header */}
//         <div className="flex bg-neutral/20 p-2 m-6 rounded-2xl">
//           <button 
//             onClick={() => setIsLogin(true)}
//             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white shadow-sm text-primary' : 'text-primary/40'}`}
//           >
//             Login
//           </button>
//           <button 
//             onClick={() => setIsLogin(false)}
//             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white shadow-sm text-primary' : 'text-primary/40'}`}
//           >
//             Signup
//           </button>
//         </div>

//         <div className="px-10 pb-10">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">
//               {isLogin ? 'Core Auth' : 'Create Identity'}
//             </h1>
//           </div>

//           <form onSubmit={handleAuth} className="space-y-4">
//             <input 
//               type="text" 
//               placeholder="USERNAME" 
//               className="w-full p-4 bg-neutral/10 rounded-2xl outline-none text-xs font-bold border border-transparent focus:border-accent/30 transition-all"
//               onChange={(e) => setFormData({...formData, username: e.target.value})}
//               required
//             />
            
//             {!isLogin && (
//               <input 
//                 type="email" 
//                 placeholder="EMAIL_ADDRESS" 
//                 className="w-full p-4 bg-neutral/10 rounded-2xl outline-none text-xs font-bold border border-transparent focus:border-accent/30 transition-all"
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                 required
//               />
//             )}

//             <input 
//               type="password" 
//               placeholder="PASSWORD" 
//               className="w-full p-4 bg-neutral/10 rounded-2xl outline-none text-xs font-bold border border-transparent focus:border-accent/30 transition-all"
//               onChange={(e) => setFormData({...formData, password: e.target.value})}
//               required
//             />

//             {error && <p className="text-[9px] font-black text-accent uppercase text-center bg-accent/10 py-2 rounded-lg">{error}</p>}

//             <button type="submit" className="w-full py-5 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-lg">
//               {isLogin ? 'Authorize Session' : 'Register System User'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? 'token/' : 'register/';
    const url = `${import.meta.env.VITE_API_URL}${endpoint}`;

    try {
      const res = await axios.post(url, formData);
      
      if (isLogin) {
        const decoded = jwtDecode(res.data.access);
        
        // SYNC THESE WITH App.jsx
        localStorage.setItem('authToken', res.data.access);
        localStorage.setItem('access', res.data.access); // For AddProductForm compatibility
        localStorage.setItem('refreshToken', res.data.refresh);
        localStorage.setItem('username', formData.username);
        
        // Critical: Ensure these keys match exactly
        localStorage.setItem('isAdmin', decoded.is_superuser ? "true" : "false");
        localStorage.setItem('isStaff', decoded.is_staff ? "true" : "false");
        
        setToken(res.data.access);
        navigate("/inventory"); // Go straight to Inventory after login
      } else {
        localStorage.setItem('pendingUsername', formData.username.trim());
        navigate("/approval-pending");
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-10 border border-primary/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">
            {isLogin ? 'Core Auth' : 'Create Identity'}
          </h1>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="text" 
            placeholder="USERNAME" 
            className="w-full p-4 bg-neutral/10 rounded-2xl outline-none text-xs font-bold"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          {!isLogin && (
            <input 
              type="email" 
              placeholder="EMAIL" 
              className="w-full p-4 bg-neutral/10 rounded-2xl outline-none text-xs font-bold"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          )}
          <input 
            type="password" 
            placeholder="PASSWORD" 
            className="w-full p-4 bg-neutral/10 rounded-2xl outline-none text-xs font-bold"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          {error && <p className="text-[9px] font-black text-accent uppercase text-center bg-accent/10 py-2 rounded-lg">{error}</p>}
          <button type="submit" className="w-full py-5 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all">
            {isLogin ? 'Authorize Session' : 'Register System User'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-[10px] font-bold uppercase text-primary/40 hover:text-primary transition-colors">
          {isLogin ? "Need an account? Signup" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;