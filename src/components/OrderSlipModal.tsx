import React from 'react';
import { X, Printer, Check, Tag, Phone, Calendar, DollarSign } from 'lucide-react';
import { FootwearType } from '../types';

interface OrderSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    customerCode: string;
    customerName: string;
    customerPhone: string;
    footwearType: FootwearType | string;
    selectedServices: string[];
    notes: string;
    neighborhood: string;
    needsDelivery: boolean;
    estimatedDelivery: string;
    totalPrice: string;
    shopPhone: string;
    shopAddress?: string;
  };
}

export const OrderSlipModal: React.FC<OrderSlipModalProps> = ({
  isOpen,
  onClose,
  orderData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#e8dfd5] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebdcd0] mb-4">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#784621]" />
            <h3 className="font-bold text-base text-[#27211d]">Comprovante da Ordem de Serviço</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8a7260] hover:text-[#27211d] hover:bg-[#faf7f2] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket */}
        <div id="printable-order-slip" className="p-5 rounded-xl border-2 border-dashed border-[#bfa286] bg-[#fdfbf7] space-y-4 text-xs text-[#3d2e22]">
          
          {/* Header */}
          <div className="text-center border-b border-[#ebdcd0] pb-3">
            <h4 className="font-brand text-lg font-bold text-[#543016] uppercase tracking-wider">
              Sapataria Liberdade
            </h4>
            <p className="text-[11px] text-[#7e6b5d]">{orderData.shopAddress || 'Atelier de Restauração & Conserto de Calçados'}</p>
            <p className="text-[10px] text-[#8a7260]">WhatsApp Oficina: {orderData.shopPhone}</p>
          </div>

          {/* OS & Client info */}
          <div className="flex items-center justify-between bg-[#f5ede3] p-2.5 rounded-lg border border-[#e2d5c6]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#784621] block">Nº da Ordem de Serviço</span>
              <span className="font-mono text-base font-bold text-[#3d200e]">{orderData.customerCode}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-[#7e6b5d] block">Data de Entrada</span>
              <span className="font-semibold text-xs text-[#27211d]">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-1 py-1">
            <p><span className="font-bold text-[#543016]">Cliente:</span> {orderData.customerName || 'Não informado'}</p>
            {orderData.customerPhone && (
              <p><span className="font-bold text-[#543016]">Telefone/WhatsApp:</span> {orderData.customerPhone}</p>
            )}
            <p><span className="font-bold text-[#543016]">Calçado:</span> {orderData.footwearType}</p>
            {orderData.neighborhood && (
              <p><span className="font-bold text-[#543016]">Localidade:</span> {orderData.neighborhood} {orderData.needsDelivery ? '(Leva e Traz)' : '(Balcão)'}</p>
            )}
          </div>

          {/* Services */}
          <div className="border-t border-[#ebdcd0] pt-2">
            <p className="font-bold text-[#543016] mb-1">Serviços Contratados:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[#4a392c]">
              {orderData.selectedServices.map((s, idx) => (
                <li key={idx} className="font-medium">{s}</li>
              ))}
            </ul>
          </div>

          {/* Notes */}
          {orderData.notes && (
            <div className="border-t border-[#ebdcd0] pt-2">
              <p className="font-bold text-[#543016]">Diagnóstico / Observações:</p>
              <p className="text-[11px] text-[#5a483a] italic mt-0.5">{orderData.notes}</p>
            </div>
          )}

          {/* Terms & totals */}
          <div className="border-t border-[#ebdcd0] pt-3 flex items-center justify-between bg-[#fbf5ed] p-2.5 rounded-lg">
            <div>
              <span className="text-[10px] uppercase text-[#7e6b5d] block">Previsão de Entrega</span>
              <span className="font-bold text-xs text-[#27211d]">{orderData.estimatedDelivery || 'A combinar'}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-[#7e6b5d] block">Valor Total</span>
              <span className="font-bold text-sm text-[#784621]">{orderData.totalPrice || 'A combinar'}</span>
            </div>
          </div>

          {/* Tear-off slip for shoe last/box */}
          <div className="pt-2 border-t border-dashed border-[#bfa286] text-center text-[10px] text-[#8a7260]">
            ✂️ <span>Canhoto de identificação do sapato: <b>{orderData.customerCode}</b> · {orderData.customerName}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#675445] hover:bg-[#faf7f2] cursor-pointer"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-[#784621] hover:bg-[#5f3618] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
