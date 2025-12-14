import React, { useState, useRef, useEffect } from 'react';
import { Check, Settings, ShoppingCart, Ruler, Layers, Circle, Square, ArrowRight, MousePointer2, Upload, FileText, X, Image as ImageIcon, CornerDownRight, Snowflake, Star, ScanLine, Gem, AlertTriangle, Shield, Sparkles, Eraser, Copy, Plus, PaintBucket, Ban, Printer, Palette, Search, Sun, Cloud, Fingerprint, Eye, Stamp, StickyNote, Puzzle, MessageSquare, Send, CheckCircle, Droplets, Zap, Cylinder } from 'lucide-react';

// --- DATA DEFINITIONS ---

const labelMaterials = [
  { 
    id: 'termiczne', 
    name: 'Etykiety Termiczne', 
    desc: 'Krótka żywotność, matowe', 
    colorClass: 'bg-white',
    variants: [
      { id: 'eco', name: 'ECO', desc: 'Standardowe' },
      { id: 'top', name: 'TOP', desc: 'Wzmocnione' },
      { id: 'freeze', name: 'Deep Freeze', desc: 'Do głębokiego mrożenia', icon: Snowflake }
    ]
  },
  { 
    id: 'papierowe', 
    name: 'Etykiety Papierowe', 
    desc: 'Do druku termotransferowego', 
    colorClass: 'bg-stone-50',
    variants: [
      { id: 'polblysk', name: 'Półbłysk', desc: 'Standard (Najczęściej wybierane)', badge: 'Popularne' },
      { id: 'mat', name: 'Matowe', desc: 'Naturalne, nie odbijają światła' },
      { id: 'odlepne', name: 'Łatwo odlepne', desc: 'Klej usuwalny, nie zostawia śladów', icon: Eraser }
    ]
  },
  { 
    id: 'foliowe', 
    name: 'Etykiety Foliowe', 
    desc: 'Wodoodporne, trwałe', 
    colorClass: 'bg-slate-100 ring-1 ring-slate-200',
    variants: [
      { id: 'white', name: 'Folia Biała', desc: 'Standardowa biała' },
      { id: 'transparent', name: 'Przeźroczysta', desc: 'Ze znacznikiem (black mark)', icon: ScanLine }
    ]
  },
  { 
    id: 'metalizowane', 
    name: 'Etykiety Metalizowane', 
    desc: 'Efekt premium, błyszczące', 
    colorClass: 'bg-gradient-to-br from-gray-300 via-yellow-100 to-gray-300',
    variants: [
      { id: 'silver', name: 'Folia Srebrna', desc: 'Chromowany połysk' },
      { id: 'gold', name: 'Folia Złota', desc: 'Złoty połysk', icon: Gem }
    ]
  },
  { 
    id: 'holograficzne', 
    name: 'Etykiety Holograficzne', 
    desc: 'Zabezpieczające, efekt 3D', 
    colorClass: 'bg-gradient-to-tr from-pink-300 via-cyan-300 to-indigo-300',
    variants: [
      { id: 'standard', name: 'Standard', desc: 'Tęczowy hologram', icon: Sparkles },
    ]
  },
  { 
    id: 'plombowe', 
    name: 'Etykiety Plombowe', 
    desc: 'Gwarancyjne, trudnousuwalne', 
    colorClass: 'bg-slate-50 border-dashed border border-slate-400',
    variants: [
      { id: 'kruszaca', name: 'Folia Krusząca', desc: 'Rozpada się przy zerwaniu', icon: Shield },
      { id: 'void', name: 'Folia VOID', desc: 'Zostawia ślad po zerwaniu' }
    ]
  },
  { 
    id: 'fluo', 
    name: 'Etykiety Fluorescencyjne', 
    desc: 'Jaskrawe kolory ostrzegawcze', 
    colorClass: 'bg-yellow-400',
    variants: [
      { id: 'yellow', name: 'Żółta', desc: 'Intensywny żółty', icon: AlertTriangle },
      { id: 'red', name: 'Czerwona', desc: 'Intensywny czerwony' },
      { id: 'green', name: 'Zielona', desc: 'Intensywny zielony' }
    ]
  },
  { 
    id: 'pcv', 
    name: 'Folie PCV', 
    desc: 'Sztywne podłoże (przywieszki)', 
    colorClass: 'bg-white border-2 border-slate-200',
    variants: [
      { id: '200g', name: 'Biała 200g', desc: 'Standardowa grubość', icon: StickyNote },
      { id: '300g', name: 'Biała 300g', desc: 'Zwiększona sztywność', icon: Shield }
    ]
  },
];

const ribbonMaterials = [
  { 
    id: 'wosk', 
    name: 'Kalki Woskowe', 
    desc: 'Ekonomiczne, do etykiet papierowych', 
    colorClass: 'bg-slate-800',
    variants: [
      { id: 'wax_black', name: 'Czarna Standard', desc: 'Najtańsza, uniwersalna, woskowa taśma barwiąca o standardowej wydajności do etykiet papierowych.', icon: Droplets, badge: 'Standard' },
    ]
  },
  { 
    id: 'wosk_zywica', 
    name: 'Kalki Woskowo-Żywiczne', 
    desc: 'Zwiększona odporność na ścieranie', 
    colorClass: 'bg-slate-700',
    variants: [
      { id: 'wax_resin_black', name: 'Czarna', desc: 'Można zadrukować papier oraz folie, zapewnia doskonałą czytelność nadruku, nawet przy dużych prędkościach druku. Zwiększona odporność na ścieranie.', icon: Layers, badge: 'Popularne' },
    ]
  },
  { 
    id: 'zywica', 
    name: 'Kalki Żywiczne', 
    desc: 'Najwyższa trwałość, do folii i tekstyliów', 
    colorClass: 'bg-black',
    variants: [
      { id: 'resin_black', name: 'Czarna Premium', desc: 'Nadruk taki jest odporny na czynniki mechaniczne, wodoodporny, niewrażliwy na światło słoneczne (promieniowanie UV).', icon: Shield },
    ]
  },
  { 
    id: 'kolor', 
    name: 'Kalki Kolorowe', 
    desc: 'Woskowo-żywiczne w kolorach', 
    colorClass: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500',
    variants: [
      { id: 'red', name: 'Czerwona', desc: 'Ostrzegawcza', icon: Palette },
      { id: 'blue', name: 'Niebieska', desc: 'Standardowy niebieski' },
      { id: 'green', name: 'Zielona', desc: 'Standardowy zielony' }
    ]
  },
  { 
    id: 'metalik', 
    name: 'Kalki Metalizowane', 
    desc: 'Efektowne wydruki ozdobne', 
    colorClass: 'bg-gradient-to-br from-gray-300 via-yellow-100 to-gray-400',
    variants: [
      { id: 'gold', name: 'Złota', desc: 'Luksusowy połysk', icon: Gem },
      { id: 'silver', name: 'Srebrna', desc: 'Metaliczny połysk', icon: Star }
    ]
  },
];

