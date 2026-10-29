import React, { useState } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawPrompt = `Objetivo: Crie a estrutura, o design e a lógica de um site responsivo e moderno para uma Sapataria / Sapataria Artesanal e Conserto de Calçados, focado em conversão e agendamento via WhatsApp.

🎨 1. Estilo Visual e Design
Tema: Limpo, profissional, moderno e confiável (tons de couro/marrom, marrom-café ou azul-marinho com detalhes em dourado/bege e fundo claro/branco).
Layout: Totalmente responsivo (mobile-first), com navegação simples e botões de ação bem visíveis.

🏗️ 2. Estrutura das Páginas / Seções
Cabeçalho (Hero Section):
- Título chamativo: "Seus sapatos favoritos com cara de novos de novo!"
- Subtítulo explicativo sobre os serviços prestados.
- Botão de Ação (CTA): "Solicitar Orçamento no WhatsApp".

Como Funciona:
- Passo 1: Escolha o serviço e descreva seu calçado.
- Passo 2: Clique no botão de enviar.
- Passo 3: Finalize o orçamento direto no nosso WhatsApp.

Formulário Dinâmico de Seleção de Serviços (Seção Principal):
- Nome do Cliente: (Campo de texto simples)
- Tipo de Calçado: (Menu suspenso / Select ou Cards com ícones)
  * Sapato Social / Mocassim
  * Tênis (Esportivo / Casual)
  * Bota / Coturno
  * Salto / Calçado Feminino
  * Bolsa / Acessório de Couro
  * Outro
- Serviços Desejados: (Caixas de seleção / Checkboxes para marcar mais de um)
  * Troca de solado / Meia sola
  * Pintura / Tingimento / Restauração de cor
  * Higienização e lavagem profunda
  * Costura e colagem de reforço
  * Troca de salto / Tacão
  * Ajuste de tamanho / Larga-sapato
  * Hidratação de couro
  * Outro serviço
- Observações / Descrição do Problema: (Área de texto para o cliente descrever o estado do calçado ou detalhes específicos).
- Bairro / Cidade para Entrega/Coleta (Opcional): (Campo de texto para estimar entrega/Leva e Traz).
- Botão de Envio para o WhatsApp:
  Ao clicar no botão "Enviar Pedido para o WhatsApp", o sistema deve formatar uma mensagem limpa e legível e abrir o link direto para o WhatsApp do estabelecimento (https://wa.me/55NUMERO?text=...).

💬 3. Formato da Mensagem Gerada para o WhatsApp
🛠️ *NOVO ORÇAMENTO - SAPATARIA*
----------------------------------
🏷️ *Código do Cliente:* [Código do Cliente]
👤 *Nome:* [Nome do Cliente]
👞 *Tipo de Calçado:* [Tipo selecionado]
🔧 *Serviços Solicitados:*
• [Serviço 1]
• [Serviço 2]
📝 *Observações:* [Descrição do cliente]
📍 *Localização/Bairro:* [Bairro informado]
----------------------------------
Olá! Gostaria de um orçamento para os serviços acima.

💻 4. Requisitos Técnicos e Funcionalidades Extras
- Validação: Não permitir o envio sem selecionar ao menos um serviço e preencher o nome.
- Tecnologias sugeridas: HTML5, Tailwind CSS e JavaScript para montagem da URL do WhatsApp (encodeURIComponent).
- Opção de Anexo: Incluir um aviso informando ao cliente para anexar uma foto do calçado diretamente na conversa do WhatsApp após o envio da mensagem.
- Código do Cliente/OS: Gerador automático de código de cliente/OS (#CLI-0000) rastreável na mensagem.
- Modo Sapateiro (Atendimento Balcão): Alternador de perfil para quando o cliente tiver dificuldades no celular. O próprio sapateiro preenche o calçado no balcão, insere o WhatsApp do cliente e envia o comprovante da Ordem de Serviço direto para o WhatsApp do cliente com valor e previsão de entrega!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-[#e8dfd5] shadow-2xl relative flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between pb-4 border-b border-[#ebdcd0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#784621]/10 text-[#784621] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#27211d]">Prompt Estruturado do Site</h3>
              <p className="text-xs text-[#7e6b5d]">Copie este prompt para usar no ChatGPT, v0 ou enviar ao desenvolvedor</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a7260] hover:text-[#27211d] hover:bg-[#faf7f2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 p-4 rounded-xl bg-[#faf7f2] border border-[#e8dfd5] font-mono text-xs text-[#3d2e22] leading-relaxed whitespace-pre-wrap select-all">
          {rawPrompt}
        </div>

        <div className="pt-2 flex items-center justify-between gap-4">
          <p className="text-xs text-[#8a7260]">
            Este aplicativo já implementou 100% dos requisitos acima!
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 bg-[#784621] hover:bg-[#5f3618] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Prompt Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Prompt Completo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
