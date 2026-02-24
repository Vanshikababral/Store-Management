// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';
// // 1. Updated Import: Change Login to Auth
// import Auth from './pages/Auth'; 
// import Dashboard from './pages/Dashboard';
// import Inventory from './pages/Inventory';
// import POS from './pages/POS';
// import Sidebar from './components/Sidebar';
// import Transactions from './pages/Transactions';
// import UserManagement from './pages/UserManagement';
// import ApprovalPending from './pages/ApprovalPending';
// import Profile from './pages/Profile';
// import ProductDetail from './pages/ProductDetail'; 
// import Departments from './pages/Departments';

// function App() {
//   const [token, setToken] = useState(localStorage.getItem('authToken'));
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear();
//     setToken(null);
//   };

//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isStaff = localStorage.getItem('isStaff') === 'true';
  
//   useEffect(() => {
//     Promise.resolve().then(() => {
//       setIsSidebarOpen(false);
//     });
//   }, []); 

//   return (
//     <Router>
//       <Routes>
//         <Route path="/approval-pending" element={<ApprovalPending />} />
//         <Route path="*" element={
//           !token ? (
//             <Auth setToken={setToken} />
//           ) : (
//             <div className="flex flex-col md:flex-row h-screen bg-secondary relative overflow-hidden">
//               {/* Mobile Header */}
//               <header className="md:hidden bg-white border-b border-primary/10 p-4 flex items-center justify-between sticky top-0 z-50">
//                 <h1 className="text-lg font-black text-primary italic uppercase">M Core</h1>
//                 <button 
//                   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                   className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
//                 >
//                   {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//                 </button>
//               </header>

//               {/* Sidebar container */}
//               <div className={`
//                  md:relative z-40 h-full transition-transform duration-300 ease-in-out
//                 ${isSidebarOpen ? 'fixed translate-x-0 inset-0' : 'fixed -translate-x-full md:translate-x-0 md:static'}
//                 w-72 md:w-auto
//               `}>
//                 <Sidebar onLogout={handleLogout} />
//               </div>

//               {/* Overlay for mobile sidebar */}
//               {isSidebarOpen && (
//                 <div 
//                   className="fixed inset-0 bg-black/20 z-30 md:hidden"
//                   onClick={() => setIsSidebarOpen(false)}
//                 />
//               )}
              
//               <main className="flex-grow p-4 md:p-8 overflow-y-auto">
//                 <Routes>
//                   <Route path="/" element={<Dashboard token={token} />} />
//                   <Route 
//                     path="/inventory" 
//                     element={(isAdmin || isStaff) ? <Inventory token={token} /> : <Navigate to="/" />} 
//                   />
//                   <Route path="/pos" element={<POS token={token} />} />
//                   <Route path="/transactions" element={<Transactions token={token} />} />
//                   <Route path="/departments" element={<Departments token={token} />} />
//                   <Route path="/products/:id" element={<ProductDetail token={token} />} />
//                   <Route 
//                     path="/users" 
//                     element={isAdmin ? <UserManagement token={token} /> : <Navigate to="/" />} 
//                   />
//                   <Route path="/profile" element={<Profile token={token} />} />
//                   <Route path="/products/:id" element={<ProductDetail token={token} />} /> {/* NEW: Restored route */}
//                   <Route path="*" element={<Navigate to="/" />} />
//                 </Routes>
//               </main>
//             </div>
//           )
//         } />
//       </Routes>
//     </Router>
//   );
// }



// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Auth from './pages/Auth'; 
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Sidebar from './components/Sidebar';
import Transactions from './pages/Transactions';
import UserManagement from './pages/UserManagement';
import ApprovalPending from './pages/ApprovalPending';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail'; 
import Departments from './pages/Departments';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // REACTIVE ROLE STATES
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [isStaff, setIsStaff] = useState(localStorage.getItem('isStaff') === 'true');

  // Update roles whenever the token changes
  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsStaff(localStorage.getItem('isStaff') === 'true');
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setIsAdmin(false);
    setIsStaff(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/approval-pending" element={<ApprovalPending />} />
        <Route path="*" element={
          !token ? (
            <Auth setToken={setToken} />
          ) : (
            <div className="flex flex-col md:flex-row h-screen bg-secondary relative overflow-hidden">
              <header className="md:hidden bg-white border-b border-primary/10 p-4 flex items-center justify-between sticky top-0 z-50">
                <h1 className="text-lg font-black text-primary italic uppercase">M Core</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </header>

              <div className={`md:relative z-40 h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'fixed translate-x-0 inset-0' : 'fixed -translate-x-full md:translate-x-0 md:static'} w-72 md:w-auto`}>
                <Sidebar onLogout={handleLogout} />
              </div>

              {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
              )}
              
              <main className="flex-grow p-4 md:p-8 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard token={token} />} />
                  <Route 
                    path="/inventory" 
                    element={(isAdmin || isStaff) ? <Inventory token={token} /> : <Navigate to="/" />} 
                  />
                  <Route path="/pos" element={<POS token={token} />} />
                  <Route path="/transactions" element={<Transactions token={token} />} />
                  <Route path="/departments" element={<Departments token={token} />} />
                  <Route path="/profile" element={<Profile token={token} />} />
                  <Route path="/products/:id" element={<ProductDetail token={token} />} />
                  <Route 
                    path="/users" 
                    element={isAdmin ? <UserManagement token={token} /> : <Navigate to="/" />} 
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;