import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenSettings?: () => void;
  whatsappNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ whatsappNumber }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e6ded3] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <a 
          href="#" 
          className="font-brand text-xl sm:text-2xl font-bold tracking-tight text-[#3b2a1d] hover:text-[#784621] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <span className="w-8 h-8 rounded bg-[#784621] text-[#faf7f2] flex items-center justify-center font-serif text-base font-bold shadow-xs">
            SL
          </span>
          <span>Sapataria Liberdade</span>
        </a>

        {/* Zone 2: 4 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#675445]">
          <button 
            onClick={() => scrollToSection('orcamento')} 
            className="hover:text-[#27211d] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Orçamento
          </button>
          <button 
            onClick={() => scrollToSection('como-funciona')} 
            className="hover:text-[#27211d] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Como Funciona
          </button>
          <button 
            onClick={() => scrollToSection('galeria')} 
            className="hover:text-[#27211d] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Antes & Depois
          </button>
          <button 
            onClick={() => scrollToSection('duvidas')} 
            className="hover:text-[#27211d] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Dúvidas
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => scrollToSection('orcamento')}
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Pedir no WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
};
