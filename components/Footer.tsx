
import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';

interface FooterProps {
  settings: AppSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-white text-slate-900 pt-24 pb-16 border-t border-slate-100 relative mt-24">
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
        <div className="space-y-10">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white italic text-xl">V</div>
            <span className="font-black text-3xl uppercase tracking-tighter text-slate-900">{settings.brandName}</span>
          </Link>
          <p className="text-slate-400 text-[15px] font-medium leading-relaxed max-w-sm italic">
            Official distribution repository for premium licensing and digital verification since {settings.establishedYear}. Trusted globally for authentic key delivery.
          </p>
        </div>

        <div className="space-y-10">
          <h4 className="font-black text-slate-900 uppercase text-[12px] tracking-[0.4em]">Vault Links</h4>
          <nav className="flex flex-col gap-6 text-slate-400 text-[14px] font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-slate-900 transition-colors">Repository Home</Link>
            <Link to="/search?q=best" className="hover:text-slate-900 transition-colors">Global Bestsellers</Link>
            <Link to="/admin/login" className="text-blue-600 hover:text-blue-800 transition-colors">Seller Portal Access</Link>
          </nav>
        </div>

        <div className="space-y-10">
          <h4 className="font-black text-slate-900 uppercase text-[12px] tracking-[0.4em]">Authenticity</h4>
          <nav className="flex flex-col gap-6 text-slate-400 text-[14px] font-bold uppercase tracking-widest">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Authenticity Promise</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Distribution Status</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Legal Repository</span>
          </nav>
        </div>

        <div className="space-y-10">
          <h4 className="font-black text-slate-900 uppercase text-[12px] tracking-[0.4em]">Support Bridge</h4>
          <a href={`https://wa.me/${settings.whatsappNumber}`} className="flex items-center gap-6 group bg-slate-50 p-6 rounded-[32px] border border-slate-100 hover:border-emerald-500/20 transition-all shadow-sm">
             <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.284l-.569 2.1c-.149.546.37 1.039.905.868l2.127-.677c.727.427 1.486.634 2.268.635 3.181 0 5.766-2.587 5.768-5.766.001-3.181-2.587-5.77-5.77-5.77zm3.033 8.358c-.145.409-.844.757-1.15.808-.282.047-.648.082-1.047-.113-.245-.121-.555-.262-1.218-.549-1.201-.52-1.956-1.748-2.016-1.828-.06-.081-.486-.647-.486-1.235 0-.589.308-.878.421-1.002.113-.124.248-.155.33-.155s.165 0 .237.004c.075.004.177-.029.277.214.102.243.346.845.376.906.031.061.05.131.01.21-.04.079-.061.131-.121.202-.06.07-.124.156-.177.21-.059.06-.121.125-.053.243.068.118.303.499.65 0.808.448.399.825.522.942.583.117.06.185.05.253-.028.068-.078.293-.342.371-.459.078-.117.157-.098.263-.059.106.039.67.316.786.375.115.059.193.088.221.137.028.049.028.283-.117.691z"/></svg>
             </div>
             <div className="flex flex-col leading-tight">
               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Direct Network</span>
               <span className="text-slate-900 text-[16px] font-black">{settings.whatsappNumber}</span>
             </div>
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-10 text-[11px] text-slate-300 font-bold uppercase tracking-[0.4em]">
        <p>© 2024 {settings.brandName}. Professional Licensing Repository Port.</p>
        <div className="flex gap-12 relative">
           <span className="flex items-center gap-3">Network Encrypted</span>
           <span>v7.2 Global Build</span>
           
           {/* Admin Entrance */}
           <Link 
            to="/admin" 
            className="absolute -right-8 bottom-0 w-2 h-2 bg-red-600 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            title="System Login"
           ></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
