import json
from collections import defaultdict

# Charger la bibliothèque
with open(r'C:\Users\JulienFernandez\OneDrive\Coding\_Projets de code\2025.10 Music Impro chooser\music_library.json', 'r', encoding='utf-8') as f:
    library = json.load(f)

print("=" * 80)
print("RAPPORT DE LA BIBLIOTHEQUE MUSICALE IMPRO")
print("=" * 80)
print(f"\nTotal de pistes: {library['total_tracks']}")
print(f"Version: {library['version']}")

# Statistiques par genres
print("\n" + "=" * 80)
print("GENRES")
print("=" * 80)
genres_count = defaultdict(int)
for track in library['tracks']:
    for genre in track['tags']['genre']:
        genres_count[genre] += 1

for genre, count in sorted(genres_count.items(), key=lambda x: x[1], reverse=True):
    print(f"  {genre:20} : {count:4} pistes")

# Statistiques par mood
print("\n" + "=" * 80)
print("AMBIANCES (MOODS)")
print("=" * 80)
moods_count = defaultdict(int)
for track in library['tracks']:
    for mood in track['tags']['mood']:
        moods_count[mood] += 1

for mood, count in sorted(moods_count.items(), key=lambda x: x[1], reverse=True):
    print(f"  {mood:20} : {count:4} pistes")

# Statistiques par énergie
print("\n" + "=" * 80)
print("NIVEAU D'ENERGIE")
print("=" * 80)
energy_count = defaultdict(int)
for track in library['tracks']:
    energy = track['tags']['energy']
    energy_count[energy] += 1

for energy, count in sorted(energy_count.items()):
    bar = "#" * (count // 10)
    print(f"  Energie {energy:2}/10 : {count:4} pistes {bar}")

# Statistiques par tempo
print("\n" + "=" * 80)
print("TEMPO")
print("=" * 80)
tempo_count = defaultdict(int)
for track in library['tracks']:
    tempo = track['tags']['tempo']
    tempo_count[tempo] += 1

for tempo, count in sorted(tempo_count.items(), key=lambda x: x[1], reverse=True):
    print(f"  {tempo:20} : {count:4} pistes")

# Statistiques par scenarios impro
print("\n" + "=" * 80)
print("SCENARIOS D'IMPRO")
print("=" * 80)
scenarios_count = defaultdict(int)
for track in library['tracks']:
    for scenario in track['impro_context']['scenarios']:
        scenarios_count[scenario] += 1

for scenario, count in sorted(scenarios_count.items(), key=lambda x: x[1], reverse=True):
    print(f"  {scenario:30} : {count:4} pistes")

# Statistiques par dossiers
print("\n" + "=" * 80)
print("DOSSIERS")
print("=" * 80)
folders_count = defaultdict(int)
for track in library['tracks']:
    folder = track['metadata']['folder']
    folders_count[folder] += 1

for folder, count in sorted(folders_count.items(), key=lambda x: x[1], reverse=True)[:15]:
    print(f"  {folder[:50]:50} : {count:4} pistes")

# Exemples de pistes par catégorie
print("\n" + "=" * 80)
print("EXEMPLES DE PISTES PAR CATEGORIE")
print("=" * 80)

# Rock
print("\nROCK:")
rock_tracks = [t for t in library['tracks'] if 'rock' in t['tags']['genre']][:5]
for track in rock_tracks:
    print(f"  - {track['artist']} - {track['title']} (energie: {track['tags']['energy']})")

# Bruitages
print("\nBRUITAGES (EFFET-SONORE):")
bruitage_tracks = [t for t in library['tracks'] if 'effet-sonore' in t['tags']['mood']][:5]
for track in bruitage_tracks:
    print(f"  - {track['title']} (duree: {track['duration']}s)")

# Ambiance calme
print("\nAMBIANCE CALME:")
calm_tracks = [t for t in library['tracks'] if 'calme' in t['tags']['mood']][:5]
for track in calm_tracks:
    print(f"  - {track['artist']} - {track['title']} (energie: {track['tags']['energy']})")

# Generiques
print("\nGENERIQUES RECONNAISSABLES:")
generique_tracks = [t for t in library['tracks'] if 'reconnaissable' in t['tags']['mood']][:5]
for track in generique_tracks:
    print(f"  - {track['title']}")

# Haute energie
print("\nHAUTE ENERGIE (9+):")
high_energy_tracks = [t for t in library['tracks'] if t['tags']['energy'] >= 9][:5]
for track in high_energy_tracks:
    print(f"  - {track['artist']} - {track['title']} (energie: {track['tags']['energy']})")

# Match impro
print("\nMATCH D'IMPRO:")
match_tracks = [t for t in library['tracks'] if 'match-impro' in t['impro_context']['scenarios']][:5]
for track in match_tracks:
    print(f"  - {track['title']}")

# Statistiques durées
print("\n" + "=" * 80)
print("DUREES")
print("=" * 80)
durations = [t['duration'] for t in library['tracks']]
avg_duration = sum(durations) / len(durations)
print(f"  Duree moyenne: {avg_duration:.1f}s ({avg_duration/60:.1f} minutes)")
print(f"  Duree min: {min(durations)}s")
print(f"  Duree max: {max(durations)}s")

# Pistes avec contraintes
print("\n" + "=" * 80)
print("CONTRAINTES D'IMPRO")
print("=" * 80)
contraintes_count = defaultdict(int)
for track in library['tracks']:
    for contrainte in track['impro_context']['contraintes']:
        contraintes_count[contrainte] += 1

for contrainte, count in sorted(contraintes_count.items(), key=lambda x: x[1], reverse=True):
    print(f"  {contrainte:30} : {count:4} pistes")

print("\n" + "=" * 80)
print("FIN DU RAPPORT")
print("=" * 80)
