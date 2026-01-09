
import { Product, Category, AppSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-ai', name: 'AI Solutions', slug: 'ai-tools', icon: '🤖' },
  { id: 'cat-dev', name: 'Dev Tools', slug: 'development', icon: '💻' },
  { id: 'cat-design', name: 'Creative', slug: 'design', icon: '🎨' },
  { id: 'cat-prod', name: 'Flow & Prod', slug: 'productivity', icon: '⚡' },
];

export const INITIAL_SETTINGS: AppSettings = {
  whatsappNumber: '919876543210',
  whatsappTemplate: "Hi, I'm interested in buying {product}. Reference: {ref}",
  brandName: 'VAULT PORT',
  establishedYear: '2024',
  defaultImageQuality: 0.9,
  preferredImageFormat: 'image/webp',
  currencySymbol: '₹',
  defaultTaxPercent: 0
};

const PRODUCT_LIST = [
  { 
    name: 'Adobe Creative Cloud', 
    category: 'Creative', 
    versions: ['Full Suite All-Apps', 'Photoshop Pro', 'Illustrator Pro'], 
    img: 'Adobe.jpg' 
  },
  { 
    name: 'Canva Pro', 
    category: 'Creative', 
    versions: ['Pro License', 'Team Enterprise'], 
    img: 'image.png' 
  },
  { 
    name: 'ChatGPT Plus', 
    category: 'AI Solutions', 
    versions: ['Personal Plus', 'Team Workspace'], 
    img: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' 
  },
  { 
    name: 'Lovable (Lable)', 
    category: 'Dev Tools', 
    versions: ['Starter Build', 'Pro Scale'], 
    img: 'https://lovable.dev/favicon.ico' 
  },
  { 
    name: 'Cursor AI', 
    category: 'Dev Tools', 
    versions: ['Pro Subscription'], 
    img: 'https://www.cursor.com/assets/images/logo.svg' 
  },
  { 
    name: 'Google Gemini Pro', 
    category: 'AI Solutions', 
    versions: ['Flash', 'Pro', 'Ultra'], 
    img: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v2_f2f3a67d9f743.svg' 
  },
  { 
    name: 'Notion Plus', 
    category: 'Flow & Prod', 
    versions: ['Personal Plus', 'Team Collaboration'], 
    img: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' 
  },
  { 
    name: 'Netflix Premium', 
    category: 'Creative', 
    versions: ['4K UHD + HDR', 'Standard'], 
    img: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png' 
  }
];

const generateMockProduct = (index: number): Product => {
  const item = PRODUCT_LIST[index % PRODUCT_LIST.length];
  
  return {
    id: `prod-${index}`,
    title: item.name,
    shortDescription: `Official Authentication Key for ${item.name}. Secure activation.`,
    fullDescription: `Acquire authenticated premium access for ${item.name}. This digital credential is authenticated through official enterprise channels, ensuring permanent service uptime and full cloud feature parity. Includes 24/7 technical oversight and a verified deployment guide.`,
    category: item.category,
    tags: ['verified', 'instant', 'premium', 'official', item.name.toLowerCase().replace(/\s+/g, '')],
    images: [item.img],
    status: 'active',
    isTrending: index < 4,
    isBestseller: index % 3 === 0,
    isNew: index % 4 === 0,
    isStaffPick: index === 0,
    inventory: 50,
    soldCount: 4200 + (index * 120),
    subsections: item.versions.map((v, vIdx) => ({
      id: `sub-${index}-${vIdx}`,
      name: `${v}`,
      options: [
        { 
          id: `opt-1-${index}-${vIdx}`, 
          name: '30 Day Access', 
          type: 'preset', 
          presetValue: 'Monthly', 
          mrp: 1499 + (vIdx * 200), 
          price: 499 + (vIdx * 100) 
        },
        { 
          id: `opt-2-${index}-${vIdx}`, 
          name: '365 Day Pass', 
          type: 'preset', 
          presetValue: 'Annual', 
          mrp: 18999, 
          price: 3999 
        }
      ]
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const INITIAL_PRODUCTS: Product[] = Array.from({ length: 16 }).map((_, i) => generateMockProduct(i));
