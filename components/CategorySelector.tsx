import React from 'react';
import { MainCategory } from '../types';
import { Scroll, Printer, Sticker, Image, Layers } from 'lucide-react';

interface CategorySelectorProps {
  categories: MainCategory[];
  activeCategory: MainCategory;
  onSelectCategory: (category: MainCategory) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Scroll,
  Printer,
  Sticker,
  Image,
  Layers,
};

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <section className="bg-slate-50 relative z-30 -mt-10 md:-mt-16 px-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 md:p-4 grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.iconName] || Layers;
            const isActive = activeCategory.id === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`flex flex-col items-center justify-center py-6 px-2 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-lg ring-2 ring-brand-primary ring-offset-2' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-brand-primary'
                }`}
              >
                <div className={`p-3 rounded-full mb-3 transition-colors ${
                  isActive ? 'bg-white/10' : 'bg-white shadow-sm group-hover:scale-110'
                }`}>
                  <Icon className={`w-6 h-6 md:w-8 md:h-8 ${
                    isActive ? 'text-white' : 'text-brand-accent'
                  }`} />
                </div>
                <span className={`font-semibold text-xs md:text-sm text-center leading-tight ${
                  isActive ? 'text-white' : 'text-slate-700'
                }`}>
                  {cat.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySelector;