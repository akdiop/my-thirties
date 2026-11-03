/** Listes prêtes à l'emploi (Mes listes › Modèles) : un toucher crée la liste à cocher. */
export type ListTemplate = { id: string; title: string; hint: string; groups: { name: string; items: string[] }[] };

export const LIST_TEMPLATES: ListTemplate[] = [
  { id: 'courses-perte-poids', title: 'Courses · Perte de poids', hint: 'Protéines, féculents, légumes, fruits, laitages, placard', groups: [
    { name: 'Protéines', items: ['Poulet', 'Dinde', 'Œufs', 'Fromage', 'Charcuterie halal', 'Lotte ou sole', 'Bœuf haché'] },
    { name: 'Féculents', items: ['Riz', 'Pâtes', 'Pain (maison ou du commerce)', 'Pommes de terre', 'Patate douce'] },
    { name: 'Légumes', items: ['Courgettes', 'Poivrons', 'Tomates', 'Salade', 'Oignons', 'Lentilles', 'Champignons', 'Aubergines'] },
    { name: 'Fruits', items: ['Mangue', 'Oranges', 'Pommes', 'Fruits rouges', 'Citrons', 'Fruits de la passion'] },
    { name: 'Produits laitiers', items: ['Yaourt nature', 'Fromage blanc', 'Lait', 'Mozzarella', 'Feta', 'Emmental', 'Chèvre', 'Parmesan'] },
    { name: 'Divers', items: ['Huile d’olive', 'Cumin', 'Paprika', 'Origan', 'Cannelle', 'Levure boulangère', 'Cacao non sucré', 'Gingembre frais', 'Menthe fraîche',
      'Sirop d’agave', 'Tomate concentrée ou concassée', 'Moutarde', 'Ail en poudre', 'Clous de girofle'] },
  ] },
  { id: 'toujours-maison', title: 'Toujours à la maison', hint: 'Les bases à ne jamais laisser manquer', groups: [
    { name: 'Bases', items: ['Œufs', 'Fromage', 'Pain (maison ou du commerce)', 'Riz ou pâtes', 'Un légume qui se conserve (courgette, poivron, oignon)',
      'Un fruit facile (pomme, orange)', 'Yaourt nature', 'Huile d’olive', 'Citron'] },
  ] },
  { id: 'valise-vacances', title: 'Valise · Vacances', hint: 'Vêtements, accessoires, soins, chaussures, électronique, indispensables', groups: [
    { name: 'Indispensables', items: ['Passeport', 'CNI', 'Cartes bancaires (Revolut, Afrika Bank, Galactic)', 'Cadenas', 'Gouttière', 'Médicaments'] },
    { name: 'Vêtements', items: ['Maillots de bain', 'Shorts de ville et de soirée', 'Vestes de soirée et de ville', 'Crop tops', 'Robes décontractées', 'Robes de soirée',
      'Dessus de plage', 'Débardeurs et pyjama', 'Sous-vêtements', 'Tenue de prière + chapelet', 'Tenues traditionnelles', 'Pantalons'] },
    { name: 'Accessoires', items: ['Lunettes de soleil', 'Chapeau et casquette', 'Bijoux (boucles d’oreilles, bagues, collier, bijoux de corps)', 'Tote bag', 'Perruques'] },
    { name: 'Soins', items: ['Eau micellaire + huile démaquillante', 'Gant de toilette et pierre ponce', 'Gel douche et gel intime', 'Crème corps et crème solaire',
      'Parfum et anti-moustique', 'Routine visage, dentifrice et brosse à dents', 'Fer, peigne à lisser, brosse, bonnet, cire',
      'Protecteur de chaleur, démêlant, huile cheveux', 'Maquillage (fards, contouring, highlighter, routine)'] },
    { name: 'Chaussures', items: ['Sandales blanches', 'Talons noirs', 'Talons dorés', 'Talons blancs', 'Talons marron', 'Yeezy slides', 'Yeezy 350', 'RL'] },
    { name: 'Électronique', items: ['Ordinateur du boulot + souris et tapis', 'Casque', 'Téléphone du boulot', 'AirPods + chargeur', 'MacBook + chargeur', 'Enceinte',
      'Batterie externe + chargeur USB'] },
  ] },
];

/** Éléments à créer : chaque article précédé de sa famille (« Protéines · Poulet ») pour garder les rayons lisibles. */
export const templateItems = (t: ListTemplate) => t.groups.flatMap((g) => t.groups.length > 1 ? g.items.map((i) => g.name + ' · ' + i) : g.items);
