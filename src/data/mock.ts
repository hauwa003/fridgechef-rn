import { Ingredient, Recipe, ReviewIngredient } from '../types';

export const mockIngredients: Ingredient[] = [
  { id: '1', name: 'Chicken Breast', emoji: '🍗', selected: true },
  { id: '2', name: 'Garlic', emoji: '🧄', selected: true },
  { id: '3', name: 'Onion', emoji: '🧅', selected: true },
  { id: '4', name: 'Tomato', emoji: '🍅', selected: true },
  { id: '5', name: 'Olive Oil', emoji: '🫒', selected: true },
  { id: '6', name: 'Bell Pepper', emoji: '🫑', selected: false },
  { id: '7', name: 'Rice', emoji: '🍚', selected: true },
  { id: '8', name: 'Lemon', emoji: '🍋', selected: true },
];

export const mockReviewIngredients: ReviewIngredient[] = [
  { id: 'r1', name: 'Chicken Breast', emoji: '🍗', category: 'PRODUCE', confidence: 'confirmed' },
  { id: 'r2', name: 'Garlic', emoji: '🧄', category: 'PRODUCE', confidence: 'confirmed' },
  { id: 'r3', name: 'Onion', emoji: '🧅', category: 'PRODUCE', confidence: 'confirmed' },
  { id: 'r4', name: 'Tomato', emoji: '🍅', category: 'PRODUCE', confidence: 'maybe', altName: 'or maybe red bell pepper', suggestions: ['Tomato', 'Red bell pepper', 'Cherry tomatoes'] },
  { id: 'r5', name: 'Lemon', emoji: '🍋', category: 'PRODUCE', confidence: 'confirmed' },
  { id: 'r6', name: 'Spinach', emoji: '🥬', category: 'PRODUCE', confidence: 'maybe', altName: 'or maybe kale', suggestions: ['Spinach', 'Kale', 'Arugula'] },
  { id: 'r7', name: 'Milk', emoji: '🥛', category: 'DAIRY', confidence: 'confirmed' },
  { id: 'r8', name: 'Butter', emoji: '🧈', category: 'DAIRY', confidence: 'confirmed' },
  { id: 'r9', name: 'Cheese', emoji: '🧀', category: 'DAIRY', confidence: 'fix', altName: 'couldn\'t identify the type', suggestions: ['Cheddar', 'Mozzarella', 'Parmesan', 'Gouda'] },
  { id: 'r10', name: 'Rice', emoji: '🍚', category: 'PANTRY', confidence: 'confirmed' },
  { id: 'r11', name: 'Olive Oil', emoji: '🫒', category: 'PANTRY', confidence: 'confirmed' },
  { id: 'r12', name: 'Pasta', emoji: '🍝', category: 'PANTRY', confidence: 'fix', altName: 'blurry — is this spaghetti or linguine?', suggestions: ['Spaghetti', 'Linguine', 'Penne', 'Fettuccine'] },
];

export const addIngredientSuggestions: ReviewIngredient[] = [
  { id: 'a1', name: 'Salt', emoji: '🧂', category: 'PANTRY', confidence: 'confirmed' },
  { id: 'a2', name: 'Black Pepper', emoji: '🌶️', category: 'PANTRY', confidence: 'confirmed' },
  { id: 'a3', name: 'Sugar', emoji: '🍬', category: 'PANTRY', confidence: 'confirmed' },
  { id: 'a4', name: 'Flour', emoji: '🌾', category: 'PANTRY', confidence: 'confirmed' },
  { id: 'a5', name: 'Eggs', emoji: '🥚', category: 'DAIRY', confidence: 'confirmed' },
  { id: 'a6', name: 'Carrot', emoji: '🥕', category: 'PRODUCE', confidence: 'confirmed' },
  { id: 'a7', name: 'Potato', emoji: '🥔', category: 'PRODUCE', confidence: 'confirmed' },
  { id: 'a8', name: 'Mushroom', emoji: '🍄', category: 'PRODUCE', confidence: 'confirmed' },
  { id: 'a9', name: 'Soy Sauce', emoji: '🫙', category: 'PANTRY', confidence: 'confirmed' },
  { id: 'a10', name: 'Yogurt', emoji: '🫙', category: 'DAIRY', confidence: 'confirmed' },
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Lemon Herb Chicken',
    cuisine: 'Mediterranean',
    cuisineEmoji: '🇬🇷',
    matchPercent: 92,
    cookTime: '35 min',
    servings: 4,
    difficulty: 'Easy',
    ingredients: ['Chicken Breast', 'Lemon', 'Garlic', 'Olive Oil', 'Onion'],
    steps: [
      { number: 1, title: 'Prep the Chicken', description: 'Pat chicken dry and season with salt, pepper, and herbs.', duration: '5 min' },
      { number: 2, title: 'Sear', description: 'Heat olive oil in a pan over medium-high heat. Sear chicken 4 min per side.', duration: '8 min' },
      { number: 3, title: 'Make the Sauce', description: 'Add garlic, lemon juice, and broth to the pan. Simmer until reduced.', duration: '10 min' },
      { number: 4, title: 'Serve', description: 'Slice chicken and spoon sauce over top. Serve with rice.', duration: '5 min' },
    ],
    saved: false,
  },
  {
    id: '2',
    title: 'Tomato Garlic Rice',
    cuisine: 'Italian',
    cuisineEmoji: '🇮🇹',
    matchPercent: 85,
    cookTime: '25 min',
    servings: 2,
    difficulty: 'Easy',
    ingredients: ['Rice', 'Tomato', 'Garlic', 'Olive Oil', 'Onion'],
    steps: [
      { number: 1, title: 'Sauté Aromatics', description: 'Cook diced onion and garlic in olive oil until soft.', duration: '5 min' },
      { number: 2, title: 'Add Tomatoes', description: 'Add diced tomatoes and cook until broken down.', duration: '5 min' },
      { number: 3, title: 'Cook Rice', description: 'Add rice and water. Cover and simmer until tender.', duration: '15 min' },
    ],
    saved: true,
  },
  {
    id: '3',
    title: 'Chicken Stir Fry',
    cuisine: 'Asian',
    cuisineEmoji: '🇨🇳',
    matchPercent: 78,
    cookTime: '20 min',
    servings: 3,
    difficulty: 'Medium',
    ingredients: ['Chicken Breast', 'Bell Pepper', 'Garlic', 'Onion', 'Rice'],
    steps: [
      { number: 1, title: 'Slice Ingredients', description: 'Cut chicken and vegetables into thin strips.', duration: '5 min' },
      { number: 2, title: 'Stir Fry', description: 'Cook chicken first, then add vegetables. Toss on high heat.', duration: '8 min' },
      { number: 3, title: 'Season & Serve', description: 'Add soy sauce and serve over steamed rice.', duration: '5 min' },
    ],
    saved: false,
  },
];
