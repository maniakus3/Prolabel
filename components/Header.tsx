import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 text-xs md:text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
             <span className="flex items-center hover:text-white transition cursor-pointer">
               <Mail className="w-3 h-3 mr-1" /> biuro@prolabel.pl
             </span>
             <span className="flex items-center hover:text-white transition cursor-pointer">
               <Phone className="w-3 h-3 mr-1" /> +48 123 456 789
             </span>
          </div>
          <div className="hidden md:flex items-center">
            <MapPin className="w-3 h-3 mr-1" /> Warszawa, Polska
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="https://prolabel.pl/wp-content/uploads/2025/12/prolabel_logo.png?_t=1765647339" 
            alt="Prolabel Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
        
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-700">
          <a href="#" className="hover:text-brand-primary transition">Strona Główna</a>
          <a href="#details-section" className="hover:text-brand-primary transition">Oferta</a>
          <a href="#" className="hover:text-brand-primary transition">O Nas</a>
          <button className="bg-brand-primary text-white px-5 py-2 rounded-lg hover:bg-brand-dark transition shadow-md shadow-blue-900/20">
            Kontakt
          </button>
        </nav>

        {/* Mobile Menu Icon (Placeholder) */}
        <div className="md:hidden">
           <button className="text-slate-800 p-2">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
