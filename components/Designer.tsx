import React, { useState, useRef, useEffect } from 'react';
import { EditorConfig, CanvasElement } from '../types';
import { 
  ArrowLeft, Type, Image as ImageIcon, Save, Upload, 
  Layers, ChevronUp, ChevronDown, AlertCircle, 
  FileText, Move, Trash2, X, Palette, Sun,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Scaling, ShieldCheck
} from 'lucide-react';

interface DesignerProps {
  config: EditorConfig;
  onBack: () => void;
}

type TabType = 'text' | 'graphics' | 'layers' | 'background';

const FONT_OPTIONS = [
  { name: 'Inter (Domyślna)', value: 'Inter, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
];

const PRESET_COLORS = [
  '#000000', '#ffffff', // Black & White
  '#1e3a8a', // Brand Primary
  '#dc2626', // Red
  '#16a34a', // Green
  '#f59e0b', // Yellow/Orange
  '#9333ea', // Purple
  '#db2777', // Pink
];

const SAFE_MARGIN_MM = 3; // 3mm safe margin

const Designer: React.FC<DesignerProps> = ({ config, onBack }) => {
  // --- CANVAS CALCULATION (RESPONSIVE) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState({ width: 0, height: 0 });

  // Padding around the canvas within the container
  const PADDING = 40;
  const availableW = containerRect.width > PADDING * 2 ? containerRect.width - PADDING * 2 : 800;
  const availableH = containerRect.height > PADDING * 2 ? containerRect.height - PADDING * 2 : 600;

  const aspectRatio = config.width / config.height;
  
  // Calculate fit dimensions
  let canvasVisualWidth = availableW;
  let canvasVisualHeight = availableW / aspectRatio;

  // If height overflows, scale down based on height
  if (canvasVisualHeight > availableH) {
    canvasVisualHeight = availableH;
    canvasVisualWidth = availableH * aspectRatio;
  }

  // SCALE: Pixels per Millimeter
  const scale = canvasVisualWidth / config.width;

  // --- LIMITS & DEFAULTS ---
  // Max font size is strictly limited to the largest dimension of the label
  const maxFontSizeMM = Math.max(config.width, config.height);
  // Default font size is proportional (e.g., 1/8th of height), but at least 5mm
  const defaultFontSizeMM = Math.max(5, Math.round(config.height / 8));

  // State
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  
  // Text Tool State
  const [inputText, setInputText] = useState('Twój tekst');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(defaultFontSizeMM);
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [textShadow, setTextShadow] = useState<string>('none');
  // Text Formatting State
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [textAlign, setTextAlign] = useState<CanvasElement['textAlign']>('center');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<string | null>(null);
  const dragStart = useRef<{x: number, y: number} | null>(null);

  // Resize State
  const isResizing = useRef(false);
  const resizeStart = useRef<{
    y: number; 
    initialFontSize: number; 
    initialWidth: number; 
    initialHeight: number;
  } | null>(null);

  // Check if a text element is currently selected
  const selectedEl = elements.find(e => e.id === selectedElementId);
  const isTextSelected = selectedEl?.type === 'text';

  // --- RESIZE OBSERVER ---
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerRect({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // --- SYNCHRONIZATION: Selection -> Inputs ---
  useEffect(() => {
    if (selectedElementId) {
      const el = elements.find(e => e.id === selectedElementId);
      if (el && el.type === 'text') {
        // Populate sidebar with selected element's data
        setInputText(el.content);
        setFontSize(el.fontSize || defaultFontSizeMM);
        setTextColor(el.color || '#000000');
        setFontFamily(el.fontFamily || FONT_OPTIONS[0].value);
        setTextShadow(el.textShadow || 'none');
        // Typography
        setFontWeight(el.fontWeight || 'bold'); 
        setFontStyle(el.fontStyle || 'normal');
        setTextDecoration(el.textDecoration || 'none');
        setTextAlign(el.textAlign || 'center');

        setActiveTab('text'); // Switch to text tab to show controls
      }
    }
  }, [selectedElementId, defaultFontSizeMM]);

  // --- UPDATERS: Inputs -> Selection ---
  
  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (selectedElementId) {
      setElements(prev => prev.map(el => {
        if (el.id === selectedElementId) {
          return { ...el, ...updates };
        }
        return el;
      }));
    }
  };

  const handleTextChange = (val: string) => {
    setInputText(val);
    if (selectedElementId) updateSelectedElement({ content: val });
  };

  const handleFontFamilyChange = (val: string) => {
    setFontFamily(val);
    if (selectedElementId) updateSelectedElement({ fontFamily: val });
  };

  const handleFontSizeChange = (val: number) => {
    // Ensure value doesn't exceed the physical max dimension
    const clampedVal = Math.min(val, maxFontSizeMM);
    setFontSize(clampedVal);
    if (selectedElementId) updateSelectedElement({ fontSize: clampedVal });
  };

  const handleColorChange = (val: string) => {
    setTextColor(val);
    if (selectedElementId) updateSelectedElement({ color: val });
  };

  const handleShadowChange = (hasShadow: boolean) => {
    const val = hasShadow ? 'shadow' : 'none';
    setTextShadow(val);
    if (selectedElementId) updateSelectedElement({ textShadow: val });
  };

  const handleFormatChange = (key: keyof CanvasElement, value: string) => {
    if (selectedElementId) updateSelectedElement({ [key]: value });
    
    if (key === 'fontWeight') setFontWeight(value);
    if (key === 'fontStyle') setFontStyle(value);
    if (key === 'textDecoration') setTextDecoration(value);
    if (key === 'textAlign') setTextAlign(value as any);
  };

  // --- ACTIONS ---

  const handleAddText = () => {
    const newEl: CanvasElement = {
      id: Date.now().toString(),
      type: 'text',
      content: 'Twój tekst',
      x: config.width / 2,
      y: config.height / 2,
      fontSize: defaultFontSizeMM,
      color: '#000000',
      fontFamily: FONT_OPTIONS[0].value,
      textShadow: 'none',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center'
    };
    
    setInputText('Twój tekst');
    setFontSize(defaultFontSizeMM);
    setTextColor('#000000');
    setFontFamily(FONT_OPTIONS[0].value);
    setTextShadow('none');
    setFontWeight('bold');
    setFontStyle('normal');
    setTextDecoration('none');
    setTextAlign('center');

    setElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isPdf = file.type === 'application/pdf';
      
      let newEl: CanvasElement;

      if (isPdf) {
        newEl = {
            id: Date.now().toString(),
            type: 'pdf',
            content: file.name,
            x: config.width / 2,
            y: config.height / 2,
            width: config.width * 0.5,
            height: config.height * 0.5,
        };
      } else {
        const url = URL.createObjectURL(file);
        newEl = {
            id: Date.now().toString(),
            type: 'image',
            content: url,
            x: config.width / 2,
            y: config.height / 2,
            width: config.width / 2,
            height: (config.width / 2),
        };
      }

      setElements([...elements, newEl]);
      setSelectedElementId(newEl.id);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id?: string) => {
    const targetId = id || selectedElementId;
    if (targetId) {
      setElements(prev => prev.filter(e => e.id !== targetId));
      if (selectedElementId === targetId) setSelectedElementId(null);
    }
  };

  const handleLayerMove = (id: string, direction: 'up' | 'down') => {
    const index = elements.findIndex(e => e.id === id);
    if (index === -1) return;

    const newElements = [...elements];
    if (direction === 'up' && index < elements.length - 1) {
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
    } else if (direction === 'down' && index > 0) {
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
    }
    setElements(newElements);
  };

  // --- INTERACTION HANDLERS ---

  const handleResizeMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation(); // Stop moving
    isResizing.current = true;
    resizeStart.current = {
      y: e.clientY,
      initialFontSize: el.fontSize || defaultFontSizeMM,
      initialWidth: el.width || 0,
      initialHeight: el.height || 0
    };
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);
    dragItem.current = id;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // RESIZE LOGIC
    if (isResizing.current && resizeStart.current && selectedElementId) {
      const deltaY = (e.clientY - resizeStart.current.y) / scale;
      
      setElements(prev => prev.map(el => {
        if (el.id === selectedElementId) {
          if (el.type === 'text') {
            const newSize = Math.max(2, Math.min(maxFontSizeMM, resizeStart.current!.initialFontSize + deltaY));
            if (activeTab === 'text') setFontSize(newSize); // Sync UI
            return { ...el, fontSize: newSize };
          } else {
             // Aspect Ratio Scaling for Image/PDF
             const aspectRatio = resizeStart.current!.initialWidth / resizeStart.current!.initialHeight;
             const newHeight = Math.max(5, resizeStart.current!.initialHeight + deltaY);
             const newWidth = newHeight * aspectRatio;
             return { ...el, width: newWidth, height: newHeight };
          }
        }
        return el;
      }));
      return;
    }

    // DRAG LOGIC
    if (dragItem.current && dragStart.current) {
      const deltaX = (e.clientX - dragStart.current.x) / scale;
      const deltaY = (e.clientY - dragStart.current.y) / scale;
      
      setElements(prev => prev.map(el => {
        if (el.id === dragItem.current) {
          return { ...el, x: el.x + deltaX, y: el.y + deltaY };
        }
        return el;
      }));
      
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    dragItem.current = null;
    dragStart.current = null;
    isResizing.current = false;
    resizeStart.current = null;
  };

  // --- STYLES ---

  const getBackgroundClass = () => {
    switch (config.material) {
      case 'gold': return 'bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-br from-gray-200 via-gray-400 to-gray-500';
      case 'transparent': return 'bg-slate-100 opacity-90';
      case 'eco': return 'bg-[#d2b48c]';
      case 'holographic': return 'bg-gradient-to-tr from-pink-300 via-cyan-300 to-indigo-300';
      default: return 'bg-white';
    }
  };

  const borderRadius = config.cornerRadius > 0 ? `${config.cornerRadius * scale}px` : (config.shape === 'circle' ? '50%' : '0');

  // --- RENDER SIDEBAR CONTENT ---
  
  const renderSidebarContent = () => {
    switch (activeTab) {
      case 'text':
        if (!isTextSelected) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in pb-10">
               <div className="bg-brand-light p-6 rounded-full">
                  <Type size={48} className="text-brand-primary opacity-50" />
               </div>
               
               <div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Dodaj Tekst</h3>
                 <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                   Kliknij poniżej, aby dodać nowy element tekstowy do projektu.
                 </p>
               </div>

               <button 
                 onClick={handleAddText}
                 className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
               >
                  <Type size={18}/> Dodaj napis
               </button>
            </div>
          );
        }

        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center justify-between border-b border-gray-100 pb-3">
               <h3 className="text-base font-bold text-gray-900">
                 Edytuj Tekst
               </h3>
               <button 
                onClick={() => setSelectedElementId(null)}
                className="text-slate-400 hover:text-slate-600 transition"
                title="Zamknij edycję"
               >
                 <X size={18} />
               </button>
             </div>

             <div>
               <label className="text-xs font-bold text-gray-500 mb-2 block">Treść</label>
               <textarea 
                  value={inputText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none text-sm min-h-[80px]"
                  placeholder="Wpisz swój tekst tutaj..."
               />
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 mb-1 block">Czcionka</label>
                   <select 
                     value={fontFamily}
                     onChange={(e) => handleFontFamilyChange(e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                   >
                     {FONT_OPTIONS.map(font => (
                       <option key={font.value} value={font.value}>{font.name}</option>
                     ))}
                   </select>
                </div>

                <div>
                     <div className="flex justify-between items-center mb-1">
                       <label className="text-xs font-bold text-gray-500">Rozmiar (mm)</label>
                       <span className="text-xs text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                         {fontSize.toFixed(1)}mm / {maxFontSizeMM}mm
                       </span>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">A</span>
                        <input 
                          type="range" 
                          min="2" 
                          max={maxFontSizeMM} // Limit max size to label dimensions
                          value={fontSize} 
                          onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                        />
                        <span className="text-lg text-gray-600 font-bold">A</span>
                     </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Formatowanie</label>
                  <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
                     <div className="flex gap-1">
                        <button 
                          onClick={() => handleFormatChange('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')}
                          className={`p-2 rounded hover:bg-white transition-colors ${fontWeight === 'bold' ? 'bg-white text-brand-primary shadow-sm ring-1 ring-gray-200' : 'text-slate-500 hover:text-slate-700'}`}
                          title="Pogrubienie"
                        >
                          <Bold size={16} />
                        </button>
                        <button 
                          onClick={() => handleFormatChange('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic')}
                          className={`p-2 rounded hover:bg-white transition-colors ${fontStyle === 'italic' ? 'bg-white text-brand-primary shadow-sm ring-1 ring-gray-200' : 'text-slate-500 hover:text-slate-700'}`}
                          title="Kursywa"
                        >
                          <Italic size={16} />
                        </button>
                         <button 
                          onClick={() => handleFormatChange('textDecoration', textDecoration === 'underline' ? 'none' : 'underline')}
                          className={`p-2 rounded hover:bg-white transition-colors ${textDecoration === 'underline' ? 'bg-white text-brand-primary shadow-sm ring-1 ring-gray-200' : 'text-slate-500 hover:text-slate-700'}`}
                          title="Podkreślenie"
                        >
                          <Underline size={16} />
                        </button>
                     </div>
                     <div className="w-px h-6 bg-gray-200"></div>
                     <div className="flex gap-1">
                        <button 
                          onClick={() => handleFormatChange('textAlign', 'left')}
                          className={`p-2 rounded hover:bg-white transition-colors ${textAlign === 'left' ? 'bg-white text-brand-primary shadow-sm ring-1 ring-gray-200' : 'text-slate-500 hover:text-slate-700'}`}
                          title="Wyrównaj do lewej"
                        >
                          <AlignLeft size={16} />
                        </button>
                        <button 
                          onClick={() => handleFormatChange('textAlign', 'center')}
                          className={`p-2 rounded hover:bg-white transition-colors ${textAlign === 'center' ? 'bg-white text-brand-primary shadow-sm ring-1 ring-gray-200' : 'text-slate-500 hover:text-slate-700'}`}
                          title="Wyrównaj do środka"
                        >
                          <AlignCenter size={16} />
                        </button>
                        <button 
                          onClick={() => handleFormatChange('textAlign', 'right')}
                          className={`p-2 rounded hover:bg-white transition-colors ${textAlign === 'right' ? 'bg-white text-brand-primary shadow-sm ring-1 ring-gray-200' : 'text-slate-500 hover:text-slate-700'}`}
                          title="Wyrównaj do prawej"
                        >
                          <AlignRight size={16} />
                        </button>
                     </div>
                  </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block">Kolor tekstu</label>
                    <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-2 bg-white mb-2">
                       <input 
                          type="color" 
                          value={textColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="h-8 w-8 p-0 border-0 rounded cursor-pointer flex-shrink-0"
                       />
                       <span className="text-xs text-gray-500 font-mono uppercase">{textColor}</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`w-full aspect-square rounded border transition-transform hover:scale-110 ${textColor === color ? 'ring-2 ring-brand-accent ring-offset-1 border-transparent' : 'border-gray-200'}`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-700">
                     <Sun size={16} className="text-slate-500" />
                     <span className="text-sm font-bold">Cień</span>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={textShadow !== 'none'}
                        onChange={(e) => handleShadowChange(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-accent"></div>
                    </label>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleDelete()} 
                    className="w-full py-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                  >
                    <Trash2 size={16} /> Usuń ten element
                  </button>
                </div>
             </div>
          </div>
        );

      case 'graphics':
        return (
          <div className="space-y-6 animate-fade-in">
             <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">Wgraj Grafikę</h3>
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-brand-accent transition-colors group"
                 >
                   <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-brand-accent/10 transition-colors">
                     <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-accent" />
                   </div>
                   <p className="text-sm font-bold text-slate-700">Wybierz plik</p>
                   <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF</p>
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept="image/*,application/pdf" 
                   />
                 </div>
             </div>

             <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Zalecamy pliki wektorowe <strong>PDF</strong> lub obrazy <strong>300 DPI</strong>.
                </p>
             </div>
          </div>
        );

      case 'background':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center justify-between border-b border-gray-100 pb-3">
               <h3 className="text-base font-bold text-gray-900">Edytuj Tło</h3>
             </div>
             
             <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Kolor wypełnienia</label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border border-gray-200 p-2 rounded-lg bg-slate-50">
                     <input 
                        type="color" 
                        value={backgroundColor || '#ffffff'}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-10 h-10 border-0 rounded cursor-pointer p-0 bg-transparent"
                     />
                     <span className="text-sm font-mono text-gray-600 uppercase">{backgroundColor || 'Brak'}</span>
                  </div>

                  {backgroundColor && (
                     <button 
                       onClick={() => setBackgroundColor('')}
                       className="text-red-500 text-xs flex items-center gap-1 hover:underline pl-1"
                     >
                       <X size={12}/> Usuń kolor tła (pokaż materiał)
                     </button>
                  )}
                </div>
             </div>

             <div>
               <label className="text-xs font-bold text-gray-500 mb-2 block">Paleta podstawowa</label>
               <div className="grid grid-cols-5 gap-2">
                  {['#ffffff', '#000000', '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6', '#9ca3af'].map(c => (
                     <button 
                       key={c} 
                       onClick={() => setBackgroundColor(c)}
                       className="w-full aspect-square rounded-md border border-gray-200 shadow-sm transition-transform hover:scale-110"
                       style={{ backgroundColor: c }}
                       title={c}
                     />
                  ))}
               </div>
             </div>

             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-2">
                <AlertCircle className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                   Wybrany kolor tła zostanie nadrukowany na całej powierzchni materiału ({config.material}).
                </p>
             </div>
          </div>
        );

      case 'layers':
        return (
          <div className="space-y-4 animate-fade-in h-full flex flex-col">
             <h3 className="text-base font-bold text-gray-900 mb-2">Warstwy</h3>
             <p className="text-xs text-gray-400 mb-3">Przeciągnij lub użyj strzałek.</p>
             
             {elements.length === 0 ? (
               <div className="text-center py-8 text-gray-400 text-xs italic bg-gray-50 rounded-lg border border-gray-100">
                 Brak elementów
               </div>
             ) : (
               <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[400px]">
                 {elements.slice().reverse().map((el, idx) => {
                   const originalIndex = elements.length - 1 - idx;
                   return (
                     <div 
                       key={el.id}
                       onClick={() => setSelectedElementId(el.id)}
                       className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                         selectedElementId === el.id 
                           ? 'bg-brand-accent/10 border-brand-accent ring-1 ring-brand-accent/30' 
                           : 'bg-white border-gray-200 hover:border-gray-300'
                       }`}
                     >
                        <div className="flex items-center gap-2 overflow-hidden">
                           <div className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 text-gray-500">
                              {el.type === 'text' ? <Type size={14}/> : el.type === 'pdf' ? <FileText size={14}/> : <ImageIcon size={14}/>}
                           </div>
                           <div className="min-w-0">
                             <p className="text-xs font-bold text-gray-700 truncate max-w-[90px]">
                                {el.type === 'text' ? el.content : (el.type === 'pdf' ? el.content : 'Obraz')}
                             </p>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-0.5">
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleLayerMove(el.id, 'up'); }}
                             className="p-1 hover:bg-gray-200 rounded text-gray-500"
                           >
                             <ChevronUp size={12} />
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleLayerMove(el.id, 'down'); }}
                             className="p-1 hover:bg-gray-200 rounded text-gray-500"
                           >
                             <ChevronDown size={12} />
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleDelete(el.id); }}
                             className="p-1 hover:bg-red-100 rounded text-red-500 ml-1"
                           >
                             <Trash2 size={12} />
                           </button>
                        </div>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
        );
    }
  };

  // --- RENDER MAIN ---

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[800px] font-sans">
       
       <div className="flex flex-shrink-0 w-full md:w-[350px] border border-gray-200 bg-white rounded-2xl shadow-xl overflow-hidden h-[800px]">
         
         <div className="w-[70px] flex flex-col items-center py-6 bg-white border-r border-gray-100 z-10">
            <div className="mb-6">
              <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-slate-500 transition mb-4" title="Wróć">
                 <ArrowLeft size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 w-full px-1">
               <button 
                 onClick={() => setActiveTab('text')}
                 className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeTab === 'text' ? 'bg-brand-light text-brand-primary font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 <Type size={20} className="mb-1" />
                 <span className="text-[9px]">Tekst</span>
               </button>

               <button 
                 onClick={() => setActiveTab('graphics')}
                 className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeTab === 'graphics' ? 'bg-brand-light text-brand-primary font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 <ImageIcon size={20} className="mb-1" />
                 <span className="text-[9px]">Grafika</span>
               </button>

               <button 
                 onClick={() => setActiveTab('background')}
                 className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeTab === 'background' ? 'bg-brand-light text-brand-primary font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 <Palette size={20} className="mb-1" />
                 <span className="text-[9px]">Tło</span>
               </button>

               <button 
                 onClick={() => setActiveTab('layers')}
                 className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeTab === 'layers' ? 'bg-brand-light text-brand-primary font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 <Layers size={20} className="mb-1" />
                 <span className="text-[9px]">Warstwy</span>
               </button>
            </div>
         </div>

         <div className="flex-1 p-5 bg-white flex flex-col h-full animate-in slide-in-from-left-2 duration-200">
            {renderSidebarContent()}

            <div className="mt-auto pt-6 border-t border-gray-100">
               <button 
                 onClick={() => alert("Funkcja zapisu w przygotowaniu!")}
                 className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm"
               >
                 <Save size={16} />
                 Zapisz Projekt
               </button>
            </div>
         </div>

       </div>

       <div 
         ref={containerRef}
         className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-slate-100" 
         onMouseMove={handleMouseMove} 
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
       >
          {selectedElementId && (
            <div className="absolute top-4 z-50 animate-in fade-in slide-in-from-top-4">
              <button 
                onClick={() => handleDelete()} 
                className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full shadow-lg border border-red-100 hover:bg-red-50 transition font-bold text-xs"
              >
                <Trash2 size={14} /> Usuń zaznaczone
              </button>
            </div>
          )}

          {/* LARGE SAFE MARGIN ALERT */}
          {isTextSelected && (
            <div className="absolute bottom-8 z-50 animate-in fade-in slide-in-from-bottom-4 px-6 py-3 bg-white/90 backdrop-blur-md border border-green-200 text-green-700 rounded-full shadow-xl flex items-center gap-3 max-w-[90%]">
               <div className="bg-green-100 p-2 rounded-full shrink-0">
                 <ShieldCheck size={24} className="text-green-600" />
               </div>
               <div>
                 <span className="font-bold block text-green-800 text-base">Bezpieczny obszar ({SAFE_MARGIN_MM}mm)</span>
                 <span className="text-xs md:text-sm text-green-700/80 leading-tight">Unikaj umieszczania ważnych tekstów poza zieloną linią.</span>
               </div>
            </div>
          )}

          <div className="relative transition-all duration-300 ease-out">
             <div 
               className={`relative shadow-2xl overflow-hidden transition-all duration-300 ${getBackgroundClass()}`}
               style={{
                 width: `${canvasVisualWidth}px`,
                 height: `${canvasVisualHeight}px`,
                 borderRadius: borderRadius,
               }}
               onMouseDown={() => setSelectedElementId(null)}
             >
                 {backgroundColor && (
                   <div 
                     className="absolute inset-0 z-0 pointer-events-none"
                     style={{ backgroundColor: backgroundColor }}
                   />
                 )}

                 {/* SAFE MARGIN INDICATOR (GREEN DASHED LINE) - VISIBLE ONLY WHEN TEXT IS SELECTED */}
                 {isTextSelected && (
                   <div 
                      className="absolute border-2 border-green-400 border-dashed opacity-60 pointer-events-none z-40 transition-opacity duration-300"
                      style={{
                         top: `${SAFE_MARGIN_MM * scale}px`,
                         left: `${SAFE_MARGIN_MM * scale}px`,
                         width: `${(config.width - 2 * SAFE_MARGIN_MM) * scale}px`,
                         height: `${(config.height - 2 * SAFE_MARGIN_MM) * scale}px`,
                         borderRadius: config.cornerRadius > 0 ? `${(config.cornerRadius * scale) * 0.8}px` : (config.shape === 'circle' ? '50%' : '0')
                      }}
                   />
                 )}

                 {config.material === 'transparent' && !backgroundColor && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard-cross.png')] opacity-10 pointer-events-none z-0"></div>}

                 {elements.map(el => (
                   <div
                     key={el.id}
                     onMouseDown={(e) => handleMouseDown(e, el.id)}
                     className={`absolute cursor-move select-none group ${selectedElementId === el.id ? 'ring-2 ring-brand-accent ring-offset-2 z-20' : 'hover:ring-1 hover:ring-brand-accent/50 hover:ring-offset-1 z-10'}`}
                     style={{
                       left: `${el.x * scale}px`,
                       top: `${el.y * scale}px`,
                       transform: 'translate(-50%, -50%)',
                     }}
                   >
                     {el.type === 'text' ? (
                       <span 
                         style={{ 
                           fontSize: `${(el.fontSize || defaultFontSizeMM) * scale}px`, 
                           color: el.color,
                           fontFamily: el.fontFamily || 'Inter, sans-serif',
                           whiteSpace: 'pre-wrap', 
                           display: 'block', 
                           minWidth: 'max-content',
                           userSelect: 'none',
                           lineHeight: 1.2,
                           textShadow: el.textShadow && el.textShadow !== 'none' 
                              ? `${2 * scale}px ${2 * scale}px ${4 * scale}px rgba(0,0,0,0.5)` 
                              : 'none',
                           fontWeight: el.fontWeight || 'normal',
                           fontStyle: el.fontStyle || 'normal',
                           textDecoration: el.textDecoration || 'none',
                           textAlign: el.textAlign || 'center'
                         }}
                         className="drop-shadow-sm"
                       >
                         {el.content}
                       </span>
                     ) : el.type === 'pdf' ? (
                       <div 
                          className="bg-white/95 border border-red-200 rounded-lg flex flex-col items-center justify-center p-2 shadow-sm text-center overflow-hidden relative"
                          style={{
                            width: el.width ? `${el.width * scale}px` : '100px',
                            height: el.height ? `${el.height * scale}px` : '100px',
                          }}
                        >
                           <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-md"></div>
                           <FileText size={24} className="text-red-500 mb-1" />
                           <span className="text-[10px] font-bold text-gray-700 leading-tight truncate w-full px-1">
                               {el.content}
                           </span>
                           <span className="text-[8px] text-gray-400 font-mono mt-0.5">PDF VECTOR</span>
                        </div>
                     ) : (
                       <img 
                         src={el.content} 
                         alt="design element" 
                         draggable={false}
                         style={{
                           width: el.width ? `${el.width * scale}px` : 'auto',
                           height: el.height ? `${el.height * scale}px` : 'auto',
                           pointerEvents: 'none'
                         }}
                       />
                     )}
                     
                     {/* Move Badge */}
                     {selectedElementId === el.id && (
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-accent text-white text-[9px] px-2 py-0.5 rounded-full pointer-events-none opacity-80 whitespace-nowrap shadow-sm">
                          <Move size={8} className="inline mr-1"/> Przesuń
                       </div>
                     )}

                     {/* Resize Handle */}
                     {selectedElementId === el.id && (
                        <div 
                           onMouseDown={(e) => handleResizeMouseDown(e, el)}
                           className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-brand-accent rounded-full shadow-md cursor-se-resize flex items-center justify-center hover:scale-110 transition-transform"
                        >
                           <Scaling size={10} className="text-brand-accent"/>
                        </div>
                     )}
                   </div>
                 ))}
             </div>

             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-slate-400">
               {config.width}mm
             </div>
             <div className="absolute top-1/2 -right-8 -translate-y-1/2 text-xs font-mono text-slate-400 rotate-90">
               {config.height}mm
             </div>
          </div>

       </div>

    </div>
  );
};

export default Designer;