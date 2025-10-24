#!/usr/bin/env python3
"""
YouTube Music Downloader pour Impro Manager
Télécharge des musiques YouTube, détecte les moments forts (hook/climax) et les ajoute à la bibliothèque.

Dépendances:
    pip install yt-dlp mutagen librosa numpy

Usage:
    python youtube_downloader.py "https://www.youtube.com/watch?v=VIDEO_ID"
    python youtube_downloader.py --playlist "https://www.youtube.com/playlist?list=..."
    python youtube_downloader.py --search "western showdown music"
"""

import os
import sys
import json
import argparse
import hashlib
from pathlib import Path
import subprocess

try:
    import yt_dlp
except ImportError:
    print("❌ yt-dlp n'est pas installé. Installez avec: pip install yt-dlp")
    sys.exit(1)

try:
    from mutagen.mp3 import MP3
    from mutagen.easyid3 import EasyID3
except ImportError:
    print("❌ mutagen n'est pas installé. Installez avec: pip install mutagen")
    sys.exit(1)

try:
    import librosa
    import numpy as np
    HAS_LIBROSA = True
except ImportError:
    print("⚠️  librosa non installé - détection des moments forts désactivée")
    print("   Pour activer: pip install librosa numpy")
    HAS_LIBROSA = False


# Configuration
# Détection de l'environnement (local Windows vs production Linux)
if os.path.exists(r"C:\Users\JulienFernandez\OneDrive\Zic impro"):
    # Environnement local Windows
    MUSIC_DIR = Path(r"C:\Users\JulienFernandez\OneDrive\Zic impro")
    LIBRARY_FILE = Path("./music_library.json")
else:
    # Environnement production (conteneur Docker)
    MUSIC_DIR = Path("/app/music")
    LIBRARY_FILE = Path("/app/music_library.json")

DOWNLOAD_SUBDIR = "YouTube Downloads"


