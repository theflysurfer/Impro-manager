import os
import json
import re
import hashlib
from pathlib import Path

# Fonction pour générer un ID unique basé sur le chemin du fichier
def generate_id(file_path):
    return hashlib.md5(file_path.encode()).hexdigest()[:12]

# Fonction pour extraire artiste et titre depuis le nom de fichier
def parse_filename(filename):
    # Nettoyer l'extension
    name = os.path.splitext(filename)[0]

    # Nettoyer les marqueurs communs
    name = re.sub(r'\(Official.*?\)', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\(Lyrics?\)', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\(Audio\)', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\(Live.*?\)', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\[.*?\]', '', name)
    name = re.sub(r'\d+\.\s*', '', name)  # Enlever numéros au début
    name = name.strip()

    # Essayer de détecter format "Artiste - Titre"
    if ' - ' in name:
        parts = name.split(' - ', 1)
        artist = parts[0].strip()
        title = parts[1].strip() if len(parts) > 1 else name
    elif '–' in name:  # tiret long
        parts = name.split('–', 1)
        artist = parts[0].strip()
        title = parts[1].strip() if len(parts) > 1 else name
    else:
        artist = ""
        title = name

    return artist, title

# Fonction pour analyser le contexte depuis le chemin
def analyze_path_context(file_path, base_path):
    relative_path = file_path.replace(base_path, '').strip(os.sep)
    path_parts = relative_path.split(os.sep)

    context = {
        'folder': path_parts[-2] if len(path_parts) > 1 else 'root',
        'subfolder': path_parts[-3] if len(path_parts) > 2 else '',
        'full_path': relative_path,
        'all_folders': path_parts[:-1],  # Tous les dossiers sauf le fichier
        'date': None
    }

    # Détecter dates dans le chemin
    for part in path_parts:
        date_match = re.search(r'202\d\.\d{2}\.\d{2}', part)
        if date_match:
            context['date'] = date_match.group()

    return context

# Fonction pour déterminer les tags basés sur le nom et contexte
def determine_tags(artist, title, path_context, filename):
    tags = {
        'mood': [],
        'genre': [],
        'energy': 5,
        'tempo': 'medium'
    }

    # Analyse du genre basée sur les artistes connus
    rock_artists = ['ACDC', 'Aerosmith', 'Queen', 'Bon Jovi', 'Green Day', 'Oasis', 'Nirvana',
                    'Linkin Park', 'Rolling Stones', 'Pink Floyd', 'Led Zeppelin', 'Guns N Roses',
                    'White Stripes', 'Rage Against', 'Sum 41']
    pop_artists = ['Michael Jackson', 'Madonna', 'Justin Timberlake', 'Rihanna', 'Ed Sheeran',
                   'Pharrell', 'Dua Lipa', 'ABBA', 'Elton John']
    electronic_artists = ['Daft Punk', 'Moby', 'Fatboy Slim']
    soul_artists = ['Barry White', 'Aretha Franklin', 'Marvin Gaye']

    artist_lower = artist.lower()
    title_lower = title.lower()
    filename_lower = filename.lower()
    full_path_lower = path_context['full_path'].lower()

    # Genre
    if any(a.lower() in artist_lower for a in rock_artists):
        tags['genre'].append('rock')
        tags['energy'] = 8
        tags['tempo'] = 'fast'
    elif any(a.lower() in artist_lower for a in pop_artists):
        tags['genre'].append('pop')
        tags['energy'] = 7
    elif any(a.lower() in artist_lower for a in electronic_artists):
        tags['genre'].append('electronic')
        tags['energy'] = 6
    elif any(a.lower() in artist_lower for a in soul_artists):
        tags['genre'].append('soul')
        tags['energy'] = 5
        tags['tempo'] = 'slow'

    # Genres spécifiques depuis le titre/nom
    if 'reggae' in title_lower or 'rasta' in filename_lower:
        tags['genre'].append('reggae')
    if 'jazz' in title_lower or 'swing' in title_lower:
        tags['genre'].append('jazz')
    if 'classical' in title_lower or 'chopin' in artist_lower or 'beethoven' in artist_lower:
        tags['genre'].append('classical')
    if 'hip hop' in title_lower or 'rap' in title_lower:
        tags['genre'].append('hip-hop')
    if 'country' in title_lower or 'western' in full_path_lower:
        tags['genre'].append('country')

    # Mood depuis le chemin complet
    if 'ambiance' in full_path_lower or 'attente' in full_path_lower:
        tags['mood'].extend(['calme', 'atmosphérique'])
        tags['energy'] = 4
        tags['tempo'] = 'slow'
    if 'bruitage' in full_path_lower:
        tags['mood'].append('effet-sonore')
        tags['energy'] = 3
    if 'horreur' in full_path_lower or 'horror' in filename_lower:
        tags['mood'].extend(['sombre', 'inquiétant'])
        tags['energy'] = 6
    if 'aventure' in full_path_lower:
        tags['mood'].extend(['épique', 'aventure'])
        tags['energy'] = 7
    if 'générique' in full_path_lower or 'generique' in full_path_lower:
        tags['mood'].append('reconnaissable')
        tags['energy'] = 6
    if 'pause' in filename_lower or 'entracte' in filename_lower:
        tags['mood'].append('transition')

    # Mood depuis le titre
    mood_keywords = {
        'happy': ['joyeux', 'énergique'],
        'sad': ['triste', 'mélancolique'],
        'love': ['romantique', 'doux'],
        'epic': ['épique', 'grandiose'],
        'action': ['intense', 'dynamique'],
        'calm': ['calme', 'relaxant'],
        'suspense': ['suspense', 'tension'],
        'party': ['festif', 'dansant']
    }

    for keyword, moods in mood_keywords.items():
        if keyword in title_lower or keyword in filename_lower:
            tags['mood'].extend(moods)

    # Détecter énergie depuis le titre
    if any(word in title_lower for word in ['highway', 'thunderstruck', 'rock', 'party', 'dance']):
        tags['energy'] = 9
        tags['tempo'] = 'fast'
    if any(word in title_lower for word in ['ballad', 'slow', 'love', 'alone', 'without you']):
        tags['energy'] = 3
        tags['tempo'] = 'slow'

    # Dédupliquer
    tags['mood'] = list(set(tags['mood']))
    tags['genre'] = list(set(tags['genre']))

    return tags

