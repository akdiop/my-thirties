/** Ma numérologie : chiffre d'expression et chiffre de vie affective, reformulés à partir de mes fiches Evozen. */
export type Section = { titre: string; texte: string };
export type Fiche = { titre: string; devise?: string; reperes?: [string, string][]; sections: Section[]; offrir?: string[] };
export type Numero = { n: number; maitre?: number };
export type MaNumerologie = { expression?: Numero; affectif?: Numero };

const EXPRESSION: Record<number, Fiche> = {
  2: { titre: 'Chiffre d’expression 2', devise: '« J’écoute, je perçois. » Moi et l’autre.',
    reperes: [['Couleurs', 'Rose, orange clair'], ['Planète', 'La Lune'], ['Centre d’énergie', 'Le centre sacré (le ventre)'], ['Énergie', 'Féminine, yin (sans rapport avec le sexe)']],
    sections: [
      { titre: 'Le sens du 2', texte: 'Après le 1, la conscience de soi, le 2 est la prise de conscience de la dualité : jour et nuit, ombre et lumière. Dans tous les domaines, il cherche à retrouver une forme de fusion et d’unité.' },
      { titre: 'Ce que tu aimes', texte: 'Coopérer, t’associer, partager. Tu recherches des relations douces et harmonieuses ; les tensions et oppositions t’angoissent, et tout ce qui exprime la force ou la violence te déplaît. Tu ne cherches pas à dominer ni à prendre la place de quelqu’un.' },
      { titre: 'Ce que tu veux', texte: 'Trouver ta place dans le groupe et contribuer à ce que tes idées et celles des autres se réalisent.' },
      { titre: 'Ta sensibilité', texte: 'Un nombre de fécondité, celle de l’imaginaire et du rêve : tu es une grande rêveuse, très sensible, à l’écoute des autres et de ce qui se passe autour de toi. Tu pressens parfois les situations avant qu’elles n’arrivent. Le revers : te laisser emporter par l’émotion et créer les tensions que tu crains.' },
      { titre: 'Avec les autres', texte: 'On t’apprécie pour ta sociabilité et ta capacité à écouter, consoler et épauler, mais tu as parfois le sentiment de ne pas recevoir autant. Certains prennent ton empathie pour de la faiblesse. Pour passer à l’action, tu as besoin de te sentir soutenue par ceux qui partagent tes buts.' },
      { titre: 'Dans les conflits', texte: 'Tu fais merveille : diplomate et patiente, tu trouves les compromis qui ramènent l’entente. Face à la brutalité, tu peux fuir et te réfugier chez toi ou dans un lieu intérieur où calmer tes émotions. Écrire, dessiner, peindre ou danser rendent tes ressentis féconds. Pourtant tu détestes la solitude : une de tes contradictions.' },
      { titre: 'Ta voie', texte: 'Chercher la voie du milieu, l’équilibre entre les opposés, même s’il n’est pas toujours facile à trouver ni à garder.' },
      { titre: 'En amour', texte: 'Grand besoin de tendresse, le couple compte énormément et l’idée d’une relation fusionnelle t’attire. Romantique, tes sentiments peuvent t’emporter loin de la raison ; par amour, tu peux renoncer, voire te soumettre. Mais si l’on abuse de toi, c’est un véritable raz-de-marée émotionnel.' },
      { titre: 'Tes proches', texte: 'Tes amis sont nombreux et peuvent compter sur toi : tu gardes les secrets et cherches des solutions à leurs problèmes. Parent attentive et tendre, tu protèges tes enfants.' },
      { titre: 'Professionnellement', texte: 'Les métiers des relations humaines (psychologie, social, ressources humaines), le monde associatif (caritatif, engagé), la petite enfance (puériculture, obstétrique, enseignement), l’hôtellerie et la restauration, la musique et les arts.' },
      { titre: 'Le côté sombre du 2', texte: 'Dépendance affective, indécision, passivité, soumission, hypersensibilité, peur du conflit, manipulation affective, manque de confiance en soi.' },
      { titre: 'Points d’attention du corps', texte: 'Selon la numérologie, le 2 est associé au ventre : digestion, cycles, gestation, eau dans le corps (rétention, reins, vessie), seins, ainsi qu’aux angoisses et coups de blues.' },
    ] },
  11: { titre: 'Nombre maître 11', devise: 'Le 2 porté à sa plus haute exigence.',
    sections: [
      { titre: 'Un nombre maître', texte: 'Le 11 est apparu lors de la réduction : comme tous les nombres maîtres, il donne une grande puissance à ton thème, mais il n’est pas plus facile à vivre. Il demande davantage.' },
      { titre: 'Une personne à part', texte: 'Tu te sens différente, la médiocrité te fait horreur, et tu rêves d’un destin hors des sentiers battus. D’une intelligence vive, tu aspires à changer le monde et la façon dont les autres le perçoivent.' },
      { titre: 'Intuition', texte: 'L’émotivité du 2 devient parfois nervosité, voire angoisse existentielle. Tes ressentis deviennent une intuition très forte : rêves, signes, sentiment que le monde a un sens caché.' },
      { titre: 'Ta tour d’ivoire', texte: 'Tu peux être solitaire, avoir du mal à te fondre dans un groupe, la foule t’intimide. Tu as un refuge, réel ou intérieur, où tu élabores ton idéal. Un nombre souvent difficile à vivre dans la jeunesse, quand on cherche sa place.' },
      { titre: 'Ta place', texte: 'En trouvant comment vivre tes ambitions idéalistes, tu trouves ta place en contribuant à l’évolution du monde.' },
    ] },
};

