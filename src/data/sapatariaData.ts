import { ServiceItem, FootwearType, BeforeAfterItem, TestimonialItem } from '../types';

export const FOOTWEAR_OPTIONS: { id: FootwearType; label: string; iconName: string; hint: string }[] = [
  {
    id: 'Sapato Social / Mocassim',
    label: 'Sapato Social / Mocassim',
    iconName: 'Footprints',
    hint: 'Oxford, Derby, Loafer, Monks, Mocassins clássicos',
  },
  {
    id: 'Tênis (Esportivo / Casual)',
    label: 'Tênis (Esportivo / Casual)',
    iconName: 'Sparkles',
    hint: 'Sneakers, camurça, knit, corrida e lifestyle',
  },
  {
    id: 'Bota / Coturno',
    label: 'Bota / Coturno',
    iconName: 'Shield',
    hint: 'Chelsea, cano alto, coturno militar, trabalho',
  },
  {
    id: 'Salto / Calçado Feminino',
    label: 'Salto / Calçado Feminino',
    iconName: 'Sparkle',
    hint: 'Scarpin, sandália fina, anabela, sapatilhas',
  },
  {
    id: 'Bolsa / Acessório de Couro',
    label: 'Bolsa / Acessório de Couro',
    iconName: 'Briefcase',
    hint: 'Maletas, jaquetas, cintos e bolsas de luxo',
  },
  {
    id: 'Outro',
    label: 'Outro',
    iconName: 'PlusCircle',
    hint: 'Peças especiais sob consulta técnica',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'solado',
    name: 'Troca de solado / Meia sola',
    category: 'Solados & Saltos',
    description: 'Borracha antiderrapante Vibram ou couro legítimo com costura de alta resistência.',
    estimatedPrice: 'A partir de R$ 85,00',
    turnaroundDays: '2 a 4 dias úteis',
  },
  {
    id: 'pintura',
    name: 'Pintura / Tingimento / Restauração de cor',
    category: 'Estética & Lavagem',
    description: 'Renovação tonal profunda, cobertura de arranhões e pigmentação impermeabilizante.',
    estimatedPrice: 'A partir de R$ 95,00',
    turnaroundDays: '3 a 5 dias úteis',
  },
  {
    id: 'higienizacao',
    name: 'Higienização e lavagem profunda',
    category: 'Estética & Lavagem',
    description: 'Limpeza artesanal a seco/espuma ativa, desodorização com ozônio e clareamento de entressolas.',
    estimatedPrice: 'A partir de R$ 50,00',
    turnaroundDays: '2 dias úteis',
  },
  {
    id: 'costura',
    name: 'Costura e colagem de reforço',
    category: 'Estrutura & Ajustes',
    description: 'Linhas enceradas ultra-resistentes e adesivo de poliuretano vulcanizado a quente.',
    estimatedPrice: 'A partir de R$ 40,00',
    turnaroundDays: '1 a 2 dias úteis',
  },
  {
    id: 'salto',
    name: 'Troca de salto / Tacão',
    category: 'Solados & Saltos',
    description: 'Substituição de pontas de metal/PU antiruído e nivelamento ergonômico da pisada.',
    estimatedPrice: 'A partir de R$ 35,00',
    turnaroundDays: '1 dia útil',
  },
  {
    id: 'alargamento',
    name: 'Ajuste de tamanho / Larga-sapato',
    category: 'Estrutura & Ajustes',
    description: 'Amolecimento de pontos de atrito no peito do pé ou calcanhar em fôrma hidráulica.',
    estimatedPrice: 'A partir de R$ 30,00',
    turnaroundDays: '1 a 2 dias úteis',
  },
  {
    id: 'hidratacao',
    name: 'Hidratação de couro',
    category: 'Estética & Lavagem',
    description: 'Ceras nobres de carnaúba e óleos essenciais para recuperar o brilho e flexibilidade original.',
    estimatedPrice: 'A partir de R$ 45,00',
    turnaroundDays: '1 dia útil',
  },
  {
    id: 'outro',
    name: 'Outro serviço',
    category: 'Estrutura & Ajustes',
    description: 'Customização, troca de zíperes, reforço de ilhoses ou reparos estruturais especiais.',
    estimatedPrice: 'Sob avaliação técnica',
    turnaroundDays: 'A combinar',
  },
];

