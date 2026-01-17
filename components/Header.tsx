import React from 'react';
import { Phone, Mail, MapPin, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0, onOpenCart }) => {
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
        
        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-700">
            <a href="#" className="hover:text-brand-primary transition">Strona Główna</a>
            <a href="#details-section" className="hover:text-brand-primary transition">Oferta</a>
            <a href="#" className="hover:text-brand-primary transition">O Nas</a>
          </nav>

          <div className="flex items-center gap-3">
            {onOpenCart && (
              <button 
                onClick={onOpenCart}
                className="relative p-2 text-slate-600 hover:text-brand-accent transition-colors rounded-full hover:bg-slate-50"
                title="Koszyk"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button className="hidden md:block bg-brand-primary text-white px-5 py-2 rounded-lg hover:bg-brand-dark transition shadow-md shadow-blue-900/20 text-sm font-medium">
              Kontakt
            </button>

            {/* Mobile Menu Icon (Placeholder) */}
            <div className="md:hidden">
               <button className="text-slate-800 p-2">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
               </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;