def create_audio_clips(audio_path, cues, output_dir=None):
    """
    Crée des clips audio aux moments clés détectés (hook, climax, outro).

    Args:
        audio_path: Chemin du fichier audio source
        cues: Dict contenant les timestamps (hook, climax, outro)
        output_dir: Dossier de sortie (par défaut: même dossier que l'audio source)

    Returns:
        dict: Chemins des clips créés
    """
    audio_path = Path(audio_path)
    if output_dir is None:
        output_dir = audio_path.parent / "clips"
    else:
        output_dir = Path(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    clips = {}
    base_name = audio_path.stem

    # Durée des clips (en secondes)
    clip_duration = 30

    print(f"✂️  Création des clips audio...")

    # Clip du hook (30s à partir du hook)
    if 'hook' in cues and cues['hook'] > 0:
        hook_start = cues['hook']
        hook_clip = output_dir / f"{base_name}_hook.mp3"
        cmd = [
            'ffmpeg', '-i', str(audio_path),
            '-ss', str(hook_start),
            '-t', str(clip_duration),
            '-acodec', 'libmp3lame',
            '-b:a', '192k',
            '-y',  # Overwrite
            str(hook_clip)
        ]
        subprocess.run(cmd, capture_output=True, check=True)
        clips['hook'] = str(hook_clip)
        print(f"   ✓ Hook clip: {hook_clip.name}")

    # Clip du climax (30s à partir du climax)
    if 'climax' in cues and cues['climax'] > 0:
        climax_start = cues['climax']
        climax_clip = output_dir / f"{base_name}_climax.mp3"
        cmd = [
            'ffmpeg', '-i', str(audio_path),
            '-ss', str(climax_start),
            '-t', str(clip_duration),
            '-acodec', 'libmp3lame',
            '-b:a', '192k',
            '-y',
            str(climax_clip)
        ]
        subprocess.run(cmd, capture_output=True, check=True)
        clips['climax'] = str(climax_clip)
        print(f"   ✓ Climax clip: {climax_clip.name}")

    # Clip de l'outro (depuis l'outro jusqu'à la fin)
    if 'outro' in cues and cues['outro'] > 0:
        outro_start = cues['outro']
        outro_clip = output_dir / f"{base_name}_outro.mp3"
        cmd = [
            'ffmpeg', '-i', str(audio_path),
            '-ss', str(outro_start),
            '-acodec', 'libmp3lame',
            '-b:a', '192k',
            '-y',
            str(outro_clip)
        ]
        subprocess.run(cmd, capture_output=True, check=True)
        clips['outro'] = str(outro_clip)
        print(f"   ✓ Outro clip: {outro_clip.name}")

    return clips


def detect_music_cues(audio_path):
    """
    Détecte automatiquement les moments clés d'une musique.

    Returns:
        dict: {
            'start': 0,
            'hook': timestamp du premier moment accrocheur (30-60s),
            'climax': timestamp du point culminant,
            'outro': timestamp de début de fade out,
            'fade_duration': durée suggérée du fade out
        }
    """
    if not HAS_LIBROSA:
        # Valeurs par défaut sans analyse
        audio = MP3(audio_path)
        duration = int(audio.info.length)
        return {
            'start': 0,
            'hook': min(30, duration // 3),
            'climax': duration // 2,
            'outro': max(0, duration - 15),
            'fade_duration': 8
        }

    print("🎵 Analyse des moments forts...")

    # Charger l'audio
    y, sr = librosa.load(str(audio_path), duration=300)  # Limiter à 5min pour vitesse
    duration = librosa.get_duration(y=y, sr=sr)

    # Détection du tempo et beats
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beats, sr=sr)

    # Analyse de l'énergie spectrale (pour trouver le climax)
    hop_length = 512
    spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=hop_length)[0]
    rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]

    # Combiner centroïde spectral et RMS pour détecter l'intensité
    energy = spectral_centroids * rms

    # Trouver le pic d'énergie (climax) - généralement dans le dernier tiers
    climax_start_frame = int(len(energy) * 0.4)  # Après 40% du morceau
    climax_frame = climax_start_frame + np.argmax(energy[climax_start_frame:])
    climax_time = librosa.frames_to_time(climax_frame, sr=sr, hop_length=hop_length)

    # Hook: premier moment accrocheur entre 20-60s
    # On cherche un pic d'énergie local dans cette zone
    hook_start_frame = librosa.time_to_frames(20, sr=sr, hop_length=hop_length)
    hook_end_frame = librosa.time_to_frames(min(60, duration), sr=sr, hop_length=hop_length)
    hook_zone = energy[hook_start_frame:hook_end_frame]

    if len(hook_zone) > 0:
        hook_frame = hook_start_frame + np.argmax(hook_zone)
        hook_time = librosa.frames_to_time(hook_frame, sr=sr, hop_length=hop_length)
    else:
        hook_time = 30  # Défaut

    # Outro: détection du fade out (diminution progressive de l'énergie)
    # On cherche où l'énergie commence à décroître significativement
    outro_start_frame = int(len(energy) * 0.7)  # Derniers 30%
    energy_tail = energy[outro_start_frame:]

    # Trouver où l'énergie passe sous 50% du max
    max_energy = np.max(energy)
    threshold = max_energy * 0.5
    outro_candidates = np.where(energy_tail < threshold)[0]

    if len(outro_candidates) > 0:
        outro_frame = outro_start_frame + outro_candidates[0]
        outro_time = librosa.frames_to_time(outro_frame, sr=sr, hop_length=hop_length)
    else:
        outro_time = duration - 15  # Défaut: 15s avant la fin

    # Fade duration basé sur le tempo
    if tempo > 140:
        fade_duration = 4  # Rapide: fade court
    elif tempo > 100:
        fade_duration = 6  # Modéré
    else:
        fade_duration = 8  # Lent: fade plus long

    cues = {
        'start': 0,
        'hook': int(hook_time),
        'climax': int(climax_time),
        'outro': int(outro_time),
        'fade_duration': fade_duration
    }

    print(f"   ✓ Hook détecté à {cues['hook']}s")
    print(f"   ✓ Climax à {cues['climax']}s")
    print(f"   ✓ Outro à {cues['outro']}s")
    print(f"   ✓ Tempo: {int(tempo)} BPM")

    return cues


