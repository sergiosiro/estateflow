export interface Property {
  id: string;
  slug: string;
  title: string;
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
  tagType?: 'new' | 'open' | 'pricedrop' | 'featured';
  imageUrl: string;
  imageAlt: string;
  images?: string[];
  description?: string;
  isFavorite?: boolean;
}
