export type FootwearType = 
  | 'Sapato Social / Mocassim'
  | 'Tênis (Esportivo / Casual)'
  | 'Bota / Coturno'
  | 'Salto / Calçado Feminino'
  | 'Bolsa / Acessório de Couro'
  | 'Outro';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Solados & Saltos' | 'Estética & Lavagem' | 'Estrutura & Ajustes';
  description: string;
  estimatedPrice: string;
  turnaroundDays: string;
}

export interface QuoteFormData {
  mode: 'cliente' | 'sapateiro';
  customerCode: string;
  customerName: string;
  customerPhone?: string;
  estimatedDelivery?: string;
  totalPrice?: string;
  footwearType: FootwearType;
  customFootwearType?: string;
  selectedServices: string[];
  notes: string;
  neighborhood: string;
  deliveryNeeded: boolean;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  improvementTags: string[];
}

export interface TestimonialItem {
  id?: string;
  name: string;
  role: string;
  comment: string;
  serviceUsed: string;
  stars?: number;
  date?: string;
}

