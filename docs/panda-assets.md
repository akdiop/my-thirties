# Mon Panda : bibliothèque graphique

Aïda crée les visuels ; le code les affiche dès qu'ils sont déposés dans `web/public/panda/` et déclarés dans `web/src/features/panda/assets.ts`. Tant qu'une image manque, le dessin SVG actuel sert de secours.

## Règles communes
- **Format** : PNG transparent, sRGB (converti en WebP à l’intégration pour alléger l’app).
- **Noms** : minuscules, sans accents ni espaces, mots séparés par `_`, extension `.png`.
- **Palette** : crème `#FBEADB`, chocolat `#6E4A3C`, contour `#4A3128`, caramel `#C08A5E`, joues `#F3B9A3`, foulard sauge `#9AA77E`.
- **Même cadre pour tout le panda** : 1024 × 1126 px, panda centré, **bas des pattes à 40 px du bord inférieur**, même taille de tête d'une image à l'autre. Les calques (tenues) sont dessinés sur ce même cadre, à la même place, pour se superposer exactement.

## 1. Le panda : `panda_<expression>.png`
| Fichier | Quand |
| --- | --- |
| `panda_idle` | Par défaut (assis, yeux ouverts) |
| `panda_happy` | Câlin (yeux fermés de joie, bras qui salue) |
| `panda_playful` | Jouer |
| `panda_sleepy` | Repos, nuit (avec « z ») |
| `panda_calm` | Humeur difficile déclarée, moment calme |
| `panda_curious` | Curiosité |
| `panda_surprised` | Surprise |
| `panda_proud` | Nouveau niveau, mini-jeu réussi |
| `panda_eating` | Nourrir (bambou en main) |
| `panda_reading` | Coin lecture (livre) |
| `panda_tea` | Pause thé (tasse) |

Le foulard sauge fait partie du panda (présent sur toutes ces images).

## 2. Tenues (calques) : `acc_<tenue>.png`
`acc_noeud`, `acc_bandana`, `acc_echarpe`, `acc_chapeau`, `acc_couronne`, `acc_lunettes`, `acc_fete` (chapeau d'anniversaire).
Uniquement l'accessoire, sur fond transparent, dans le cadre 1024 × 1126.

## 3. Décors : `bg_<pièce>_<saison>.png`
Cadre **1600 × 1200 px** (sol en bas, place libre au centre pour le panda).
`bg_maison_automne`, `bg_maison_hiver`, `bg_maison_printemps`, `bg_maison_ete`, `bg_jardin`.

## 4. Objets : `item_<objet>.png`
Chaque objet est dessiné **sur le cadre 1600 × 1200 du décor, à sa place** (le reste transparent), pour s'empiler sans réglage.
Maison : `item_tapis`, `item_coussin`, `item_plante`, `item_panier`, `item_yoga`, `item_theiere`, `item_lampe`, `item_etagere`, `item_tableau`, `item_valise`, `item_guirlande`, `item_bonsai`.
Jardin : `item_fleurs`, `item_lanterne`, `item_balancoire`, `item_fontaine`.

## Livraison
Déposer les fichiers dans le dépôt (`web/public/panda/`) ou les envoyer dans la conversation : Claude les ajoute, les déclare et vérifie l'alignement.

## 5. Bannières d'activité : `banner_<nom>.png` (module Mon Panda uniquement)
Le panda en situation, environ 1024 × 530 px (format paysage ≈ 2:1). Affichées dans l'espace du panda : « Aujourd'hui, il… » et les cartes de l'onglet Évolution.
| Fichier | Domaine |
| --- | --- |
| `banner_bienetre` | Mon équilibre |
| `banner_sport` | Sport et bien-être |
| `banner_sommeil` | Sommeil |
| `banner_lecture` | Lecture et apprentissage |
| `banner_spiritualite` | Spiritualité |
| `banner_cuisine` | Cuisine |
| `banner_organisation` | Défis et habitudes |
| `banner_voyages` | Voyages |
| `banner_objectifs` | Mon projet personnel |

## 6. Livré par planches (déjà intégré)
- **Pièces** (`bg_salon`, `bg_chambre`, `bg_lecture`, `bg_jardin`) : salon le jour, chambre quand il dort, coin lecture quand il lit, jardin zen à partir du niveau 4. Elles remplacent `bg_maison_<saison>` (les feuilles ou flocons de saison restent animés par-dessus).
- **Objets** (`icon_<nom>`, fond transparent) : bambou, lunettes, chapeau, sac, livre, thé, coussin, panier, plante, lanterne, écharpe, cœur. Vignettes de la boutique et objets posés dans la pièce quand le panda les possède.
