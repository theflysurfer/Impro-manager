# 🧪 Test Scenarios - Impro Manager v2.0

**Date**: 22 octobre 2025
**Version**: MVP Live Mode
**Based on**: PRD.md personas and user journeys

---

## Table des Matières

1. [Scénarios Persona Julie (MC)](#scénarios-persona-julie-mc)
2. [Scénarios Persona Marc (Son)](#scénarios-persona-marc-son)
3. [Scénarios Synchronisation Temps Réel](#scénarios-synchronisation-temps-réel)
4. [Scénarios Edge Cases](#scénarios-edge-cases)

---

## Scénarios Persona Julie (MC)

### Scénario 1.1 : Créer une feuille de match depuis template

**Persona** : Julie (MC)
**Objectif** : Créer une feuille de match complète en moins de 10 minutes
**Prérequis** : Aucun

**Steps** :
1. Navigate to `/mc`
2. Click "Nouveau Match"
3. Fill in match info:
   - Title: "Match vs Les Fous du Rire"
   - Date: 2025-11-15
   - Teams: home="Notre Troupe", away="Les Fous du Rire"
4. Click "Charger Template Standard"
5. Verify 19 lines loaded:
   - ARRIVÉE (lines 1-4)
   - ÉCHAUFFEMENT (line 5)
   - PRÉSENTATION (line 6)
   - SÉQUENCE x8 (lines 7-10, 13-16)
   - ANNONCE_INTERMEDIAIRE (line 11)
   - PAUSE (line 12)
   - ANNONCE_FIN (lines 17-18)
   - FIN (line 19)
6. Click "Sauvegarder"

**Expected Result** :
- ✅ Match created with match_id
- ✅ 19 lines with correct types
- ✅ Success notification displayed
- ✅ Match appears in matches list

**Acceptance Criteria** :
- Duration: < 2 minutes
- No errors in console
- Data saved in matches.json

---

### Scénario 1.2 : Personnaliser lignes de match

**Persona** : Julie (MC)
**Objectif** : Modifier thèmes et durées des séquences
**Prérequis** : Match créé (Scénario 1.1)

**Steps** :
1. Select match from dropdown
2. Edit line 7 (SÉQUENCE #1):
   - Theme: "Western"
   - Duration: 180 seconds
3. Edit line 8 (SÉQUENCE #2):
   - Theme: "Romance"
   - Duration: 180 seconds
4. Edit line 9 (SÉQUENCE #3):
   - Theme: "Action"
   - Duration: 300 seconds
5. Click "Sauvegarder"

**Expected Result** :
- ✅ All changes saved
- ✅ Themes displayed in lines list
- ✅ Durations updated

---

### Scénario 1.3 : Passer en Mode Live MC

**Persona** : Julie (MC)
**Objectif** : Activer Mode Live pour gérer le spectacle
**Prérequis** : Match sauvegardé

**Steps** :
1. Select match with match_id
2. Click "Passer en Mode Live" button
3. Verify navigation to `/matches/{match_id}/live/mc`
4. Verify interface displays:
   - Match title
   - Connection status (🟢 Connecté or 🔴 Déconnecté)
   - Chronomètre at 00:00
   - Score board (both teams at 0)
   - Lines list with first line active

**Expected Result** :
- ✅ Page loads without errors
- ✅ WebSocket connection established
- ✅ All UI elements visible
- ✅ First line highlighted as active

---

### Scénario 1.4 : Gérer chronomètre pendant spectacle

**Persona** : Julie (MC)
**Objectif** : Contrôler timing d'une séquence
**Prérequis** : Mode Live activé

**Steps** :
1. Click "▶️ Démarrer" chronometer
2. Wait 5 seconds
3. Verify chrono displays 00:05
4. Click "⏸️ Pause"
5. Wait 3 seconds
6. Verify chrono still at 00:05
7. Click "▶️ Démarrer" again
8. Wait 2 seconds
9. Verify chrono at 00:07
10. Click "⏹️ Stop"
11. Verify chrono reset to 00:00

**Expected Result** :
- ✅ Chrono updates every second when running
- ✅ Pause freezes timer
- ✅ Resume continues from paused time
- ✅ Stop resets to 00:00
- ✅ WebSocket emits chrono_update events

---

### Scénario 1.5 : Gérer score équipes

**Persona** : Julie (MC)
**Objectif** : Saisir points pendant spectacle
**Prérequis** : Mode Live activé

**Steps** :
1. Click "+1" for home team (Notre Troupe)
2. Verify score: Home 1 - Away 0
3. Click "+2" for away team (Les Fous)
4. Verify score: Home 1 - Away 2
5. Click "+3" for home team
6. Verify score: Home 4 - Away 2

**Expected Result** :
- ✅ Scores update immediately
- ✅ Numbers displayed correctly
- ✅ WebSocket emits score_update events

---

### Scénario 1.6 : Passer ligne suivante

**Persona** : Julie (MC)
**Objectif** : Progresser dans la feuille de match
**Prérequis** : Mode Live activé, first line active

**Steps** :
1. Verify line 1 is active (highlighted)
2. Click "⏭️ Ligne Suivante"
3. Verify line 2 is now active
4. Click line 5 directly from list
5. Verify line 5 is now active
6. Verify chrono reset to 00:00

**Expected Result** :
- ✅ Active line updates correctly
- ✅ Visual highlight moves
- ✅ Chrono resets when changing line
- ✅ WebSocket emits line_started event

---

## Scénarios Persona Marc (Son)

### Scénario 2.1 : Ouvrir interface Son et voir match assigné

**Persona** : Marc (Son)
**Objectif** : Accéder à la feuille de match pour assignation
**Prérequis** : Match créé par Julie

**Steps** :
1. Navigate to `/sound`
2. Select match from dropdown
3. Verify match details displayed:
   - Title
   - Teams
   - Lines list
4. Verify music library loaded (800+ tracks)

**Expected Result** :
- ✅ Match loads successfully
- ✅ Lines displayed with types and durations
- ✅ Music library accessible
- ✅ No console errors

---

### Scénario 2.2 : Assigner musique simple (1 point)

**Persona** : Marc (Son)
**Objectif** : Assigner une musique à une ligne
**Prérequis** : Match loaded in sound interface

**Steps** :
1. Scroll to line 7 (SÉQUENCE #1 - Western)
2. Search music library for "Western"
3. Click on "Western Showdown" music card
4. Verify music assigned to line
5. Click "Sauvegarder"

**Expected Result** :
- ✅ Music icon appears on line
- ✅ Assignment saved to backend
- ✅ Success notification

**Note** : 3-point assignment (INTRO/OUTRO/TRANSITION) will be implemented in Sprint 2

---

### Scénario 2.3 : Passer en Mode Live Son

**Persona** : Marc (Son)
**Objectif** : Activer Mode Live pour gérer audio pendant spectacle
**Prérequis** : Match with assigned music

**Steps** :
1. Select match from dropdown
2. Click "Passer en Mode Live" button
3. Verify navigation to `/matches/{match_id}/live/sound`
4. Verify interface displays:
   - Match title
   - Connection status
   - Current line section (empty initially)
   - All lines list
   - Quick search input
   - Score board (read-only)

**Expected Result** :
- ✅ Page loads without errors
- ✅ WebSocket connection established
- ✅ All UI sections visible
- ✅ Waiting for MC to start

---

### Scénario 2.4 : Jouer musique en Mode Live

**Persona** : Marc (Son)
**Objectif** : Jouer musique assignée pendant séquence
**Prérequis** : Mode Live Son activated, line with music started by MC

**Steps** :
1. Wait for MC to start line 7
2. Verify current line displays:
   - Title: "SÉQUENCE #1 - Western"
   - Duration: 03:00
   - Assigned music info
3. Click "▶️ Play" button
4. Verify audio playing
5. Adjust volume to 60%
6. Click "⏸️ Pause"
7. Click "⏹️ Stop"

**Expected Result** :
- ✅ Audio plays from assigned music file
- ✅ Controls work correctly
- ✅ Volume adjusts in real-time
- ✅ Pause/resume functional

---

### Scénario 2.5 : Recherche rapide bruitage imprévu

**Persona** : Marc (Son)
**Objectif** : Trouver et jouer un bruitage non anticipé
**Prérequis** : Mode Live Son activated

**Steps** :
1. Type "chat" in quick search input
2. Verify filtered results appear
3. Click on "Meow Cat Sound" result
4. Verify audio plays immediately

**Expected Result** :
- ✅ Search filters library in < 500ms
- ✅ Results show only matching tracks
- ✅ Click plays audio instantly
- ✅ No interruption of main music playback

---

## Scénarios Synchronisation Temps Réel

### Scénario 3.1 : Synchronisation démarrage ligne

**Personas** : Julie (MC) + Marc (Son)
**Objectif** : Vérifier que changement de ligne se synchronise
**Prérequis** : Both in Live Mode, different devices/browsers

**Steps** :
1. **Julie** : Click "⏭️ Ligne Suivante" (line 1 → line 2)
2. **Marc** : Verify current line updates to line 2
3. **Julie** : Click line 5 directly
4. **Marc** : Verify current line updates to line 5

**Expected Result** :
- ✅ Marc sees line change < 1 second after Julie
- ✅ Line title and metadata update
- ✅ WebSocket events transmitted correctly

**Latency Target** : < 1 second

---

### Scénario 3.2 : Synchronisation chronomètre

**Personas** : Julie (MC) + Marc (Son)
**Objectif** : Vérifier que chrono se synchronise en temps réel
**Prérequis** : Both in Live Mode

**Steps** :
1. **Julie** : Start chronometer
2. **Marc** : Verify chrono displays and updates every second
3. Wait 10 seconds
4. **Marc** : Verify chrono shows 00:10 (± 1 second)
5. **Julie** : Pause chronometer
6. **Marc** : Verify chrono status shows "⏸️ Pause"
7. **Julie** : Resume chronometer
8. **Marc** : Verify chrono continues from paused time

**Expected Result** :
- ✅ Chrono displays synchronize every second
- ✅ Pause/resume status synchronizes
- ✅ Drift < 2 seconds after 3 minutes

**Latency Target** : chrono_update emitted every 1 second

---

### Scénario 3.3 : Synchronisation score

**Personas** : Julie (MC) + Marc (Son)
**Objectif** : Vérifier que score se synchronise
**Prérequis** : Both in Live Mode

**Steps** :
1. **Julie** : Add +1 to home team
2. **Marc** : Verify score updates to Home 1 - Away 0
3. **Julie** : Add +2 to away team
4. **Marc** : Verify score updates to Home 1 - Away 2

**Expected Result** :
- ✅ Score updates appear on Marc's interface < 1 second
- ✅ Numbers match exactly

---

## Scénarios Edge Cases

### Scénario 4.1 : Reconnexion après perte réseau

**Personas** : Julie or Marc
**Objectif** : Vérifier robustesse WebSocket
**Prérequis** : Mode Live activated

**Steps** :
1. Verify connection status: 🟢 Connecté
2. Simulate network loss (disable WiFi 5 seconds)
3. Verify status changes to: 🔴 Déconnecté
4. Re-enable network
5. Wait for auto-reconnection
6. Verify status back to: 🟢 Connecté

**Expected Result** :
- ✅ Disconnection detected
- ✅ Auto-reconnect within 5 seconds
- ✅ State preserved (current line, scores)
- ✅ User notified of reconnection

---

### Scénario 4.2 : Mode Live sans match sauvegardé

**Persona** : Julie (MC)
**Objectif** : Vérifier validation avant Mode Live
**Prérequis** : New match not saved

**Steps** :
1. Create new match (don't save)
2. Click "Passer en Mode Live"

**Expected Result** :
- ✅ Alert: "Veuillez d'abord sauvegarder le match..."
- ✅ Navigation blocked
- ✅ User can save then try again

---

### Scénario 4.3 : Mode Live avec match sans lignes

**Persona** : Julie (MC)
**Objectif** : Gérer match vide gracefully
**Prérequis** : Match saved with 0 lines

**Steps** :
1. Load match with no lines
2. Go to Mode Live
3. Verify interface displays "En attente..."
4. Verify no errors in console

**Expected Result** :
- ✅ Interface loads
- ✅ Empty state message shown
- ✅ No JavaScript errors
- ✅ Can still navigate back

---

### Scénario 4.4 : Multiple MCs en Mode Live (pas supporté)

**Personas** : Julie + autre MC
**Objectif** : Vérifier qu'un seul MC peut être actif
**Prérequis** : None

**Steps** :
1. **Julie** : Activate Mode Live MC
2. **Other MC** : Try to activate Mode Live for same match
3. Verify warning/prevention mechanism

**Expected Result** :
- ✅ Warning: "Un MC est déjà en Mode Live"
- ✅ Second MC can view but not control
- ⚠️ **Note**: Multi-MC not in MVP scope

---

## Test Execution Checklist

### Manual Testing (Priority P0)
- [ ] Scénario 1.1 - Create match from template
- [ ] Scénario 1.3 - Activate Live Mode MC
- [ ] Scénario 1.4 - Chronometer controls
- [ ] Scénario 1.6 - Next line progression
- [ ] Scénario 2.3 - Activate Live Mode Sound
- [ ] Scénario 3.1 - Line synchronization
- [ ] Scénario 3.2 - Chrono synchronization

### Automated Testing (Priority P1)
- [ ] Write Playwright E2E test for Scénario 1.1
- [ ] Write Playwright E2E test for Scénario 1.3
- [ ] Write WebSocket integration test for Scénario 3.1

### Performance Testing (Priority P2)
- [ ] Measure chrono sync latency (target < 1s)
- [ ] Measure line change latency (target < 1s)
- [ ] Test with 3G connection
- [ ] Test with 100+ music tracks in library

---

## Test Environment

### Local Development
- Backend: http://localhost:3001
- Frontend: http://localhost:5173
- WebSocket: ws://localhost:3001

### Test Data
- Use migrated matches.json (3 matches, 9 lines)
- Use music.json (800+ tracks)
- Create test match "TEST - Match Scénarios"

### Tools
- Manual: Browser DevTools, Network tab
- Automated: Playwright
- WebSocket: Browser console for socket.io events

---

**Last Updated**: 22 octobre 2025
**Status**: Ready for manual testing (Sprint 1 completed)
**Next**: Implement Sprint 2, then update scenarios for 3-point music
