import { Language } from "@/lib/i18n/types";

export interface Property {
  id: string;
  slug: string;
  title: string;
  titleTranslations?: Partial<Record<Language, string>>;
  price: number;
  formattedPrice: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  beds: number;
  baths: number | string;
  sqft: number;
  tag: string;
  tagTranslations?: Partial<Record<Language, string>>;
  tagType?: 'new' | 'open' | 'pricedrop' | 'featured';
  imageUrl: string;
  imageAlt: string;
  images?: string[];
  description?: string;
  descriptionTranslations?: Partial<Record<Language, string>>;
  isFavorite?: boolean;
}

