import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDigiContext } from '../../context/DigiContext';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useDigiContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'ai360') {
      login();
      navigate('/admin');
    } else {
      setError('AUTHORIZATION REVOKED: INVALID CLEARANCE');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-10 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-4xl border border-white/10 mx-auto shadow-inner">🔐</div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command Entry</h2>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Restricted Administrative Access Only</p>
          </div>

          <div className="space-y-6">
            <input
              type="password"
              placeholder="ENTER CLEARANCE KEY"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all text-white text-center font-mono font-bold placeholder:text-white/20"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest animate-pulse">{error}</p>}
          </div>

          <button className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 uppercase text-[12px] tracking-[0.4em] italic leading-none">
            Authenticate Node
          </button>

          <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em] pt-4">Global Security Protocol v2.4</p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;