import React from 'react';
import { MapPin, Clock, Phone, FileText, Lock, Instagram } from 'lucide-react';

interface FooterProps {
  onOpenPrompt: () => void;
  onOpenDeveloperModal: () => void;
  whatsappNumber: string;
  address?: string;
  addressComplement?: string;
  operatingHours?: string;
  mapsUrl?: string;
  instagramUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrompt,
  onOpenDeveloperModal,
  whatsappNumber,
  address,
  addressComplement,
  operatingHours,
  mapsUrl,
  instagramUrl,
}) => {
  return (
    <footer className="bg-[#1e1712] text-[#d6c7b9] pt-16 pb-12 border-t border-[#382b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#382b22]">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <span className="font-brand text-xl font-bold tracking-tight text-[#faf7f2] block">
              Sapataria Liberdade
            </span>
            <p className="text-xs text-[#a89584] leading-relaxed">
              Atelier especializado em conserto, costura artesanal, troca de solados Vibram, restauração de cor e revitalização de sapatos, botas e artigos em couro nobre.
            </p>
            <div className="pt-2 space-y-2">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#faf7f2] hover:text-[#dfb892] bg-[#27211d] hover:bg-[#342921] px-3 py-1.5 rounded-lg border border-[#3e3025] hover:border-[#dfb892]/50 transition-colors group cursor-pointer"
                  title="Acesse nosso Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#E1306C] group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Siga no Instagram</span>
                  <span className="text-[10px] text-[#a89584] group-hover:text-[#dfb892]">↗</span>
                </a>
              )}
              <div>
                <button
                  onClick={onOpenPrompt}
                  className="inline-flex items-center gap-1.5 text-xs text-[#dfb892] hover:text-[#faf7f2] underline decoration-dotted cursor-pointer transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver o Prompt deste Site</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#faf7f2]">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#orcamento" className="hover:text-[#faf7f2] transition-colors">Solicitar Orçamento</a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-[#faf7f2] transition-colors">Como Funciona</a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-[#faf7f2] transition-colors">Antes e Depois</a>
              </li>
              <li>
                <a href="#duvidas" className="hover:text-[#faf7f2] transition-colors">Perguntas Frequentes</a>
              </li>
            </ul>
          </div>

          {/* Operating hours & atelier address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#faf7f2]">Localização & Atendimento</h4>
            <div className="text-xs text-[#a89584] space-y-2.5">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#dfb892] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#faf7f2] font-medium leading-snug">
                    {operatingHours || 'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00'}
                  </p>
                  <p className="text-[11px] text-[#8a7260] mt-0.5">Domingo e Feriados: Fechado</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-[#382b22]/50">
                <MapPin className="w-4 h-4 text-[#dfb892] shrink-0 mt-0.5" />
                <div>
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#faf7f2] hover:text-[#dfb892] font-medium transition-colors block group underline decoration-dotted"
                      title="Abrir no Google Maps"
                    >
                      <span>{address || 'Rua da Liberdade, 250 - Bairro Liberdade, São Paulo - SP'}</span>
                    </a>
                  ) : (
                    <span className="text-[#faf7f2] font-medium block">
                      {address || 'Rua da Liberdade, 250 - Bairro Liberdade, São Paulo - SP'}
                    </span>
                  )}
                  {addressComplement && (
                    <p className="text-[11px] text-[#8a7260] mt-0.5">{addressComplement}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Developer Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#faf7f2]">Atendimento & Redes</h4>
            <div className="text-xs text-[#a89584] space-y-2.5">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                <span className="font-mono text-[#faf7f2]">{whatsappNumber}</span>
              </div>

              {instagramUrl && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#faf7f2] hover:text-[#dfb892] transition-colors font-medium flex items-center gap-1 group"
                    title="Acessar Instagram da Sapataria Liberdade"
                  >
                    <span>
                      {instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '@').replace(/\/$/, '') || 'Instagram Oficial'}
                    </span>
                    <span className="text-[10px] text-[#a89584] group-hover:text-[#faf7f2]">↗</span>
                  </a>
                </div>
              )}

              <p className="text-[11px]">
                Orçamentos tabelados com preços fixos definidos pela administração.
              </p>
              <div className="pt-3 border-t border-[#382b22]/80">
                <button
                  onClick={onOpenDeveloperModal}
                  className="inline-flex items-center gap-1.5 text-xs text-[#dfb892] hover:text-[#faf7f2] transition-colors cursor-pointer text-left font-medium"
                >
                  <Lock className="w-3.5 h-3.5 shrink-0 text-[#dfb892]" />
                  <span>Área do Desenvolvedor (CPF e Senha)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Quiet copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a7260]">
          <p>© {new Date().getFullYear()} Sapataria Liberdade. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#dfb892] flex items-center gap-1 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>Instagram</span>
              </a>
            )}
            <span className="hidden sm:inline text-[#4a3a2e]">•</span>
            <span>Cuidado artesanal para calçados de valor</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
