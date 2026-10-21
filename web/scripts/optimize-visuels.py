"""Prépare les visuels de la maquette pour l'app : WebP de 1280 px de large au plus (jamais agrandi),
qualité 80, métadonnées retirées.

Usage : python3 web/scripts/optimize-visuels.py <dossier des originaux>
Les fichiers sont reconnus par mot-clé dans leur nom (ex. « 01_pilates.jpg », « 05_voyages_iles_mer.jpg »).
"""
import pathlib, sys
from PIL import Image, ImageOps

NAMES = {'cuisine': 'cuisine', 'pilates': 'pilates', 'yoga': 'yoga', 'tennis': 'tennis', 'passions': 'passions',
         'voyage': 'voyage', 'bien_etre': 'bien-etre', 'organisation': 'organisation', 'apprentissage': 'apprentissage'}
src = pathlib.Path(sys.argv[1])
out = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'visuels'
out.mkdir(parents=True, exist_ok=True)
for key, name in NAMES.items():
    found = [p for p in src.iterdir() if key in p.stem.lower().replace('-', '_')]
    if not found:
        print('manquant :', name); continue
    img = ImageOps.exif_transpose(Image.open(found[0])).convert('RGB')
    if img.width > 1280:
        img = img.resize((1280, round(img.height * 1280 / img.width)), Image.LANCZOS)
    target = out / (name + '.webp')
    img.save(target, 'WEBP', quality=80, method=6)
    print(f'{name}: {img.width}x{img.height}, {target.stat().st_size // 1024} Ko')
