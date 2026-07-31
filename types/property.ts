export interface Property {
  id: string;
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
  isFavorite?: boolean;
}
