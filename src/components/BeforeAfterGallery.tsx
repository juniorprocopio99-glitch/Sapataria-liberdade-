import React, { useState } from 'react';
import { GALLERY_ITEMS as DEFAULT_GALLERY_ITEMS } from '../data/sapatariaData';
import { BeforeAfterItem } from '../types';
import { ArrowRight } from 'lucide-react';

interface BeforeAfterGalleryProps {
  onQuoteClick: () => void;
  items?: BeforeAfterItem[];
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({ 
  onQuoteClick,
  items = DEFAULT_GALLERY_ITEMS
}) => {
  const displayItems = items.length > 0 ? items : DEFAULT_GALLERY_ITEMS;
  const [activeItem, setActiveItem] = useState<BeforeAfterItem>(displayItems[0]);

  return (
    <section id="galeria" className="py-20 bg-[#faf7f2] border-b border-[#e8dfd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#784621] uppercase mb-3">
              <span>Resultados Comprovados</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#27211d] tracking-tight">
              Galeria de Restaurações & Antes e Depois
            </h2>
            <p className="mt-3 text-base text-[#675445] leading-relaxed">
              Veja a transformação real de calçados desgastados pelo tempo e uso. Nossa técnica artesanal recupera a estrutura original mantendo o conforto do seu pé.
            </p>
          </div>

          <button
            onClick={onQuoteClick}
            className="inline-flex items-center gap-2 bg-[#784621] hover:bg-[#5f3618] text-[#faf7f2] px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>Quero Restaurar o Meu Calçado</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item) => {
            const isSelected = activeItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`group rounded-2xl overflow-hidden border bg-white transition-all cursor-pointer flex flex-col ${
                  isSelected 
                    ? 'border-[#784621] ring-2 ring-[#784621]/30 shadow-md' 
                    : 'border-[#e4d8cc] hover:border-[#cbbaa8] hover:shadow-sm'
                }`}
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#e8dfd5]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#f5caa0] block">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#27211d] mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5a483a] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#ebdcd0] flex flex-wrap gap-1.5">
                    {item.improvementTags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-[11px] font-medium text-[#784621] bg-[#f5ede3] px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