const AFFECTIF: Record<number, Fiche> = {
  2: { titre: 'Chiffre de vie affective 2', devise: '« J’écoute, je perçois. » Moi et l’autre.',
    sections: [
      { titre: 'Relations humaines', texte: 'Très sensible et émotive, tu as besoin d’être entourée. Amie compatissante, tu sais écouter et consoler, et tu ressens profondément les chagrins comme les joies des autres.' },
      { titre: 'Les conflits', texte: 'D’un caractère doux, l’agressivité te bouleverse. Si quelqu’un profite de toi, tu mets du temps à t’en rendre compte et à trouver le courage de le dire, ou de t’éloigner. Ta peur de blesser te fait souvent fermer les yeux.' },
      { titre: 'Tes amitiés', texte: 'Les personnes douces et sensibles t’attirent, tu rêves d’une amitié en symbiose. Pourtant, les amis plus remuants te font beaucoup de bien : ils te font sortir, découvrir, rencontrer.' },
      { titre: 'Le revers de ta gentillesse', texte: 'Ton soutien peut être perçu comme trop insistant, et certains pourraient en profiter. Ton apprentissage : partager tout en gardant une juste distance, pour te protéger et pour ne pas envahir l’autre de ta gentillesse.' },
      { titre: 'Ton foyer', texte: 'Très maternante, tes enfants restent tes « bébés » et le foyer est un cocon. Tu peux être méfiante envers ceux qui entrent chez toi, mais tu finis toujours par accueillir, pour le plaisir d’une maison pleine de vie.' },
      { titre: 'Vie de couple', texte: 'Tu rêves d’un amour fusionnel où l’on se comprend sans parler. Les ruptures te déchirent, mais la solitude te pèse : le bonheur se conçoit à deux. Tu as besoin de te sentir aimée et protégée, et la sécurité matérielle et la maison comptent pour bâtir un monde doux, chaleureux et romantique.' },
      { titre: 'Ce que tu donnes', texte: 'Tu pardonnes, tu donnes et tu fais beaucoup de concessions pour que l’amour fonctionne, pourvu qu’on te promette amour et fidélité. Les petites maladresses te blessent vite, et tu pardonnes vite quand l’autre vient te consoler.' },
      { titre: 'Ta limite', texte: 'La tromperie est impardonnable : ta douceur peut alors se changer en colère. Ton défi : accepter que l’autre ait besoin de respirer, de silence ou d’activités seul.' },
      { titre: 'Ce que l’autre peut faire pour toi', texte: 'Te rassurer, t’écouter et t’offrir de la tendresse à son tour.' },
      { titre: 'Le 2 en numérologie', texte: 'Le chiffre de l’amour, de la complémentarité et de la dualité : l’ombre et la lumière ne s’opposent pas, elles se complètent. Chiffre rond et féminin, associé à la mère, il est aussi celui des vies parallèles. Dans la symbolique africaine, c’est le symbole de l’union.' },
    ],
    offrir: ['Un week-end en amoureux', 'Une déclaration d’amour', 'Une demande en mariage romantique', 'Un bijou avec un serment gravé', 'Des fleurs', 'Un roman d’amour ou une saga familiale', 'Une séance photo de famille', 'Un fauteuil confortable', 'De la musique douce'] },
  11: { titre: 'Nombre maître 11 (vie affective)',
    sections: [
      { titre: 'Difficile à cerner', texte: 'Tu te dis indépendante et forte, tournée vers des buts élevés, et en même temps tu demandes beaucoup d’attention et d’affection. Ton émotivité cachée est très puissante et tu crains de ne pas la maîtriser : tu évites les situations qui te fragilisent.' },
      { titre: 'Ton cercle', texte: 'Beaucoup de monde autour de toi, mais peu de personnes entrent dans ton intimité. Tu dégages quelque chose de magnétique et mystérieux. Exigeante, éprise de perfection, tu fuis la médiocrité et la vulgarité, avec une tendance dominatrice que tu ne revendiques pas.' },
      { titre: 'En couple', texte: 'Tu attends que l’autre te comprenne, te materne, devine tes besoins, sans forcément t’attendre à la réciprocité. Tu laisses l’autre poursuivre ses buts, surtout s’ils sont élevés. Tu cherches un amour absolu, à la fois physique, intellectuel et spirituel, et tu as besoin d’admirer ton partenaire autant qu’il t’admire.' },
      { titre: 'Point de vigilance', texte: 'Tu penses que deux êtres faits l’un pour l’autre se comprennent sans parler : peu de longues explications quand ça ne va pas, et l’impression parfois pour l’autre que tu lui échappes. Femme, tu peux être à la fois la féminité même et une figure très dominante : une personne pleine de dualités.' },
      { titre: 'Compatibilité avec le 22', texte: 'Deux nombres maîtres ensemble : un couple très constructif, capable de grandes réalisations, s’il partage un but élevé ; sans but commun, beaucoup de tensions.' },
    ] },
};