export const GALLERY_ITEMS: BeforeAfterItem[] = [
  {
    id: '1',
    title: 'Recuperação de Solado Goodyear & Tingimento Nobre',
    category: 'Sapato Social Oxford',
    description: 'Troca completa de solado desgastado por meia sola em borracha italiana com acabamento encerado e hidratação profunda.',
    image: '/src/assets/images/hero_shoe_restoration_1793227372164.jpg',
    improvementTags: ['Meia sola antiderrapante', 'Tingimento artesanal', 'Couro flexibilizado'],
  },
  {
    id: '2',
    title: 'Ressolação Robusta de Coturno de Trilha',
    category: 'Bota em Couro Rústico',
    description: 'Descolamento estrutural e desgaste extremo corrigidos com costura reforçada à mão e novo solado tratorado vulcanizado.',
    image: '/src/assets/images/artisan_sole_craft_1793227372264.jpg',
    improvementTags: ['Costura manual', 'Solado tratorado', 'Impermeabilização'],
  },
  {
    id: '3',
    title: 'Higienização e Clareamento de Entressola de Tênis',
    category: 'Sneakers Premium',
    description: 'Remoção de manchas de lama e graxa, lavagem detalhada de camurça e tratamento antioxidação da borracha amarelada.',
    image: '/src/assets/images/sneaker_cleaning_restoration_1793227373920.jpg',
    improvementTags: ['Espuma bio-ativa', 'Higienização com ozônio', 'Clareamento UV'],
  },
  {
    id: '4',
    title: 'Revitalização de Bolsa & Botas em Couro Cognac',
    category: 'Acessórios & Calçados',
    description: 'Limpeza de estrias de ressecamento, aplicação de bálsamo orgânico com cera de abelha e restauração de bordas.',
    image: '/src/assets/images/leather_bag_care_1793227373569.jpg',
    improvementTags: ['Bálsamo orgânico', 'Proteção hidrorrepelente', 'Brilho acetinado'],
  },
];

export const FAQ_LIST = [
  {
    question: 'Como funciona o envio de fotos pelo WhatsApp?',
    answer: 'Ao clicar no botão "Enviar Pedido para o WhatsApp", a mensagem com todos os serviços selecionados será carregada automaticamente no seu aplicativo. Basta clicar em enviar e, em seguida, anexar fotos do calçado tiradas de frente, de lado e da sola para que possamos confirmar o valor exato.',
  },
  {
    question: 'Vocês têm serviço de Leva e Traz (coleta e entrega)?',
    answer: 'Sim! Atendemos com serviço de motoboy express ou agendamento de rota. Ao preencher o seu bairro no formulário, já calculamos a disponibilidade e informamos o valor da taxa de coleta diretamente na conversa.',
  },
  {
    question: 'Qual é o prazo médio para os consertos?',
    answer: 'Serviços simples como tacão, hidratação ou colagens pontuais ficam prontos em 24 a 48 horas. Reformas completas de solado ou repintura total levam de 3 a 5 dias úteis com cura térmica adequada.',
  },
  {
    question: 'Os reparos têm garantia?',
    answer: 'Sim, todos os nossos serviços contam com garantia de 90 dias nas costuras, colagens estruturais e solados novos aplicados em nossa oficina.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test_1',
    name: 'Carlos Eduardo Ramos',
    role: 'Advogado · São Paulo',
    comment: 'Salvei meu par de sapatos ingleses que já estavam com a sola furada. O acabamento artesanal e a costura ficaram impecáveis, parece que saíram da caixa hoje.',
    serviceUsed: 'Troca de solado & Tingimento',
    stars: 5,
    date: 'Há 3 dias'
  },
  {
    id: 'test_2',
    name: 'Mariana Silveira',
    role: 'Arquiteta · São Paulo',
    comment: 'Enviei fotos de uma bota de couro legítimo arranhada e uma bolsa no WhatsApp. O orçamento veio em minutos e a entrega com leva-e-traz facilitou demais minha rotina.',
    serviceUsed: 'Hidratação & Restauração de cor',
    stars: 5,
    date: 'Há 1 semana'
  },
  {
    id: 'test_3',
    name: 'Rodrigo Fontes',
    role: 'Colecionador de Sneakers',
    comment: 'Fiquei impressionado com o clareamento da sola do meu tênis branco. Eliminaram todo o tom amarelado sem agredir a costura. Super recomendo a sapataria!',
    serviceUsed: 'Higienização profunda',
    stars: 5,
    date: 'Há 2 semanas'
  },
];
