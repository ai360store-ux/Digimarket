
import { Product, Category, AppSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-ai', name: 'AI Tools', slug: 'ai-tools', icon: '🤖' },
  { id: 'cat-dev', name: 'Development', slug: 'development', icon: '💻' },
  { id: 'cat-design', name: 'Design', slug: 'design', icon: '🎨' },
  { id: 'cat-streaming', name: 'Streaming', slug: 'streaming', icon: '🎬' },
  { id: 'cat-prod', name: 'Productivity', slug: 'productivity', icon: '⚡' },
];

export const INITIAL_SETTINGS: AppSettings = {
  whatsappNumber: '919876543210',
  whatsappTemplate: "Hi, I'm interested in buying {product}. Reference: {ref}",
  brandName: 'GameVault Pro',
  establishedYear: '2019',
  defaultImageQuality: 0.8,
  preferredImageFormat: 'image/webp',
  currencySymbol: '₹',
  defaultTaxPercent: 0
};

const PRODUCT_LIST = [
  { name: 'Google AI Pro', category: 'AI Tools', versions: ['Pro', 'Ultra'], img: '1670507042503-4556f067d84e' },
  { name: 'Chat GPT Premium', category: 'AI Tools', versions: ['Plus', 'Team'], img: '1675557009807-ad3bc3909197' },
  { name: 'Cursor AI', category: 'Development', versions: ['Pro'], img: '1555066931-4365d14bab8c' },
  { name: 'Lovable Dev', category: 'Development', versions: ['Pro'], img: '1587620962725-abab7fe55159' },
  { name: 'Notion Plus', category: 'Productivity', versions: ['Personal', 'Team'], img: '1527219525722-f9767a7f2884' },
  { name: 'Adobe Cloud', category: 'Design', versions: ['Full Suite', 'Single App'], img: '1618005182384-a83a8bd57fbe' },
  { name: 'Canva Pro', category: 'Design', versions: ['Standard'], img: '1634942537034-253176676767' },
  { name: 'Netflix Premium', category: 'Streaming', versions: ['4K UHD'], img: '1522869635100-9f4c5e81aa3f' }
];

const generateMockProduct = (index: number): Product => {
  const item = PRODUCT_LIST[index % PRODUCT_LIST.length];
  const imgId = item.img || '1618005182384-a83a8bd57fbe';
  
  return {
    id: `prod-${index}`,
    title: item.name,
    shortDescription: `Official ${item.name} License Key. Instant Delivery.`,
    fullDescription: `Authenticated premium access for ${item.name}. Sourced through official licensing channels. This digital asset provides unrestricted access to all premium features, high-speed updates, and 24/7 cloud sync. Fully global and legally compliant.`,
    category: item.category,
    tags: ['verified', 'instant', 'premium'],
    images: [`https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=800&q=80`],
    status: 'active',
    isTrending: index % 3 === 0,
    isBestseller: index % 4 === 0,
    isNew: index % 2 === 0,
    isStaffPick: index % 5 === 0,
    inventory: 50,
    soldCount: 1200 + (index * 45),
    subsections: item.versions.map((v, vIdx) => ({
      id: `sub-${index}-${vIdx}`,
      name: `${v} Edition`,
      options: [
        { id: `opt-1-${index}-${vIdx}`, name: 'Monthly Access', type: 'preset', presetValue: '30 Days', mrp: 1499 + (vIdx * 500), price: 599 + (vIdx * 200) },
        { id: `opt-2-${index}-${vIdx}`, name: 'Annual Pass', type: 'preset', presetValue: '365 Days', mrp: 14999 + (vIdx * 5000), price: 4499 + (vIdx * 2000) }
      ]
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const INITIAL_PRODUCTS: Product[] = Array.from({ length: 24 }).map((_, i) => generateMockProduct(i));
