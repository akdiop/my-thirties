"""Prépare les visuels de la maquette pour l'app : WebP 1280 px de large, qualité 74, métadonnées retirées.

Usage : python3 web/scripts/optimize-visuels.py <dossier des originaux>
Noms attendus (extension libre) : cuisine, pilates, yoga, tennis, passions, voyage, bien-etre, organisation, agenda.
"""
import pathlib, sys
from PIL import Image, ImageOps

NAMES = ['cuisine', 'pilates', 'yoga', 'tennis', 'passions', 'voyage', 'bien-etre', 'organisation', 'agenda']
src = pathlib.Path(sys.argv[1])
out = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'visuels'
out.mkdir(parents=True, exist_ok=True)
for name in NAMES:
    found = [p for p in src.iterdir() if p.stem.lower() == name]
    if not found:
        print('manquant :', name); continue
    img = ImageOps.exif_transpose(Image.open(found[0])).convert('RGB')
    if img.width > 1280:
        img = img.resize((1280, round(img.height * 1280 / img.width)), Image.LANCZOS)
    target = out / (name + '.webp')
    img.save(target, 'WEBP', quality=74, method=6)
    print(f'{name}: {img.width}x{img.height}, {target.stat().st_size // 1024} Ko')
