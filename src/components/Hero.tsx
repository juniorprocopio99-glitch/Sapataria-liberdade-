import React from 'react';
import { ArrowRight, ShieldCheck, Clock, Sparkles, Truck } from 'lucide-react';

interface HeroProps {
  onStartQuote: () => void;
  heroImage?: string;
}

export const Hero: React.FC<HeroProps> = ({ onStartQuote, heroImage }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f5ede3] to-[#faf7f2] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#e8dfd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#784621] uppercase mb-4">
              <span>Sapataria Artesanal & Restauração de Couro</span>
              <span aria-hidden="true" className="text-[#cbb59f]">·</span>
              <span>Oficina Especializada</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#27211d] leading-[1.12] mb-6 text-balance">
              Seus sapatos favoritos com cara de novos de novo!
            </h1>

            <p className="text-lg text-[#5a483a] leading-relaxed mb-8 max-w-2xl">
              Conserto de solados, meia sola Vibram, costuras manuais, tingimento, higienização profunda e recuperação de calçados sociais, tênis, botas e artigos de couro. Escolha os serviços desejados e receba seu orçamento personalizado diretamente no WhatsApp em minutos.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={onStartQuote}
                className="inline-flex items-center justify-center gap-3 bg-[#784621] hover:bg-[#5f3618] text-[#faf7f2] px-7 py-4 rounded-xl font-semibold text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer group whitespace-nowrap"
              >
                <span>Solicitar Orçamento no WhatsApp</span>
                <ArrowRight className="w-5 h-5 text-[#f0dfcc] transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl border border-[#cbb59f] text-[#4a392c] hover:bg-[#ece2d6]/60 transition-colors text-base font-medium whitespace-nowrap cursor-pointer text-center"
              >
                Como Funciona o Pedido
              </a>
            </div>

            {/* Micro proof indicators */}
            <div className="pt-6 border-t border-[#e2d5c6] flex flex-wrap items-center gap-6 text-xs text-[#6e5a4a]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#784621]" />
                <span className="font-medium">90 dias de garantia nas costuras</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#784621]" />
                <span className="font-medium">Serviço de Leva e Traz disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#784621]" />
                <span className="font-medium">Atendimento rápido no WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#ded2c3] bg-[#f0e7dc] group">
              <img
                src={heroImage || "/src/assets/images/hero_shoe_restoration_1793227372164.jpg"}
                alt="Mestre sapateiro artesão restaurando calçado de couro em bancada clássica"
                className="w-full h-80 sm:h-96 lg:h-[480px] object-cover transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#27211d]/75 via-[#27211d]/20 to-transparent pointer-events-none" />
              
              {/* Floating caption */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#27211d]/85 backdrop-blur-md text-[#faf7f2] border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#f0c38f] uppercase tracking-wider">Atelier Sapataria Liberdade</p>
                    <p className="text-sm font-medium text-white/90">Tradição artesanal com técnicas modernas</p>
                  </div>
                  <span className="text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-md">Desde 2008</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-column KPI strip below the split */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[#e2d5c6]">
          <div className="p-4 rounded-xl bg-white/70 border border-[#e8dfd5] text-center sm:text-left">
            <p className="font-brand text-2xl sm:text-3xl font-bold text-[#784621] tabular-nums">+15.000</p>
            <p className="text-xs sm:text-sm font-medium text-[#5a483a] mt-1">Calçados revitalizados</p>
          </div>
          <div className="p-4 rounded-xl bg-white/70 border border-[#e8dfd5] text-center sm:text-left">
            <p className="font-brand text-2xl sm:text-3xl font-bold text-[#784621] tabular-nums">100%</p>
            <p className="text-xs sm:text-sm font-medium text-[#5a483a] mt-1">Couro nobre & borracha Vibram</p>
          </div>
          <div className="p-4 rounded-xl bg-white/70 border border-[#e8dfd5] text-center sm:text-left">
            <p className="font-brand text-2xl sm:text-3xl font-bold text-[#784621] tabular-nums">24h - 48h</p>
            <p className="text-xs sm:text-sm font-medium text-[#5a483a] mt-1">Prazos para serviços rápidos</p>
          </div>
          <div className="p-4 rounded-xl bg-white/70 border border-[#e8dfd5] text-center sm:text-left">
            <p className="font-brand text-2xl sm:text-3xl font-bold text-[#784621] tabular-nums">4.9 / 5.0</p>
            <p className="text-xs sm:text-sm font-medium text-[#5a483a] mt-1">Avaliação dos clientes</p>
          </div>
        </div>
      </div>
    </section>
  );
};