/** Le nombre dans la tradition islamique (texte transmis par Aïda). */
export const ISLAM: Record<number, Fiche> = {
  2: { titre: '2 (Al-Ithnan) : la dualité, le témoignage, la justice', sections: [
    { titre: 'Le sens', texte: 'Le nombre 2, « Al-Ithnan », représente la dualité, le témoignage et la justice. Il symbolise l’équilibre et la justice divine, des notions fondamentales de l’islam. Le Coran mentionne souvent des paires, comme les deux anges de la mort ou les deux témoins nécessaires pour une accusation. Cette dualité représente la balance entre le bien et le mal, la lumière et les ténèbres, et rappelle l’importance de la justice divine.' },
    { titre: 'Deux piliers', texte: 'La profession de foi et la prière soulignent l’engagement envers Dieu et la recherche de Sa guidance : la profession de foi affirme l’unicité de Dieu et l’engagement dans l’islam, la prière est une communication directe avec Lui.' },
    { titre: 'La justice divine', texte: 'Un concept central de l’islam : le 2 symbolise l’équilibre entre le bien et le mal et rappelle que chacun sera jugé selon ses actes. La justice divine s’applique à tous, sans exception.' },
  ] },
};
export const ficheIslam = (n?: number) => (n ? ISLAM[n] : undefined);
export const ficheExpression = (n?: number) => (n ? EXPRESSION[n] : undefined);
export const ficheAffectif = (n?: number) => (n ? AFFECTIF[n] : undefined);
export const numerologieOf = (data: Record<string, unknown> | undefined): MaNumerologie => {
  const ok = (v: unknown): Numero | undefined => { const x = v as Numero | undefined; return x && Number.isInteger(x.n) ? { n: x.n, maitre: Number.isInteger(x.maitre) ? x.maitre : undefined } : undefined; };
  const n = (data?.numerologie ?? {}) as Record<string, unknown>;
  return { expression: ok(n.expression), affectif: ok(n.affectif) };
};

/* ---------- Calculs (méthode pythagoricienne) : expression, nombre intime, chemin de vie ---------- */
const reduce = (n: number): number => (n <= 9 || n === 11 || n === 22 || n === 33 ? n : reduce([...String(n)].reduce((a, c) => a + Number(c), 0)));
const letters = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
const valueOf = (c: string) => ((c.charCodeAt(0) - 65) % 9) + 1;
const base = (n: number) => (n > 9 ? [...String(n)].reduce((a, c) => a + Number(c), 0) : n);
/** Nombre d'expression (toutes les lettres du nom complet) et nombre intime (les voyelles), avec le nombre maître éventuel. */
export function nombresDuNom(nom: string) {
  const l = letters(nom), v = [...l].filter((c) => 'AEIOUY'.includes(c));
  const exp = reduce([...l].reduce((a, c) => a + valueOf(c), 0)), intime = reduce(v.reduce((a, c) => a + valueOf(c), 0));
  const fmt = (n: number): Numero => (n > 9 ? { n: base(n), maitre: n } : { n });
  return l ? { expression: fmt(exp), intime: fmt(intime) } : null;
}
/** Chemin de vie : somme des chiffres de la date de naissance, réduite (nombres maîtres gardés). */
export function cheminDeVie(iso: string): Numero | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const n = reduce([...iso.replace(/-/g, '')].reduce((a, c) => a + Number(c), 0));
  return n > 9 ? { n: base(n), maitre: n } : { n };
}
/** Le sens général de chaque nombre, pour mes proches et mon chemin de vie (repères de numérologie, en quelques mots). */
export const SENS_NOMBRES: Record<number, string> = {
  1: 'L’initiative, l’indépendance, le leadership : ouvrir la voie.', 2: 'L’écoute, la coopération, la sensibilité : relier et apaiser.', 3: 'L’expression, la créativité, la joie de communiquer.',
  4: 'La construction, la rigueur, la fiabilité : bâtir solide.', 5: 'La liberté, le mouvement, la curiosité, le changement.', 6: 'L’harmonie, le foyer, la responsabilité envers les autres.',
  7: 'La réflexion, la quête de sens, la vie intérieure.', 8: 'L’ambition, la réussite matérielle, l’autorité.', 9: 'L’altruisme, l’idéal, l’ouverture au monde.',
  11: 'Nombre maître : intuition, inspiration, exigence élevée.', 22: 'Nombre maître : le grand bâtisseur, des réalisations concrètes et durables.', 33: 'Nombre maître : le don de soi, la compassion à grande échelle.',
};
