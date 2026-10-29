import React from 'react';
import { MousePointerClick, Send, Camera, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: MousePointerClick,
      title: 'Selecione o calçado e serviços',
      description: 'Marque o tipo de calçado (social, tênis, bota, etc.), selecione as restaurações necessárias e relate os detalhes na caixa de observações.',
    },
    {
      number: '02',
      icon: Send,
      title: 'Revise e clique em enviar',
      description: 'O sistema organiza tudo em uma mensagem clara e padronizada pronta para o atendimento da nossa equipe de sapateiros.',
    },
    {
      number: '03',
      icon: Camera,
      title: 'Envie as fotos no WhatsApp',
      description: 'Ao abrir a conversa no WhatsApp, anexe fotos do estado do couro e da sola para confirmarmos o valor exato e prazo de entrega.',
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white border-b border-[#e8dfd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#784621] uppercase mb-3">
            <span>Processo Simples & Transparente</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#27211d] tracking-tight">
            Como funciona o seu pedido de orçamento
          </h2>
          <p className="mt-4 text-base text-[#675445] leading-relaxed">
            Sem burocracia, sem formulários longos. Em menos de 2 minutos você seleciona o que seu calçado precisa e conversa diretamente com quem vai restaurá-lo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="relative p-8 rounded-2xl bg-[#faf7f2] border border-[#e8dfd5] transition-all hover:border-[#cbb59f] hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-brand text-2xl font-bold text-[#b58863]">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#ede3d5] text-[#784621] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#27211d] mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#5a483a] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#ebdcd0] flex items-center gap-2 text-xs text-[#784621] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Passo {idx + 1} de 3</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Counter support note */}
        <div className="mt-12 p-5 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#784621]/10 text-[#784621] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#27211d]">
                Dificuldade para preencher pelo celular ou prefere vir à oficina?
              </p>
              <p className="text-xs text-[#675445] mt-0.5">
                Não se preocupe! O próprio sapateiro faz o cadastro no balcão e envia a Ordem de Serviço completa direto para o seu WhatsApp.
              </p>
            </div>
          </div>

          <a
            href="#orcamento"
            className="px-4 py-2.5 rounded-xl bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            Ver Modo Sapateiro
          </a>
        </div>
      </div>
    </section>
  );
};
