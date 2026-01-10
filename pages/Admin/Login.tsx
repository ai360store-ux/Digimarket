import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
      navigate('/admin');
    } else {
      setError('Invalid system key. Try admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md bg-[#121218] rounded-[32px] p-10 border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl rounded-full"></div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-[0_0_30px_rgba(139,92,246,0.4)]">D</div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">System Access</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-none">Enter admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Admin Key</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-violet-600/50 focus:border-violet-600 outline-none transition-all text-white placeholder-zinc-700 font-mono"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="mt-4 text-center text-[10px] text-rose-500 font-black uppercase tracking-widest">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 text-white font-black py-5 rounded-2xl hover:bg-violet-700 transition-all active:scale-95 shadow-xl shadow-violet-600/20 uppercase text-xs tracking-[0.3em]"
          >
            Authorize Session
          </button>
        </form>

        <p className="text-center text-[9px] font-black text-zinc-600 uppercase tracking-widest pt-4 space-x-4">
          <span>Emergency Bypass: <span className="text-zinc-400">admin123</span></span>
          <span className="text-zinc-700">|</span>
          <a href="/#/admin/debug" className="text-blue-500 hover:text-blue-400 transition-colors">System Diagnostics</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;