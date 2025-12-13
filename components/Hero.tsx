import React from 'react';
import { MainCategory } from '../types';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  categories: MainCategory[];
  activeCategory: MainCategory;
  onSelectCategory: (category: MainCategory) => void;
}

const Hero: React.FC<HeroProps> = ({ categories, activeCategory, onSelectCategory }) => {
  
  const activeIndex = categories.findIndex(c => c.id === activeCategory.id);

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % categories.length;
    onSelectCategory(categories[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + categories.length) % categories.length;
    onSelectCategory(categories[prevIndex]);
  };

  return (
    <div className="relative bg-brand-dark text-white overflow-hidden h-[500px] lg:h-[600px] group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-dark/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent z-10" />
        <img 
          key={activeCategory.image}
          src={activeCategory.image} 
          alt={activeCategory.title} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out scale-105"
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        
        {/* Text Content */}
        <div className="max-w-4xl space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-brand-accent/20 text-brand-accent px-4 py-1.5 rounded-full text-sm font-medium border border-brand-accent/30 backdrop-blur-sm">
            <span>Profesjonalny Druk & Reklama</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-2xl">
            {activeCategory.title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-2xl mx-auto drop-shadow-lg font-light">
            {activeCategory.description}
          </p>
          
          <div className="flex justify-center pt-6">
            <button 
              onClick={() => {
                const element = document.getElementById('details-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-brand-accent hover:bg-sky-400 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-sky-500/20 flex items-center hover:scale-105 active:scale-95"
            >
              Zobacz ofertę
              <ArrowRight className="ml-2 w-6 h-6" />
            </button>
          </div>
        </div>

      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev} 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-brand-accent text-white backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button 
        onClick={handleNext} 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-brand-accent text-white backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 translate-x-[20px] group-hover:translate-x-0"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Hero;