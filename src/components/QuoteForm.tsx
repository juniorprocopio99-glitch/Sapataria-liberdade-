import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  FOOTWEAR_OPTIONS, 
  SERVICES_LIST 
} from '../data/sapatariaData';
import { FootwearType, ServiceItem } from '../types';
import { OrderSlipModal } from './OrderSlipModal';
import { 
  Send, 
  Check, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  Sparkles, 
  RotateCcw, 
  HelpCircle,
  Phone,
  Settings,
  Truck,
  Tag,
  Hammer,
  User,
  Smartphone,
  Calendar,
  DollarSign,
  Printer,
  Receipt,
  Edit2,
  MapPin
} from 'lucide-react';

interface QuoteFormProps {
  whatsappNumber: string;
  services: ServiceItem[];
  shopAddress?: string;
}

const generateCustomerCode = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CLI-${num}`;
};

export const QuoteForm: React.FC<QuoteFormProps> = ({ 
  whatsappNumber, 
  services,
  shopAddress 
}) => {
  const [activeMode, setActiveMode] = useState<'cliente' | 'sapateiro'>('cliente');
  const [customerCode, setCustomerCode] = useState(generateCustomerCode);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('3 dias úteis');
  const [totalPrice, setTotalPrice] = useState('R$ 130,00');
  const [footwearType, setFootwearType] = useState<FootwearType>('Sapato Social / Mocassim');
  const [customFootwear, setCustomFootwear] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Troca de solado / Meia sola'
  ]);
  const [notes, setNotes] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [needsDelivery, setNeedsDelivery] = useState(false);

  // Validation errors
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Generate formatted WhatsApp message depending on active mode
  const getSelectedFootwearLabel = () => {
    if (footwearType === 'Outro' && customFootwear.trim()) {
      return `Outro (${customFootwear.trim()})`;
    }
    return footwearType;
  };

  // Helper to extract numerical price from formatted price strings (e.g. "R$ 85,00", "A partir de R$ 85,00")
  const parsePriceValue = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const match = priceStr.match(/(\d+[\d.,]*)/);
    if (!match) return 0;
    let s = match[1];
    if (s.includes(',') && s.includes('.')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (s.includes(',')) {
      s = s.replace(',', '.');
    }
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
  };

  // Matched ServiceItem objects for selected services
  const selectedServiceObjects = services.filter(s => selectedServices.includes(s.name));

  // Compute total price automatically for the client based on fixed service prices
  const calculatedClientTotalNumber = selectedServiceObjects.reduce(
    (acc, s) => acc + parsePriceValue(s.estimatedPrice),
    0
  );

  const formattedClientTotal = calculatedClientTotalNumber > 0
    ? calculatedClientTotalNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,00';

  const generateWhatsAppMessage = () => {
    const formattedServicesWithPrices = selectedServices.length > 0 
      ? selectedServices.map(name => {
          const item = services.find(s => s.name === name);
          return item ? `• ${name} (${item.estimatedPrice})` : `• ${name}`;
        }).join('\n')
      : '• [Nenhum serviço selecionado ainda]';

    const cleanNotes = notes.trim() ? notes.trim() : 'Nenhuma observação informada';
    const cleanLocation = neighborhood.trim() 
      ? `${neighborhood.trim()}${needsDelivery ? ' (Desejo Leva e Traz)' : ''}`
      : 'Não informado (Balcão)';

    const cleanCode = customerCode.trim() || 'CLI-0000';

    if (activeMode === 'sapateiro') {
      return `👞 *ORDEM DE SERVIÇO & CADASTRO - SAPATARIA LIBERDADE*
----------------------------------
Olá, *${customerName.trim() || '[Nome do Cliente]'}*! Seu calçado foi registrado com sucesso em nossa oficina.

