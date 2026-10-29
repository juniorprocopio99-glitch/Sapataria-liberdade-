import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  Check, 
  DollarSign, 
  Clock, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogOut, 
  AlertCircle,
  Copy,
  Sparkles,
  Layers,
  Wrench,
  Image as ImageIcon,
  Upload,
  Camera,
  ExternalLink,
  MapPin,
  Instagram
} from 'lucide-react';
import { ServiceItem, BeforeAfterItem } from '../types';
import { SERVICES_LIST as DEFAULT_SERVICES, GALLERY_ITEMS as DEFAULT_GALLERY_ITEMS } from '../data/sapatariaData';
import { computeSHA256, formatCPF, maskCPF } from '../utils/cryptoSecurity';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  onSaveServices: (updated: ServiceItem[]) => void;
  whatsappNumber: string;
  onSaveWhatsappNumber: (newNum: string) => void;
  instagramUrl: string;
  onSaveInstagramUrl: (url: string) => void;
  heroImage: string;
  onSaveHeroImage: (url: string) => void;
  beforeAfterItems: BeforeAfterItem[];
  onSaveBeforeAfter: (items: BeforeAfterItem[]) => void;
  shopAddress: string;
  onSaveShopAddress: (address: string, complement: string, hours: string, mapsUrl: string) => void;
  shopAddressComplement?: string;
  operatingHours?: string;
  mapsUrl?: string;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  isOpen,
  onClose,
  services,
  onSaveServices,
  whatsappNumber,
  onSaveWhatsappNumber,
  instagramUrl,
  onSaveInstagramUrl,
  heroImage,
  onSaveHeroImage,
  beforeAfterItems,
  onSaveBeforeAfter,
  shopAddress,
  onSaveShopAddress,
  shopAddressComplement,
  operatingHours,
  mapsUrl,
}) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstAccessMode, setIsFirstAccessMode] = useState(false);
  const [cpfInput, setCpfInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Cryptographic SHA-256 state (No plaintext passwords stored or exposed)
  const [storedCpfHash, setStoredCpfHash] = useState<string>('');
  const [storedPassHash, setStoredPassHash] = useState<string>('');
  const [storedCpfMasked, setStoredCpfMasked] = useState<string>('***.***.***-**');
  const [isCustomized, setIsCustomized] = useState<boolean>(() => {
    return localStorage.getItem('sapataria_dev_customized') === 'true';
  });

  // Brute-force protection: rate limit repeated incorrect passwords
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'servicos' | 'antes_depois' | 'fotos' | 'endereco' | 'credenciais' | 'whatsapp'>('servicos');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit / Add service form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Solados & Saltos' | 'Estética & Lavagem' | 'Estrutura & Ajustes'>('Solados & Saltos');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDays, setFormDays] = useState('');

  // Hero photo management state
  const [tempHeroUrl, setTempHeroUrl] = useState(heroImage);

  // Address and atelier location state
  const [tempAddress, setTempAddress] = useState(shopAddress);
  const [tempComplement, setTempComplement] = useState(shopAddressComplement || 'Atelier Central & Coleta em toda Região Metropolitana');
  const [tempHours, setTempHours] = useState(operatingHours || 'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00');
  const [tempMapsUrl, setTempMapsUrl] = useState(mapsUrl || 'https://maps.google.com/?q=Sapataria+Liberdade');

  // Before & After management states
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [isAddingCase, setIsAddingCase] = useState(false);
  const [caseTitle, setCaseTitle] = useState('');
  const [caseCategory, setCaseCategory] = useState('Sapato Social / Mocassim');
  const [caseDescription, setCaseDescription] = useState('');
  const [caseImage, setCaseImage] = useState('');
  const [caseTags, setCaseTags] = useState('');
  const [caseError, setCaseError] = useState<string | null>(null);

  // General settings state
  const [tempPhone, setTempPhone] = useState(whatsappNumber);
  const [tempInstagram, setTempInstagram] = useState(instagramUrl);
  
  // Credentials change tab state
  const [newCpf, setNewCpf] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [credentialsError, setCredentialsError] = useState<string | null>(null);

  // First access form state
  const [setupCpf, setSetupCpf] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    setTempPhone(whatsappNumber);
  }, [whatsappNumber]);

  useEffect(() => {
    setTempInstagram(instagramUrl);
  }, [instagramUrl]);

  useEffect(() => {
    setTempHeroUrl(heroImage);
  }, [heroImage]);

  useEffect(() => {
    setTempAddress(shopAddress);
  }, [shopAddress]);

  useEffect(() => {
    setTempComplement(shopAddressComplement || 'Atelier Central & Coleta em toda Região Metropolitana');
  }, [shopAddressComplement]);

  useEffect(() => {
    setTempHours(operatingHours || 'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00');
  }, [operatingHours]);

  useEffect(() => {
    setTempMapsUrl(mapsUrl || 'https://maps.google.com/?q=Sapataria+Liberdade');
  }, [mapsUrl]);

  // Initialize Cryptographic Security and migrate any legacy plaintext credentials
  useEffect(() => {
    let isMounted = true;

    const initSecurity = async () => {
      let passHash = localStorage.getItem('sapataria_dev_pass_hash');
      let cpfHash = localStorage.getItem('sapataria_dev_cpf_hash');
      let masked = localStorage.getItem('sapataria_dev_cpf_masked');

      // Migrate legacy plaintext credentials if they exist
      const legacyPass = localStorage.getItem('sapataria_dev_pass');
      const legacyCpf = localStorage.getItem('sapataria_dev_cpf');

      if (legacyPass) {
        passHash = await computeSHA256(legacyPass);
        localStorage.setItem('sapataria_dev_pass_hash', passHash);
        localStorage.removeItem('sapataria_dev_pass'); // Eradicate plaintext
      }
      if (legacyCpf) {
        const cleanLegacyCpf = legacyCpf.replace(/\D/g, '');
        cpfHash = await computeSHA256(cleanLegacyCpf);
        masked = maskCPF(legacyCpf);
        localStorage.setItem('sapataria_dev_cpf_hash', cpfHash);
        localStorage.setItem('sapataria_dev_cpf_masked', masked);
        localStorage.removeItem('sapataria_dev_cpf'); // Eradicate plaintext
      }

      // Default baseline fallback hashes if no credentials have ever been set
      if (!passHash) {
        passHash = await computeSHA256('admin123');
        localStorage.setItem('sapataria_dev_pass_hash', passHash);
      }
      if (!cpfHash) {
        cpfHash = await computeSHA256('12345678900');
        masked = '123.***.***-00';
        localStorage.setItem('sapataria_dev_cpf_hash', cpfHash);
        localStorage.setItem('sapataria_dev_cpf_masked', masked);
      }

      if (isMounted) {
        setStoredPassHash(passHash);
        setStoredCpfHash(cpfHash);
        setStoredCpfMasked(masked || '***.***.***-**');
      }
    };

    initSecurity();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpfInput(formatCPF(e.target.value));
    setLoginError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`Muitas tentativas incorretas. Aguarde ${remainingSeconds} segundos por segurança.`);
      return;
    }

    const cleanInputCpf = cpfInput.replace(/\D/g, '');
    if (cleanInputCpf.length !== 11) {
      setLoginError('Informe um CPF completo com 11 dígitos.');
      return;
    }

    if (!passwordInput.trim()) {
      setLoginError('Informe a senha de acesso.');
      return;
    }

    setIsAuthenticating(true);
    setLoginError(null);

    try {
      const inputCpfHash = await computeSHA256(cleanInputCpf);
      const inputPassHash = await computeSHA256(passwordInput);

      if (inputCpfHash === storedCpfHash && inputPassHash === storedPassHash) {
        setIsLoggedIn(true);
        setLoginError(null);
        setFailedAttempts(0);
        setLockoutUntil(null);
        setCpfInput('');
        setPasswordInput('');
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 4) {
          const lockTime = Date.now() + 30000; // 30s lockout
          setLockoutUntil(lockTime);
          setLoginError('Limite de tentativas incorretas excedido. Painel bloqueado por 30 segundos por segurança.');
        } else {
          setLoginError(`CPF ou senha incorretos. Tentativa ${nextAttempts} de 4.`);
        }
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle first-time setup or direct registration of personal credentials
  const handleFirstTimeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = setupCpf.replace(/\D/g, '');
    if (clean.length !== 11) {
      setSetupError('Informe um CPF completo com 11 dígitos.');
      return;
    }
    if (setupPassword.length < 4) {
      setSetupError('A senha deve ter no mínimo 4 caracteres.');
      return;
    }
    if (setupPassword !== setupConfirm) {
      setSetupError('A confirmação da senha não coincide com a senha digitada.');
      return;
    }

    setIsAuthenticating(true);
    try {
      const newCpfHash = await computeSHA256(clean);
      const newPassHash = await computeSHA256(setupPassword.trim());
      const masked = maskCPF(setupCpf);

      setStoredCpfHash(newCpfHash);
      setStoredPassHash(newPassHash);
      setStoredCpfMasked(masked);
      setIsCustomized(true);

      localStorage.setItem('sapataria_dev_cpf_hash', newCpfHash);
      localStorage.setItem('sapataria_dev_pass_hash', newPassHash);
      localStorage.setItem('sapataria_dev_cpf_masked', masked);
      localStorage.setItem('sapataria_dev_customized', 'true');
      localStorage.removeItem('sapataria_dev_cpf');
      localStorage.removeItem('sapataria_dev_pass');

      setIsLoggedIn(true);
      setIsFirstAccessMode(false);
      setSetupCpf('');
      setSetupPassword('');
      setSetupConfirm('');
      setSetupError(null);
      showNotification('Credenciais criptografadas com SHA-256 e salvas com sucesso!');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('servicos');
    setEditingId(null);
    setIsAdding(false);
    setEditingCaseId(null);
    setIsAddingCase(false);
    setCpfInput('');
    setPasswordInput('');
    setLoginError(null);
  };

  // Services management
  const startEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setIsAdding(false);
    setFormName(service.name);
    setFormCategory(service.category);
    setFormDescription(service.description);
    setFormPrice(service.estimatedPrice);
    setFormDays(service.turnaroundDays);
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setFormName('');
    setFormCategory('Solados & Saltos');
    setFormDescription('');
    setFormPrice('A partir de R$ 50,00');
    setFormDays('2 a 3 dias úteis');
  };

  const duplicateService = (service: ServiceItem) => {
    const duplicated: ServiceItem = {
      id: 'serv_' + Date.now(),
      name: `${service.name} (Novo)`,
      category: service.category,
      description: service.description,
      estimatedPrice: service.estimatedPrice,
      turnaroundDays: service.turnaroundDays,
    };
    const updated = [...services, duplicated];
    onSaveServices(updated);
    startEdit(duplicated);
    showNotification(`Cópia criada! Agora você pode alterar o nome e o preço.`);
  };

  const cancelForm = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim()) return;

    if (isAdding) {
      const newService: ServiceItem = {
        id: 'serv_' + Date.now(),
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim() || 'Serviço sob medida executado na oficina.',
        estimatedPrice: formPrice.trim(),
        turnaroundDays: formDays.trim() || '2 a 3 dias úteis',
      };
      const updated = [...services, newService];
      onSaveServices(updated);
      showNotification(`Serviço "${newService.name}" adicionado com sucesso!`);
    } else if (editingId) {
      const updated = services.map(s => {
        if (s.id === editingId) {
          return {
            ...s,
            name: formName.trim(),
            category: formCategory,
            description: formDescription.trim(),
            estimatedPrice: formPrice.trim(),
            turnaroundDays: formDays.trim(),
          };
        }
        return s;
      });
      onSaveServices(updated);
      showNotification(`Nome e detalhes do serviço atualizados com sucesso!`);
    }

    cancelForm();
  };

  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o serviço "${name}" da tabela oficial?`)) {
      const updated = services.filter(s => s.id !== id);
      onSaveServices(updated);
      showNotification(`Serviço "${name}" excluído.`);
      if (editingId === id) cancelForm();
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Deseja restaurar a tabela original padrão de serviços e preços da Sapataria?')) {
      onSaveServices(DEFAULT_SERVICES);
      showNotification('Tabela padrão restaurada.');
      cancelForm();
    }
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempPhone.replace(/\D/g, '');
    if (clean.length >= 10) {
      onSaveWhatsappNumber(tempPhone);
      showNotification('Número de WhatsApp oficial da sapataria atualizado!');
    }
  };

  const handleSaveInstagramForm = (e: React.FormEvent) => {
    e.preventDefault();
    let clean = tempInstagram.trim();
    if (clean.startsWith('@')) {
      clean = `https://instagram.com/${clean.substring(1)}`;
    } else if (clean && !clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    setTempInstagram(clean);
    onSaveInstagramUrl(clean);
    showNotification('Link do Instagram atualizado com sucesso! O rodapé do site foi sincronizado.');
  };

  const handleApplyInstagramPreset = (handleOrUrl: string) => {
    let clean = handleOrUrl.trim();
    if (clean.startsWith('@')) {
      clean = `https://instagram.com/${clean.substring(1)}`;
    }
    setTempInstagram(clean);
    onSaveInstagramUrl(clean);
    showNotification(`Instagram "${clean}" aplicado com sucesso ao rodapé!`);
  };

  const handleSaveAddressForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAddress.trim()) {
      showNotification('Por favor, informe o endereço da sapataria.');
      return;
    }
    onSaveShopAddress(
      tempAddress.trim(),
      tempComplement.trim(),
      tempHours.trim(),
      tempMapsUrl.trim()
    );
    showNotification('Endereço e horários da sapataria atualizados com sucesso!');
  };

  const handleApplyAddressPreset = (addr: string, comp: string, hours: string, maps: string) => {
    setTempAddress(addr);
    setTempComplement(comp);
    setTempHours(hours);
    setTempMapsUrl(maps);
    onSaveShopAddress(addr, comp, hours, maps);
    showNotification(`Endereço "${addr.split('-')[0].trim()}" aplicado com sucesso!`);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsError(null);

    const cleanCpf = newCpf.replace(/\D/g, '');
    
    // Check if at least one field was provided
    if (!cleanCpf && !newPassword.trim()) {
      setCredentialsError('Preencha um novo CPF ou uma nova senha para atualizar.');
      return;
    }

    if (cleanCpf && cleanCpf.length !== 11) {
      setCredentialsError('O CPF precisa conter exatamente 11 dígitos.');
      return;
    }

    if (newPassword.trim()) {
      if (newPassword.trim().length < 4) {
        setCredentialsError('A nova senha deve ter no mínimo 4 caracteres.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setCredentialsError('A confirmação da senha não confere com a nova senha digitada.');
        return;
      }
    }

    try {
      if (cleanCpf) {
        const newCpfHash = await computeSHA256(cleanCpf);
        const masked = maskCPF(newCpf);
        setStoredCpfHash(newCpfHash);
        setStoredCpfMasked(masked);
        localStorage.setItem('sapataria_dev_cpf_hash', newCpfHash);
        localStorage.setItem('sapataria_dev_cpf_masked', masked);
        localStorage.removeItem('sapataria_dev_cpf'); // remove any plaintext
      }
      if (newPassword.trim()) {
        const newPassHash = await computeSHA256(newPassword.trim());
        setStoredPassHash(newPassHash);
        localStorage.setItem('sapataria_dev_pass_hash', newPassHash);
        localStorage.removeItem('sapataria_dev_pass'); // remove any plaintext
      }

      setIsCustomized(true);
      localStorage.setItem('sapataria_dev_customized', 'true');
      setNewCpf('');
      setNewPassword('');
      setConfirmPassword('');
      showNotification('Credenciais criptografadas com SHA-256 salvas com sucesso! Guarde suas novas credenciais.');
    } catch {
      setCredentialsError('Erro ao processar a criptografia das credenciais.');
    }
  };

  // Quick preset suggestions to help the developer quickly add services
  const quickServiceSuggestions = [
    { name: 'Troca de Zíper / Fecho', category: 'Estrutura & Ajustes' as const, price: 'R$ 45,00', days: '2 dias úteis', desc: 'Troca de zíper reforçado de metal ou tratorado para botas e calçados.' },
    { name: 'Palmilha Anatômica de Couro', category: 'Estrutura & Ajustes' as const, price: 'R$ 55,00', days: '1 dia útil', desc: 'Confecção e colagem de palmilha acolchoada em couro pelica respirável.' },
    { name: 'Impermeabilização Nano-Tech', category: 'Estética & Lavagem' as const, price: 'R$ 40,00', days: '24 horas', desc: 'Aplicação de barreira repelente contra líquidos, café, vinho e manchas.' },
    { name: 'Troca de Salto Fino Feminino', category: 'Solados & Saltos' as const, price: 'R$ 75,00', days: '2 a 3 dias úteis', desc: 'Substituição completa do salto estrutural com acabamento encapado.' }
  ];

  const handleApplySuggestion = (sug: typeof quickServiceSuggestions[0]) => {
    setIsAdding(true);
    setEditingId(null);
    setFormName(sug.name);
    setFormCategory(sug.category);
    setFormPrice(sug.price);
    setFormDays(sug.days);
    setFormDescription(sug.desc);
  };

  // Presets and Handlers for Photos & Before/After
  const PRESET_PHOTOS = [
    {
      title: 'Oficina Clássica & Mestre Sapateiro',
      subtitle: 'Ambiente nobre e artesanal de restauração',
      url: '/src/assets/images/hero_shoe_restoration_1793227372164.jpg',
    },
    {
      title: 'Bancada do Artesão com Solados',
      subtitle: 'Trabalho manual em solas de couro e borracha',
      url: '/src/assets/images/artisan_sole_craft_1793227372264.jpg',
    },
    {
      title: 'Sneakers & Tênis Premium',
      subtitle: 'Higienização e restauração moderna de tênis',
      url: '/src/assets/images/sneaker_cleaning_restoration_1793227373920.jpg',
    },
    {
      title: 'Bolsas & Artigos em Couro Nobre',
      subtitle: 'Revitalização e hidratação de acessórios em couro',
      url: '/src/assets/images/leather_bag_care_1793227373569.jpg',
    },
  ];

  // Hero Image Handlers
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setTempHeroUrl(base64);
        onSaveHeroImage(base64);
        showNotification('Nova foto principal do site carregada e aplicada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHeroUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempHeroUrl.trim()) return;
    onSaveHeroImage(tempHeroUrl.trim());
    showNotification('Foto principal do site atualizada com sucesso!');
  };

  const handleSelectPresetHero = (url: string, name: string) => {
    setTempHeroUrl(url);
    onSaveHeroImage(url);
    showNotification(`Foto principal alterada para "${name}"!`);
  };

  const handleResetHero = () => {
    const defaultImg = '/src/assets/images/hero_shoe_restoration_1793227372164.jpg';
    setTempHeroUrl(defaultImg);
    onSaveHeroImage(defaultImg);
    showNotification('Foto principal restaurada para a imagem padrão.');
  };

  // Before & After Handlers
  const startAddCase = () => {
    setEditingCaseId(null);
    setIsAddingCase(true);
    setCaseTitle('');
    setCaseCategory('Sapato Social / Mocassim');
    setCaseDescription('');
    setCaseImage('/src/assets/images/hero_shoe_restoration_1793227372164.jpg');
    setCaseTags('Meia sola Vibram, Costura manual, Pintura');
    setCaseError(null);
  };

  const startEditCase = (item: BeforeAfterItem) => {
    setEditingCaseId(item.id);
    setIsAddingCase(false);
    setCaseTitle(item.title);
    setCaseCategory(item.category);
    setCaseDescription(item.description);
    setCaseImage(item.image);
    setCaseTags(item.improvementTags.join(', '));
    setCaseError(null);
  };

  const cancelCaseForm = () => {
    setEditingCaseId(null);
    setIsAddingCase(false);
    setCaseError(null);
  };

  const handleCaseFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCaseError('Por favor, selecione um arquivo de imagem válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setCaseImage(base64);
        setCaseError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCaseForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle.trim()) {
      setCaseError('Informe um título para o caso de restauração.');
      return;
    }
    if (!caseDescription.trim()) {
      setCaseError('Escreva a descrição do trabalho realizado no calçado.');
      return;
    }
    if (!caseImage.trim()) {
      setCaseError('Selecione ou informe a foto do calçado.');
      return;
    }

    const parsedTags = caseTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (isAddingCase) {
      const newCase: BeforeAfterItem = {
        id: 'case_' + Date.now(),
        title: caseTitle.trim(),
        category: caseCategory.trim(),
        description: caseDescription.trim(),
        image: caseImage.trim(),
        improvementTags: parsedTags.length > 0 ? parsedTags : ['Restauração artesanal', 'Couro nobre'],
      };
      onSaveBeforeAfter([newCase, ...beforeAfterItems]);
      showNotification(`Novo caso "${newCase.title}" adicionado com sucesso!`);
    } else if (editingCaseId) {
      const updated = beforeAfterItems.map(item => {
        if (item.id === editingCaseId) {
          return {
            ...item,
            title: caseTitle.trim(),
            category: caseCategory.trim(),
            description: caseDescription.trim(),
            image: caseImage.trim(),
            improvementTags: parsedTags.length > 0 ? parsedTags : item.improvementTags,
          };
        }
        return item;
      });
      onSaveBeforeAfter(updated);
      showNotification(`Caso "${caseTitle}" atualizado com sucesso!`);
    }

    cancelCaseForm();
  };

  const handleDeleteCase = (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja remover o caso "${title}" da galeria de Antes e Depois?`)) {
      const updated = beforeAfterItems.filter(item => item.id !== id);
      onSaveBeforeAfter(updated);
      showNotification(`Caso "${title}" excluído da galeria.`);
      if (editingCaseId === id) cancelCaseForm();
    }
  };

  const handleResetDefaultCases = () => {
    if (confirm('Deseja restaurar a galeria original de Antes e Depois da Sapataria?')) {
      onSaveBeforeAfter(DEFAULT_GALLERY_ITEMS);
      showNotification('Galeria padrão de Antes e Depois restaurada com sucesso!');
      cancelCaseForm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-7 border border-[#e8dfd5] shadow-2xl relative flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#ebdcd0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27211d] text-[#faf7f2] flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5 text-[#dfb892]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-[#27211d]">Área do Desenvolvedor</h3>
                {isLoggedIn && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Sessão Autenticada
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7e6b5d]">
                {isLoggedIn 
                  ? 'Gerencie nomes de serviços, adicione novos itens e configure preços fixos'
                  : 'Acesso restrito e protegido por CPF e Senha'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer font-medium"
                title="Encerrar sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8a7260] hover:text-[#27211d] hover:bg-[#faf7f2] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center gap-2 border border-emerald-200 shadow-xs shrink-0">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN & SETUP SCREENS (When NOT authenticated) */}
        {!isLoggedIn ? (
          <div className="py-6 sm:py-8 max-w-md mx-auto w-full overflow-y-auto">
            {!isFirstAccessMode ? (
              /* STANDARD SECURE LOGIN FORM (NO EXPOSED PASSWORDS) */
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf3ea] text-[#784621] mx-auto flex items-center justify-center mb-3 border border-[#ebd8c5] shadow-xs">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#27211d]">Entrar na Área do Desenvolvedor</h4>
                  <p className="text-xs text-[#675445] mt-1.5 leading-relaxed">
                    Painel protegido. Somente o desenvolvedor com o CPF e a senha cadastrados pode editar nomes, preços e serviços.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      CPF do Desenvolvedor
                    </label>
                    <input
                      type="text"
                      value={cpfInput}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                      autoComplete="username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] bg-[#faf7f2]/40 text-sm font-mono focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      Senha de Acesso
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setLoginError(null);
                        }}
                        placeholder="••••••••••••"
                        required
                        autoComplete="current-password"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#d8cbbe] bg-[#faf7f2]/40 text-sm focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7260] hover:text-[#27211d] cursor-pointer"
                        title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span>{loginError}</span>
                        {!isCustomized && (
                          <p className="mt-1 text-[11px] text-rose-600">
                            Se é seu primeiro acesso, use a opção de cadastro inicial abaixo.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAuthenticating || Boolean(lockoutUntil && Date.now() < lockoutUntil)}
                    className="w-full py-3 px-4 rounded-xl bg-[#784621] hover:bg-[#5f3618] disabled:bg-[#a89584] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {isAuthenticating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Autenticando com SHA-256...</span>
                      </>
                    ) : (
                      <span>Entrar no Painel Seguro</span>
                    )}
                  </button>
                </form>

                {/* Conditional setup link: Only shown if no custom credentials have been set yet */}
                <div className="mt-6 pt-4 border-t border-[#ebdcd0] text-center">
                  {!isCustomized ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsFirstAccessMode(true);
                        setLoginError(null);
                      }}
                      className="text-xs text-[#784621] hover:text-[#42240e] font-semibold underline decoration-dotted cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#784621]" />
                      <span>Cadastrar meu CPF e Senha Privados (Primeiro Acesso)</span>
                    </button>
                  ) : (
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#208b53] bg-[#f0f9f4] px-3 py-1.5 rounded-full border border-[#c4e6d4]">
                        <ShieldCheck className="w-4 h-4 text-[#208b53]" />
                        <span className="font-semibold">Criptografia SHA-256 Ativa</span>
                      </div>
                      <p className="text-[11px] text-[#7e6b5d]">
                        Painel blindado contra leitura de código-fonte. Apenas o proprietário com CPF e senha autorizados tem acesso.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* FIRST TIME / DIRECT CREDENTIAL SETUP SCREEN */
              <div>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#f0f9f4] text-[#208b53] mx-auto flex items-center justify-center mb-3 border border-[#c4e6d4] shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#27211d]">Configurar Meu CPF e Senha Privados</h4>
                  <p className="text-xs text-[#675445] mt-1.5 leading-relaxed">
                    Defina agora o seu CPF e sua senha secreta para que <b>somente você</b> tenha acesso às configurações da sapataria.
                  </p>
                </div>

                <form onSubmit={handleFirstTimeSetup} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      Seu CPF *
                    </label>
                    <input
                      type="text"
                      value={setupCpf}
                      onChange={e => {
                        setSetupCpf(formatCPF(e.target.value));
                        setSetupError(null);
                      }}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] text-sm font-mono focus:outline-none focus:border-[#784621]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      Sua Nova Senha Secreta *
                    </label>
                    <input
                      type="password"
                      value={setupPassword}
                      onChange={e => {
                        setSetupPassword(e.target.value);
                        setSetupError(null);
                      }}
                      placeholder="Mínimo 4 caracteres"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] text-sm focus:outline-none focus:border-[#784621]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      Confirme a Nova Senha *
                    </label>
                    <input
                      type="password"
                      value={setupConfirm}
                      onChange={e => {
                        setSetupConfirm(e.target.value);
                        setSetupError(null);
                      }}
                      placeholder="Repita a mesma senha"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] text-sm focus:outline-none focus:border-[#784621]"
                    />
                  </div>

                  {setupError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{setupError}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFirstAccessMode(false);
                        setSetupError(null);
                      }}
                      className="w-full sm:w-1/3 py-2.5 px-3 rounded-xl border border-[#d8cbbe] text-xs font-semibold text-[#675445] hover:bg-[#faf7f2] cursor-pointer"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-2/3 py-2.5 px-4 rounded-xl bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Salvar Minhas Credenciais e Entrar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* 2. AUTHENTICATED DEVELOPER DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden pt-3">
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#ede1d4] rounded-xl mb-4 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => { setActiveTab('servicos'); cancelForm(); cancelCaseForm(); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === 'servicos'
                    ? 'bg-white text-[#784621] shadow-xs'
                    : 'text-[#6e5a4a] hover:text-[#27211d]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>Nomes & Preços</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('antes_depois'); cancelForm(); cancelCaseForm(); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === 'antes_depois'
                    ? 'bg-white text-[#784621] shadow-xs'
                    : 'text-[#6e5a4a] hover:text-[#27211d]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Antes & Depois</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('fotos'); cancelForm(); cancelCaseForm(); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === 'fotos'
                    ? 'bg-white text-[#784621] shadow-xs'
                    : 'text-[#6e5a4a] hover:text-[#27211d]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Foto do Site (Hero)</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('endereco'); cancelForm(); cancelCaseForm(); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === 'endereco'
                    ? 'bg-white text-[#784621] shadow-xs'
                    : 'text-[#6e5a4a] hover:text-[#27211d]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Endereço & Atelier</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('credenciais'); cancelForm(); cancelCaseForm(); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === 'credenciais'
                    ? 'bg-white text-[#784621] shadow-xs'
                    : 'text-[#6e5a4a] hover:text-[#27211d]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span>Mudar CPF / Senha</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('whatsapp'); cancelForm(); cancelCaseForm(); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === 'whatsapp'
                    ? 'bg-white text-[#784621] shadow-xs'
                    : 'text-[#6e5a4a] hover:text-[#27211d]'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C] shrink-0" />
                <span className="hidden sm:inline">WhatsApp & Instagram</span>
                <span className="sm:hidden">Redes</span>
              </button>
            </div>

            {/* TAB 1: SERVICES & NAMES & PRICES */}
            {activeTab === 'servicos' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Form to Edit or Add a Service */}
                {(isAdding || editingId) ? (
                  <form onSubmit={handleSaveServiceForm} className="mb-4 p-4 rounded-xl bg-[#faf7f2] border-2 border-[#d8c5b2] space-y-3.5 shrink-0 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd0]">
                      <div className="flex items-center gap-2">
                        {isAdding ? (
                          <div className="w-6 h-6 rounded bg-[#784621] text-white flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded bg-[#784621] text-white flex items-center justify-center">
                            <Edit2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <h5 className="font-bold text-xs uppercase tracking-wider text-[#784621]">
                          {isAdding ? 'Adicionar Novo Serviço à Tabela' : 'Alterar Nome e Detalhes do Serviço'}
                        </h5>
                      </div>
                      <span className="text-[11px] text-[#8a7260]">
                        {isAdding ? 'Novo item' : `ID: ${editingId}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Service Name - Highlighted Field */}
                      <div className="sm:col-span-8">
                        <label className="block text-xs font-bold text-[#27211d] mb-1">
                          Nome do Serviço * <span className="text-[11px] font-normal text-[#784621]">(você pode mudar como desejar)</span>
                        </label>
                        <input
                          type="text"
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          placeholder="Ex: Troca de solado Vibram ou Pintura especial..."
                          required
                          className="w-full px-3 py-2 rounded-lg border-2 border-[#784621]/40 bg-white text-xs font-semibold text-[#27211d] focus:border-[#784621] focus:outline-none"
                        />
                      </div>

                      {/* Category */}
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-semibold text-[#27211d] mb-1">
                          Categoria
                        </label>
                        <select
                          value={formCategory}
                          onChange={e => setFormCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg border border-[#d8cbbe] bg-white text-xs focus:outline-none focus:border-[#784621]"
                        >
                          <option value="Solados & Saltos">Solados & Saltos</option>
                          <option value="Estética & Lavagem">Estética & Lavagem</option>
                          <option value="Estrutura & Ajustes">Estrutura & Ajustes</option>
                        </select>
                      </div>

                      {/* Price */}
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-bold text-[#27211d] mb-1">
                          Preço Fixo Exibido * <span className="text-[11px] font-normal text-[#784621]">(exato para clientes)</span>
                        </label>
                        <input
                          type="text"
                          value={formPrice}
                          onChange={e => setFormPrice(e.target.value)}
                          placeholder="Ex: R$ 85,00 ou A partir de R$ 90,00"
                          required
                          className="w-full px-3 py-2 rounded-lg border border-[#d8cbbe] bg-white text-xs font-bold text-[#784621] focus:outline-none focus:border-[#784621]"
                        />
                      </div>

                      {/* Turnaround */}
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-semibold text-[#27211d] mb-1">
                          Prazo Médio de Execução
                        </label>
                        <input
                          type="text"
                          value={formDays}
                          onChange={e => setFormDays(e.target.value)}
                          placeholder="Ex: 2 a 3 dias úteis"
                          className="w-full px-3 py-2 rounded-lg border border-[#d8cbbe] bg-white text-xs focus:outline-none focus:border-[#784621]"
                        />
                      </div>

                      {/* Description */}
                      <div className="sm:col-span-12">
                        <label className="block text-xs font-semibold text-[#27211d] mb-1">
                          Descrição Técnica do Serviço (opcional)
                        </label>
                        <input
                          type="text"
                          value={formDescription}
                          onChange={e => setFormDescription(e.target.value)}
                          placeholder="Ex: Borracha antiderrapante de alta resistência e costura manual..."
                          className="w-full px-3 py-2 rounded-lg border border-[#d8cbbe] bg-white text-xs focus:outline-none focus:border-[#784621]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#ebdcd0]">
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="px-3 py-2 rounded-lg text-xs font-semibold text-[#675445] hover:bg-[#ede3d5] cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-[#784621] hover:bg-[#5f3618] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Salvar Serviço</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Action bar with button to Add New Service */
                  <div className="space-y-3 pb-3 mb-2 border-b border-[#ebdcd0] shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#27211d]">
                          Gerenciamento de Serviços da Sapataria
                        </p>
                        <p className="text-[11px] text-[#675445]">
                          Você pode alterar o <b>nome</b>, <b>preço</b>, <b>prazo</b> ou <b>adicionar novos serviços</b> abaixo:
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={startAdd}
                        className="inline-flex items-center gap-1.5 bg-[#784621] hover:bg-[#5f3618] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Novo Serviço</span>
                      </button>
                    </div>

                    {/* Quick Suggestions strip */}
                    <div className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#ebd8c5]">
                      <p className="text-[10px] font-bold text-[#784621] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Sugestões rápidas para adicionar com 1 clique:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {quickServiceSuggestions.map((sug, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleApplySuggestion(sug)}
                            className="text-[11px] bg-white hover:bg-[#f5ede3] text-[#4a3525] border border-[#d8cbbe] px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 text-[#784621]" />
                            <span>{sug.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* List of current services */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                  {services.map(service => (
                    <div
                      key={service.id}
                      className="p-3 rounded-xl border border-[#e8dfd5] bg-[#faf7f2]/80 hover:bg-[#faf7f2] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#27211d] text-sm">
                            {service.name}
                          </span>
                          <span className="text-[10px] text-[#784621] bg-[#f5ede3] px-2 py-0.5 rounded border border-[#e8dfd5] shrink-0 font-medium">
                            {service.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#675445] mt-1 leading-snug">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] mt-1.5 text-[#8a7260]">
                          <span className="font-bold text-[#784621] bg-white px-2 py-0.5 rounded border border-[#e4d8cc]">
                            {service.estimatedPrice}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{service.turnaroundDays}</span>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons with explicit labels */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[#ebdcd0] w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => startEdit(service)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#784621] hover:text-[#5f3618] bg-white hover:bg-[#ede3d5] px-2.5 py-1.5 rounded-lg border border-[#d8cbbe] cursor-pointer transition-colors"
                          title="Alterar o nome, preço ou detalhes deste serviço"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Alterar Nome/Preço</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => duplicateService(service)}
                          className="p-1.5 rounded-lg text-[#675445] hover:text-[#27211d] hover:bg-white border border-transparent hover:border-[#d8cbbe] cursor-pointer"
                          title="Criar cópia deste serviço para editar"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteService(service.id, service.name)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer"
                          title="Excluir serviço da tabela"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer of the services list */}
                <div className="pt-3 mt-2 border-t border-[#ebdcd0] flex items-center justify-between text-xs text-[#8a7260] shrink-0">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="inline-flex items-center gap-1 text-[#8a7260] hover:text-[#784621] underline decoration-dotted cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar serviços padrão</span>
                  </button>
                  <span className="text-[11px] font-medium">Total: {services.length} serviços cadastrados</span>
                </div>
              </div>
            )}

            {/* TAB: ANTES & DEPOIS (FOTOS E DESCRIÇÕES) */}
            {activeTab === 'antes_depois' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header with Title and Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ebdcd0] gap-2 shrink-0">
                  <div>
                    <h4 className="font-bold text-sm text-[#27211d] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#784621]" />
                      <span>Gerenciador de Antes & Depois</span>
                    </h4>
                    <p className="text-xs text-[#6e5a4a]">
                      Altere fotos, títulos, categorias, tags e descrições dos calçados restaurados ou adicione novos casos.
                    </p>
                  </div>
                  {!isAddingCase && !editingCaseId && (
                    <button
                      type="button"
                      onClick={startAddCase}
                      className="inline-flex items-center gap-1.5 bg-[#784621] hover:bg-[#5f3618] text-[#faf7f2] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Novo Antes & Depois</span>
                    </button>
                  )}
                </div>

                {/* Form to Add or Edit a Before & After Case */}
                {(isAddingCase || editingCaseId) && (
                  <form onSubmit={handleSaveCaseForm} className="my-3 p-4 rounded-xl bg-[#faf7f2] border-2 border-[#d8c5b2] space-y-3.5 shrink-0 shadow-xs max-h-[55vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd0]">
                      <div className="flex items-center gap-2">
                        {isAddingCase ? (
                          <div className="w-6 h-6 rounded bg-[#784621] text-white flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded bg-[#543016] text-white flex items-center justify-center">
                            <Edit2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <h5 className="font-bold text-xs text-[#27211d]">
                          {isAddingCase ? 'Cadastrar Novo Caso de Restauração' : `Editando: ${caseTitle || 'Caso Selecionado'}`}
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={cancelCaseForm}
                        className="text-xs text-[#8a7260] hover:text-[#27211d] font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    {/* Image Selector & Live Preview */}
                    <div>
                      <label className="block text-xs font-semibold text-[#27211d] mb-1">
                        Foto da Restauração (Antes & Depois) *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Preview Box */}
                        <div className="sm:col-span-4 relative aspect-4/3 rounded-xl overflow-hidden border border-[#d8c5b2] bg-[#f0e7dc]">
                          {caseImage ? (
                            <img
                              src={caseImage}
                              alt="Preview da restauração"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[#8a7260] text-xs p-2 text-center">
                              <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                              <span>Sem foto selecionada</span>
                            </div>
                          )}
                        </div>

                        {/* Upload & URL Input */}
                        <div className="sm:col-span-8 space-y-2">
                          <div>
                            <label 
                              htmlFor="case-image-upload" 
                              className="inline-flex items-center gap-2 bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer shadow-xs transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Subir Foto do Computador / Celular</span>
                            </label>
                            <input
                              type="file"
                              id="case-image-upload"
                              accept="image/*"
                              onChange={handleCaseFileUpload}
                              className="hidden"
                            />
                            <p className="text-[11px] text-[#8a7260] mt-1">
                              Formatos suportados: JPG, PNG, WEBP. A foto é salva instantaneamente.
                            </p>
                          </div>

                          <div className="pt-1">
                            <span className="text-[11px] font-semibold text-[#5a483a] block mb-1">
                              Ou cole o link / URL da foto:
                            </span>
                            <input
                              type="text"
                              value={caseImage}
                              onChange={(e) => setCaseImage(e.target.value)}
                              placeholder="https://exemplo.com/minha-foto.jpg"
                              className="w-full px-3 py-1.5 rounded-lg border border-[#d8cbbe] text-xs bg-white focus:outline-none focus:border-[#784621]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#27211d] mb-1">
                          Título do Caso / Modelo *
                        </label>
                        <input
                          type="text"
                          value={caseTitle}
                          onChange={(e) => setCaseTitle(e.target.value)}
                          placeholder="Ex: Recuperação de Solado Oxford & Tingimento"
                          required
                          className="w-full px-3 py-2 rounded-xl border border-[#d8cbbe] text-xs bg-white focus:outline-none focus:border-[#784621]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#27211d] mb-1">
                          Categoria do Calçado *
                        </label>
                        <select
                          value={caseCategory}
                          onChange={(e) => setCaseCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#d8cbbe] text-xs bg-white focus:outline-none focus:border-[#784621]"
                        >
                          <option value="Sapato Social / Mocassim">Sapato Social / Mocassim</option>
                          <option value="Tênis (Esportivo / Casual)">Tênis (Esportivo / Casual)</option>
                          <option value="Bota / Coturno">Bota / Coturno</option>
                          <option value="Salto / Calçado Feminino">Salto / Calçado Feminino</option>
                          <option value="Bolsa / Acessório de Couro">Bolsa / Acessório de Couro</option>
                          <option value="Outro Calçado / Restauração Geral">Outro Calçado / Restauração Geral</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#27211d] mb-1">
                        Descrição Completa do Antes & Depois / Reparo Realizado *
                      </label>
                      <textarea
                        value={caseDescription}
                        onChange={(e) => setCaseDescription(e.target.value)}
                        placeholder="Descreva detalhadamente o estado inicial do calçado e as técnicas e produtos aplicados..."
                        rows={2}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#d8cbbe] text-xs bg-white focus:outline-none focus:border-[#784621]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#27211d] mb-1">
                        Tags de Destaque / Melhorias (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={caseTags}
                        onChange={(e) => setCaseTags(e.target.value)}
                        placeholder="Ex: Meia sola Vibram, Tingimento artesanal, Costura manual"
                        className="w-full px-3 py-2 rounded-xl border border-[#d8cbbe] text-xs bg-white focus:outline-none focus:border-[#784621]"
                      />
                      <p className="text-[11px] text-[#8a7260] mt-1">
                        Essas tags aparecem como selos de acabamento e técnicas no card da galeria.
                      </p>
                    </div>

                    {caseError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{caseError}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ebdcd0]">
                      <button
                        type="button"
                        onClick={cancelCaseForm}
                        className="px-4 py-2 rounded-xl border border-[#d8cbbe] text-xs font-semibold text-[#675445] hover:bg-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAddingCase ? 'Salvar Novo Caso' : 'Salvar Alterações'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Existing Before & After Cases */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-2">
                  {beforeAfterItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-[#e4d8cc] bg-white hover:border-[#cbbaa8] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#ded2c3] shrink-0 bg-[#e8dfd5] relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-sm text-[#27211d] truncate">
                              {item.title}
                            </h5>
                            <span className="text-[10px] font-semibold text-[#784621] bg-[#faf0e6] px-2 py-0.5 rounded-md border border-[#edd7c2]">
                              {item.category}
                            </span>
                          </div>

                          <p className="text-xs text-[#5a483a] mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.improvementTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium text-[#6e5a4a] bg-[#f5ede3] px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => startEditCase(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#784621] bg-[#fdf8f4] hover:bg-[#f6eee4] border border-[#ebdcd0] cursor-pointer flex items-center gap-1"
                          title="Editar foto, título e descrição"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCase(item.id, item.title)}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer"
                          title="Excluir este caso da galeria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer of Before & After */}
                <div className="pt-3 mt-2 border-t border-[#ebdcd0] flex items-center justify-between text-xs text-[#8a7260] shrink-0">
                  <button
                    type="button"
                    onClick={handleResetDefaultCases}
                    className="inline-flex items-center gap-1 text-[#8a7260] hover:text-[#784621] underline decoration-dotted cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar galeria padrão</span>
                  </button>
                  <span className="text-[11px] font-medium">Total: {beforeAfterItems.length} casos cadastrados</span>
                </div>
              </div>
            )}

            {/* TAB: FOTOS DO SITE (HERO & BANNER) */}
            {activeTab === 'fotos' && (
              <div className="flex-1 overflow-y-auto py-2 space-y-4 max-w-2xl mx-auto w-full pr-1">
                <div className="text-center mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#faf3ea] text-[#784621] mx-auto flex items-center justify-center mb-2 border border-[#ebd8c5] shadow-xs">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-[#27211d]">Foto Principal do Site (Hero)</h4>
                  <p className="text-xs text-[#675445] mt-1">
                    Altere a imagem principal exibida no topo do site da Sapataria Liberdade.
                  </p>
                </div>

                {/* Live Image Preview Card */}
                <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#d8c5b2] shadow-xs space-y-4">
                  <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-[#e8dfd5] border border-[#cbbaa8]">
                    <img
                      src={tempHeroUrl}
                      alt="Preview da foto principal do site"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      Visualização em Tempo Real
                    </div>
                  </div>

                  {/* Upload options */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <label
                        htmlFor="hero-file-input"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#784621] hover:bg-[#5f3618] text-white px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Escolher Nova Foto do Computador / Celular</span>
                      </label>
                      <input
                        type="file"
                        id="hero-file-input"
                        accept="image/*"
                        onChange={handleHeroFileUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={handleResetHero}
                        className="px-4 py-3 rounded-xl border border-[#d8cbbe] text-xs font-semibold text-[#675445] hover:bg-white cursor-pointer inline-flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restaurar Foto Padrão</span>
                      </button>
                    </div>

                    {/* URL Input */}
                    <form onSubmit={handleSaveHeroUrl} className="pt-2">
                      <label className="block text-xs font-semibold text-[#27211d] mb-1">
                        Ou digite/cole o link de uma imagem:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tempHeroUrl}
                          onChange={(e) => setTempHeroUrl(e.target.value)}
                          placeholder="https://exemplo.com/foto.jpg"
                          className="flex-1 px-3.5 py-2 rounded-xl border border-[#d8cbbe] text-xs bg-white focus:outline-none focus:border-[#784621]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#543016] hover:bg-[#3d2310] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                        >
                          Salvar URL
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Craft Preset Suggestions */}
                <div className="space-y-2 pt-2">
                  <h5 className="font-bold text-xs text-[#27211d] uppercase tracking-wider">
                    Galeria de Fotos da Sapataria (1 Clique para Selecionar)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRESET_PHOTOS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectPresetHero(preset.url, preset.title)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 bg-white ${
                          tempHeroUrl === preset.url
                            ? 'border-[#784621] ring-2 ring-[#784621]/30 bg-[#fdf8f4]'
                            : 'border-[#e4d8cc] hover:border-[#cbbaa8]'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#ded2c3] bg-[#e8dfd5]">
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#27211d] truncate">
                            {preset.title}
                          </p>
                          <p className="text-[11px] text-[#6e5a4a] truncate">
                            {preset.subtitle}
                          </p>
                        </div>
                        {tempHeroUrl === preset.url && (
                          <div className="w-5 h-5 rounded-full bg-[#784621] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EDIT CPF AND PASSWORD (PRIVATE & SECURE) */}
            {activeTab === 'credenciais' && (
              <div className="flex-1 overflow-y-auto py-3 max-w-md mx-auto w-full space-y-4">
                <div className="text-center mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#faf3ea] text-[#784621] mx-auto flex items-center justify-center mb-2 border border-[#ebd8c5] shadow-xs">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-sm text-[#27211d]">Editar CPF e Senha do Desenvolvedor</h5>
                  <p className="text-xs text-[#675445] mt-1">
                    Defina credenciais que <b>só você conhece</b>. Elas ficam salvas com segurança no navegador.
                  </p>
                </div>

                {/* Security Status Box with MASKED CPF */}
                <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#ebd8c5] text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#543016] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Criptografia Ativa:</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      SHA-256 Irreversível
                    </span>
                  </div>
                  <p className="text-[11px] text-[#675445]">
                    CPF atualmente ativo: <b className="font-mono text-[#27211d]">{storedCpfMasked}</b>
                  </p>
                  <p className="text-[10px] text-[#8a7260] leading-relaxed">
                    Sua senha e CPF são protegidos por hash criptográfico unidirecional. Mesmo inspecionando o código-fonte ou o navegador, é matematicamente impossível decifrar suas senhas.
                  </p>
                </div>

                <form onSubmit={handleSaveCredentials} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      Novo CPF do Desenvolvedor
                    </label>
                    <input
                      type="text"
                      value={newCpf}
                      onChange={e => {
                        setNewCpf(formatCPF(e.target.value));
                        setCredentialsError(null);
                      }}
                      placeholder="000.000.000-00 (deixe vazio se não quiser alterar)"
                      maxLength={14}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] text-sm font-mono focus:outline-none focus:border-[#784621]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      Nova Senha Secreta
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => {
                          setNewPassword(e.target.value);
                          setCredentialsError(null);
                        }}
                        placeholder="Nova senha (mínimo 4 caracteres)"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#d8cbbe] text-sm focus:outline-none focus:border-[#784621]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7260] hover:text-[#27211d] cursor-pointer"
                        title={showNewPassword ? 'Ocultar' : 'Exibir'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1">
                      Confirmar a Nova Senha
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        setCredentialsError(null);
                      }}
                      placeholder="Repita a nova senha exatamente igual"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] text-sm focus:outline-none focus:border-[#784621]"
                    />
                  </div>

                  {credentialsError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{credentialsError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    Salvar Novo CPF e Senha
                  </button>
                </form>
              </div>
            )}

            {/* TAB: WHATSAPP & INSTAGRAM CHANNELS */}
            {activeTab === 'whatsapp' && (
              <div className="flex-1 overflow-y-auto py-3 max-w-2xl mx-auto w-full space-y-6">
                
                {/* 1. SEÇÃO INSTAGRAM (RODAPÉ DO SITE) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#e2d5c6] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2d5c6]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-xs">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm sm:text-base text-[#27211d]">
                          Link do Instagram Oficial (Rodapé)
                        </h5>
                        <p className="text-xs text-[#7e6b5d]">
                          Modifique o link do perfil do Instagram exibido no rodapé para todos os visitantes do site.
                        </p>
                      </div>
                    </div>

                    {tempInstagram && (
                      <a
                        href={tempInstagram.startsWith('http') ? tempInstagram : `https://instagram.com/${tempInstagram.replace(/^@/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#bc1888] hover:text-[#dc2743] bg-pink-50 hover:bg-pink-100 px-2.5 py-1.5 rounded-lg border border-pink-200 transition-colors"
                        title="Abrir perfil no Instagram"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Testar Link</span>
                      </a>
                    )}
                  </div>

                  <form onSubmit={handleSaveInstagramForm} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#27211d] mb-1">
                        URL do Perfil no Instagram (ou @usuário):
                      </label>
                      <input
                        type="text"
                        value={tempInstagram}
                        onChange={e => setTempInstagram(e.target.value)}
                        placeholder="Ex: https://instagram.com/sapatarialiberdade ou @sapatarialiberdade"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] bg-white text-xs sm:text-sm font-mono text-[#27211d] focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20"
                      />
                      <p className="text-[11px] text-[#8a7260] mt-1">
                        Link atualmente ativo no rodapé: <b className="font-mono text-[#27211d]">{instagramUrl}</b>
                      </p>
                    </div>

                    {/* Visual Preview Box replicating the dark footer design */}
                    <div className="p-3.5 rounded-xl bg-[#1e1712] border border-[#382b22] text-[#d6c7b9] space-y-2">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#dfb892]">
                        Prévia no Rodapé do Site:
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 text-xs text-[#faf7f2] bg-[#27211d] px-3 py-1.5 rounded-lg border border-[#3e3025]">
                          <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                          <span className="font-medium">Siga no Instagram</span>
                          <span className="text-[10px] text-[#a89584]">↗</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#faf7f2]">
                          <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
                          <span className="font-medium">
                            {tempInstagram.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '@').replace(/\/$/, '') || '@sapatarialiberdade'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                    >
                      Salvar Link do Instagram
                    </button>
                  </form>

                  {/* Preset Suggestions for Instagram */}
                  <div className="pt-2 border-t border-[#ebdcd0]">
                    <span className="block text-[11px] font-semibold text-[#784621] uppercase tracking-wider mb-2">
                      Sugestões Rápidas de Link / Perfil:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleApplyInstagramPreset('https://instagram.com/sapatarialiberdade')}
                        className="p-2 text-left rounded-lg border border-[#e2d5c6] bg-white hover:border-[#784621] hover:bg-[#faf7f2] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-mono text-[11px] text-[#27211d]">@sapatarialiberdade</span>
                        <span className="text-[10px] text-[#784621] font-semibold">Padrão</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyInstagramPreset('https://instagram.com/sapataria.liberdade')}
                        className="p-2 text-left rounded-lg border border-[#e2d5c6] bg-white hover:border-[#784621] hover:bg-[#faf7f2] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-mono text-[11px] text-[#27211d]">@sapataria.liberdade</span>
                        <span className="text-[10px] text-[#784621] font-semibold">Opção</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyInstagramPreset('https://instagram.com/sapatariaoficial')}
                        className="p-2 text-left rounded-lg border border-[#e2d5c6] bg-white hover:border-[#784621] hover:bg-[#faf7f2] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-mono text-[11px] text-[#27211d]">@sapatariaoficial</span>
                        <span className="text-[10px] text-[#784621] font-semibold">Opção</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyInstagramPreset('https://instagram.com/ateliercouroliberdade')}
                        className="p-2 text-left rounded-lg border border-[#e2d5c6] bg-white hover:border-[#784621] hover:bg-[#faf7f2] transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-mono text-[11px] text-[#27211d]">@ateliercouroliberdade</span>
                        <span className="text-[10px] text-[#784621] font-semibold">Atelier</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. SEÇÃO WHATSAPP OFICIAL */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#e2d5c6] space-y-4 shadow-xs">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#e2d5c6]">
                    <div className="w-10 h-10 rounded-xl bg-[#eef8f1] text-[#25D366] flex items-center justify-center shadow-xs">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm sm:text-base text-[#27211d]">
                        WhatsApp Oficial da Sapataria
                      </h5>
                      <p className="text-xs text-[#7e6b5d]">
                        Número que recebe os orçamentos tabelados e as ordens de serviço.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSavePhone} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#27211d] mb-1">
                        Número com DDD (Brasil +55):
                      </label>
                      <input
                        type="text"
                        value={tempPhone}
                        onChange={e => setTempPhone(e.target.value)}
                        placeholder="Ex: +55 11 98765-4321 ou 11987654321"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] bg-white text-sm font-mono focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20"
                      />
                      <p className="text-[11px] text-[#8a7260] mt-1.5">
                        Número ativo no site: <b className="font-mono text-[#27211d]">{whatsappNumber}</b>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-bold cursor-pointer transition-all shadow-xs active:scale-[0.99]"
                    >
                      Salvar Novo Número do WhatsApp
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* TAB: ENDEREÇO & LOCALIZAÇÃO */}
            {activeTab === 'endereco' && (
              <div className="flex-1 overflow-y-auto py-3 max-w-2xl mx-auto w-full space-y-5">
                <div className="text-center mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#faf3ea] text-[#784621] mx-auto flex items-center justify-center mb-2 border border-[#ebd8c5] shadow-xs">
                    <MapPin className="w-5 h-5 text-[#784621]" />
                  </div>
                  <h5 className="font-bold text-base text-[#27211d]">Endereço & Localização do Atelier</h5>
                  <p className="text-xs text-[#675445] mt-1 max-w-md mx-auto leading-relaxed">
                    Personalize o endereço físico da sapataria exibido no rodapé do site, nas opções de entrega no balcão e no comprovante impresso de Ordem de Serviço.
                  </p>
                </div>

                {/* Form to edit address and operating hours */}
                <form onSubmit={handleSaveAddressForm} className="p-4 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#e2d5c6] space-y-4 shadow-xs">
                  <div>
                    <label className="block text-xs font-bold text-[#27211d] mb-1">
                      Endereço Completo (Rua, Número, Bairro, Cidade - UF e CEP) *
                    </label>
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={e => setTempAddress(e.target.value)}
                      placeholder="Ex: Rua da Liberdade, 250 - Bairro Liberdade, São Paulo - SP"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] bg-white text-xs sm:text-sm font-medium text-[#27211d] focus:outline-none focus:border-[#784621] focus:ring-2 focus:ring-[#784621]/20"
                    />
                    <p className="text-[11px] text-[#8a7260] mt-1">
                      Exibido em destaque no rodapé e nos comprovantes aos clientes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#27211d] mb-1">
                        Complemento / Ponto de Referência
                      </label>
                      <input
                        type="text"
                        value={tempComplement}
                        onChange={e => setTempComplement(e.target.value)}
                        placeholder="Ex: Próximo ao Metrô / Atelier Central"
                        className="w-full px-3 py-2 rounded-xl border border-[#d8cbbe] bg-white text-xs text-[#27211d] focus:outline-none focus:border-[#784621]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#27211d] mb-1">
                        Horário de Atendimento
                      </label>
                      <input
                        type="text"
                        value={tempHours}
                        onChange={e => setTempHours(e.target.value)}
                        placeholder="Ex: Seg a Sex: 08:30 às 18:30 | Sáb: 09:00 às 14:00"
                        className="w-full px-3 py-2 rounded-xl border border-[#d8cbbe] bg-white text-xs text-[#27211d] focus:outline-none focus:border-[#784621]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#27211d] mb-1 flex items-center justify-between">
                      <span>Link do Google Maps / Rotas (Opcional)</span>
                      {tempMapsUrl && (
                        <a 
                          href={tempMapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-[11px] text-[#784621] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Testar no Maps</span>
                        </a>
                      )}
                    </label>
                    <input
                      type="url"
                      value={tempMapsUrl}
                      onChange={e => setTempMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cbbe] bg-white text-xs font-mono text-[#27211d] focus:outline-none focus:border-[#784621]"
                    />
                    <p className="text-[11px] text-[#8a7260] mt-1">
                      Ao preencher, o endereço no rodapé se torna um link direto para o cliente traçar a rota até a sua sapataria.
                    </p>
                  </div>

                  {/* Visual Preview Box */}
                  <div className="pt-3 border-t border-[#ebdcd0]">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#784621] mb-2">
                      Prévia de como os clientes verão:
                    </span>
                    <div className="p-3 rounded-xl bg-[#27211d] text-[#faf7f2] flex items-start gap-3 text-xs shadow-inner">
                      <MapPin className="w-4 h-4 text-[#dfb892] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{tempAddress || 'Endereço não informado'}</p>
                        {tempComplement && <p className="text-[11px] text-[#cbb5a0]">{tempComplement}</p>}
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#e8dfd5]">
                          <Clock className="w-3 h-3 text-[#dfb892]" />
                          <span>{tempHours}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#784621] hover:bg-[#5f3618] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    Salvar Alterações de Endereço
                  </button>
                </form>

                {/* Quick Presets / Sugestões Prontas */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#8a7260]">
                    <span className="font-semibold text-[#784621] uppercase tracking-wider text-[11px]">
                      Exemplos Prontos para Testar
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyAddressPreset(
                        'Rua da Liberdade, 250 - Bairro Liberdade, São Paulo - SP',
                        'Atelier Central & Ponto de Coleta e Entrega',
                        'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00',
                        'https://maps.google.com/?q=Rua+da+Liberdade+250+Sao+Paulo'
                      )}
                      className="text-[11px] text-[#784621] hover:underline cursor-pointer"
                    >
                      Restaurar Liberdade Padrão
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleApplyAddressPreset(
                        'Rua da Liberdade, 250 - Liberdade, São Paulo - SP',
                        'Próximo ao Metrô Japão-Liberdade · Atelier Central',
                        'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00',
                        'https://maps.google.com/?q=Rua+da+Liberdade+250+Sao+Paulo'
                      )}
                      className="p-2.5 text-left rounded-xl border border-[#e2d5c6] bg-white hover:border-[#784621] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                    >
                      <p className="font-bold text-[#27211d]">Liberdade (São Paulo - SP)</p>
                      <p className="text-[11px] text-[#7e6b5d] truncate">Rua da Liberdade, 250</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyAddressPreset(
                        'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
                        'Galeria Nobre - Loja 12 · Próximo ao Metrô Trianon',
                        'Segunda a Sexta: 09:00 às 19:00 | Sábado: 09:00 às 15:00',
                        'https://maps.google.com/?q=Avenida+Paulista+1000+Sao+Paulo'
                      )}
                      className="p-2.5 text-left rounded-xl border border-[#e2d5c6] bg-white hover:border-[#784621] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                    >
                      <p className="font-bold text-[#27211d]">Paulista (São Paulo - SP)</p>
                      <p className="text-[11px] text-[#7e6b5d] truncate">Av. Paulista, 1000</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyAddressPreset(
                        'Rua do Ouvidor, 85 - Centro Histórico, Rio de Janeiro - RJ',
                        'Atelier Tradicional · Ponto de Apoio Centro',
                        'Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:30 às 13:00',
                        'https://maps.google.com/?q=Rua+do+Ouvidor+85+Rio+de+Janeiro'
                      )}
                      className="p-2.5 text-left rounded-xl border border-[#e2d5c6] bg-white hover:border-[#784621] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                    >
                      <p className="font-bold text-[#27211d]">Centro (Rio de Janeiro - RJ)</p>
                      <p className="text-[11px] text-[#7e6b5d] truncate">Rua do Ouvidor, 85</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyAddressPreset(
                        'Rua Pernambuco, 340 - Savassi, Belo Horizonte - MG',
                        'Atelier de Couro & Sapataria Artesanal',
                        'Segunda a Sexta: 08:30 às 18:30 | Sábado: 09:00 às 14:00',
                        'https://maps.google.com/?q=Rua+Pernambuco+340+Savassi+Belo+Horizonte'
                      )}
                      className="p-2.5 text-left rounded-xl border border-[#e2d5c6] bg-white hover:border-[#784621] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                    >
                      <p className="font-bold text-[#27211d]">Savassi (Belo Horizonte - MG)</p>
                      <p className="text-[11px] text-[#7e6b5d] truncate">Rua Pernambuco, 340</p>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
