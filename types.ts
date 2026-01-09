
export type DurationType = 'preset' | 'calendar';

export interface PriceOption {
  id: string;
  name: string;
  type: DurationType;
  presetValue?: string;
  expiryDate?: string;
  mrp: number;
  price: number;
  taxPercent?: number;
}

export interface Subsection {
  id: string;
  name: string;
  options: PriceOption[];
}

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  tags: string[];
  images: string[];
  status: 'active' | 'inactive';
  isTrending: boolean;
  isBestseller: boolean;
  isNew: boolean;
  isStaffPick: boolean;
  subsections: Subsection[];
  inventory: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface AppSettings {
  whatsappNumber: string;
  whatsappTemplate: string;
  brandName: string;
  establishedYear: string;
  defaultImageQuality: number;
  preferredImageFormat: string;
  currencySymbol: string;
  defaultTaxPercent: number;
}
