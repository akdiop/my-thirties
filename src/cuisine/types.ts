export type CuratedCategory = 'petit-dejeuner' | 'dejeuner' | 'diner' | 'casse-croute' | 'smoothie' | 'shot';
export type CuratedRecipe = { id: string; title: string; category: CuratedCategory; servings: number; prepMin: number; cookMin: number; ingredients: string; steps: string[]; storage: string; };
