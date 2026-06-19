export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  selected: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  cuisineEmoji: string;
  matchPercent: number;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image?: string;
  ingredients: string[];
  steps: CookStep[];
  saved: boolean;
}

export interface CookStep {
  number: number;
  title: string;
  description: string;
  duration?: string;
}

export type IngredientConfidence = 'confirmed' | 'maybe' | 'fix';

export type ReviewIngredient = {
  id: string;
  name: string;
  emoji: string;
  category: 'PRODUCE' | 'DAIRY' | 'PANTRY';
  confidence: IngredientConfidence;
  altName?: string;
  suggestions?: string[];
};
