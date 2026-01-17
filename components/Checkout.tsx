import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, FileText, Smartphone, CheckCircle2, ShieldCheck, Lock, Copy } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onBack: () => void;
  onPlaceOrder: (orderData: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, onBack, onPlaceOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState<'blik' | 'transfer'>('blik');
  const [wantInvoice, setWantInvoice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    // Invoice specific
    companyName: '',
    nip: '',
    billingStreet: '',
    billingCity: '',
    billingZipCode: '',
    // Payment
    blikCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyShippingAddress = () => {
    setFormData(prev => ({
      ...prev,
      billingStreet: prev.street,
      billingZipCode: prev.zipCode,
      billingCity: prev.city
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.config.totalPrice, 0);
  const netPrice = totalPrice / 1.23;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Final data preparation
    const finalOrderData = {
      ...formData,
      // If user wants invoice, use explicit billing fields. 
      // If not, we can either ignore them or set them to shipping address in backend. 
      // Here we send what is in the form.
      cart, 
      paymentMethod, 
      total: totalPrice
    };

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onPlaceOrder(finalOrderData);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Checkout Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-brand-primary font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Wróć do sklepu
          </button>
          <div className="flex items-center gap-2 text-brand-primary font-bold text-lg">
            <Lock className="w-5 h-5" />
            Bezpieczna Kasa
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - FORMS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Shipping Data */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                  <Truck className="w-5 h-5" />
                </div>
                Dane do wysyłki
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Imię</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none transition-shadow" placeholder="Jan" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nazwisko</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none transition-shadow" placeholder="Kowalski" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Adres e-mail</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none transition-shadow" placeholder="jan.kowalski@example.com" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Ulica i numer</label>
                  <input required name="street" value={formData.street} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none transition-shadow" placeholder="ul. Przykładowa 1/2" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Kod pocztowy</label>
                  <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none transition-shadow" placeholder="00-000" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Miasto</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none transition-shadow" placeholder="Warszawa" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Telefon</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none transition-shadow" placeholder="+48 123 456 789" />
                </div>
              </div>
            </div>

            {/* 2. Invoice Data */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  Dane do faktury
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={wantInvoice} onChange={(e) => setWantInvoice(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
                </label>
              </div>

              {wantInvoice && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-6 border-t border-gray-100 pt-6">
                   
                   {/* Company Name */}
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Nazwa Firmy</label>
                      <input required={wantInvoice} name="companyName" value={formData.companyName} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none" placeholder="Pełna nazwa firmy" />
                   </div>

                   {/* Copy Address Button - Moved to Left */}
                   <div className="flex justify-start">
                      <button 
                        type="button"
                        onClick={copyShippingAddress}
                        className="text-xs font-bold text-brand-primary flex items-center gap-1.5 hover:bg-brand-light px-3 py-1.5 rounded-lg transition-colors -ml-3"
                      >
                         <Copy size={14} /> Skopiuj adres z danych do wysyłki
                      </button>
                   </div>

                   {/* Billing Address Fields - Removed Background/Border styling */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                           <h4 className="text-sm font-bold text-slate-700 mb-1">Adres firmy</h4>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Ulica i numer</label>
                          <input required={wantInvoice} name="billingStreet" value={formData.billingStreet} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none" placeholder="ul. Firmowa 1" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Kod pocztowy</label>
                          <input required={wantInvoice} name="billingZipCode" value={formData.billingZipCode} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none" placeholder="00-000" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Miasto</label>
                          <input required={wantInvoice} name="billingCity" value={formData.billingCity} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none" placeholder="Miasto" />
                        </div>
                   </div>

                   {/* NIP at the bottom */}
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">NIP</label>
                      <input required={wantInvoice} name="nip" value={formData.nip} onChange={handleInputChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none" placeholder="0000000000" />
                   </div>
                </div>
              )}
              {!wantInvoice && <p className="text-sm text-gray-500 pl-11">Paragon zostanie dołączony do zamówienia.</p>}
            </div>

            {/* 3. Payment */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                Płatność
              </h3>

              <div className="space-y-4">
                {/* BLIK Option */}
                <div 
                  onClick={() => setPaymentMethod('blik')}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'blik' ? 'border-brand-accent ring-1 ring-brand-accent bg-brand-light/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'blik' ? 'border-brand-accent' : 'border-gray-300'}`}>
                      {paymentMethod === 'blik' && <div className="w-2.5 h-2.5 bg-brand-accent rounded-full" />}
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                       <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-black italic tracking-tighter text-xs">BLIK</div>
                       <span className="font-bold text-slate-800">Szybka płatność BLIK</span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'blik' && (
                    <div className="ml-9 mt-4 animate-in fade-in slide-in-from-top-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Kod BLIK (6 cyfr)</label>
                      <div className="relative max-w-[200px]">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          maxLength={6} 
                          name="blikCode"
                          value={formData.blikCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData({...formData, blikCode: val});
                          }}
                          className="w-full pl-10 pr-4 py-3 text-xl font-bold tracking-widest text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none" 
                          placeholder="000 000" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Transfer Option */}
                <div 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-brand-accent ring-1 ring-brand-accent bg-brand-light/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-brand-accent' : 'border-gray-300'}`}>
                      {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 bg-brand-accent rounded-full" />}
                    </div>
                    <div className="flex-1">
                       <span className="font-bold text-slate-800 block">Przelew tradycyjny</span>
                       <span className="text-xs text-slate-500">Księgowanie może potrwać do 24h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Podsumowanie zamówienia</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm border-b border-gray-50 pb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                       {item.previewUrl && <img src={item.previewUrl} className="w-full h-full object-contain" alt="Preview" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">{item.config.productName}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{item.config.description}</div>
                      <div className="flex justify-between mt-1">
                        <span className="text-slate-500">{item.config.quantity} szt.</span>
                        <span className="font-bold text-brand-primary">{item.config.totalPrice.toFixed(2)} zł</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-slate-600">
                  <span>Wartość netto:</span>
                  <span>{netPrice.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT (23%):</span>
                  <span>{(totalPrice - netPrice).toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Dostawa:</span>
                  <span className="text-green-600 font-bold">Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t border-gray-100 mt-2">
                  <span>Do zapłaty:</span>
                  <span>{totalPrice.toFixed(2)} zł</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 mt-8 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>Przetwarzanie...</>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Zamawiam i Płacę
                  </>
                )}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-[10px] text-slate-400">
                  Klikając przycisk, akceptujesz <a href="#" className="underline hover:text-slate-600">Regulamin</a> sklepu.
                  Płatności obsługiwane są przez bezpiecznego operatora.
                </p>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;