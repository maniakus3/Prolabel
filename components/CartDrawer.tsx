import React, { useState } from 'react';
import { X, Trash2, ShoppingCart, ArrowRight, CreditCard, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }) => {
  
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.config.totalPrice, 0);
  const netPrice = totalPrice / 1.23;

  return (
    <>
      {/* Thumbnail Modal (Lightbox) */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
             <button 
                className="absolute -top-12 right-0 text-white/70 hover:text-white p-2 transition-colors"
                onClick={() => setEnlargedImage(null)}
             >
               <X className="w-8 h-8" />
             </button>
             <img 
               src={enlargedImage} 
               alt="Pełny podgląd" 
               className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
               onClick={(e) => e.stopPropagation()} 
             />
             <p className="absolute -bottom-10 text-white/50 text-sm font-medium">Kliknij tło, aby zamknąć</p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-primary" />
            Koszyk ({cartItems.length})
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="bg-slate-100 p-6 rounded-full">
                <ShoppingCart className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-sm font-medium">Twój koszyk jest pusty</p>
              <button onClick={onClose} className="text-brand-accent text-sm font-bold hover:underline">
                Wróć do konfiguratora
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-brand-accent/30 transition-all group">
                <div className="flex justify-between items-start mb-2 gap-3">
                  {/* Thumbnail Preview with Click Action */}
                  <div 
                    className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center cursor-pointer relative group/thumb"
                    onClick={() => item.previewUrl && setEnlargedImage(item.previewUrl)}
                    title="Kliknij, aby powiększyć"
                  >
                    {item.previewUrl ? (
                      <>
                        <img 
                          src={item.previewUrl} 
                          alt="Podgląd projektu" 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-all flex items-center justify-center">
                           <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover/thumb:opacity-100 drop-shadow-md" />
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        {/* PRODUCT NAME FIRST */}
                        <h3 className="font-bold text-slate-800 text-sm truncate pr-2">
                          {item.config.productName || 'Produkt Niestandardowy'}
                        </h3>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          title="Usuń"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    {/* DETAILS BELOW */}
                    <p className="text-xs text-slate-500 mb-1 line-clamp-2 leading-relaxed">
                      {item.config.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-2">
                  <div className="text-xs text-slate-500">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                        {item.config.width}x{item.config.height}mm
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                        {item.config.shape}
                      </span>
                    </div>
                    <span className="font-bold text-slate-700">Nakład: {item.config.quantity} szt.</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Brutto</div>
                    <div className="text-lg font-bold text-brand-primary">
                      {item.config.totalPrice.toFixed(2)} zł
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Suma netto:</span>
                <span>{netPrice.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>VAT (23%):</span>
                <span>{(totalPrice - netPrice).toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-gray-100">
                <span>Do zapłaty:</span>
                <span>{totalPrice.toFixed(2)} zł</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-brand-accent hover:bg-sky-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <CreditCard className="w-5 h-5" />
              Przejdź do kasy
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;