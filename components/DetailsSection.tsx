import React from 'react';
import { MainCategory } from '../types';
import { CheckCircle2, Tag, Info } from 'lucide-react';

interface DetailsSectionProps {
  category: MainCategory;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ category }) => {
  return (
    <section id="details-section" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">Szczegóły oferty</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{category.title}</h2>
          <div className="w-20 h-1 bg-brand-accent mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {category.subCategories.map((sub, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 hover:border-brand-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/5"
            >
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-brand-accent" />
                  {sub.title}
                </h3>
              </div>
              
              <ul className="p-6 space-y-4">
                {sub.items.map((item, idx) => (
                  <li key={idx} className="flex items-start group">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium block">{item.name}</span>
                      {item.description && (
                         <span className="text-sm text-gray-500 mt-1 block flex items-center">
                            <Info className="w-3 h-3 mr-1 inline" /> {item.description}
                         </span>
                      )}
                    </div>
                    {item.price && (
                      <div className="ml-4 bg-brand-light px-3 py-1 rounded-full border border-slate-200">
                        <span className="text-brand-primary font-bold text-sm whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DetailsSection;
