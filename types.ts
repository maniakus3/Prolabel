
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
  type: 'text' | 'image' | 'pdf' | 'qrcode' | 'barcode' | 'table' | 'shape';
  content: string; // Text string, Image URL, Filename for PDF, or Raw Data for Barcode, or Shape Type
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string; 
  color?: string; // Fill color (can be 'transparent')
  stroke?: string; // Stroke color
  strokeWidth?: number; // Stroke width in mm
  textShadow?: string; 
  rotation?: number;
  // Typography additions
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: 'left' | 'center' | 'right';
  // Barcode specific
  barcodeFormat?: 'CODE128' | 'EAN13';
  // Table specific
  tableRows?: number;
  tableCols?: number;
  tableBorderWidth?: number;
  // Shape specific
  shapeType?: 'rect' | 'circle' | 'triangle' | 'star' | 'heart' | 'hexagon';
  // Internal Render Cache
  _renderUrl?: string; 
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
  productName?: string; // Main product name (e.g., "Naklejki samoprzylepne")
}

// --- CART TYPES ---

export interface CartItem {
  id: string;
  config: EditorConfig;
  elements: CanvasElement[]; // Save the design elements
  previewUrl?: string; // Optional preview
  timestamp: number;
}