def download_youtube_audio(url, output_dir):
    """
    Télécharge l'audio d'une vidéo YouTube en MP3 et extrait les métadonnées.

    Args:
        url: URL de la vidéo YouTube
        output_dir: Dossier de destination

    Returns:
        tuple: (Path du fichier MP3, dict métadonnées) ou (None, None) en cas d'erreur
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': str(output_dir / '%(title)s.%(ext)s'),
        'quiet': False,
        'no_warnings': False,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"📥 Téléchargement depuis: {url}")
            info = ydl.extract_info(url, download=True)

            # Extraire métadonnées complètes
            metadata = {
                'title': info.get('title', ''),
                'artist': info.get('uploader', ''),
                'duration': info.get('duration', 0),
                'description': info.get('description', ''),
                'thumbnail': info.get('thumbnail', ''),
                'view_count': info.get('view_count', 0),
                'upload_date': info.get('upload_date', ''),
                'youtube_id': info.get('id', ''),
                'youtube_url': url
            }

            # Trouver le fichier MP3 téléchargé
            title = info['title']
            # Nettoyer le titre pour le nom de fichier
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).strip()
            mp3_path = output_dir / f"{safe_title}.mp3"

            # yt-dlp peut avoir modifié le nom, chercher le fichier
            if not mp3_path.exists():
                # Chercher tous les MP3 récents
                mp3_files = sorted(output_dir.glob("*.mp3"), key=lambda p: p.stat().st_mtime, reverse=True)
                if mp3_files:
                    mp3_path = mp3_files[0]
                else:
                    print(f"❌ Fichier MP3 introuvable dans {output_dir}")
                    return None, None

            print(f"   ✓ Téléchargé: {mp3_path.name}")
            return mp3_path, metadata

    except Exception as e:
        print(f"❌ Erreur lors du téléchargement: {e}")
        return None, None


def add_to_music_library(audio_path, cues, metadata=None):
    """
    Ajoute la musique téléchargée à music_library.json.

    Args:
        audio_path: Chemin du fichier audio
        cues: Dict des cues détectés
        metadata: Dict optionnel avec artist, scenarios, moods, etc.
    """
    audio_path = Path(audio_path)

    # Lire les métadonnées ID3
    try:
        audio = MP3(audio_path, ID3=EasyID3)
        title = audio.get('title', [audio_path.stem])[0]
        artist = audio.get('artist', [''])[0]
        duration = int(audio.info.length)
    except:
        title = audio_path.stem
        artist = ""
        duration = 0

    # Générer un ID unique
    file_id = hashlib.md5(audio_path.name.encode()).hexdigest()[:12]

    # Charger la bibliothèque existante
    if LIBRARY_FILE.exists():
        with open(LIBRARY_FILE, 'r', encoding='utf-8') as f:
            library = json.load(f)
    else:
        library = []

    # Vérifier si déjà présent
    existing = next((item for item in library if item['id'] == file_id), None)
    if existing:
        print(f"   ⚠️  Musique déjà dans la bibliothèque: {title}")
        return

    # Créer l'entrée
    entry = {
        "id": file_id,
        "filename": audio_path.name,
        "title": title,
        "artist": artist,
        "duration": duration,
        "cues": cues,
        "tags": {
            "mood": metadata.get('moods', []) if metadata else [],
            "genre": metadata.get('genres', []) if metadata else [],
            "energy": metadata.get('energy', 5) if metadata else 5,
            "tempo": metadata.get('tempo', 'medium') if metadata else 'medium'
        },
        "impro_context": {
            "scenarios": metadata.get('scenarios', []) if metadata else [],
            "emotions": metadata.get('emotions', []) if metadata else [],
            "contraintes": []
        }
    }

    # Ajouter à la bibliothèque
    library.append(entry)

    # Sauvegarder
    with open(LIBRARY_FILE, 'w', encoding='utf-8') as f:
        json.dump(library, f, indent=2, ensure_ascii=False)

    print(f"   ✓ Ajouté à la bibliothèque: {title} ({duration}s)")


def main():
    parser = argparse.ArgumentParser(description="Télécharger de la musique YouTube pour Impro Manager")
    parser.add_argument('url', nargs='?', help="URL YouTube de la vidéo ou playlist")
    parser.add_argument('--playlist', help="URL d'une playlist YouTube")
    parser.add_argument('--search', help="Rechercher et télécharger (ex: 'western music epic')")
    parser.add_argument('--output', default=str(MUSIC_DIR / DOWNLOAD_SUBDIR),
                       help="Dossier de destination")
    parser.add_argument('--scenarios', help="Scénarios d'impro (séparés par des virgules)")
    parser.add_argument('--moods', help="Ambiances (séparés par des virgules)")
    parser.add_argument('--energy', type=int, help="Niveau d'énergie (1-10)")

    args = parser.parse_args()

    if not args.url and not args.playlist and not args.search:
        parser.print_help()
        print("\nExemples:")
        print("  python youtube_downloader.py 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'")
        print("  python youtube_downloader.py --search 'western showdown music'")
        print("  python youtube_downloader.py --playlist 'https://www.youtube.com/playlist?list=...'")
        print("  python youtube_downloader.py 'URL' --scenarios 'western,action' --energy 8")
        sys.exit(1)

    # Préparer les métadonnées
    metadata = {}
    if args.scenarios:
        metadata['scenarios'] = [s.strip() for s in args.scenarios.split(',')]
    if args.moods:
        metadata['moods'] = [m.strip() for m in args.moods.split(',')]
    if args.energy:
        metadata['energy'] = args.energy

    # Déterminer l'URL
    target_url = args.url or args.playlist

    if args.search:
        # Recherche YouTube
        target_url = f"ytsearch1:{args.search}"
        print(f"🔍 Recherche YouTube: {args.search}")

    # Télécharger
    audio_path, yt_metadata = download_youtube_audio(target_url, args.output)

    if audio_path:
        # Détecter les cues
        cues = detect_music_cues(audio_path)

        # Créer les clips audio
        try:
            clips = create_audio_clips(audio_path, cues)
            print(f"   ✓ {len(clips)} clips créés")
        except Exception as e:
            print(f"   ⚠️  Erreur création clips: {e}")
            clips = {}

        # Fusionner métadonnées
        if metadata:
            metadata.update(yt_metadata or {})
        else:
            metadata = yt_metadata or {}

        # Ajouter à la bibliothèque
        add_to_music_library(audio_path, cues, metadata)

        print("\n✅ Téléchargement terminé!")
        print(f"   Fichier: {audio_path}")
        print(f"   Hook: {cues['hook']}s | Climax: {cues['climax']}s | Outro: {cues['outro']}s")
        if clips:
            print(f"   Clips: {', '.join(clips.keys())}")
    else:
        print("\n❌ Échec du téléchargement")
        sys.exit(1)


if __name__ == "__main__":
    main()