# Fonction pour déterminer le contexte impro
def determine_impro_context(artist, title, path_context, filename, tags):
    context = {
        'scenarios': [],
        'emotions': [],
        'contraintes': []
    }

    filename_lower = filename.lower()
    title_lower = title.lower()
    full_path_lower = path_context['full_path'].lower()

    # Scénarios depuis le chemin complet
    if 'cabaret' in full_path_lower or 'émissions' in full_path_lower or 'emissions' in full_path_lower:
        context['scenarios'].append('cabaret-télé')
    if 'match' in full_path_lower:
        context['scenarios'].append('match-impro')
    if 'aventure' in full_path_lower:
        context['scenarios'].extend(['aventure', 'voyage', 'exploration'])
    if 'bruitage' in full_path_lower:
        if 'animal' in full_path_lower or 'animaux' in full_path_lower:
            context['scenarios'].extend(['ferme', 'nature', 'zoo'])
        if 'arme' in full_path_lower or 'armes' in full_path_lower:
            context['scenarios'].extend(['guerre', 'action', 'western'])
        if 'horreur' in full_path_lower:
            context['scenarios'].extend(['horreur', 'mystère', 'enquête'])

    # Scénarios depuis le titre
    scenario_keywords = {
        'space': ['espace', 'science-fiction'],
        'love': ['amour', 'romance'],
        'war': ['guerre', 'conflit'],
        'party': ['fête', 'celebration'],
        'western': ['western', 'far-west'],
        'ocean': ['mer', 'océan', 'plage'],
        'jungle': ['jungle', 'aventure'],
        'spy': ['espionnage', 'thriller'],
        'wedding': ['mariage', 'cérémonie'],
        'funeral': ['funérailles', 'deuil'],
        'school': ['école', 'jeunesse'],
        'sport': ['sport', 'compétition']
    }

    for keyword, scenarios in scenario_keywords.items():
        if keyword in title_lower or keyword in filename_lower:
            context['scenarios'].extend(scenarios)

    # Émotions depuis les tags mood
    emotion_map = {
        'joyeux': 'joie',
        'triste': 'tristesse',
        'romantique': 'amour',
        'épique': 'héroïsme',
        'sombre': 'peur',
        'calme': 'sérénité',
        'intense': 'excitation',
        'mélancolique': 'nostalgie'
    }

    for mood in tags['mood']:
        if mood in emotion_map:
            context['emotions'].append(emotion_map[mood])

    # Contraintes depuis le nom de fichier
    if 'entrée' in filename_lower or 'arrivée' in filename_lower:
        context['contraintes'].append('entrée-personnage')
    if 'pause' in filename_lower or 'entracte' in filename_lower:
        context['contraintes'].append('entracte')
    if 'intro' in filename_lower:
        context['contraintes'].append('introduction')
    if 'finale' in filename_lower or 'champions' in filename_lower:
        context['contraintes'].append('finale')
    if 'musicale' in filename_lower:
        context['contraintes'].append('numéro-musical')

    # Dédupliquer
    context['scenarios'] = list(set(context['scenarios']))
    context['emotions'] = list(set(context['emotions']))
    context['contraintes'] = list(set(context['contraintes']))

    return context

