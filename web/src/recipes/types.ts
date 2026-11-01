export type CuratedCategory = 'petit-dejeuner' | 'dejeuner' | 'diner' | 'casse-croute' | 'smoothie' | 'shot' | 'boulangerie' | 'dessert' | 'base-maison' | 'quiches' | 'poulet' | 'automne';
export type CuratedRecipe = { origin?: string; id: string; title: string; category: CuratedCategory; servings: number; prepMin: number; cookMin: number; ingredients: string; steps: string[]; storage: string; };
