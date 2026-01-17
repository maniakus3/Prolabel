import React, { useState, useEffect } from 'react';
import { 
    X, Check, Star, Square, AlertTriangle, Info, Mail, 
    Upload, FileText, Loader2, Palette, Truck, Clock, 
    CheckCircle2 
} from 'lucide-react';
import { EditorConfig } from '../types';

// Stała potrzebna do wycinania kształtu serca (opcjonalnie, jeśli używasz clip-path w CSS)
const HEART_PATH_NORMALIZED = "M0.5072 0.9996 c0.9505,-0.6447 0.2837,-1.2949 -0.0015,-0.8556 -0.3168,-0.4432 -0.9598,0.2227 0.0015,0.8556 Z";

const PRESET_QUANTITIES = [50, 100, 250, 500, 1000, 2500, 5000];

interface StickerConfiguratorProps {
    onConfirm?: (config: EditorConfig) => void;
}

const StickerConfigurator: React.FC<StickerConfiguratorProps> = ({ onConfirm }) => {
    // --- STAN KOMPONENTU ---
    const [width, setWidth] = useState(90);
    const [height, setHeight] = useState(50);
    const [shape, setShape] = useState('rect');
    const [roundedCorners, setRoundedCorners] = useState(true);
    
    // Domyślne wartości
    const [material, setMaterial] = useState('white-gloss');
    const [laminate, setLaminate] = useState('none');
    const [confection, setConfection] = useState('sheet');
    const [quantity, setQuantity] = useState(100); // Initial placeholder, will be updated by effect

    // Stan formularza niestandardowego zapytania
    const [contactEmail, setContactEmail] = useState('');
    const [contactFile, setContactFile] = useState<File | null>(null);
    const [isSendingCustom, setIsSendingCustom] = useState(false);
    const [customRequestSuccess, setCustomRequestSuccess] = useState(false);

    // --- STAŁE KONFIGURACYJNE ---
    const PLOTTER_WIDTH_MM = 1320;
    const GAP_MM = 2; 
    const MIN_ORDER_AREA_M2 = 1.0; 
    const MIN_ORDER_PRICE_NETTO = 85.00;
    const MIN_ORDER_PRICE_GROSS = MIN_ORDER_PRICE_NETTO * 1.23;

    // --- DANE MATERIAŁOWE I CENNIK ---
    const shapes = [
        { 
            id: 'rect', 
            label: 'Prostokąt', 
            icon: <div className={`w-8 h-5 border-2 border-current bg-transparent transition-all ${roundedCorners && shape === 'rect' ? 'rounded-md' : 'rounded-none'}`} />,
            isPopular: true 
        },
        { 
            id: 'square', 
            label: 'Kwadrat', 
            icon: <div className={`w-6 h-6 border-2 border-current bg-transparent transition-all ${roundedCorners && shape === 'square' ? 'rounded-md' : 'rounded-none'}`} /> 
        },
        { id: 'circle', label: 'Okrąg', icon: <div className="w-6 h-6 border-2 border-current rounded-full bg-transparent" /> },
        { id: 'custom', label: 'Własny kształt', icon: <Star size={20} /> },
    ];

    // Ceny są podane jako Brutto za m2 w kodzie (Netto * 1.23)
    const materials = [
        { 
            id: 'white-gloss', 
            name: 'Folia biała błyszcząca', 
            style: 'bg-white shadow-inner bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(240,240,240,1)_50%,rgba(255,255,255,1)_100%)]',
            pricePerM2: 55.35, 
            isPopular: true
        },
        { 
            id: 'white-matte', 
            name: 'Folia biała matowa', 
            style: 'bg-gray-100',
            pricePerM2: 55.35 
        },
        { 
            id: 'strong-glue', 
            name: 'Folia biała mocny klej', 
            style: 'bg-gray-50 border-2 border-gray-300 border-dashed',
            pricePerM2: 70.0 
        },
        { 
            id: 'transparent', 
            name: 'Folia przezroczysta', 
            style: 'bg-[url("https://www.transparenttextures.com/patterns/checkerboard-cross.png")] bg-gray-200',
            pricePerM2: 60.0 
        },
        { 
            id: 'silver', 
            name: 'Folia srebrna', 
            style: 'bg-[linear-gradient(135deg,#e0e0e0_0%,#ffffff_50%,#b0b0b0_100%)]',
            pricePerM2: 147.6 
        },
        { 
            id: 'gold', 
            name: 'Folia złota', 
            style: 'bg-[linear-gradient(135deg,#bf953f_0%,#fcf6ba_50%,#b38728_100%)]',
            pricePerM2: 147.6 
        },
        { 
            id: 'holographic', 
            name: 'Folia holograficzna', 
            style: 'bg-[linear-gradient(45deg,#ff9a9e_0%,#fad0c4_99%,#fad0c4_100%)] bg-blend-overlay',
            pricePerM2: 147.6 
        },
        { 
            id: 'glitter', 
            name: 'Folia brokatowa', 
            style: 'bg-gray-200 bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:4px_4px]',
            pricePerM2: 147.6 
        },
        { 
            id: 'eco', 
            name: 'Papier brązowy Eco', 
            style: 'bg-[#d2b48c]',
            pricePerM2: 65.0 
        },
        { 
            id: 'void', 
            name: 'Folia plombowa krusząca', 
            style: 'bg-white border border-red-200',
            pricePerM2: 344.4 
        },
    ];

    const laminates = [
        { id: 'none', name: 'Brak laminatu', pricePerM2: 0.0, isPopular: true },
        { id: 'lam-gloss', name: 'Laminat Błyszczący UV', pricePerM2: 20.0 },
        { id: 'lam-matt', name: 'Laminat Matowy UV', pricePerM2: 20.0 },
    ];

    const confections = [
        { id: 'sheet', name: 'Arkusze (Gotowe do odklejania)', desc: 'Wiele użytków na arkuszu.', pricePerM2: 0, isPopular: true },
        { id: 'single', name: 'Pocięte na sztuki (Die-Cut)', desc: 'Każda naklejka osobno. Idealne do rozdawania.', pricePerM2: 20.0 },
        { id: 'roll', name: 'Na roli (Etykiety)', desc: 'Do automatycznej lub ręcznej aplikacji.', pricePerM2: 20.0 },
    ];

    const selectedMat = materials.find(m => m.id === material)!;
    const selectedLam = laminates.find(l => l.id === laminate)!;
    const selectedConf = confections.find(c => c.id === confection)!;


    // --- LOGIKA OBLICZEŃ MINIMALNEJ ILOŚCI I CENY ---

    // 1. Obliczenia powierzchni pojedynczej sztuki
    const productionWidth = width + GAP_MM;
    const productionHeight = height + GAP_MM;
    const singleAreaM2 = (productionWidth * productionHeight) / 1000000;

    // 2. Cena bazowa za m2 (z uwzględnieniem zwyżki dla małych wymiarów)
    const SMALL_WIDTH_LIMIT = 50;
    const SMALL_WIDTH_MIN_PRICE_GROSS = 120 * 1.23; 
    
    let appliedMaterialPricePerM2 = selectedMat.pricePerM2;
    if (width <= SMALL_WIDTH_LIMIT) {
        appliedMaterialPricePerM2 = Math.max(appliedMaterialPricePerM2, SMALL_WIDTH_MIN_PRICE_GROSS);
    }
    
    // Koszt produkcji 1m2 (materiał + dodatki)
    const pricePerProductionM2 = appliedMaterialPricePerM2 + selectedLam.pricePerM2 + selectedConf.pricePerM2;

    // 3. Obliczenie minimalnej ilości (Area OR Price)
    let minQuantity = 0;
    if (width > 0 && height > 0 && singleAreaM2 > 0) {
        // Ile sztuk wchodzi w rzędzie na szerokości plotera
        const itemsPerRow = Math.max(1, Math.floor(PLOTTER_WIDTH_MM / productionWidth));
        
        // A. Warunek Powierzchni: Min. 1m2
        const minQtyByArea = Math.ceil(MIN_ORDER_AREA_M2 / singleAreaM2);

        // B. Warunek Ceny: Min. 85 PLN Netto
        const singleStickerCost = singleAreaM2 * pricePerProductionM2;
        const minQtyByPrice = singleStickerCost > 0 ? Math.ceil(MIN_ORDER_PRICE_GROSS / singleStickerCost) : 0;

        // Wybieramy większą wymaganą ilość
        const baseMinQty = Math.max(minQtyByArea, minQtyByPrice);

        // Optymalizacja do pełnych rzędów
        const rowsNeeded = Math.ceil(baseMinQty / itemsPerRow);
        
        minQuantity = rowsNeeded * itemsPerRow;
    }

    // Automatyczne przeliczanie i proponowanie minimalnej ilości
    useEffect(() => {
        if (minQuantity > 0) {
            setQuantity(minQuantity);
        }
    }, [minQuantity, material, laminate, confection, width, height]); // Zależności: zmiana parametrów wymusza przeliczenie minimum

    // --- KALKULACJA CENY KOŃCOWEJ DLA WYBRANEJ ILOŚCI ---

    const totalAreaM2 = singleAreaM2 * quantity;
    let baseProductionPrice = totalAreaM2 * pricePerProductionM2;
    let totalPrice = baseProductionPrice;

    // Rabaty ilościowe
    if (quantity >= 500) totalPrice *= 0.95;
    if (quantity >= 1000) totalPrice *= 0.90;
    if (quantity >= 5000) totalPrice *= 0.85;

    // Zabezpieczenie minimalnej ceny (w razie ręcznej zmiany ilości poniżej progu ceny, choć minQuantity powinno to pokryć)
    let isMinPriceApplied = false;
    if (quantity > 0 && totalPrice < MIN_ORDER_PRICE_GROSS) {
        totalPrice = MIN_ORDER_PRICE_GROSS;
        isMinPriceApplied = true;
    }

    const unitPrice = quantity > 0 ? totalPrice / quantity : 0;
    const isBelowMinimum = quantity < minQuantity;
    const missingPieces = Math.max(0, minQuantity - quantity);

    // Walidacja
    const rawRatio = width && height ? width / height : 0;
    const isRatioOk = rawRatio >= 0.2 && rawRatio <= 5.0; 
    const isSizeOk = width >= 10 && height >= 10; 
    const isCustomShape = shape === 'custom';
    const aspectRatioDisplay = rawRatio > 0 ? rawRatio.toFixed(2) : '-';

    const canProceedStandard = isRatioOk && isSizeOk && !isCustomShape && quantity > 0 && !isBelowMinimum;
    const canSendCustomRequest = ((!isRatioOk && isSizeOk) || isCustomShape) && contactEmail.includes('@') && contactFile !== null;


    const handleAction = () => {
        if (canProceedStandard) {
            let desc = `${selectedMat.name}, ${selectedLam.name !== 'Brak laminatu' ? selectedLam.name : ''}. Konfekcja: ${selectedConf.name}.`;
            if (roundedCorners && (shape === 'rect' || shape === 'square')) {
                desc += ' Zaokrąglone rogi.';
            }
            if (isMinPriceApplied) {
                desc += ' (Zastosowano minimalną wartość zamówienia).';
            }
            
            const configData: EditorConfig = {
                productName: 'Naklejki samoprzylepne',
                width,
                height,
                shape: shape === 'circle' ? 'circle' : (shape === 'square' ? 'square' : 'rect'),
                material: material,
                cornerRadius: (roundedCorners && (shape === 'rect' || shape === 'square')) ? (Math.min(width, height) <= 60 ? 2 : 3) : 0,
                quantity: quantity,
                totalPrice: totalPrice,
                description: desc
            };

            if (onConfirm) {
                onConfirm(configData);
            }

        } 
        else if (canSendCustomRequest) {
            setIsSendingCustom(true);
            setTimeout(() => {
                setIsSendingCustom(false);
                setCustomRequestSuccess(true);
            }, 1500);
        }
    };

    return (
        <section className="py-10 bg-slate-50 min-h-[800px] flex flex-col font-sans animate-in fade-in duration-500">
             <div className="text-center mb-8">
                <span className="text-brand-accent font-bold tracking-wider uppercase text-sm">Personalizacja</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    Konfigurator Naklejek
                </h2>
            </div>

            <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEWA KOLUMNA: KONFIGURACJA */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. FORMAT & KSZTAŁT */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs">1</span>
                                Format i Kształt
                            </h3>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Wybierz kształt</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {shapes.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setShape(s.id)}
                                            className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all h-24 ${shape === s.id ? 'border-brand-accent bg-brand-light text-brand-primary' : 'border-gray-100 hover:border-gray-300 text-gray-600'}`}
                                        >
                                            <div className={shape === s.id ? 'text-brand-accent' : 'text-gray-400'}>{s.icon}</div>
                                            <span className="text-[10px] font-semibold text-center leading-tight">{s.label}</span>
                                            
                                            {(s as any).isPopular && (
                                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase z-10">
                                                    Popularne
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* OPCJA ZAOKRĄGLONYCH ROGÓW */}
                            {(shape === 'rect' || shape === 'square') && (
                                <div className="mb-6 bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 ${roundedCorners ? 'border-brand-accent bg-blue-100 text-brand-accent' : 'border-gray-300 text-gray-400'}`}>
                                            <Square size={20} className={roundedCorners ? 'rounded-md' : 'rounded-none'} fill={roundedCorners ? "currentColor" : "none"} />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-gray-800 block">Zaokrąglone rogi</span>
                                            <span className="text-xs text-gray-500">Promień 2-3mm (cięcie po obrysie)</span>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={roundedCorners}
                                            onChange={(e) => setRoundedCorners(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
                                    </label>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Szerokość (mm)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={width || ''}
                                            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                                            className="w-full p-3 border border-gray-300 rounded-lg text-lg font-bold focus:ring-2 focus:ring-brand-accent outline-none pr-10 bg-white text-gray-900 shadow-sm"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">mm</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wysokość (mm)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={height || ''}
                                            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                                            className="w-full p-3 border border-gray-300 rounded-lg text-lg font-bold focus:ring-2 focus:ring-brand-accent outline-none pr-10 bg-white text-gray-900 shadow-sm"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">mm</span>
                                    </div>
                                </div>
                            </div>

                            {/* OSTRZEŻENIA I ZAPYTANIA */}
                            {((!isRatioOk && isSizeOk) || !isSizeOk || isCustomShape) && (
                            <div className={`mt-6 p-4 rounded-xl border transition-all duration-300 ${canProceedStandard || isBelowMinimum ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                                {!isCustomShape && (
                                    <>
                                        <div className="flex justify-between items-start mb-2">
                                            {/* PROPORCJE - SEKCJA OSTRZEGAWCZA */}
                                            <div>
                                                {!isRatioOk ? (
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-bold text-orange-800">
                                                                Niestandardowe proporcje
                                                            </h4>
                                                            <AlertTriangle size={16} className="text-orange-600"/>
                                                        </div>
                                                        <p className="text-[10px] text-orange-700 mt-0.5">
                                                            Wymagane: 0.2 - 5.0 (szer./wys.)
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-bold text-gray-500">
                                                            Proporcje kształtu
                                                        </h4>
                                                        <Info size={14} className="text-gray-400"/>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-lg font-extrabold ${canProceedStandard || isBelowMinimum ? 'text-brand-accent' : 'text-orange-600'}`}>{aspectRatioDisplay}</span>
                                        </div>
                                    </>
                                )}

                                {!isSizeOk && (
                                     <div className="mt-3 text-xs font-bold text-red-600 bg-red-100/50 p-2 rounded flex items-center gap-2">
                                        <X size={14} /> Minimalny wymiar to 10mm
                                    </div>
                                )}

                                {((!isRatioOk && isSizeOk) || isCustomShape) && (
                                    <div className={`${!isCustomShape ? 'mt-4 border-t border-orange-200 pt-4' : ''} animate-in fade-in slide-in-from-top-2`}>
                                        <h5 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                                            <Info size={16} className="text-brand-accent"/> 
                                            {isCustomShape ? 'Własny kształt? Wycenimy go!' : 'Nietypowy format? Wycenimy go indywidualnie!'}
                                        </h5>
                                        <p className="text-xs text-gray-600 mb-4">
                                            {isCustomShape 
                                                ? 'Załącz swój plik z linią cięcia lub projektem, a przygotujemy ofertę.' 
                                                : 'Wymiary Twojej naklejki są niestandardowe. Załącz plik poniżej i podaj email, a przygotujemy darmową wycenę.'}
                                        </p>

                                        {customRequestSuccess ? (
                                            <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-3">
                                                <CheckCircle2 size={24} />
                                                <div>
                                                    <div className="font-bold text-sm">Wysłano zapytanie!</div>
                                                    <div className="text-xs">Skontaktujemy się z Tobą wkrótce.</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Twój Email</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input 
                                                            type="email" 
                                                            value={contactEmail}
                                                            onChange={(e) => setContactEmail(e.target.value)}
                                                            className="w-full pl-9 pr-3 py-2 bg-white border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                                                            placeholder="email@przyklad.pl"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Projekt (Opcjonalne)</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="file" 
                                                            id="custom-file-upload"
                                                            className="hidden"
                                                            onChange={(e) => setContactFile(e.target.files ? e.target.files[0] : null)}
                                                        />
                                                        <label 
                                                            htmlFor="custom-file-upload"
                                                            className={`w-full flex items-center justify-center gap-2 py-2 px-3 border border-orange-300 border-dashed rounded-lg text-sm cursor-pointer hover:bg-white transition-colors ${contactFile ? 'bg-orange-100 text-orange-800 border-orange-400' : 'bg-white/50 text-gray-600'}`}
                                                        >
                                                            {contactFile ? (
                                                                <><FileText size={16}/> {contactFile.name.substring(0, 15)}...</>
                                                            ) : (
                                                                <><Upload size={16}/> Wybierz plik</>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            )}
                        </div>

                        {/* 2. MATERIAŁ */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs">2</span>
                                Rodzaj podłoża
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {materials.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMaterial(m.id)}
                                        className={`group flex flex-col items-center gap-3 p-3 rounded-xl border transition-all relative overflow-hidden ${material === m.id ? 'border-brand-accent bg-blue-50 ring-1 ring-brand-accent' : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-full shadow-md relative transition-transform group-hover:scale-105 ${m.style}`}>
                                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-black/10 rounded-tl-xl rounded-br-full backdrop-blur-[1px]"></div>
                                        </div>
                                        
                                        <span className="text-xs font-bold text-center leading-tight text-gray-700">{m.name}</span>
                                        
                                        {m.isPopular && (
                                            <span className="absolute top-0 left-0 bg-yellow-400 text-[8px] font-bold px-1.5 py-0.5 rounded-br-md shadow-sm text-yellow-900 uppercase">
                                                Popularne
                                            </span>
                                        )}

                                        {material === m.id && (
                                            <div className="absolute top-2 right-2 bg-brand-accent text-white rounded-full p-0.5 shadow-sm">
                                                <Check size={10} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. USZLACHETNIENIE & KONFEKCJA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs">3</span>
                                    Uszlachetnienie
                                </h3>
                                <div className="space-y-2">
                                    {laminates.map((l) => (
                                        <label key={l.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all">
                                            <input 
                                                type="radio" 
                                                name="laminate" 
                                                checked={laminate === l.id} 
                                                onChange={() => setLaminate(l.id)}
                                                className="w-5 h-5 text-brand-accent border-gray-300 focus:ring-brand-accent accent-brand-accent"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {l.name}
                                                {(l as any).isPopular && (
                                                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                        POPULARNE
                                                    </span>
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs">4</span>
                                    Konfekcja
                                </h3>
                                <div className="space-y-3">
                                    {confections.map((c) => (
                                        <div 
                                            key={c.id}
                                            onClick={() => setConfection(c.id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all relative overflow-hidden ${confection === c.id ? 'border-brand-accent bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`text-sm font-bold ${confection === c.id ? 'text-brand-primary' : 'text-gray-700'}`}>{c.name}</span>
                                                {confection === c.id && <Check size={14} className="text-brand-accent" />}
                                            </div>
                                            <p className="text-xs text-gray-500">{c.desc}</p>
                                            
                                            {(c as any).isPopular && (
                                                <span className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded-bl-md uppercase">
                                                    Popularne
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* PRAWA KOLUMNA: PODSUMOWANIE (STICKY) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6">Podsumowanie</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Wymiar:</span>
                                    <span className="font-bold text-gray-900">{width} x {height} mm</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Kształt:</span>
                                    <span className="font-bold text-gray-900">
                                        {shapes.find(s => s.id === shape)?.label}
                                        {roundedCorners && (shape === 'rect' || shape === 'square') && " (Zaokrąglone)"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Materiał:</span>
                                    <span className="font-bold text-gray-900 text-right max-w-[60%] leading-tight">{selectedMat.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Uszlachetnienie:</span>
                                    <span className="font-bold text-gray-900">{selectedLam.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Konfekcja:</span>
                                    <span className="font-bold text-gray-900">{selectedConf.name.split('(')[0]}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nakład (sztuk)</label>
                                <div className="space-y-3">
                                    <input 
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-brand-accent outline-none text-center text-lg"
                                        placeholder="Wpisz ilość"
                                    />
                                    {/* PRESET QUANTITY BUTTONS */}
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {PRESET_QUANTITIES.map(qty => (
                                            <button
                                                key={qty}
                                                onClick={() => setQuantity(qty)}
                                                className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors font-medium ${
                                                    quantity === qty
                                                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-accent hover:text-brand-accent hover:bg-gray-50'
                                                }`}
                                            >
                                                {qty}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Informacja o cenie i ilości */}
                            <div className={`text-xs text-gray-500 mb-4 p-3 rounded-lg border ${isBelowMinimum || isMinPriceApplied ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100'}`}>
                                {isBelowMinimum && (
                                    <div className="text-orange-600 font-bold animate-pulse">
                                        <div className="flex items-center gap-1 mb-1"><AlertTriangle size={12}/> Zbyt mała ilość</div>
                                        <div className="text-orange-800">Minimum to: {minQuantity} szt.</div>
                                    </div>
                                )}
                                {isMinPriceApplied && !isBelowMinimum && (
                                    <div className="text-orange-600 font-bold">
                                        <div className="flex items-center gap-1 mb-1"><Info size={12}/> Min. wartość: {MIN_ORDER_PRICE_NETTO} zł netto</div>
                                        <div className="text-orange-800 text-[10px] leading-tight">Cena została podniesiona do minimum produkcyjnego.</div>
                                    </div>
                                )}
                                {!isBelowMinimum && !isMinPriceApplied && (
                                     <div className="flex items-center gap-1 text-green-600 font-medium">
                                        <CheckCircle2 size={14} /> Zamówienie spełnia minima.
                                     </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-6 mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-600 font-medium">Cena netto:</span>
                                    <span className="text-2xl font-bold text-gray-900">{(totalPrice / 1.23).toFixed(2)} zł</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 text-sm">Cena brutto:</span>
                                    <span className="text-lg font-bold text-gray-500">{totalPrice.toFixed(2)} zł</span>
                                </div>
                                <div className="mt-2 text-right">
                                    <span className="text-xs text-brand-primary bg-blue-50 px-2 py-1 rounded-md font-medium">
                                        {unitPrice > 0 ? unitPrice.toFixed(2) : '0.00'} zł netto / szt.
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-green-600 bg-green-50 p-3 rounded-lg mb-6">
                                <span className="flex items-center gap-1.5"><Truck size={14}/> Darmowa dostawa</span>
                                <span className="flex items-center gap-1.5"><Clock size={14}/> 3 dni robocze</span>
                            </div>

                            <button 
                                onClick={handleAction}
                                disabled={!canProceedStandard && !canSendCustomRequest || isSendingCustom || customRequestSuccess}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2
                                    ${canProceedStandard 
                                        ? 'bg-brand-accent text-white hover:bg-sky-400 hover:shadow-xl hover:-translate-y-0.5' 
                                        : canSendCustomRequest 
                                            ? 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-xl hover:-translate-y-0.5'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {isSendingCustom ? (
                                    <><Loader2 size={20} className="animate-spin" /> Wysyłanie...</>
                                ) : customRequestSuccess ? (
                                    <><Check size={20} /> Wysłano!</>
                                ) : canProceedStandard ? (
                                    <><Palette size={20} /> Projektuj</>
                                ) : isBelowMinimum ? (
                                    <><AlertTriangle size={20} /> Zbyt mała ilość</>
                                ) : (
                                    <><Mail size={20} /> Wyślij zapytanie</>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default StickerConfigurator;