const shapes = [
  { id: 'rect', name: 'Prostokąt', icon: Square },
  { id: 'circle', name: 'Okrąg', icon: Circle },
  { id: 'custom', name: 'Nieregularny', icon: MousePointer2 },
];

const printTypes = [
  { id: 'none', name: 'Bez nadruku', icon: Ban, badge: 'Popularne' },
  { id: 'apla', name: 'Apla', icon: PaintBucket },
  { id: 'print', name: 'Z nadrukiem', icon: Printer },
];

const varnishOptions = [
  { id: 'none', name: 'Bez uszlachetnienia', icon: Ban },
  { id: 'gloss', name: 'Lakier błyszczący', icon: Sun },
  { id: 'matte', name: 'Lakier matowy', icon: Cloud },
  { id: 'lam_gloss', name: 'Laminat błyszczący', icon: Layers },
  { id: 'lam_matte', name: 'Laminat matowy', icon: Eraser },
];

const premiumOptions = [
  { id: 'stamping_silver', name: 'Stamping Srebrny', icon: Star, color: 'text-slate-400' },
  { id: 'stamping_gold', name: 'Stamping Złoty', icon: Gem, color: 'text-yellow-500' },
  { id: 'stamping_holo', name: 'Stamping Holo', icon: Sparkles, color: 'text-indigo-400' },
  { id: 'spot_uv', name: 'Lakier Wybiórczy', icon: Eye, color: 'text-blue-400' },
  { id: 'braille', name: 'Lakier Brailla', icon: Fingerprint, color: 'text-stone-500' },
];

// Expanded Pantone Palette (Simulated Hex approximations)
const pantonePalette = [
  // Yellows
  { code: 'Yellow C', hex: '#FED100', name: 'Pantone Yellow' },
  { code: '100 C', hex: '#F6EB61', name: 'Yellow' },
  // ... (keep existing palette if needed, shortened here for brevity but existing full list persists in logic)
  { code: 'Black C', hex: '#2D2926', name: 'Process Black' },
];

// Ribbon Constants
const RIBBON_WIDTHS = ['40', '55', '75', '104'];
const RIBBON_LENGTHS = [
  { val: '74', label: '74m', sub: 'Gilza 0.5" (12.7mm)' },
  { val: '300', label: '300m', sub: 'Gilza 1" (25.4mm)', badge: 'Popularne' }
];

