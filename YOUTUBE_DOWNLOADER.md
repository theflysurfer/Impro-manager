# 🎬 YouTube Music Downloader - Impro Manager

Script Python pour télécharger de la musique depuis YouTube avec détection automatique des moments forts (hook, climax, outro).

---

## 📦 Installation

### 1. Installer Python (si nécessaire)
Télécharger Python 3.9+ depuis [python.org](https://www.python.org/downloads/)

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

**Dépendances installées** :
- `yt-dlp` : Téléchargement YouTube
- `mutagen` : Métadonnées audio (ID3 tags)
- `librosa` : Analyse musicale (détection hook/climax)
- `numpy`, `scipy` : Calculs scientifiques

---

## 🚀 Utilisation

### Télécharger une vidéo YouTube

```bash
python youtube_downloader.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Rechercher et télécharger

```bash
python youtube_downloader.py --search "western showdown epic music"
```

### Télécharger une playlist

```bash
python youtube_downloader.py --playlist "https://www.youtube.com/playlist?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG"
```

### Ajouter des métadonnées d'impro

```bash
python youtube_downloader.py "URL" \
  --scenarios "western,action" \
  --moods "épique,tendu" \
  --energy 8
```

---

## 🎵 Détection Automatique des Moments Forts

Le script utilise **librosa** pour analyser l'audio et détecter automatiquement :

| Moment | Description | Détection |
|--------|-------------|-----------|
| **Hook** (0:30-1:00) | Premier moment accrocheur | Pic d'énergie spectrale dans les 60 premières secondes |
| **Climax** (milieu) | Point culminant | Maximum d'énergie spectrale (centroïde + RMS) |
| **Outro** (fin) | Début du fade out | Décroissance de l'énergie sous 50% du max |
| **Fade Duration** | Durée du fade | Basée sur le tempo (4-8s) |

### Exemple de sortie

```
🎵 Analyse des moments forts...
   ✓ Hook détecté à 32s
   ✓ Climax à 128s
   ✓ Outro à 165s
   ✓ Tempo: 128 BPM
```

---

## 📂 Organisation des Fichiers

### Fichiers téléchargés

```
C:\Users\JulienFernandez\OneDrive\Zic impro\
└── YouTube Downloads\
    ├── Epic Western Showdown Music.mp3
    ├── Action Combat Theme.mp3
    └── ...
```

### Bibliothèque musicale

Les musiques sont automatiquement ajoutées à `music_library.json` :

```json
{
  "id": "a1b2c3d4e5f6",
  "filename": "Epic Western Showdown Music.mp3",
  "title": "Epic Western Showdown Music",
  "artist": "Epic Music World",
  "duration": 180,
  "cues": {
    "start": 0,
    "hook": 32,
    "climax": 128,
    "outro": 165,
    "fade_duration": 6
  },
  "tags": {
    "mood": ["épique", "tendu"],
    "genre": [],
    "energy": 8,
    "tempo": "fast"
  },
  "impro_context": {
    "scenarios": ["western", "action"],
    "emotions": [],
    "contraintes": []
  }
}
```

---

## 🛠️ Exemples d'Utilisation

### Créer une bibliothèque Western

```bash
python youtube_downloader.py --search "western movie theme" --scenarios western --energy 7
python youtube_downloader.py --search "cowboy duel music" --scenarios western,action --energy 9
python youtube_downloader.py --search "saloon piano" --scenarios western --moods calme --energy 3
```

### Bruitage d'animaux

```bash
python youtube_downloader.py --search "horse neigh sound effect" --moods effet-sonore --energy 5
python youtube_downloader.py --search "wolf howl" --moods effet-sonore,sombre --energy 6
```

### Musiques d'ambiance

```bash
python youtube_downloader.py --search "medieval tavern ambience" --scenarios médiéval --moods calme,atmosphérique --energy 3
python youtube_downloader.py --search "space ambient music" --scenarios science-fiction --moods atmosphérique --energy 4
```

---

## ⚙️ Configuration Avancée

### Changer le dossier de destination

```bash
python youtube_downloader.py "URL" --output "D:/Musiques/Impro"
```

### Qualité audio

Modifiez `ydl_opts` dans `youtube_downloader.py` (ligne 137) :

```python
'preferredquality': '320',  # 320 kbps au lieu de 192
```

---

## 🐛 Dépannage

### Erreur: `yt-dlp not found`

```bash
pip install --upgrade yt-dlp
```

### Erreur: `librosa failed to load`

```bash
# Windows
pip install --upgrade librosa numpy scipy

# Si erreur avec numba/llvmlite
pip install numba==0.56.4
```

### FFmpeg manquant

yt-dlp nécessite **FFmpeg** pour la conversion MP3.

**Windows** :
1. Télécharger depuis [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extraire dans `C:\ffmpeg`
3. Ajouter `C:\ffmpeg\bin` au PATH système

**Vérification** :
```bash
ffmpeg -version
```

---

## 📊 Intégration avec generate_music_library.py

Pour regénérer la bibliothèque complète avec les nouveaux téléchargements :

```bash
python generate_music_library.py
```

Cela scannera :
- Musiques existantes dans `C:\Users\JulienFernandez\OneDrive\Zic impro`
- Nouveaux téléchargements dans `YouTube Downloads`
- Mettra à jour `music_library.json`

---

## 🎯 Prochaines Améliorations

- [ ] Interface web pour téléchargement depuis l'app
- [ ] Batch download avec fichier CSV
- [ ] Auto-tagging avec reconnaissance de genre (ML)
- [ ] Détection automatique des scénarios d'impro
- [ ] Preview audio avant ajout à la bibliothèque
- [ ] Support SoundCloud/Spotify (via API)

---

## 📝 Notes

- **Légalité** : Assurez-vous d'avoir les droits d'utilisation de la musique téléchargée
- **Performance** : L'analyse librosa peut prendre 10-30s par musique (limitée à 5min d'audio)
- **Sauvegarde** : `music_library.json` est automatiquement sauvegardé avant modification

---

*Dernière mise à jour : 23 octobre 2025*
