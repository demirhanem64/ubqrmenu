export interface Business {
  id: string;
  name: string;
  description: string;
  address?: string;
  imageUrl: string;
  theme?: 'light' | 'dark' | 'system';
  seo?: {
    title: string;
    description: string;
    keywords?: string;
  };
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  order: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  price: number;
  imageUrl: string;
  videoUrl?: string;
  ingredients?: string[];
  allergens?: string[];
  weight?: string;
  badges: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    spicyLevel?: 0 | 1 | 2 | 3;
  };
  relatedProductIds?: string[];
}
