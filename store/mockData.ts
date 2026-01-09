
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
  brandName: 'DigiMarket Pro',
  establishedYear: '2018',
  defaultImageQuality: 0.6,
  preferredImageFormat: 'image/webp',
  currencySymbol: '₹',
  defaultTaxPercent: 0
};

const PRODUCT_LIST = [
  { name: 'Google AI', category: 'AI Tools', versions: ['Pro', 'Ultra'] },
  { name: 'Chat GPT', category: 'AI Tools', versions: ['Plus', 'Business', 'Go'] },
  { name: 'Replicate', category: 'AI Tools', versions: ['Standard', 'Pro'] },
  { name: 'Cursor AI', category: 'Development', versions: ['Pro'] },
  { name: 'Bolt.new', category: 'Development', versions: ['Standard', 'Pro'] },
  { name: 'Lovable', category: 'Development', versions: ['Standard', 'Pro'] },
  { name: 'Hicksfield', category: 'AI Tools', versions: ['Standard'] },
  { name: 'Make.com', category: 'Productivity', versions: ['Core', 'Pro'] },
  { name: 'You.com', category: 'AI Tools', versions: ['Pro'] },
  { name: 'Framer', category: 'Design', versions: ['Mini', 'Pro'] },
  { name: 'Webflow', category: 'Design', versions: ['CMS', 'Business'] },
  { name: 'Amazon Prime Video', category: 'Streaming', versions: ['Standard'] },
  { name: 'Discovery Plus', category: 'Streaming', versions: ['Standard'] },
  { name: 'Movie (MBI)', category: 'Streaming', versions: ['Standard'] },
  { name: 'Hootsuite', category: 'Productivity', versions: ['Pro'] },
  { name: 'Notion', category: 'Productivity', versions: ['Plus', 'Business'] },
  { name: 'Jasper', category: 'AI Tools', versions: ['Creator', 'Pro'] },
  { name: 'Beautiful AI', category: 'Productivity', versions: ['Pro'] },
  { name: 'Gamma', category: 'Productivity', versions: ['Plus', 'Pro'] },
  { name: 'Superhuman', category: 'Productivity', versions: ['Standard'] },
  { name: 'Perplexity Pro', category: 'AI Tools', versions: ['Standard'] },
  { name: 'Apple TV Plus', category: 'Streaming', versions: ['Standard'] },
  { name: 'Vapi', category: 'Development', versions: ['Standard'] },
  { name: 'N8N', category: 'Development', versions: ['Standard', 'Pro'] },
  { name: 'Raycast Pro', category: 'Productivity', versions: ['Standard'] },
  { name: 'ClickUp', category: 'Productivity', versions: ['Unlimited', 'Business'] },
  { name: 'CapCut', category: 'Design', versions: ['Pro'] },
  { name: 'Liner', category: 'AI Tools', versions: ['Pro'] },
  { name: 'Whisper Flow', category: 'AI Tools', versions: ['Pro'] },
  { name: 'Mobin Pro', category: 'Design', versions: ['Standard'] },
  { name: 'Devin Core', category: 'Development', versions: ['Standard'] },
  { name: 'Descrip', category: 'AI Tools', versions: ['Pro'] },
  { name: 'Magic Pattern', category: 'Design', versions: ['Pro'] },
  { name: 'Hostinger', category: 'Development', versions: ['Premium', 'Business'] },
  { name: 'Chat PRD Pro', category: 'Productivity', versions: ['Standard'] },
  { name: 'Freepik', category: 'Design', versions: ['Pro'] },
  { name: 'Canva Pro', category: 'Design', versions: ['Standard'] },
  { name: 'Story Base', category: 'AI Tools', versions: ['Standard'] },
  { name: 'Vista Create', category: 'Design', versions: ['Pro'] },
  { name: 'Pink Monkey', category: 'AI Tools', versions: ['Pro'] },
  { name: 'Granola', category: 'Productivity', versions: ['Standard'] },
  { name: 'Autodesk', category: 'Design', versions: ['Standard'] },
  { name: 'Adobe', category: 'Design', versions: ['Creative Cloud', 'Single App'] },
  { name: 'Coursera', category: 'Productivity', versions: ['Plus'] }
];

const generateMockProduct = (index: number): Product => {
  const item = PRODUCT_LIST[index % PRODUCT_LIST.length];
  
  return {
    id: `prod-${index}`,
    title: item.name,
    shortDescription: `Authentic ${item.name} License. Instant Activation.`,
    fullDescription: `Official subscription for ${item.name}. Sourced through verified distribution channels. Includes all premium features, regular updates, and cloud synchronization. Our keys are 100% legal and guaranteed to work globally.`,
    category: item.category,
    tags: ['verified', 'instant', 'premium'],
    images: [`https://picsum.photos/seed/digi-${index}/800/800`],
    status: 'active',
    isTrending: index % 5 === 0,
    isBestseller: index % 7 === 0,
    isNew: index % 3 === 0,
    isStaffPick: index % 10 === 0,
    inventory: 100,
    soldCount: 500 + (index * 12),
    subsections: item.versions.map((v, vIdx) => ({
      id: `sub-${index}-${vIdx}`,
      name: `${v} Version`,
      options: [
        { id: `opt-1-${index}-${vIdx}`, name: '1 Month Plan', type: 'preset', presetValue: '30 Days Access', mrp: 1299 + (vIdx * 500), price: 499 + (vIdx * 200) },
        { id: `opt-2-${index}-${vIdx}`, name: '1 Year Plan', type: 'preset', presetValue: '365 Days Access', mrp: 12999 + (vIdx * 5000), price: 3999 + (vIdx * 2000) }
      ]
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const INITIAL_PRODUCTS: Product[] = PRODUCT_LIST.map((_, i) => generateMockProduct(i));
