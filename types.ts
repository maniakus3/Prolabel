export interface ProductItem {
  name: string;
  price?: string; // Optional price per unit
  description?: string;
}

export interface SubCategory {
  title: string;
  items: ProductItem[];
}

export interface MainCategory {
  id: string;
  title: string;
  description: string;
  iconName: string; // Mapping to Lucide icon
  subCategories: SubCategory[];
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