// --- CAPTCHA COMPONENT ---
const PuzzleCaptcha = ({ onVerify, onCancel }: { onVerify: () => void, onCancel: () => void }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [targetPosition, setTargetPosition] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Randomize target position between 20% and 80%
    setTargetPosition(Math.floor(Math.random() * 60) + 20);
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Tolerance of +/- 5%
    if (Math.abs(sliderValue - targetPosition) < 5) {
      setIsVerified(true);
      setTimeout(onVerify, 500); // Wait a bit for success animation
    } else {
      // Snap back if failed
      setSliderValue(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative overflow-hidden">
        <button onClick={onCancel} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-bold text-slate-800 mb-1 text-center">Weryfikacja</h3>
        <p className="text-xs text-slate-500 mb-4 text-center">Przesuń element, aby ułożyć obrazek</p>

        {/* Puzzle Box */}
        <div className="relative w-full h-40 bg-slate-200 rounded-lg overflow-hidden mb-4 border border-slate-300 shadow-inner group">
          {/* Background Image Placeholder (Gradient/Pattern) */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent to-brand-primary opacity-20" 
               style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(0,0,0,0.1) 2px, transparent 0)', backgroundSize: '20px 20px' }}></div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <span className="text-brand-primary/10 font-black text-6xl select-none">PROLABEL</span>
          </div>

          {/* Target Hole */}
          <div 
            className="absolute top-10 w-12 h-12 bg-black/40 rounded shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border border-white/20"
            style={{ left: `${targetPosition}%` }}
          ></div>

          {/* Moving Piece */}
          <div 
            className={`absolute top-10 w-12 h-12 bg-brand-accent shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded border-2 border-white z-10 transition-transform duration-75 flex items-center justify-center text-white ${isVerified ? 'bg-green-500 border-green-200' : ''}`}
            style={{ left: `${sliderValue}%`, cursor: 'grab' }}
          >
             {isVerified ? <Check className="w-6 h-6" /> : <Puzzle className="w-6 h-6 opacity-50" />}
          </div>
        </div>

        {/* Slider */}
        <div className="relative h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center px-2">
           <div className="absolute left-4 text-xs font-bold text-slate-400 select-none pointer-events-none uppercase tracking-widest">Przesuń w prawo</div>
           <input 
             type="range" 
             min="0" 
             max="100" 
             value={sliderValue} 
             onChange={handleSliderChange}
             onMouseUp={handleDragEnd}
             onTouchEnd={handleDragEnd}
             disabled={isVerified}
             className="w-full h-full opacity-0 cursor-pointer z-20"
           />
           {/* Slider Thumb Visualization */}
           <div 
             className="absolute h-8 w-12 bg-white shadow rounded-full flex items-center justify-center border border-slate-200 pointer-events-none transition-all duration-75"
             style={{ left: `calc(${sliderValue}% - ${sliderValue * 0.4}px)` }} // simple visual offset adjustment
           >
             <ArrowRight className="w-4 h-4 text-slate-400" />
           </div>
        </div>
      </div>
    </div>
  );
};


interface LabelConfiguratorProps {
  categoryId?: string; // 'etykiety' or 'kalki'
}

const LabelConfigurator: React.FC<LabelConfiguratorProps> = ({ categoryId = 'etykiety' }) => {
  const isRibbon = categoryId === 'kalki';
  
  // Select material list based on category
  const activeMaterials = isRibbon ? ribbonMaterials : labelMaterials;

  const [config, setConfig] = useState({
    material: activeMaterials[0].id,
    variant: activeMaterials[0].variants ? activeMaterials[0].variants[0].id : '',
    shape: 'rect',
    width: isRibbon ? '110' : '50', // Default width for ribbons is often 110mm
    height: isRibbon ? '300' : '50', // Ribbons are long (length in m usually, but keeping mm for consistency or interpreting as meters)
    quantity: '10', // Ribbons usually sold in smaller counts
    designCount: '1',
    printType: 'none', 
    aplaHex: pantonePalette[0].hex,
    pantoneCode: pantonePalette[0].code,
    varnish: 'none',
    premium: [] as string[],
  });

  // Toggles for optional sections
  const [printEnabled, setPrintEnabled] = useState(false);
  const [refinementEnabled, setRefinementEnabled] = useState(false);

  // Reset config when category changes
  useEffect(() => {
    const newMats = categoryId === 'kalki' ? ribbonMaterials : labelMaterials;
    setConfig(prev => ({
      ...prev,
      material: newMats[0].id,
      variant: newMats[0].variants ? newMats[0].variants[0].id : '',
      shape: 'rect', // Ribbons are effectively "rectangular" rolls
      width: categoryId === 'kalki' ? '110' : '50',
      height: categoryId === 'kalki' ? '300' : '50', // Set default to 300 for kalki
      printType: 'none', // Reset print type
      varnish: 'none',
      premium: [],
    }));
    setFiles([]);
    setPrintEnabled(false);
    setRefinementEnabled(false);
  }, [categoryId]);

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pantoneSearch, setPantoneSearch] = useState('');
  
  // Modal States
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [userNote, setUserNote] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Preview Sizing
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewRect, setPreviewRect] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!previewRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setPreviewRect({ width, height });
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  // Update preview when files change (show first image found)
  useEffect(() => {
    if (config.printType !== 'print') {
      setPreviewUrl(null);
      return;
    }

    const imageFile = files.find(f => f.type.startsWith('image/'));
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [files, config.printType]);

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handlePrintToggle = () => {
    if (printEnabled) {
      setPrintEnabled(false);
      handleChange('printType', 'none');
    } else {
      setPrintEnabled(true);
      // Default to 'print' when enabled
      handleChange('printType', 'print');
    }
  };

  const handleRefinementToggle = () => {
    if (refinementEnabled) {
      setRefinementEnabled(false);
      handleChange('varnish', 'none');
      setConfig(prev => ({...prev, premium: []}));
    } else {
      setRefinementEnabled(true);
      // Default to 'gloss' when enabled
      handleChange('varnish', 'gloss');
    }
  };

  const handlePremiumToggle = (id: string) => {
    setConfig(prev => {
      const current = prev.premium || [];
      if (current.includes(id)) {
        return { ...prev, premium: current.filter(x => x !== id) };
      }
      return { ...prev, premium: [...current, id] };
    });
  };

  const handlePantoneSelect = (hex: string, code: string) => {
    setConfig(prev => ({ ...prev, aplaHex: hex, pantoneCode: code }));
  };

  const handleMaterialChange = (materialId: string) => {
    const material = activeMaterials.find(m => m.id === materialId);
    const defaultVariant = material?.variants ? material.variants[0].id : '';
    setConfig(prev => ({ ...prev, material: materialId, variant: defaultVariant }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleOpenSummary = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSummaryOpen(true);
  };

  const handleSendOrder = () => {
    setIsSummaryOpen(false);
    setIsCaptchaOpen(true);
  };

  const handleCaptchaSuccess = () => {
    setIsCaptchaOpen(false);
    setTimeout(() => {
      alert("Twoje zamówienie zostało wysłane pomyślnie! Skontaktujemy się z Tobą wkrótce.");
    }, 300);
  };

  const currentMaterial = activeMaterials.find(m => m.id === config.material) || activeMaterials[0];
  const currentVariant = currentMaterial.variants?.find(v => v.id === config.variant);

  // Filter Pantone Colors
  const filteredPantones = pantonePalette.filter(p => 
    p.code.toLowerCase().includes(pantoneSearch.toLowerCase()) || 
    p.name.toLowerCase().includes(pantoneSearch.toLowerCase())
  );

  // Logic to calculate dimensions and styles
  const wInput = Math.abs(parseFloat(config.width)) || 100;
  const hInput = config.shape === 'circle' ? wInput : (Math.abs(parseFloat(config.height)) || 100);
  
  // Calculate dynamic constraints based on container size
  const PADDING = 64; // p-8 x 2 = 64px
  const maxW = previewRect.width > PADDING ? previewRect.width - PADDING : 400;
  const maxH = previewRect.height > PADDING ? previewRect.height - PADDING : 400;

  const aspectRatio = wInput / hInput;
  
  let finalW, finalH;

  // Fit logic
  if (wInput / maxW > hInput / maxH) {
    finalW = maxW;
    finalH = maxW / aspectRatio;
  } else {
    finalH = maxH;
    finalW = maxH * aspectRatio;
  }

  // Calculate dynamic border radius for rectangle
  let borderRadius = undefined;
  if (config.shape === 'rect') {
      const pxPerMm = finalW / wInput;
      const radiusMm = (wInput <= 30 && hInput <= 30) ? 1 : 2;
      const radiusPx = radiusMm * pxPerMm;
      borderRadius = `${radiusPx}px`;
  }

  // Wrapper Styles (Layout)
  const wrapperStyle: React.CSSProperties = {
    width: `${finalW}px`,
    maxWidth: '100%',
    aspectRatio: `${wInput} / ${hInput}`,
    height: 'auto', 
  };

  // Helper to determine visual styles for the inner label div
  const getLabelVisualClass = () => {
    let base = "shadow-2xl transition-all duration-500 absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden ";
    
    if (config.shape === 'circle') base += "rounded-full ";
    else if (config.shape === 'custom') base += "rounded-xl "; 

    // Visual styles for specific materials
    if (config.material === 'metalizowane' || config.material === 'metalik') {
      if (config.variant === 'gold') base += "bg-gradient-to-tr from-yellow-200 via-yellow-100 to-yellow-500 border border-yellow-600";
      else base += "bg-gradient-to-tr from-gray-200 via-white to-gray-400 border border-gray-400";
    } else if (config.material === 'fluo') {
      if (config.variant === 'red') base += "bg-red-500 border border-red-600";
      else if (config.variant === 'green') base += "bg-green-500 border border-green-600";
      else base += "bg-yellow-400 border border-yellow-500";
    } else if (config.material === 'holograficzne') {
      base += "bg-gradient-to-tr from-pink-300 via-cyan-200 to-indigo-300 border border-indigo-200";
    } else if (config.material === 'wosk' || config.material === 'wosk_zywica' || config.material === 'zywica') {
      // Dark ribbon styles
      base += "bg-slate-900 border border-slate-700";
    } else if (config.material === 'kolor') {
       if (config.variant === 'red') base += "bg-red-600 border border-red-700";
       else if (config.variant === 'blue') base += "bg-blue-600 border border-blue-700";
       else if (config.variant === 'green') base += "bg-green-600 border border-green-700";
       else base += "bg-slate-500";
    } else {
      base += "bg-white border border-slate-100";
    }
    
    // Varnish
    if (config.varnish === 'gloss' || config.varnish === 'lam_gloss') {
      base += " brightness-105 saturate-110 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none before:z-20";
    } else if (config.varnish === 'matte' || config.varnish === 'lam_matte') {
      base += " brightness-95 contrast-125 saturate-50 backdrop-blur-[0.5px]";
    }

    return base;
  };

  const getRibbonPreviewUrl = () => {
    // Metalized (Gold/Silver)
    if (config.material === 'metalik') {
      if (config.variant === 'gold') return "https://s.alicdn.com/@sc04/kf/H31b43cd1d88548bb889af1074e5a30d1d.jpg_300x300.jpg";
      if (config.variant === 'silver') return "https://a.allegroimg.com/s720/1138e1/4adde3db4286b069b3c87de9d080/Tasma-Kalka-termotransferowa-TTR-wosk-zywica-WAX-RESIN-110mmx150m-SILVE";
    }
    // Colored Ribbons
    if (config.material === 'kolor') {
      if (config.variant === 'red') return "https://drukarkietykiet24.pl/213774-large_default/czerwona-termotransferowa-tasma-barwiaca-serii-4500.jpg";
      if (config.variant === 'green') return "https://a.allegroimg.com/s1024/114746/8ccd4d0b4ee58c9bba20afcaeccb/Tasma-Kalka-termotransferowa-TTR-wosk-zywica-WAX-RESIN-110-mm-x-300-m-Z";
      if (config.variant === 'blue') return "https://a.allegroimg.com/s720/119c65/bfec0a5045f2943b27b594d5894d/Tasma-Kalka-termotransferowa-TTR-wosk-zywica-WAX-RESIN-110-mm-x-150-m-N-Producent-nieznany-producent";
    }
    // Defaults based on length
    if (config.height === '300') return "https://labelstore.pl/wp-content/uploads/2023/06/tasmy-ttr.jpg";
    return "https://d37iyw84027v1q.cloudfront.net/bradyemea/BradyEMEA_Large/RGR35.jpg";
  };

  return (
    <section id="details-section" className="py-10 bg-slate-50 min-h-[800px] flex flex-col">
      <div className="container mx-auto px-4 flex-grow flex flex-col">
        
        <div className="text-center mb-8">
          <span className="text-brand-accent font-bold tracking-wider uppercase text-sm">Personalizacja</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {isRibbon ? 'Konfigurator Kalek' : 'Konfigurator Etykiet'}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-grow">
          
          {/* LEFT COLUMN: Configuration */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* 1. Shape & Dimensions */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-brand-accent/10 text-brand-accent text-xs font-bold px-3 py-1 rounded-bl-lg">
                 KROK 1
               </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Ruler className="w-5 h-5 mr-2 text-brand-primary" />
                {isRibbon ? 'Wymiary Rolki' : 'Kształt i Wymiary'}
              </h3>
              
              {!isRibbon ? (
                // --- LABEL LAYOUT ---
                <>
                  <div className="flex gap-2 mb-6">
                    {shapes.map((shape) => {
                      const Icon = shape.icon;
                      return (
                        <button
                          key={shape.id}
                          onClick={() => handleChange('shape', shape.id)}
                          className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                            config.shape === shape.id
                               ? 'border-brand-accent bg-brand-accent/5 text-brand-primary ring-1 ring-brand-accent'
                               : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-medium">{shape.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        {config.shape === 'circle' ? 'Średnica (mm)' : 'Szerokość (mm)'}
                      </label>
                      <input
                        type="number"
                        value={config.width}
                        onChange={(e) => handleChange('width', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                        placeholder="np. 100"
                      />
                    </div>
                    {config.shape !== 'circle' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Wysokość (mm)</label>
                        <input
                          type="number"
                          value={config.height}
                          onChange={(e) => handleChange('height', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                          placeholder="np. 150"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // --- RIBBON LAYOUT ---
                <div className="animate-fade-in space-y-5">
                   {/* Width Selection */}
                   <div>
                     <label className="block text-xs font-medium text-slate-500 mb-2">Szerokość Rolki (mm)</label>
                     <div className="flex gap-2 mb-3">
                       {RIBBON_WIDTHS.map(w => (
                         <button
                           key={w}
                           onClick={() => handleChange('width', w)}
                           className={`flex-1 py-4 px-2 rounded-lg text-sm font-bold border transition-colors ${
                             config.width === w 
                              ? 'bg-brand-primary text-white border-brand-primary shadow-md' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                           }`}
                         >
                           {w}mm
                         </button>
                       ))}
                     </div>
                     <div className="relative">
                       <span className="absolute left-4 top-3.5 text-slate-400 text-sm">Inny wymiar:</span>
                       <input
                         type="number"
                         value={config.width}
                         onChange={(e) => handleChange('width', e.target.value)}
                         className="w-full pl-28 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none text-base"
                         placeholder="np. 80"
                       />
                     </div>
                   </div>

                   {/* Length/Core Selection */}
                   <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">Typ Nawoju (Długość / Gilza)</label>
                      <div className="grid grid-cols-2 gap-4">
                         {RIBBON_LENGTHS.map(len => (
                           <button
                             key={len.val}
                             onClick={() => handleChange('height', len.val)}
                             className={`p-4 rounded-xl border text-left transition-all relative ${
                               config.height === len.val
                                ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                             }`}
                           >
                              {/* Popular Badge */}
                              {(len as any).badge && (
                                 <span className="absolute -top-2 right-2 bg-red-500 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                   {(len as any).badge}
                                 </span>
                               )}

                             <div className="flex items-center justify-between mb-1">
                               <span className={`text-lg font-bold ${config.height === len.val ? 'text-brand-primary' : 'text-slate-700'}`}>
                                 {len.label}
                               </span>
                               {config.height === len.val && <CheckCircle className="w-4 h-4 text-brand-accent" />}
                             </div>
                             <div className="flex items-center text-[10px] text-slate-500">
                               <Cylinder className="w-3 h-3 mr-1" />
                               {len.sub}
                             </div>
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {/* Quantity */}
              <div className="pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      {isRibbon ? 'Ilość Rolek' : 'Nakład (sztuki)'}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-slate-400">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={config.quantity}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-accent outline-none text-sm font-medium"
                        placeholder="100"
                      />
                    </div>
                  </div>
              </div>
            </div>

            {/* 2. Material */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                 KROK 2
               </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-brand-primary" />
                {isRibbon ? 'Rodzaj Kalki' : 'Materiał'}
              </h3>
              
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {activeMaterials.map((mat) => {
                  const isSelected = config.material === mat.id;
                  const isFullWidthVariant = isRibbon && ['wosk', 'wosk_zywica', 'zywica'].includes(mat.id);

                  return (
                    <div 
                      key={mat.id} 
                      className={`rounded-lg border transition-all duration-300 overflow-hidden flex-shrink-0 ${
                        isSelected 
                          ? 'border-brand-accent bg-white shadow-md ring-1 ring-brand-accent/30' 
                          : 'border-transparent hover:bg-slate-50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* Main Category Header */}
                      <button
                        onClick={() => handleMaterialChange(mat.id)}
                        className={`w-full p-3 text-left flex items-center gap-3 outline-none ${isSelected ? '' : 'cursor-pointer'}`}
                      >
                        <div className={`w-8 h-8 rounded-full shadow-sm border border-slate-200 flex-shrink-0 ${mat.colorClass}`}></div>
                        <div className="flex-1 min-w-0">
                          <span className={`font-semibold text-sm block ${isSelected ? 'text-brand-dark' : 'text-slate-600'}`}>
                            {mat.name}
                          </span>
                          {!isSelected && <span className="text-xs text-slate-400 truncate block">{mat.desc}</span>}
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-brand-accent" />}
                      </button>

                      {/* Expanded Sub-options (Accordion Content) */}
                      {isSelected && mat.variants && (
                        <div className="px-3 pb-3 pt-0 animate-fade-in">
                          <div className="w-full h-px bg-slate-100 mb-3"></div>
                          <div className={isFullWidthVariant ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 sm:grid-cols-3 gap-2"}>
                            {mat.variants.map((variant) => {
                              const isVarSelected = config.variant === variant.id;
                              const VariantIcon = variant.icon;
                              // Define the type for proper TS support if needed, or simply cast/access
                              const badge = (variant as any).badge;

                              if (isFullWidthVariant) {
                                return (
                                  <button
                                      key={variant.id}
                                      onClick={() => handleChange('variant', variant.id)}
                                      className={`relative flex flex-row items-center justify-start p-4 rounded-md border transition-all text-left gap-4 ${
                                        isVarSelected
                                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-accent/50 hover:bg-white'
                                      }`}
                                    >
                                      {badge && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                          {badge}
                                        </span>
                                      )}
                                      
                                      {VariantIcon && <VariantIcon className={`w-8 h-8 flex-shrink-0 ${isVarSelected ? 'text-white' : 'text-brand-accent'}`} />}
                                      <div className="flex-1">
                                          <span className="font-bold text-sm block mb-1">{variant.name}</span>
                                          <span className={`text-xs block leading-relaxed ${isVarSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                            {variant.desc}
                                          </span>
                                      </div>
                                    </button>
                                );
                              }

                              return (
                                <button
                                  key={variant.id}
                                  onClick={() => handleChange('variant', variant.id)}
                                  className={`relative flex flex-col items-center justify-center p-2 rounded-md border transition-all text-center min-h-[60px] ${
                                    isVarSelected
                                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-accent/50 hover:bg-white'
                                  }`}
                                >
                                   {badge && (
                                     <span className="absolute -top-2 right-1 bg-red-500 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                       {badge}
                                     </span>
                                   )}
                                   
                                   {VariantIcon && <VariantIcon className={`w-3 h-3 mb-1 ${isVarSelected ? 'text-white' : 'text-brand-accent'}`} />}
                                   <span className="font-bold text-xs leading-tight">{variant.name}</span>
                                   <span className={`text-[9px] mt-1 leading-tight ${isVarSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                     {variant.desc}
                                   </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Steps 3 & 4 - Only for Labels */}
            {!isRibbon && (
              <>
                {/* 3. Print Type & Upload */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden transition-all duration-300">
                   <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                     KROK 3
                   </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <Printer className="w-5 h-5 mr-2 text-brand-primary" />
                      Rodzaj Zadruku
                    </h3>
                    <button 
                      onClick={handlePrintToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 ${printEnabled ? 'bg-brand-accent' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${printEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  {printEnabled ? (
                    <div className="animate-fade-in">
                      {/* Print Type Selection */}
                      <div className="flex gap-2 mb-6">
                        {printTypes.filter(t => t.id !== 'none').map((type) => {
                          const Icon = type.icon;
                          const badge = (type as any).badge;
                          
                          return (
                            <button
                              key={type.id}
                              onClick={() => handleChange('printType', type.id)}
                              className={`relative flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                                config.printType === type.id
                                   ? 'border-brand-accent bg-brand-accent/5 text-brand-primary ring-1 ring-brand-accent'
                                   : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              {badge && (
                                 <span className="absolute -top-2 right-1 bg-red-500 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                   {badge}
                                 </span>
                               )}
                              <Icon className="w-6 h-6" />
                              <span className="text-xs font-medium text-center">{type.name}</span>
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* ... Existing Upload/Pantone Logic ... */}
                      {config.printType === 'print' && (
                        <div className="animate-fade-in space-y-4">
                          {/* Design Count */}
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2">Ilość wzorów</label>
                            <div className="relative">
                              <div className="absolute left-3 top-2.5 text-slate-400">
                                <Copy className="w-4 h-4" />
                              </div>
                              <input
                                type="number"
                                min="1"
                                value={config.designCount}
                                onChange={(e) => handleChange('designCount', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-accent outline-none text-sm font-medium"
                                placeholder="1"
                              />
                            </div>
                          </div>

                          {/* Upload Box */}
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2">Pliki projektowe</label>
                            <div 
                              onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-brand-accent transition-colors group mb-3"
                            >
                              <div className="bg-slate-100 p-2 rounded-full mb-2 group-hover:bg-brand-accent/10 transition-colors">
                                <Plus className="w-5 h-5 text-slate-400 group-hover:text-brand-accent" />
                              </div>
                              <p className="text-sm font-medium text-slate-700">Wgraj projekty</p>
                              <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, PDF (max 10MB)</p>
                            </div>

                            {files.length > 0 && (
                              <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                                {files.map((f, index) => (
                                  <div key={`${f.name}-${index}`} className="border border-slate-200 rounded-lg p-2 flex items-center justify-between bg-slate-50">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                                        {f.type.includes('image') ? <ImageIcon className="w-4 h-4 text-brand-accent" /> : <FileText className="w-4 h-4 text-brand-primary" />}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-800 truncate max-w-[150px]">{f.name}</p>
                                        <p className="text-[10px] text-slate-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                      </div>
                                    </div>
                                    <button onClick={() => removeFile(index)} className="p-1.5 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf" className="hidden" />
                          </div>
                        </div>
                      )}

                      {config.printType === 'apla' && (
                         <div className="animate-fade-in space-y-4">
                            <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2">Wybierz kolor</label>
                            <div className="relative mb-3">
                              <div className="absolute left-3 top-2.5 text-slate-400"><Search className="w-4 h-4" /></div>
                              <input type="text" value={pantoneSearch} onChange={(e) => setPantoneSearch(e.target.value)} placeholder="Szukaj koloru..." className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-accent outline-none text-sm" />
                            </div>
                            <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 max-h-[220px] overflow-y-auto custom-scrollbar mb-4">
                               <div className="grid grid-cols-5 gap-2">
                                {filteredPantones.map((color) => (
                                    <button key={color.code} onClick={() => handlePantoneSelect(color.hex, color.code)} className={`aspect-square rounded-md border shadow-sm transition-all hover:scale-105 flex flex-col items-center justify-center p-1 group relative overflow-hidden ${config.pantoneCode === color.code ? 'ring-2 ring-offset-1 ring-brand-accent border-brand-accent' : 'border-slate-200 hover:border-slate-300'}`} title={color.name}>
                                      <div className="w-full h-full rounded-sm mb-1" style={{ backgroundColor: color.hex }}></div>
                                      <span className="text-[9px] text-slate-600 font-bold truncate w-full text-center">{color.code.replace(' C', '')}</span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                           </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-center">
                      <Ban className="w-4 h-4 mr-2" />
                      Brak wybranego nadruku. Włącz, aby skonfigurować.
                    </div>
                  )}
                </div>
                
                {/* 4. Refinement */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden transition-all duration-300">
                   <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                     KROK 4
                   </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-brand-primary" />
                      Uszlachetnienie
                    </h3>
                    <button 
                      onClick={handleRefinementToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 ${refinementEnabled ? 'bg-brand-accent' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${refinementEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  {refinementEnabled ? (
                    <div className="animate-fade-in">
                      <div className="mb-6">
                        <label className="block text-xs font-medium text-slate-500 mb-2">Wykończenie Powierzchni</label>
                        <div className="grid grid-cols-3 gap-2">
                          {varnishOptions.filter(v => v.id !== 'none').map((opt) => {
                            const Icon = opt.icon;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleChange('varnish', opt.id)}
                                className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all h-[60px] ${
                                  config.varnish === opt.id
                                     ? 'border-brand-accent bg-brand-accent/5 text-brand-primary ring-1 ring-brand-accent'
                                     : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="text-[9px] font-medium text-center leading-tight">{opt.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Uszlachetnienie Premium</label>
                        <div className="grid grid-cols-2 gap-2">
                          {premiumOptions.map((opt) => {
                            const Icon = opt.icon;
                            const isSelected = config.premium.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handlePremiumToggle(opt.id)}
                                className={`p-2 rounded-lg border flex items-center gap-2 transition-all text-left ${
                                  isSelected
                                     ? 'border-brand-primary bg-brand-primary/5 text-brand-dark ring-1 ring-brand-primary'
                                     : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                }`}
                              >
                                <div className={`p-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-100'}`}>
                                   <Icon className={`w-4 h-4 ${opt.color}`} />
                                </div>
                                <span className="text-[10px] font-bold leading-tight">{opt.name}</span>
                                {isSelected && <Check className="w-3 h-3 ml-auto text-brand-primary" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-center">
                       <Ban className="w-4 h-4 mr-2" />
                       Bez dodatkowego uszlachetnienia.
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* MIDDLE/RIGHT COLUMN: Mockup/Preview */}
          <div 
            ref={previewRef}
            className="w-full lg:w-2/3 bg-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden border border-gray-200 min-h-[500px]"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5" 
                 style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
            
            <span className="absolute top-6 left-6 text-slate-400 font-mono text-xs uppercase tracking-widest bg-gray-200/50 px-2 py-1">
              Podgląd Wizualny
            </span>

            {/* PREVIEW LOGIC */}
            {isRibbon ? (
               <div className="relative z-10 w-full max-w-md bg-white p-4 rounded-xl shadow-2xl animate-fade-in-up">
                 <img 
                   src={getRibbonPreviewUrl()} 
                   alt="Kalka termotransferowa" 
                   className="w-full h-auto object-contain rounded-lg"
                 />
                 <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                    {currentMaterial.name} {currentVariant?.name}
                 </div>
               </div>
            ) : (
              <div className="relative group transition-all duration-300 ease-out" style={wrapperStyle}>
                
                {/* Width Dimension Indicator */}
                <div className="absolute -top-8 left-0 w-full flex items-end justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full border-b border-slate-400 relative h-3 flex justify-center">
                      <div className="absolute bottom-[-1px] left-0 h-2 w-px bg-slate-400"></div>
                      <div className="absolute bottom-[-1px] right-0 h-2 w-px bg-slate-400"></div>
                      <span className="absolute -top-5 bg-gray-100 px-1 text-[10px] font-mono font-bold text-slate-600 rounded">
                        {config.width} mm
                      </span>
                  </div>
                </div>

                {/* Height Dimension Indicator */}
                {config.shape !== 'circle' && (
                  <div className="absolute -left-8 top-0 h-full flex items-center justify-end pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="h-full border-r border-slate-400 relative w-3 flex flex-col justify-center">
                          <div className="absolute right-[-1px] top-0 w-2 h-px bg-slate-400"></div>
                          <div className="absolute right-[-1px] bottom-0 w-2 h-px bg-slate-400"></div>
                          <span className="absolute -left-3 top-1/2 -translate-y-1/2 -translate-x-full -rotate-90 bg-gray-100 px-1 text-[10px] font-mono font-bold text-slate-600 rounded whitespace-nowrap">
                            {config.height} mm
                          </span>
                      </div>
                  </div>
                )}

                {/* ACTUAL LABEL */}
                <div className={getLabelVisualClass()} style={{ borderRadius }}>
                  {config.printType === 'apla' && <div className="absolute inset-0 opacity-90 mix-blend-multiply" style={{ backgroundColor: config.aplaHex }}></div>}
                  {config.printType === 'print' ? (
                    previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-90 relative z-10" />
                    ) : files.length > 0 && files.some(f => f.type === 'application/pdf') ? (
                      <div className="flex flex-col items-center justify-center text-slate-400 relative z-10"><FileText className="w-16 h-16 mb-2" /><span className="text-sm font-mono">PDF</span></div>
                    ) : (
                      <div className="text-center p-4 relative z-10"><p className="text-xs text-gray-400 font-mono mb-2">Twój Nadruk</p><div className="border-2 border-dashed border-gray-300 rounded p-4 mb-4"><p className="text-2xl font-bold text-gray-800 opacity-20 rotate-[-15deg]">LOGO</p></div></div>
                    )
                  ) : config.printType === 'apla' ? (
                    <div className="flex flex-col items-center justify-center h-full w-full relative z-10"><span className="text-white/80 font-bold text-2xl rotate-[-15deg] drop-shadow-md mix-blend-screen">{config.pantoneCode}</span></div>
                  ) : null}
                  {(config.material === 'metalizowane' || config.material === 'foliowe' || config.material === 'holograficzne') && (
                    <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] pointer-events-none z-20 ${config.material === 'holograficzne' ? 'animate-[shimmer_2s_infinite] via-white/60' : 'animate-[shimmer_3s_infinite]'}`}></div>
                  )}
                  {config.shape === 'custom' && (
                    <div className="absolute inset-0 border-2 border-dashed border-pink-400/50 pointer-events-none flex items-center justify-center z-30">
                      <span className="bg-pink-100 text-pink-600 text-[10px] px-1 rounded opacity-50">Linia cięcia</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scale Indicator - Only for Labels */}
            {!isRibbon && (
              <div className="mt-12 flex items-center gap-4 text-slate-400 text-xs">
                <div className="h-px w-12 bg-slate-300"></div>
                <span>Najedź na etykietę, aby zobaczyć wymiary</span>
                <div className="h-px w-12 bg-slate-300"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: Quantity & Summary */}
      <div className="sticky bottom-0 z-40 mt-8">
        <div className="container mx-auto px-4">
          <div className="bg-brand-dark text-white p-4 md:p-6 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center justify-between gap-6 border-t border-brand-primary/30">
            
            {/* Summary Text */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 flex-1 justify-center md:justify-start">
               <div className="bg-white/10 p-3 rounded-full hidden md:block">
                <Check className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="text-center md:text-left">
                <div className="text-gray-400 text-xs uppercase mb-1">Podsumowanie konfiguracji:</div>
                <div className="text-sm md:text-base">
                  <span className="font-bold text-white text-lg mr-2">{config.quantity} {isRibbon ? 'rolek' : 'szt.'}</span>
                  {config.printType === 'print' && <span className="mr-2 text-gray-300">({config.designCount} wz.)</span>}
                  {config.printType === 'apla' && <span className="mr-2 text-brand-accent">({config.pantoneCode})</span>}
                  <span className="text-brand-accent font-semibold">
                    {currentMaterial.name} {currentVariant ? `(${currentVariant.name})` : ''}
                  </span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-300">
                    {shapes.find(s => s.id === config.shape)?.name} {config.width}{config.shape !== 'circle' ? `x${config.height}` : ''} {isRibbon ? 'm' : 'mm'}
                    {isRibbon && (config.height === '74' ? ' (Gilza 0.5")' : config.height === '300' ? ' (Gilza 1")' : '')}
                  </span>
                  
                  {/* Premium Badges in Summary */}
                  {config.premium.length > 0 && (
                    <div className="flex gap-1 mt-1 justify-center md:justify-start">
                      {config.premium.map(p => (
                         <span key={p} className="inline-block text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 rounded border border-yellow-500/30">
                           + {premiumOptions.find(o => o.id === p)?.name.split(' ')[1]}
                         </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleOpenSummary}
              className="w-full md:w-auto bg-brand-accent hover:bg-sky-400 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <span>Zamów Wycenę</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
          </div>
        </div>
      </div>

      {/* SUMMARY MODAL */}
      {isSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
               <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                 <ShoppingCart className="w-6 h-6 mr-3 text-brand-primary" />
                 Podsumowanie Zamówienia
               </h3>
               <button onClick={() => setIsSummaryOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <div className="p-8 space-y-8 bg-white">
               
               {/* STEPPED SUMMARY GRID */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 
                 {/* KROK 1 */}
                 <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col h-full relative overflow-hidden group hover:border-brand-accent/30 transition-all">
                    <div className="absolute top-0 right-0 bg-brand-accent/10 text-brand-accent text-[10px] font-bold px-2 py-1 rounded-bl-lg">KROK 1</div>
                    <div className="flex items-center gap-2 mb-4 text-brand-primary">
                       <Ruler className="w-5 h-5" />
                       <h4 className="font-bold text-sm uppercase tracking-wide">{isRibbon ? 'Rolka' : 'Kształt'}</h4>
                    </div>
                    <div className="space-y-3 text-sm flex-1">
                       <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                         <span className="text-slate-500">{isRibbon ? 'Format' : 'Kształt'}</span>
                         <span className="font-semibold text-slate-800">{isRibbon ? 'Standard' : shapes.find(s=>s.id===config.shape)?.name}</span>
                       </div>
                       <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                         <span className="text-slate-500">Wymiar</span>
                         <span className="font-semibold text-slate-800">
                            {config.width}mm x {config.height}{isRibbon ? 'm' : 'mm'}
                            {isRibbon && (config.height === '74' ? ' (0.5")' : config.height === '300' ? ' (1")' : '')}
                         </span>
                       </div>
                       <div className="flex justify-between items-center pt-1">
                         <span className="text-slate-500">{isRibbon ? 'Ilość' : 'Nakład'}</span>
                         <span className="font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded text-base">
                           {config.quantity} {isRibbon ? 'rol.' : 'szt.'}
                         </span>
                       </div>
                    </div>
                 </div>

                 {/* KROK 2 */}
                 <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col h-full relative overflow-hidden group hover:border-brand-accent/30 transition-all">
                    <div className="absolute top-0 right-0 bg-brand-accent/10 text-brand-accent text-[10px] font-bold px-2 py-1 rounded-bl-lg">KROK 2</div>
                    <div className="flex items-center gap-2 mb-4 text-brand-primary">
                       <Layers className="w-5 h-5" />
                       <h4 className="font-bold text-sm uppercase tracking-wide">Materiał</h4>
                    </div>
                    <div className="space-y-3 text-sm flex-1">
                       <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                         <span className="text-slate-500">Rodzaj</span>
                         <span className="font-semibold text-slate-800 text-right">{currentMaterial.name}</span>
                       </div>
                       <div className="flex flex-col gap-1 pt-1">
                         <span className="text-slate-500">Wariant</span>
                         <span className="font-semibold text-slate-800 bg-white border border-slate-200 p-2 rounded text-center">
                           {currentVariant?.name}
                         </span>
                       </div>
                    </div>
                 </div>

                 {/* KROK 3 - Conditionally Rendered or Info Box for Ribbon */}
                 {isRibbon ? (
                    <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 flex flex-col h-full relative overflow-hidden opacity-70">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                           <Printer className="w-5 h-5" />
                           <h4 className="font-bold text-sm uppercase tracking-wide">Druk</h4>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-center text-xs text-slate-400 italic">
                          Produkt eksploatacyjny <br/>(bez nadruku)
                        </div>
                    </div>
                 ) : (
                   <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col h-full relative overflow-hidden group hover:border-brand-accent/30 transition-all">
                      <div className="absolute top-0 right-0 bg-brand-accent/10 text-brand-accent text-[10px] font-bold px-2 py-1 rounded-bl-lg">KROK 3</div>
                      <div className="flex items-center gap-2 mb-4 text-brand-primary">
                         <Printer className="w-5 h-5" />
                         <h4 className="font-bold text-sm uppercase tracking-wide">Druk i Pliki</h4>
                      </div>
                      <div className="space-y-3 text-sm flex-1">
                         <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                           <span className="text-slate-500">Typ</span>
                           <span className="font-semibold text-slate-800">
                              {printTypes.find(p => p.id === config.printType)?.name}
                           </span>
                         </div>
                         {config.printType === 'print' && (
                           <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                             <span className="text-slate-500">Wzory</span>
                             <span className="font-semibold text-slate-800">{config.designCount}</span>
                           </div>
                         )}
                         {config.printType === 'apla' && (
                           <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                             <span className="text-slate-500">Kolor</span>
                             <span className="font-semibold text-slate-800">{config.pantoneCode}</span>
                           </div>
                         )}
                         
                         {/* Files Preview Grid */}
                         {files.length > 0 ? (
                           <div className="pt-2">
                             <span className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Załączone pliki:</span>
                             <div className="grid grid-cols-4 gap-2">
                               {files.map((f, i) => (
                                 <div key={i} className="aspect-square bg-white border border-slate-200 rounded flex items-center justify-center overflow-hidden relative group/file" title={f.name}>
                                   {f.type.startsWith('image/') ? (
                                     <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover" />
                                   ) : (
                                     <FileText className="w-5 h-5 text-slate-400" />
                                   )}
                                 </div>
                               ))}
                             </div>
                           </div>
                         ) : config.printType === 'print' && (
                           <div className="pt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                             Brak plików. Pamiętaj o dosłaniu!
                           </div>
                         )}
                      </div>
                   </div>
                 )}

                 {/* KROK 4 - Conditionally Rendered or Info Box for Ribbon */}
                 {isRibbon ? (
                    <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 flex flex-col h-full relative overflow-hidden opacity-70">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                           <Sparkles className="w-5 h-5" />
                           <h4 className="font-bold text-sm uppercase tracking-wide">Wykończenie</h4>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-center text-xs text-slate-400 italic">
                          Produkt gotowy
                        </div>
                    </div>
                 ) : (
                   <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col h-full relative overflow-hidden group hover:border-brand-accent/30 transition-all">
                      <div className="absolute top-0 right-0 bg-brand-accent/10 text-brand-accent text-[10px] font-bold px-2 py-1 rounded-bl-lg">KROK 4</div>
                      <div className="flex items-center gap-2 mb-4 text-brand-primary">
                         <Sparkles className="w-5 h-5" />
                         <h4 className="font-bold text-sm uppercase tracking-wide">Wykończenie</h4>
                      </div>
                      <div className="space-y-3 text-sm flex-1">
                         <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                           <span className="text-slate-500">Standard</span>
                           <span className="font-semibold text-slate-800">{varnishOptions.find(v => v.id === config.varnish)?.name}</span>
                         </div>
                         
                         {config.premium.length > 0 ? (
                           <div className="pt-1">
                             <span className="text-slate-500 block mb-1">Premium:</span>
                             <div className="flex flex-wrap gap-1">
                               {config.premium.map(p => (
                                 <span key={p} className="text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded-full font-bold">
                                   {premiumOptions.find(opt => opt.id === p)?.name}
                                 </span>
                               ))}
                             </div>
                           </div>
                         ) : (
                           <div className="pt-1 text-slate-400 italic text-xs">
                             Brak opcji premium
                           </div>
                         )}
                      </div>
                   </div>
                 )}

               </div>

               {/* Notes Section */}
               <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-brand-accent" />
                    Uwagi do zamówienia / Dodatkowe informacje
                  </label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none min-h-[100px] bg-white transition-shadow focus:shadow-md"
                    placeholder="Np. proszę o sprawdzenie spadów, zależy mi na czasie, dostawa na inny adres..."
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                  ></textarea>
               </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-gray-100 flex gap-4 justify-end items-center">
               <span className="text-xs text-slate-400 mr-auto hidden sm:block">
                 Klikając "Potwierdź", akceptujesz naszą politykę prywatności.
               </span>
               <button 
                 onClick={() => setIsSummaryOpen(false)}
                 className="px-6 py-3 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-white transition"
               >
                 Wróć do edycji
               </button>
               <button 
                 onClick={handleSendOrder}
                 className="px-10 py-3 rounded-lg bg-brand-accent text-white font-bold hover:bg-sky-500 transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transform hover:scale-105"
               >
                 <Send className="w-5 h-5" />
                 Potwierdź i Wyślij
               </button>
            </div>
          </div>
        </div>
      )}

      {/* CAPTCHA MODAL */}
      {isCaptchaOpen && (
        <PuzzleCaptcha onVerify={handleCaptchaSuccess} onCancel={() => setIsCaptchaOpen(false)} />
      )}

    </section>
  );
};

export default LabelConfigurator;