import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySelector from './components/CategorySelector';
import DetailsSection from './components/DetailsSection';
import LabelConfigurator from './components/LabelConfigurator';
import StickerConfigurator from './components/StickerConfigurator';
import Designer from './components/Designer'; // Import Designer
import AiAdvisor from './components/AiAdvisor';
import { PROLABEL_DATA } from './data';
import { MainCategory, EditorConfig } from './types';
import { ArrowUp } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MainCategory>(PROLABEL_DATA[0]);
  const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: MainCategory) => {
    setActiveCategory(category);
    setEditorConfig(null); // Reset designer when changing categories
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Header />
      
      <main className="flex-grow">
        {/* Hero and CategorySelector are now ALWAYS visible */}
        <Hero 
          categories={PROLABEL_DATA} 
          activeCategory={activeCategory} 
          onSelectCategory={handleCategorySelect}
        />
        
        <CategorySelector 
          categories={PROLABEL_DATA}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* Dynamic Content Area: Switches between Configurator/Details AND Designer */}
        <div id="main-content-area" className="scroll-mt-24">
          {editorConfig ? (
            <div className="container mx-auto px-4 py-8">
              <Designer 
                config={editorConfig} 
                onBack={() => setEditorConfig(null)} 
              />
            </div>
          ) : (
            <>
              {['etykiety', 'kalki'].includes(activeCategory.id) ? (
                <LabelConfigurator categoryId={activeCategory.id} />
              ) : activeCategory.id === 'naklejki' ? (
                <StickerConfigurator onConfirm={(config) => {
                  setEditorConfig(config);
                  // Optional: scroll to designer start if needed
                  document.getElementById('main-content-area')?.scrollIntoView({ behavior: 'smooth' });
                }} />
              ) : (
                <DetailsSection category={activeCategory} />
              )}
            </>
          )}
        </div>
        
        {/* Contact Teaser - Visible only when not designing to reduce distraction */}
        {!editorConfig && (
          <section className="bg-brand-dark text-white py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Potrzebujesz indywidualnej wyceny?</h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Skontaktuj się z nami, aby omówić szczegóły Twojego projektu. 
                  Oferujemy profesjonalne doradztwo i konkurencyjne ceny.
                </p>
                <button className="bg-white text-brand-dark px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1">
                  Skontaktuj się z nami
                </button>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-bold mb-4">Prolabel</h4>
            <p className="text-sm">Profesjonalne rozwiązania dla przemysłu i reklamy.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Oferta</h4>
            <ul className="space-y-2 text-sm">
              <li>Etykiety na rolce</li>
              <li>Kalki termotransferowe</li>
              <li>Naklejki samoprzylepne</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm">
              <li>biuro@prolabel.pl</li>
              <li>+48 123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-900 text-center text-xs">
          © {new Date().getFullYear()} Prolabel. Wszelkie prawa zastrzeżone.
        </div>
      </footer>

      <AiAdvisor />
      
      {/* Scroll to top */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 p-3 bg-white text-brand-primary rounded-full shadow-lg hover:bg-gray-50 transition border border-gray-100 hidden md:block"
        title="Przewiń do góry"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default App;