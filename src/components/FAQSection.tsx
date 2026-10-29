import React, { useState, useRef } from 'react';
import { FAQ_LIST, TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../data/sapatariaData';
import { TestimonialItem } from '../types';
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MessageCircle, 
  Plus, 
  Check, 
  Sparkles, 
  X, 
  AlertCircle,
  ThumbsUp,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Testimonials state with localStorage persistence
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('sapataria_testimonials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return DEFAULT_TESTIMONIALS;
  });

  // Client Review Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [serviceUsed, setServiceUsed] = useState('Troca de Solado Vibram');
  const [comment, setComment] = useState('');
  const [nameError, setNameError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Horizontal scroll container ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth / 3;
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth / 3;
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();

    // Enforce at least the first name
    if (!cleanName || cleanName.length < 2) {
      setNameError(true);
      setFormError('É obrigatório informar pelo menos o seu primeiro nome para enviar a avaliação.');
      return;
    }
    setNameError(false);

    if (!comment.trim()) {
      setFormError('Por favor, escreva o seu comentário sobre o serviço.');
      return;
    }
    if (comment.trim().length < 8) {
      setFormError('O seu comentário precisa ter pelo menos 8 caracteres.');
      return;
    }

    const newReview: TestimonialItem = {
      id: 'rev_' + Date.now(),
      name: cleanName,
      role: role.trim() || 'Cliente Verificado · Sapataria Liberdade',
      serviceUsed: serviceUsed.trim() || 'Restauração de Calçado',
      stars: rating,
      comment: comment.trim(),
      date: 'Hoje'
    };

    const updated = [newReview, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('sapataria_testimonials', JSON.stringify(updated));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // silent fallback
    }

    setSuccessFeedback('Obrigado pelo seu depoimento! Sua avaliação de 5 estrelas foi publicada.');
    setName('');
    setRole('');
    setComment('');
    setRating(5);
    setFormError(null);
    setIsFormOpen(false);

    // Scroll container to first card so new review is visible
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 100);

    setTimeout(() => {
      setSuccessFeedback(null);
    }, 4500);
  };

  // Quick service tag suggestions for the client
  const quickServices = [
    'Troca de Solado Vibram',
    'Restauração de Cor & Tingimento',
    'Hidratação em Couro Nobre',
    'Higienização de Sneakers',
    'Costura & Colagem de Reforço',
    'Troca de Salto / Tacão'
  ];

  // Calculate average rating
  const averageRating = (
    testimonials.reduce((acc, t) => acc + (t.stars || 5), 0) / (testimonials.length || 1)
  ).toFixed(1);

  return (
    <section id="duvidas" className="py-20 bg-white border-b border-[#e8dfd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Header */}
        <div className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ebdcd0]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#784621] uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#b57335]" />
                <span>Depoimentos Reais & Avaliações</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#27211d] tracking-tight">
                A confiança de quem ama seus calçados
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#675445] leading-relaxed">
                Experiências reais de clientes que restauraram sapatos sociais, tênis e botas conosco.
              </p>
              
              {/* Average Rating & Count Badge */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <div className="inline-flex items-center gap-1.5 bg-[#fbf5ed] border border-[#ecd9c7] text-[#784621] px-3 py-1 rounded-full font-bold">
                  <span className="text-amber-500 text-sm">★</span>
                  <span>{averageRating} de 5.0</span>
                  <span className="text-[#8a7260] font-normal">({testimonials.length} avaliações)</span>
                </div>
                <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  <span>100% Clientes Reais</span>
                </span>
              </div>
            </div>

            {/* Actions: Write Review Button & Carousel Navigation */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(!isFormOpen);
                  setFormError(null);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                  isFormOpen
                    ? 'bg-[#27211d] text-white'
                    : 'bg-[#784621] hover:bg-[#5f3618] text-white active:scale-95'
                }`}
              >
                {isFormOpen ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Fechar Formulário</span>
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Avaliar Serviço (Até 5 Estrelas)</span>
                  </>
                )}
              </button>

              {/* Navigation Arrows (Visible when > 3 reviews) */}
              {testimonials.length > 3 && (
                <div className="flex items-center gap-1 bg-[#faf7f2] p-1 rounded-xl border border-[#e8dfd5]">
                  <button
                    type="button"
                    onClick={scrollLeft}
                    className="p-2 rounded-lg text-[#784621] hover:bg-[#ede1d4] transition-colors cursor-pointer"
                    title="Depoimentos anteriores"
                    aria-label="Rolar para a esquerda"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollRight}
                    className="p-2 rounded-lg text-[#784621] hover:bg-[#ede1d4] transition-colors cursor-pointer"
                    title="Próximos depoimentos"
                    aria-label="Rolar para a direita"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success Banner */}
          {successFeedback && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs animate-in fade-in">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successFeedback}</span>
            </div>
          )}

          {/* CLIENT REVIEW CREATION FORM (Expandable) */}
          {isFormOpen && (
            <div className="mt-6 mb-8 p-5 sm:p-7 rounded-2xl bg-[#faf7f2] border-2 border-[#dfb892] shadow-md animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#ebdcd0] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#784621] text-white flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#27211d]">
                      Deixe sua Avaliação da Sapataria Liberdade
                    </h4>
                    <p className="text-xs text-[#7e6b5d]">
                      Sua opinião é fundamental e ajuda outros clientes a escolherem nossos serviços.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg text-[#8a7260] hover:text-[#27211d] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* 1. Star Rating Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#27211d] mb-1.5">
                    Sua Nota (1 a 5 Estrelas) <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#d8cbbe]">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 rounded-md transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                            title={`${star} estrela${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                isFilled 
                                  ? 'text-amber-500 fill-amber-500' 
                                  : 'text-[#d8cbbe] stroke-1 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-xs font-bold text-[#784621] bg-[#f2e7db] px-3 py-1 rounded-lg border border-[#ebd8c5]">
                      {rating === 5 && '★★★★★ Excelente! (5 Estrelas)'}
                      {rating === 4 && '★★★★☆ Muito Bom! (4 Estrelas)'}
                      {rating === 3 && '★★★☆☆ Bom (3 Estrelas)'}
                      {rating === 2 && '★★☆☆☆ Regular (2 Estrelas)'}
                      {rating === 1 && '★☆☆☆☆ Insatisfeito (1 Estrela)'}
                    </span>
                  </div>
                </div>

                {/* 2. Customer Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#27211d] mb-1">
                      Seu Primeiro Nome <span className="text-rose-600">* (Obrigatório)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(false);
                        if (formError) setFormError(null);
                      }}
                      placeholder="Ex: Carlos (informe ao menos o primeiro nome)"
                      required
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm text-[#27211d] focus:outline-none transition-colors ${
                        nameError 
                          ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/20' 
                          : 'border-[#d8cbbe] focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20'
                      }`}
                    />
                    <p className="text-[11px] text-[#7e6b5d] mt-1">
                      Necessário informar pelo menos o seu primeiro nome para assinar o comentário.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      Sua Cidade / Bairro (Opcional)
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ex: Pinheiros · São Paulo - SP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] bg-white text-xs sm:text-sm text-[#27211d] focus:outline-none focus:border-[#784621]"
                    />
                  </div>
                </div>

                {/* 3. Service Used */}
                <div>
                  <label className="block text-xs font-semibold text-[#27211d] mb-1">
                    Qual serviço foi realizado no seu calçado?
                  </label>
                  <input
                    type="text"
                    value={serviceUsed}
                    onChange={(e) => setServiceUsed(e.target.value)}
                    placeholder="Ex: Troca de Solado Vibram & Pintura"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#d8cbbe] bg-white text-xs text-[#27211d] focus:outline-none focus:border-[#784621] mb-1.5"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {quickServices.map((qs) => (
                      <button
                        key={qs}
                        type="button"
                        onClick={() => setServiceUsed(qs)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          serviceUsed === qs 
                            ? 'bg-[#784621] text-white border-[#784621]' 
                            : 'bg-white text-[#7e6b5d] border-[#e2d5c6] hover:border-[#784621]'
                        }`}
                      >
                        {qs}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Comment Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-[#27211d] mb-1">
                    Seu Comentário / Relato do Serviço <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conte como ficou o calçado, o atendimento, a rapidez e a qualidade do conserto..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] bg-white text-xs sm:text-sm text-[#27211d] focus:outline-none focus:border-[#784621] resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-[#8a7260] mt-1 text-right">
                    {comment.length} caracteres informados
                  </p>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-[#d8cbbe] text-xs font-semibold text-[#675445] hover:bg-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publicar Meu Depoimento</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TESTIMONIALS CAROUSEL / SCROLL CONTAINER: ALWAYS EXACTLY 3 COMMENTS ON DESKTOP */}
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className={`flex items-stretch gap-6 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth select-none
                ${testimonials.length > 3 
                  ? 'scrollbar-thin [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-[#ebdcd0]/70 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#784621] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#543016]' 
                  : ''
                }`}
            >
              {testimonials.map((t, i) => {
                const starCount = t.stars || 5;
                const initials = t.name
                  .split(' ')
                  .map(n => n.charAt(0))
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <div 
                    key={t.id || i} 
                    className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e8dfd5] flex flex-col justify-between shrink-0 shadow-xs hover:shadow-md transition-shadow snap-start
                      w-[88vw] sm:w-[calc((100%-24px)/2)] md:w-[calc((100%-48px)/3)] md:min-w-[calc((100%-48px)/3)] md:max-w-[calc((100%-48px)/3)]"
                  >
                    <div>
                      {/* Star Rating Display */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, s) => (
                            <Star 
                              key={s} 
                              className={`w-4 h-4 ${s < starCount ? 'fill-amber-500 text-amber-500' : 'text-[#d8cbbe]'}`} 
                            />
                          ))}
                        </div>
                        {t.date && (
                          <span className="text-[10px] text-[#8a7260] font-medium">
                            {t.date}
                          </span>
                        )}
                      </div>

                      {/* Comment text */}
                      <p className="text-sm text-[#4a392c] italic leading-relaxed mb-6">
                        "{t.comment}"
                      </p>
                    </div>

                    {/* Customer info & Service */}
                    <div className="pt-4 border-t border-[#ebdcd0] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#ebd8c5] text-[#784621] flex items-center justify-center font-bold text-xs shrink-0">
                          {initials}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-sm text-[#27211d] truncate">{t.name}</p>
                          <p className="text-[11px] text-[#7e6b5d] truncate">{t.role}</p>
                        </div>
                      </div>

                      <span className="inline-block shrink-0 text-[10px] font-semibold text-[#784621] bg-[#f2e7db] px-2 py-0.5 rounded border border-[#ebd8c5] max-w-[120px] truncate" title={t.serviceUsed}>
                        {t.serviceUsed}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint & Navigation Footer for > 3 reviews */}
            {testimonials.length > 3 && (
              <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8a7260]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#784621] animate-pulse" />
                  <span>Exibindo 3 avaliações na tela · Role a barra acima ou use as setas para ver todas as <b>{testimonials.length} avaliações</b></span>
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={scrollLeft}
                    className="hover:text-[#784621] cursor-pointer underline decoration-dotted"
                  >
                    ← Anteriores
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={scrollRight}
                    className="hover:text-[#784621] cursor-pointer underline decoration-dotted font-medium"
                  >
                    Próximos →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#784621] uppercase mb-3">
              <span>Tire Suas Dúvidas</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#27211d] tracking-tight">
              Perguntas Frequentes
            </h3>
          </div>

          <div className="space-y-4">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-[#e8dfd5] bg-[#faf7f2] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#27211d] hover:text-[#784621] cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[#8a7260] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#784621]' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#5a483a] leading-relaxed border-t border-[#ebdcd0]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
