# 🚀 Workflow de Développement - Impro Manager

**Stratégie** : Développement direct sur serveur de production
**Raison** : Éviter problèmes OneDrive + environnement unique

---

## 📋 Prérequis

- Accès SSH au serveur : `root@69.62.108.82`
- Git configuré en local (pour commits)
- VSCode avec extension Remote-SSH (optionnel mais recommandé)

---

## 🔧 Setup Initial (Une Seule Fois)

### 1. Configuration SSH Locale

Ajouter dans `~/.ssh/config` (ou `C:\Users\JulienFernandez\.ssh\config`) :

```ssh-config
Host impro-server
    HostName 69.62.108.82
    User root
    Port 22
```

Ensuite, connexion rapide avec : `ssh impro-server`

### 2. Vérifier Setup Serveur

```bash
ssh impro-server "cd /opt/impro-manager && git status"
```

---

## 🔄 Workflow de Développement

### Option A : CLI Pure (Rapide)

#### 1. Développer sur Serveur

```bash
# Connexion SSH
ssh impro-server

# Aller dans le projet
cd /opt/impro-manager

# Créer/modifier fichiers avec nano ou vim
nano backend/server.js

# Ou utiliser SCP pour copier fichiers depuis local
# (depuis machine locale)
scp local-file.js root@69.62.108.82:/opt/impro-manager/path/
```

#### 2. Tester les Changements

```bash
# Sur le serveur

# Option 1 : Rebuild et restart Docker
docker-compose build
docker-compose up -d

# Option 2 : Développement sans Docker (plus rapide)
cd backend && npm install && npm start &
cd ../client && npm install && npm run build

# Voir les logs
docker logs impro-manager --tail=50 -f

# Tester l'API
curl http://localhost:8504/api/health
```

#### 3. Commit et Push (depuis serveur)

```bash
# Sur le serveur
cd /opt/impro-manager

# Vérifier changements
git status
git diff

# Commit
git add .
git commit -m "✨ feat: Add Socket.IO server setup"

# Push vers GitHub
git push origin master
```

---

### Option B : VSCode Remote-SSH (Confort) ⭐ Recommandé

#### Setup VSCode Remote

1. **Installer extension** : `Remote - SSH` (ms-vscode-remote.remote-ssh)

2. **Se connecter au serveur** :
   - `Ctrl+Shift+P` → "Remote-SSH: Connect to Host"
   - Sélectionner `impro-server` (ou entrer `root@69.62.108.82`)

3. **Ouvrir le projet** :
   - `File > Open Folder` → `/opt/impro-manager`

4. **Développer normalement** :
   - Éditer fichiers directement
   - Terminal intégré = terminal serveur
   - Git intégré fonctionne

#### Workflow VSCode

```bash
# Dans le terminal VSCode (déjà sur serveur)

# Installer dépendances si besoin
cd backend && npm install socket.io
cd ../client && npm install socket.io-client

# Démarrer en mode dev (sans Docker)
cd /opt/impro-manager

# Terminal 1 : Backend
cd backend && npm start

# Terminal 2 : Frontend (build watch)
cd client && npm run build -- --watch

# Ou utiliser Docker
docker-compose up --build
```

---

## 🧪 Tests et Validation

### Tester l'App

```bash
# API Health Check
curl http://localhost:8504/api/health

# Frontend (si servi par backend)
curl http://localhost:8504/

# WebSocket (après implémentation)
# Utiliser outil comme https://amritb.github.io/socketio-client-tool/
```

### Tester depuis Local

Si port forwarding configuré :
```bash
# Port forward SSH (depuis local)
ssh -L 8504:localhost:8504 root@69.62.108.82

# Puis accéder à http://localhost:8504 dans navigateur local
```

Ou directement via domaine :
```
https://impro-manager.ludo-impro.fr
```

---

## 📦 Déploiement Production

### Déploiement Complet

```bash
# Sur le serveur
cd /opt/impro-manager

# 1. Pull dernières modifications (si commit depuis local)
git pull origin master

# 2. Rebuild images Docker
docker-compose build

# 3. Restart containers
docker-compose down
docker-compose up -d

# 4. Vérifier logs
docker logs impro-manager --tail=50

# 5. Check santé
curl http://localhost:8504/api/health
```

### Déploiement Rapide (sans rebuild)

Si seulement changements JS/Vue (pas de dépendances) :

```bash
# Sur le serveur
docker-compose restart
```

---

## 🔍 Debugging

### Logs en Temps Réel

```bash
# Logs application
docker logs impro-manager -f

# Logs Nginx (si configuré)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Entrer dans le Container

```bash
# Shell interactif
docker exec -it impro-manager sh

# Explorer fichiers
ls -la /app
cat /app/backend/server.js
```

### Vérifier Processus

```bash
# Voir les containers actifs
docker ps

# Voir ports exposés
docker ps --format '{{.Names}}: {{.Ports}}'

# Netstat
netstat -tlnp | grep -E '8504|3001|5173'
```

---

## 🚨 Troubleshooting

### Problème : Port déjà utilisé

```bash
# Trouver processus sur port 8504
lsof -i :8504
# Ou
netstat -tlnp | grep 8504

# Kill processus
kill -9 <PID>
```

### Problème : Git conflicts

```bash
# Stash changements locaux
git stash

# Pull
git pull origin master

# Ré-appliquer changements
git stash pop
```

### Problème : Docker out of space

```bash
# Nettoyer images inutilisées
docker system prune -a

# Voir l'espace disque
df -h
```

### Problème : npm install échoue

```bash
# Clear cache
npm cache clean --force

# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Conventions Commits (depuis serveur)

```bash
# Préfixer avec emoji ou type
git commit -m "✨ feat: Add WebSocket server"
git commit -m "🐛 fix: Correct match schema"
git commit -m "♻️ refactor: Improve live timer"
git commit -m "📝 docs: Update workflow guide"
git commit -m "🎨 style: Format code"

# Toujours avec message descriptif
git commit -m "feat: Add chrono sync" # ✅ BON
git commit -m "update" # ❌ MAUVAIS
```

---

## 🔄 Workflow Complet Exemple

### Ajout Feature WebSocket

```bash
# 1. Connexion (VSCode Remote ou SSH)
ssh impro-server
cd /opt/impro-manager

# 2. Créer branche (optionnel)
git checkout -b feat/websocket-live

# 3. Installer dépendances
cd backend && npm install socket.io

# 4. Développer (éditer fichiers)
nano backend/server.js
# Ajouter code Socket.IO...

# 5. Tester sans Docker (rapide)
cd backend
node server.js
# Ctrl+C pour stopper

# 6. Commit
git add .
git commit -m "✨ feat: Add Socket.IO server with rooms"

# 7. Merge dans master (si branch)
git checkout master
git merge feat/websocket-live

# 8. Push
git push origin master

# 9. Déployer avec Docker
docker-compose build
docker-compose up -d

# 10. Vérifier
docker logs impro-manager --tail=20
curl http://localhost:8504/api/health
```

---

## 🎯 Résumé : Commandes Essentielles

```bash
# Connexion
ssh root@69.62.108.82

# Navigation
cd /opt/impro-manager

# Édition (choisir selon préférence)
nano fichier.js          # Nano (simple)
vim fichier.js           # Vim (avancé)
code .                   # VSCode Remote

# Git
git status
git add .
git commit -m "message"
git push origin master

# Docker
docker-compose build
docker-compose up -d
docker-compose restart
docker logs impro-manager -f

# Tests
curl http://localhost:8504/api/health
curl http://localhost:8504/api/matches
```

---

## ✅ Checklist Avant Chaque Session

- [ ] SSH connecté : `ssh impro-server`
- [ ] Dans le bon dossier : `cd /opt/impro-manager`
- [ ] Git à jour : `git pull origin master`
- [ ] Containers actifs : `docker ps`

---

*Workflow mis à jour : 22 octobre 2025*
*Développement direct sur serveur pour éviter sync OneDrive*
