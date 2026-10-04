export type AppMode = 'build' | 'design' | 'flow' | 'preview';

export type ElementType = 'text' | 'button' | 'card' | 'badge' | 'image' | 'input' | 'container' | 'price';

export interface ElementStyles {
  width?: string;
  height?: string;
  x?: number;
  y?: number;
  padding?: string;
  margin?: string;
  fontSize?: number;
  fontWeight?: '400' | '500' | '600' | '700';
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export interface CanvasElement {
  id: string;
  name: string;
  type: ElementType;
  content: string;
  styles: ElementStyles;
  actionTarget?: string; // Screen ID to navigate to
  actionLabel?: string;
  secondaryContent?: string;
  imageUrl?: string;
  isDraggable?: boolean;
}

export interface Screen {
  id: string;
  name: string;
  description: string;
  category: 'discovery' | 'conversion' | 'fulfillment' | 'auth';
  elements: CanvasElement[];
  layoutType?: 'mobile-list' | 'grid' | 'form' | 'detail' | 'status';
  isGenerated?: boolean;
}

export interface FlowStep {
  id: string;
  screenId: string;
  title: string;
  actionTrigger: string; // e.g. "Clicks Buy Now", "Enters Delivery Address", "Taps Pay Now"
  targetScreenId?: string; // where this step points to
  notes?: string;
}

export interface ProductFlow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  active?: boolean;
  category?: string;
}

export interface PrototypeProject {
  id: string;
  name: string;
  prompt: string;
  updatedAt: string;
  screens: Record<string, Screen>;
  flows: Record<string, ProductFlow>;
  activeFlowId: string;
  currentScreenId: string;
}

export interface AIModificationLog {
  id: string;
  timestamp: string;
  userPrompt: string;
  type: 'flow_change' | 'design_change' | 'screen_added';
  title: string;
  description: string;
  affectedScreenId?: string;
  affectedFlowId?: string;
}
