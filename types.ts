export interface Ingredient {
  item: string;
  amount: string;
  category: 'Produce' | 'Dairy' | 'Meat' | 'Pantry' | 'Other';
  checked?: boolean;
}

export interface InstructionStep {
  step: number;
  text: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  servings: string;
  imageUrl?: string;
  sourceUrl?: string;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  tags: string[];
  createdAt: number;
}

export type ViewState = 'DASHBOARD' | 'RECIPE_DETAIL' | 'SHOPPING_LIST';

export interface AIParseResponse {
  recipe: Omit<Recipe, 'id' | 'createdAt'>;
}