# Fonction pour estimer la durée typique (en secondes)
def estimate_duration(filename, path_context):
    # Par défaut
    duration = 180

    full_path_lower = path_context['full_path'].lower()
    filename_lower = filename.lower()

    # Les bruitages sont généralement courts
    if 'bruitage' in full_path_lower:
        duration = 10
    # Les génériques aussi
    if 'générique' in full_path_lower or 'generique' in full_path_lower:
        duration = 30
    # Les chansons complètes
    if any(word in filename_lower for word in ['official', 'video', 'audio']):
        duration = 210
    # Musiques d'ambiance
    if 'ambiance' in full_path_lower:
        duration = 240

    return duration

# Fonction principale
def generate_music_library(base_path):
    library = {
        'version': '1.0',
        'generated_at': '2025-03-10',
        'total_tracks': 0,
        'tracks': []
    }

    audio_extensions = ('.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.wma')

    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.lower().endswith(audio_extensions):
                file_path = os.path.join(root, file)

                # Analyser le fichier
                artist, title = parse_filename(file)
                path_context = analyze_path_context(file_path, base_path)
                tags = determine_tags(artist, title, path_context, file)
                impro_context = determine_impro_context(artist, title, path_context, file, tags)
                duration = estimate_duration(file, path_context)

                # Créer l'URL pour le serveur web
                relative_path = file_path.replace(base_path, '').replace('\\', '/').lstrip('/')
                web_url = f'/music/{relative_path}'

                # Créer l'entrée
                track = {
                    'id': generate_id(file_path),
                    'filename': file,
                    'title': title,
                    'artist': artist,
                    'file_path': file_path,
                    'web_url': web_url,
                    'duration': duration,
                    'cues': {
                        'start': 0,
                        'hook': min(30, duration // 4),
                        'climax': min(60, duration // 2),
                        'outro': max(duration - 30, duration - 10) if duration > 30 else duration,
                        'fade_duration': 8 if duration > 20 else 3
                    },
                    'tags': tags,
                    'impro_context': impro_context,
                    'metadata': {
                        'folder': path_context['folder'],
                        'subfolder': path_context['subfolder'],
                        'date': path_context['date'],
                        'extension': os.path.splitext(file)[1][1:]
                    }
                }

                library['tracks'].append(track)

    library['total_tracks'] = len(library['tracks'])
    return library

# Générer la bibliothèque
if __name__ == '__main__':
    base_path = r'C:\Users\JulienFernandez\OneDrive\Zic impro'
    print(f'Scanning music library in: {base_path}')

    library = generate_music_library(base_path)

    # Sauvegarder en JSON
    output_file = r'C:\Users\JulienFernandez\OneDrive\Coding\_Projets de code\2025.10 Music Impro chooser\music_library.json'

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(library, f, ensure_ascii=False, indent=2)

    print(f'\nLibrary generated successfully!')
    print(f'  Total tracks: {library["total_tracks"]}')
    print(f'  Output file: {output_file}')

    # Statistiques
    genres = {}
    moods = {}
    folders = {}

    for track in library['tracks']:
        for genre in track['tags']['genre']:
            genres[genre] = genres.get(genre, 0) + 1
        for mood in track['tags']['mood']:
            moods[mood] = moods.get(mood, 0) + 1
        folder = track['metadata']['folder']
        folders[folder] = folders.get(folder, 0) + 1

    print(f'\nStatistics:')
    print(f'  Genres: {len(genres)} - Top 5: {sorted(genres.items(), key=lambda x: x[1], reverse=True)[:5]}')
    print(f'  Moods: {len(moods)} - Top 5: {sorted(moods.items(), key=lambda x: x[1], reverse=True)[:5]}')
    print(f'  Folders: {len(folders)}')
