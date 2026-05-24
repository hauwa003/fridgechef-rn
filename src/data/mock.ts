import { Ingredient, Recipe } from '../types';

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
