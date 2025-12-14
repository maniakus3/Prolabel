
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

// --- EDITOR TYPES ---

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'pdf';
  content: string; // Text string, Image URL, or Filename for PDF
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string; 
  color?: string;
  textShadow?: string; 
  rotation?: number;
  // Typography additions
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface EditorConfig {
  width: number;
  height: number;
  shape: string; // 'rect' | 'circle' | 'square' | 'custom'
  material: string;
  cornerRadius: number;
  quantity: number;
  totalPrice: number;
  description: string;
}