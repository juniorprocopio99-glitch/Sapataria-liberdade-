/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { QuoteForm } from './components/QuoteForm';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { PromptModal } from './components/PromptModal';
import { DeveloperModal } from './components/DeveloperModal';
import { SERVICES_LIST as DEFAULT_SERVICES, GALLERY_ITEMS as DEFAULT_GALLERY_ITEMS } from './data/sapatariaData';
import { ServiceItem, BeforeAfterItem } from './types';
import { MessageSquare } from 'lucide-react';

const DEFAULT_HERO_IMAGE = '/src/assets/images/hero_shoe_restoration_1793227372164.jpg';
const DEFAULT_ADDRESS = 'Rua da Liberdade, 250 - Bairro Liberdade, São Paulo - SP';
const DEFAULT_ADDRESS_COMPLEMENT = 'Atelier Central & Ponto de Coleta e Entrega';
const DEFAULT_HOURS = 'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00';
const DEFAULT_MAPS_URL = 'https://maps.google.com/?q=Rua+da+Liberdade+250+Sao+Paulo';
const DEFAULT_INSTAGRAM = 'https://instagram.com/sapatarialiberdade';

export default function App() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    return localStorage.getItem('sapataria_whatsapp') || '+55 11 98765-4321';
  });

  const [instagramUrl, setInstagramUrl] = useState<string>(() => {
    return localStorage.getItem('sapataria_instagram') || DEFAULT_INSTAGRAM;
  });

  const [shopAddress, setShopAddress] = useState<string>(() => {
    return localStorage.getItem('sapataria_address') || DEFAULT_ADDRESS;
  });

  const [shopAddressComplement, setShopAddressComplement] = useState<string>(() => {
    return localStorage.getItem('sapataria_address_comp') || DEFAULT_ADDRESS_COMPLEMENT;
  });

  const [operatingHours, setOperatingHours] = useState<string>(() => {
    return localStorage.getItem('sapataria_hours') || DEFAULT_HOURS;
  });

  const [mapsUrl, setMapsUrl] = useState<string>(() => {
    return localStorage.getItem('sapataria_maps_url') || DEFAULT_MAPS_URL;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('sapataria_services');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_SERVICES;
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('sapataria_hero_image') || DEFAULT_HERO_IMAGE;
  });

  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>(() => {
    const saved = localStorage.getItem('sapataria_before_after');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_GALLERY_ITEMS;
  });

  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  const handleSaveNumber = (newNum: string) => {
    setWhatsappNumber(newNum);
    localStorage.setItem('sapataria_whatsapp', newNum);
  };

  const handleSaveServices = (updatedServices: ServiceItem[]) => {
    setServices(updatedServices);
    localStorage.setItem('sapataria_services', JSON.stringify(updatedServices));
  };

  const handleSaveHeroImage = (newImage: string) => {
    setHeroImage(newImage);
    localStorage.setItem('sapataria_hero_image', newImage);
  };

  const handleSaveBeforeAfter = (updatedItems: BeforeAfterItem[]) => {
    setBeforeAfterItems(updatedItems);
    localStorage.setItem('sapataria_before_after', JSON.stringify(updatedItems));
  };

  const handleSaveAddress = (newAddress: string, newComplement: string, newHours: string, newMapsUrl: string) => {
    setShopAddress(newAddress);
    setShopAddressComplement(newComplement);
    setOperatingHours(newHours);
    setMapsUrl(newMapsUrl);
    localStorage.setItem('sapataria_address', newAddress);
    localStorage.setItem('sapataria_address_comp', newComplement);
    localStorage.setItem('sapataria_hours', newHours);
    localStorage.setItem('sapataria_maps_url', newMapsUrl);
  };

  const handleSaveInstagram = (newUrl: string) => {
    let cleanUrl = newUrl.trim();
    if (cleanUrl.startsWith('@')) {
      cleanUrl = `https://instagram.com/${cleanUrl.substring(1)}`;
    } else if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    setInstagramUrl(cleanUrl);
    localStorage.setItem('sapataria_instagram', cleanUrl);
  };

  const scrollToQuote = () => {
    const el = document.getElementById('orcamento');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#27211d]">
      {/* Top Bar with 3-zone contract */}
      <Navbar whatsappNumber={whatsappNumber} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onStartQuote={scrollToQuote} 
          heroImage={heroImage}
        />

        {/* Como Funciona (3 Steps) */}
        <HowItWorks />

        {/* Main Feature: Formulário Dinâmico com Preços Fixos e Envio para WhatsApp */}
        <QuoteForm 
          whatsappNumber={whatsappNumber}
          services={services}
          shopAddress={shopAddress}
        />

        {/* Galeria Antes & Depois */}
        <BeforeAfterGallery 
          onQuoteClick={scrollToQuote} 
          items={beforeAfterItems}
        />

        {/* Depoimentos & Dúvidas Frequentes */}
        <FAQSection />
      </main>

      {/* Footer com link discreto para Área do Desenvolvedor protegida por CPF e Senha */}
      <Footer 
        onOpenPrompt={() => setIsPromptOpen(true)}
        onOpenDeveloperModal={() => setIsDeveloperModalOpen(true)}
        whatsappNumber={whatsappNumber}
        address={shopAddress}
        addressComplement={shopAddressComplement}
        operatingHours={operatingHours}
        mapsUrl={mapsUrl}
        instagramUrl={instagramUrl}
      />

      {/* Floating WhatsApp Action Button */}
      <aside aria-label="Ações rápidas de contato" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={scrollToQuote}
          aria-label="Abrir formulário de orçamento no WhatsApp"
          className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            Orçamento WhatsApp
          </span>
        </button>
      </aside>

      {/* Developer Restricted Portal (Protected by CPF and Password) */}
      <DeveloperModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
        services={services}
        onSaveServices={handleSaveServices}
        whatsappNumber={whatsappNumber}
        onSaveWhatsappNumber={handleSaveNumber}
        instagramUrl={instagramUrl}
        onSaveInstagramUrl={handleSaveInstagram}
        heroImage={heroImage}
        onSaveHeroImage={handleSaveHeroImage}
        beforeAfterItems={beforeAfterItems}
        onSaveBeforeAfter={handleSaveBeforeAfter}
        shopAddress={shopAddress}
        onSaveShopAddress={handleSaveAddress}
        shopAddressComplement={shopAddressComplement}
        operatingHours={operatingHours}
        mapsUrl={mapsUrl}
      />

      {/* Prompt Visualizer Modal */}
      <PromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
      />
    </div>
  );
}