🏷️ *Código da OS:* ${cleanCode}
👞 *Calçado:* ${getSelectedFootwearLabel()}
🔧 *Serviços a Realizar:*
${formattedServicesWithPrices}
📅 *Previsão de Entrega:* ${estimatedDelivery.trim() || 'A combinar'}
💰 *Valor do Serviço:* ${totalPrice.trim() || formattedClientTotal || 'A combinar'}
📝 *Diagnóstico / Detalhes:* ${cleanNotes}
📍 *Modalidade:* ${needsDelivery ? `Leva e Traz (${neighborhood.trim() || 'Endereço informado'})` : 'Retirada no Balcão da Oficina'}
----------------------------------
Qualquer dúvida ou para acompanhar o reparo, basta responder a esta mensagem. Agradecemos a sua preferência!`;
    }

    return `🛠️ *NOVO PEDIDO & ORÇAMENTO - SAPATARIA LIBERDADE*
----------------------------------
🏷️ *Código do Cliente:* ${cleanCode}
👤 *Cliente:* ${customerName.trim() || '[Nome do Cliente]'}
👞 *Tipo de Calçado:* ${getSelectedFootwearLabel()}
🔧 *Serviços Solicitados (Preços Fixos):*
${formattedServicesWithPrices}

💰 *VALOR TOTAL DO PEDIDO:* ${formattedClientTotal}
💳 *Forma de Pagamento:* Pix (por favor me envie a sua chave Pix para pagamento)
📝 *Observações:* ${cleanNotes}
📍 *Localização/Bairro:* ${cleanLocation}
----------------------------------
Olá mestre sapateiro! Já selecionei os serviços tabelados com valor total de *${formattedClientTotal}*. Pode me enviar a sua chave Pix para eu efetuar o pagamento e combinarmos a entrega?`;
  };

  const handleToggleService = (serviceName: string) => {
    setSelectedServices(prev => {
      const exists = prev.includes(serviceName);
      let updated: string[];
      if (exists) {
        updated = prev.filter(s => s !== serviceName);
      } else {
        updated = [...prev, serviceName];
      }
      if (updated.length > 0) setServiceError(false);
      return updated;
    });
  };

  const handleSelectAllServices = () => {
    setSelectedServices(services.map(s => s.name));
    setServiceError(false);
  };

  const handleClearServices = () => {
    setSelectedServices([]);
  };

  const handleApplyPreset = (preset: 'social' | 'tenis' | 'bota' | 'balcao') => {
    if (preset === 'social') {
      setActiveMode('cliente');
      setCustomerCode('CLI-3942');
      setCustomerName('Dr. Roberto Maia');
      setFootwearType('Sapato Social / Mocassim');
      setSelectedServices(['Troca de solado / Meia sola', 'Hidratação de couro']);
      setNotes('Sapato social Oxford em couro marrom escuro com solado de couro gasto no bico. Preciso de meia sola antiderrapante.');
      setNeighborhood('Jardins, São Paulo');
      setNeedsDelivery(true);
    } else if (preset === 'tenis') {
      setActiveMode('cliente');
      setCustomerCode('CLI-8120');
      setCustomerName('Camila Andrade');
      setFootwearType('Tênis (Esportivo / Casual)');
      setSelectedServices(['Higienização e lavagem profunda', 'Pintura / Tingimento / Restauração de cor']);
      setNotes('Sneaker casual branco com solado amarelado e detalhe em camurça acinzentada precisando de restauração.');
      setNeighborhood('Moema, São Paulo');
      setNeedsDelivery(false);
    } else if (preset === 'bota') {
      setActiveMode('cliente');
      setCustomerCode('CLI-5573');
      setCustomerName('Guilherme Siqueira');
      setFootwearType('Bota / Coturno');
      setSelectedServices(['Costura e colagem de reforço', 'Hidratação de couro', 'Troca de salto / Tacão']);
      setNotes('Bota Chelsea em couro legítimo com tacão de borracha comido e pequeno descolamento na lateral esquerda.');
      setNeighborhood('Pinheiros, São Paulo');
      setNeedsDelivery(true);
    } else if (preset === 'balcao') {
      setActiveMode('sapateiro');
      setCustomerCode('CLI-7392');
      setCustomerName('Marcos Vinicius');
      setCustomerPhone('(11) 98123-4567');
      setFootwearType('Bota / Coturno');
      setSelectedServices(['Troca de solado / Meia sola', 'Costura e colagem de reforço']);
      setNotes('Ressolação com borracha Vibram tratorada e costura de reforço no cano.');
      setNeighborhood('Vila Mariana, São Paulo');
      setNeedsDelivery(false);
      setEstimatedDelivery('Sexta-feira, 16h');
      setTotalPrice('R$ 145,00');
    }
    setNameError(false);
    setPhoneError(false);
    setServiceError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!customerName.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (selectedServices.length === 0) {
      setServiceError(true);
      hasError = true;
    } else {
      setServiceError(false);
    }

    if (activeMode === 'sapateiro') {
      const cleanPhone = customerPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        setPhoneError(true);
        hasError = true;
      } else {
        setPhoneError(false);
      }
    }

    if (hasError) {
      const formEl = document.getElementById('orcamento');
      formEl?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Trigger celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // silent fallback
    }

    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);

    let targetPhone = whatsappNumber.replace(/\D/g, '');
    if (activeMode === 'sapateiro') {
      let cust = customerPhone.replace(/\D/g, '');
      if (cust.startsWith('55') && cust.length >= 12) {
        targetPhone = cust;
      } else {
        targetPhone = `55${cust}`;
      }
    }

    const waUrl = `https://wa.me/${targetPhone}?text=${encoded}`;

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = async () => {
    const text = generateWhatsAppMessage();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="orcamento" className="py-20 bg-[#faf7f2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mode Selector Tabs */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="p-1.5 bg-[#ede1d4] rounded-2xl flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => {
                setActiveMode('cliente');
                setPhoneError(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeMode === 'cliente'
                  ? 'bg-white text-[#784621] shadow-xs'
                  : 'text-[#6e5a4a] hover:text-[#27211d]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>👤 Sou o Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('sapateiro');
                setPhoneError(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeMode === 'sapateiro'
                  ? 'bg-[#784621] text-white shadow-xs'
                  : 'text-[#6e5a4a] hover:text-[#27211d]'
              }`}
            >
              <Hammer className="w-4 h-4 shrink-0" />
              <span>🔨 Modo Sapateiro (Balcão)</span>
            </button>
          </div>

          <div className="mt-3 text-center">
            {activeMode === 'cliente' ? (
              <p className="text-xs text-[#6e5a4a]">
                💡 <b>Modo Cliente:</b> Escolha os serviços e envie o orçamento diretamente para o WhatsApp da nossa oficina.
              </p>
            ) : (
              <p className="text-xs text-[#784621] font-medium bg-[#f5ede3] py-2 px-4 rounded-xl border border-[#ded0c1] inline-block">
                🛠️ <b>Atendimento Balcão:</b> Caso o cliente não consiga preencher, cadastre os dados aqui e envie o comprovante da Ordem de Serviço direto para o WhatsApp dele!
              </p>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#784621] uppercase mb-2">
            <span>{activeMode === 'cliente' ? 'Orçamento Rápido & Sem Compromisso' : 'Terminal da Oficina / Balcão'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#27211d] tracking-tight">
            {activeMode === 'cliente' 
              ? 'Monte seu Pedido e Envie no WhatsApp' 
              : 'Cadastro de Calçado & Envio para o Cliente'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#675445] leading-relaxed">
            {activeMode === 'cliente'
              ? 'Selecione o tipo do calçado, os serviços desejados e envie direto para o sapateiro no WhatsApp para receber valores e prazos exatos.'
              : 'Preencha o diagnóstico e serviços acordados com o cliente no balcão e envie o comprovante da OS para o WhatsApp dele em um clique.'}
          </p>

          {/* Quick test presets */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-[#8a7260]">Testar exemplos:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('social')}
              className="text-xs bg-white hover:bg-[#efe6dc] text-[#543b27] border border-[#d8c9bc] px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            >
              👞 Sapato Social (Cliente)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('tenis')}
              className="text-xs bg-white hover:bg-[#efe6dc] text-[#543b27] border border-[#d8c9bc] px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            >
              👟 Sneakers (Cliente)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('bota')}
              className="text-xs bg-white hover:bg-[#efe6dc] text-[#543b27] border border-[#d8c9bc] px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            >
              🥾 Bota (Cliente)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('balcao')}
              className="text-xs bg-[#784621] hover:bg-[#5f3618] text-white px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shadow-xs"
            >
              🔨 Balcão (Sapateiro → Cliente)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Form (Left / Col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#e8dfd5] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* 1. Identificação do Cliente & Código */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#f0e7dc]">
                  <label htmlFor="customer-name" className="text-sm font-semibold text-[#27211d]">
                    1. Identificação do Cliente <span className="text-rose-600">*</span>
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8a7260]">Código gerado:</span>
                    <div className="inline-flex items-center gap-1.5 bg-[#f5ede3] border border-[#ded0c1] px-2.5 py-1 rounded-lg">
                      <Tag className="w-3.5 h-3.5 text-[#784621]" />
                      <span className="font-mono text-xs font-bold text-[#543016]">{customerCode}</span>
                      <button
                        type="button"
                        onClick={() => setCustomerCode(generateCustomerCode())}
                        title="Gerar novo código"
                        className="text-[#8a7260] hover:text-[#784621] p-0.5 rounded cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                  <div className="sm:col-span-8">
                    <label htmlFor="customer-name" className="block text-xs font-medium text-[#6e5a4a] mb-1">
                      Nome do Cliente <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="customer-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (e.target.value.trim()) setNameError(false);
                        }}
                        placeholder="Ex: João da Silva"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#784621]/20 ${
                          nameError 
                            ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500' 
                            : 'border-[#d8cbbe] bg-[#faf7f2]/40 text-[#27211d] focus:border-[#784621]'
                        }`}
                      />
                      {nameError && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Por favor, informe o nome do cliente.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="customer-code" className="block text-xs font-medium text-[#6e5a4a] mb-1">
                      Código do Cliente / OS
                    </label>
                    <input
                      id="customer-code"
                      type="text"
                      value={customerCode}
                      onChange={(e) => setCustomerCode(e.target.value.toUpperCase())}
                      placeholder="CLI-0000"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#d8cbbe] bg-[#faf7f2]/40 text-sm font-mono uppercase text-[#27211d] focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20"
                    />
                    <p className="text-[10px] text-[#8a7260] mt-1">Identificador único</p>
                  </div>
                </div>

                {/* Additional fields in Sapateiro Mode */}
                {activeMode === 'sapateiro' && (
                  <div className="pt-2 space-y-3">
                    <div>
                      <label htmlFor="customer-phone" className="block text-xs font-semibold text-[#27211d] mb-1">
                        WhatsApp do Cliente (para envio da OS) <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Smartphone className="w-4 h-4 text-[#25D366]" />
                        </div>
                        <input
                          id="customer-phone"
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => {
                            setCustomerPhone(e.target.value);
                            if (e.target.value.replace(/\D/g, '').length >= 10) setPhoneError(false);
                          }}
                          placeholder="Ex: (11) 98765-4321 ou DDD + 9 dígitos"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#784621]/20 ${
                            phoneError
                              ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                              : 'border-[#d8cbbe] bg-[#faf7f2]/40 text-[#27211d] focus:border-[#784621]'
                          }`}
                        />
                      </div>
                      {phoneError && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Informe um número de WhatsApp válido do cliente (DDD + 9 dígitos) para enviar a OS.</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#faf7f2] border border-[#e8dfd5]">
                      <div>
                        <label htmlFor="estimated-delivery" className="block text-xs font-semibold text-[#27211d] mb-1">
                          Previsão de Entrega / Retirada
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8a7260]">
                            <Calendar className="w-4 h-4 text-[#784621]" />
                          </div>
                          <input
                            id="estimated-delivery"
                            type="text"
                            value={estimatedDelivery}
                            onChange={(e) => setEstimatedDelivery(e.target.value)}
                            placeholder="Ex: Sexta-feira às 16h (3 dias)"
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#d8cbbe] bg-white text-xs focus:outline-none focus:border-[#784621]"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="total-price" className="block text-xs font-semibold text-[#27211d] mb-1">
                          Valor Acordado / Total (R$)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8a7260]">
                            <DollarSign className="w-4 h-4 text-[#784621]" />
                          </div>
                          <input
                            id="total-price"
                            type="text"
                            value={totalPrice}
                            onChange={(e) => setTotalPrice(e.target.value)}
                            placeholder="Ex: R$ 130,00"
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#d8cbbe] bg-white text-xs font-semibold focus:outline-none focus:border-[#784621]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Tipo de Calçado */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[#27211d]">
                    2. Tipo de Calçado / Item <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-xs text-[#8a7260]">Selecione uma opção</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOOTWEAR_OPTIONS.map((item) => {
                    const isSelected = footwearType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFootwearType(item.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-[#784621] bg-[#fbf6f0] ring-1 ring-[#784621]'
                            : 'border-[#e4d8cc] bg-white hover:border-[#cbbaa8] hover:bg-[#faf7f2]/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected 
                            ? 'border-[#784621] bg-[#784621] text-white' 
                            : 'border-[#cbbaa8] bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isSelected ? 'text-[#543016]' : 'text-[#27211d]'}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-[#7e6b5d] mt-0.5 leading-snug">
                            {item.hint}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {footwearType === 'Outro' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customFootwear}
                      onChange={(e) => setCustomFootwear(e.target.value)}
                      placeholder="Especifique qual calçado ou acessório (ex: Carteira, Jaqueta, Cinto)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d8cbbe] bg-[#faf7f2]/40 text-sm focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20"
                    />
                  </div>
                )}
              </div>

              {/* 3. Serviços Desejados (Checkboxes) */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <label className="block text-sm font-semibold text-[#27211d]">
                      3. Serviços Desejados <span className="text-rose-600">*</span>
                    </label>
                    <p className="text-xs text-[#7e6b5d]">
                      Marque um ou mais serviços que seu calçado precisa
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#784621] bg-[#faf3ea] px-2.5 py-1 rounded-lg border border-[#ebd8c5]">
                      Tabela de Preços Fixos
                    </span>
                    <span className="text-[#cbbaa8]">·</span>
                    <button
                      type="button"
                      onClick={handleSelectAllServices}
                      className="text-xs text-[#784621] hover:underline font-medium cursor-pointer"
                    >
                      Todos
                    </button>
                    <span className="text-[#cbbaa8]">·</span>
                    <button
                      type="button"
                      onClick={handleClearServices}
                      className="text-xs text-[#8a7260] hover:underline font-medium cursor-pointer"
                    >
                      Limpar
                    </button>
                  </div>
                </div>

                {serviceError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 mb-3 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Selecione ao menos um serviço para gerar seu orçamento.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => {
                    const isChecked = selectedServices.includes(service.name);
                    return (
                      <div
                        key={service.id}
                        onClick={() => handleToggleService(service.name)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                          isChecked
                            ? 'border-[#784621] bg-[#fbf6f0] ring-1 ring-[#784621]/40'
                            : 'border-[#e4d8cc] bg-white hover:border-[#cbbaa8] hover:bg-[#faf7f2]/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'border-[#784621] bg-[#784621] text-white'
                            : 'border-[#cbbaa8] bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isChecked ? 'text-[#4e2d14] font-semibold' : 'text-[#27211d]'}`}>
                            {service.name}
                          </p>
                          <p className="text-xs text-[#7e6b5d] mt-0.5 leading-snug line-clamp-2">
                            {service.description}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#8a7260]">
                            <span className="font-semibold text-[#784621]">{service.estimatedPrice}</span>
                            <span>·</span>
                            <span>{service.turnaroundDays}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* RESUMO DE VALOR TOTAL & PAGAMENTO VIA PIX */}
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#faf3ea] via-[#f7ede1] to-[#f4e4d4] border-2 border-[#dfb892] shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#784621] bg-[#edd9c5] px-2.5 py-0.5 rounded-full">
                          Tabela Oficial de Preços Fixos
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cálculo Automático</span>
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#27211d]">
                        Resumo do Pedido & Valor Total
                      </h4>
                      <p className="text-xs text-[#6e5a4a] leading-relaxed">
                        Como todos os serviços têm preço fixo, o total já vai pronto no WhatsApp para o sapateiro lhe passar a chave Pix.
                      </p>
                    </div>

                    {/* Destaque do Valor Total */}
                    <div className="bg-white/90 p-3 sm:px-4 sm:py-3 rounded-xl border border-[#d8c2ad] shadow-xs sm:text-right shrink-0">
                      <span className="text-[11px] font-semibold text-[#8a7260] uppercase tracking-wider block">
                        Valor Total a Pagar:
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#784621] font-mono tracking-tight block">
                        {formattedClientTotal}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 sm:justify-end mt-0.5">
                        <span>⚡ Pronto para transferência Pix</span>
                      </span>
                    </div>
                  </div>

                  {/* Detalhamento dos serviços selecionados */}
                  {selectedServiceObjects.length > 0 && (
                    <div className="pt-3 border-t border-[#dfb892]/60 space-y-1.5">
                      <span className="text-[11px] font-bold text-[#784621] uppercase tracking-wider block">
                        Serviços Somados ({selectedServiceObjects.length}):
                      </span>
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {selectedServiceObjects.map((s) => (
                          <div key={s.id} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/70 text-[#27211d]">
                            <span className="truncate pr-2 font-medium">{s.name}</span>
                            <span className="font-bold text-[#784621] shrink-0 font-mono">{s.estimatedPrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Banner de Aviso do Pix */}
                  <div className="p-3 rounded-xl bg-white/90 border border-emerald-200 text-xs flex items-center gap-2.5 text-[#1e5233]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      PIX
                    </div>
                    <div className="text-[11px] leading-snug">
                      <b>Prático e sem surpresas:</b> Ao clicar em <i>"Enviar Pedido para a Sapataria"</i>, a mensagem já incluirá este valor de <b>{formattedClientTotal}</b> e pedirá a chave Pix do mestre sapateiro para você pagar direto pelo WhatsApp.
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Observações / Descrição do Problema */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-[#27211d] mb-1.5">
                  4. Observações ou Detalhes do Calçado (Opcional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: O calcanhar direito está desgastado na parte de trás; o couro está ressecado na dobra dos dedos..."
                  className="w-full px-4 py-3 rounded-xl border border-[#d8cbbe] bg-[#faf7f2]/40 text-sm text-[#27211d] focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20 resize-none leading-relaxed"
                />
              </div>

              {/* 5. Bairro / Cidade para Leva e Traz */}
              <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#e8dfd5]">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="neighborhood" className="block text-sm font-semibold text-[#27211d]">
                    5. Bairro / Cidade (Para Coleta & Entrega)
                  </label>
                  <span className="text-xs text-[#8a7260]">Opcional</span>
                </div>
                
                <input
                  id="neighborhood"
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Pinheiros, São Paulo / SP"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#d8cbbe] bg-white text-sm text-[#27211d] focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20 mb-3"
                />

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#5a483a]">
                  <input
                    type="checkbox"
                    checked={needsDelivery}
                    onChange={(e) => setNeedsDelivery(e.target.checked)}
                    className="w-4 h-4 rounded border-[#cbbaa8] text-[#784621] focus:ring-[#784621]"
                  />
                  <Truck className="w-4 h-4 text-[#784621]" />
                  <span>Desejo solicitar serviço de Leva e Traz em meu endereço</span>
                </label>
                {!needsDelivery && shopAddress && (
                  <div className="mt-2 text-xs text-[#784621] flex items-center gap-2 bg-[#fbf5ed] p-2.5 rounded-lg border border-[#ebd8c5]">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#784621]" />
                    <span><b>Local para entrega no balcão:</b> {shopAddress}</span>
                  </div>
                )}
              </div>

              {/* Notice / Photo Alert tip */}
              <div className="p-4 rounded-xl bg-[#f0f8f3] border border-[#bce3ca] text-[#196b39] flex items-start gap-3">
                <Camera className="w-5 h-5 shrink-0 mt-0.5 text-[#196b39]" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">📸 Dica Importante:</span> Ao abrir o WhatsApp após o envio,{' '}
                  <span className="font-semibold underline">anexe fotos do calçado</span> (solado, laterais e bico). 
                  Isso permite ao sapateiro avaliar a estrutura do couro e emitir o orçamento definitivo na hora.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20be5a] text-white px-6 py-4 rounded-xl font-bold text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-5 h-5 shrink-0" />
                  <span>
                    {activeMode === 'cliente' 
                      ? 'Enviar Pedido para a Sapataria' 
                      : 'Enviar OS para o WhatsApp do Cliente'}
                  </span>
                </button>

                {activeMode === 'sapateiro' && (
                  <button
                    type="button"
                    onClick={() => setIsPrintModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 border border-[#784621] bg-[#faf3ea] hover:bg-[#f3e5d5] text-[#784621] px-5 py-4 rounded-xl font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>Imprimir OS</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center justify-center gap-2 border border-[#d8cbbe] bg-white hover:bg-[#f6eee4] text-[#543b27] px-5 py-4 rounded-xl font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Mensagem Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Live WhatsApp Message Preview (Col-span-5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            {/* Phone destination bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#e8dfd5] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  activeMode === 'cliente' 
                    ? 'bg-[#eef8f1] text-[#25D366]' 
                    : 'bg-[#faf3ea] text-[#784621]'
                }`}>
                  {activeMode === 'cliente' ? <Phone className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                </div>
                <div className="truncate">
                  <p className="font-semibold text-[#27211d]">
                    {activeMode === 'cliente' ? 'WhatsApp da Sapataria (Destino):' : 'WhatsApp do Cliente (Destino):'}
                  </p>
                  <p className="text-[#675445] font-mono tabular-nums">
                    {activeMode === 'cliente' 
                      ? whatsappNumber 
                      : (customerPhone.trim() || 'Aguardando preenchimento...')}
                  </p>
                </div>
              </div>

              <span className="inline-block text-[11px] font-semibold text-[#784621] bg-[#faf3ea] px-2.5 py-1 rounded-lg border border-[#ebd8c5]">
                {activeMode === 'cliente' ? 'Oficina' : 'Balcão'}
              </span>
            </div>

            {/* Live WhatsApp Screen Card */}
            <div className="rounded-2xl border border-[#d7cbbe] bg-[#0b141a] text-white shadow-xl overflow-hidden">
              {/* WhatsApp App Header */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#784621] text-[#faf7f2] flex items-center justify-center font-bold text-xs uppercase">
                    {activeMode === 'cliente' ? 'SL' : (customerName.trim() ? customerName.trim().charAt(0) : 'CL')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#e9edef] leading-tight truncate">
                      {activeMode === 'cliente' ? 'Sapataria Liberdade' : (customerName.trim() || 'Cliente')}
                    </h3>
                    <p className="text-[11px] text-[#8696a0]">
                      {activeMode === 'cliente' ? 'Atendimento & Orçamentos' : 'Ordem de Serviço Direta'}
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-[#25D366] font-semibold bg-[#25D366]/10 px-2 py-0.5 rounded shrink-0">
                  {activeMode === 'cliente' ? 'Sapataria' : 'Cliente'}
                </div>
              </div>

              {/* Chat Canvas */}
              <div 
                className="p-4 min-h-[360px] flex flex-col justify-end bg-[#0b141a]"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              >
                {/* Outgoing Message Bubble */}
                <div className="bg-[#005c4b] text-[#e9edef] rounded-xl rounded-tr-xs p-3.5 max-w-[92%] ml-auto text-xs leading-relaxed shadow-md border border-[#005c4b]/80">
                  <pre className="font-mono whitespace-pre-wrap font-sans text-xs leading-relaxed selection:bg-emerald-700">
                    {generateWhatsAppMessage()}
                  </pre>
                  
                  <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-[#8696a0]">
                    <span>{activeMode === 'cliente' ? 'Mensagem do Cliente' : 'Ordem de Serviço do Sapateiro'}</span>
                    <span className="flex items-center gap-1">
                      {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      <Check className="w-3 h-3 text-[#53bdeb] stroke-[3]" />
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="inline-block bg-[#182229] text-[#8696a0] text-[10px] px-2.5 py-1 rounded-md">
                    ⚡ {activeMode === 'cliente' 
                      ? 'Pré-visualização do envio para a Sapataria' 
                      : 'Pré-visualização do envio para o WhatsApp do Cliente'}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-[#202c33] p-3 border-t border-[#2a3942] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-[#111b21] py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {activeMode === 'cliente' ? 'Enviar para a Sapataria' : 'Enviar OS para o Cliente'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Summary of selected items */}
            <div className="p-4 rounded-xl bg-white border border-[#e8dfd5] text-xs space-y-2">
              <div className="flex justify-between items-center text-[#5a483a]">
                <span>Modo Ativo:</span>
                <span className="font-bold text-[#784621]">
                  {activeMode === 'cliente' ? '👤 Cliente → Sapataria' : '🔨 Sapateiro → Cliente'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#5a483a]">
                <span>Código da OS / Cliente:</span>
                <span className="font-mono font-bold text-[#784621] bg-[#faf3ea] px-2 py-0.5 rounded border border-[#ecd9c7]">
                  {customerCode || 'CLI-0000'}
                </span>
              </div>
              {activeMode === 'sapateiro' && (
                <div className="flex justify-between items-center text-[#5a483a]">
                  <span>WhatsApp do Cliente:</span>
                  <span className="font-mono font-medium text-[#27211d]">
                    {customerPhone || 'Não informado'}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-[#5a483a]">
                <span>Serviços selecionados:</span>
                <span className="font-bold text-[#27211d]">{selectedServices.length}</span>
              </div>
              <div className="flex justify-between items-center text-[#5a483a]">
                <span>Tipo do calçado:</span>
                <span className="font-semibold text-[#27211d] truncate max-w-[200px]">
                  {getSelectedFootwearLabel()}
                </span>
              </div>
              {activeMode === 'cliente' && (
                <>
                  <div className="flex justify-between items-center text-[#5a483a] pt-1 border-t border-[#f0e7dc]">
                    <span>Total dos Serviços:</span>
                    <span className="font-extrabold text-sm text-[#784621] font-mono">{formattedClientTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-800 text-[11px] font-medium">
                    <span>Pagamento:</span>
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      Chave Pix no WhatsApp
                    </span>
                  </div>
                </>
              )}
              {activeMode === 'sapateiro' && (
                <>
                  <div className="flex justify-between items-center text-[#5a483a] pt-1 border-t border-[#f0e7dc]">
                    <span>Previsão de Entrega:</span>
                    <span className="font-semibold text-[#27211d]">{estimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#5a483a]">
                    <span>Valor Acordado:</span>
                    <span className="font-bold text-[#784621]">{totalPrice}</span>
                  </div>
                </>
              )}
              {needsDelivery && (
                <div className="flex justify-between items-center text-emerald-700 font-medium pt-1 border-t border-[#f0e7dc]">
                  <span>Serviço solicitado:</span>
                  <span>Coleta & Entrega (Leva e Traz)</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Printable Order Slip Modal for Shoemaker */}
      <OrderSlipModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        orderData={{
          customerCode,
          customerName,
          customerPhone,
          footwearType: getSelectedFootwearLabel(),
          selectedServices,
          notes,
          neighborhood,
          needsDelivery,
          estimatedDelivery,
          totalPrice: totalPrice.trim() || formattedClientTotal,
          shopPhone: whatsappNumber,
          shopAddress: shopAddress || 'Atelier Sapataria Liberdade',
        }}
      />
    </section>
  );
};
