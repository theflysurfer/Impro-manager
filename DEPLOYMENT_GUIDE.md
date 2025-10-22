# Guide de déploiement - Impro Manager v2.0 sur Hostinger

## État actuel

### ✅ Fichiers Docker créés
- `Dockerfile` : Build multi-stage (frontend Vue.js + backend Node.js)
- `docker-compose.yml` : Configuration production avec auto-start
- `.dockerignore` : Optimisation du build
- `backend/app.production.js` : Version production du backend

### 📋 Configuration
- **Port** : 8504
- **URL cible** : https://zimprobagnais.srv759970.hstgr.cloud
- **Auto-start** : Oui (économie RAM)
- **Basic Auth** : Oui (julien/DevAccess2025)
- **HTTPS** : Oui (Let's Encrypt)

---

## Étape 1 : Configuration rclone pour Dropbox

### Sur votre PC Windows

1. **Installer rclone** (si pas déjà fait) :
   - Télécharger depuis : https://rclone.org/downloads/
   - Ou via Chocolatey : `choco install rclone`

2. **Configurer Dropbox** :

```bash
rclone config
```

Suivre ces étapes :
- `n` → New remote
- Name : `dropbox`
- Storage : `dropbox` (tapez le numéro correspondant)
- Client ID : (laisser vide, appuyez sur Entrée)
- Client Secret : (laisser vide, appuyez sur Entrée)
- Edit advanced config : `n`
- Auto config : `y` → **Un navigateur s'ouvrira**
- Autorisez l'accès Dropbox
- Configuré ? `y`
- Quit : `q`

3. **Récupérer la configuration** :

```powershell
# Windows PowerShell
type $env:USERPROFILE\.config\rclone\rclone.conf

# OU Git Bash
cat ~/.config/rclone/rclone.conf
```

4. **Copier le contenu** qui ressemble à :

```ini
[dropbox]
type = dropbox
token = {"access_token":"...","token_type":"bearer",...}
```

### Sur le serveur Hostinger

Envoyez-moi le contenu du fichier rclone.conf, je le configurerai sur le serveur avec ces commandes :

```bash
ssh root@69.62.108.82
mkdir -p ~/.config/rclone
nano ~/.config/rclone/rclone.conf
# Coller le contenu [dropbox]
# Ctrl+X, Y, Enter

# Tester la connexion
rclone lsd dropbox:

# Créer le mount point
mkdir -p /opt/impro-manager/music

# Monter Dropbox (temporaire pour test)
rclone mount dropbox:Musiques /opt/impro-manager/music --daemon --vfs-cache-mode writes
```

---

## Étape 2 : Transfert des fichiers (après config rclone)

```bash
# Depuis votre PC Windows
cd "C:\Users\JulienFernandez\OneDrive\Coding\_Projets de code\2025.10 Music Impro chooser"

# Transférer les fichiers
scp -r backend client data music_library.json Dockerfile docker-compose.yml package.json root@69.62.108.82:/opt/impro-manager/
```

---

## Étape 3 : Build et lancement Docker

```bash
ssh root@69.62.108.82

cd /opt/impro-manager

# Build l'image
docker-compose build

# Lancer (première fois)
docker-compose up -d

# Vérifier les logs
docker logs impro-manager --tail=50 -f

# Tester
curl http://localhost:8504/api/health
```

---

## Étape 4 : Configuration Nginx + HTTPS + Auto-start

### Créer le certificat SSL

```bash
ssh root@69.62.108.82

# Obtenir certificat Let's Encrypt
certbot certonly --nginx -d zimprobagnais.srv759970.hstgr.cloud
```

### Créer la configuration Nginx

```bash
cat > /etc/nginx/sites-available/zimprobagnais <<'EOF'
server {
    listen 443 ssl http2;
    server_name zimprobagnais.srv759970.hstgr.cloud;

    ssl_certificate /etc/letsencrypt/live/zimprobagnais.srv759970.hstgr.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zimprobagnais.srv759970.hstgr.cloud/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Basic Auth
    include snippets/basic-auth.conf;

    location / {
        proxy_pass http://127.0.0.1:8890;  # Auto-start proxy
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 300;
        client_max_body_size 100M;
    }
}

server {
    listen 80;
    server_name zimprobagnais.srv759970.hstgr.cloud;
    return 301 https://$host$request_uri;
}
EOF

# Activer le site
ln -s /etc/nginx/sites-available/zimprobagnais /etc/nginx/sites-enabled/

# Tester et recharger
nginx -t && systemctl reload nginx
```

### Ajouter à l'auto-start

```bash
# Éditer la config auto-start
nano /opt/docker-autostart/config.json
```

Ajouter cette section dans `services` :

```json
"zimprobagnais.srv759970.hstgr.cloud": {
  "name": "Impro Manager",
  "composeDir": "/opt/impro-manager",
  "proxyPort": 8504,
  "theme": "matrix",
  "containers": ["impro-manager"]
}
```

Redémarrer le service :

```bash
systemctl restart docker-autostart
```

---

## Étape 5 : Configuration rclone mount permanent

```bash
# Créer le script de mount
cat > /opt/scripts/mount-dropbox-music.sh <<'EOF'
#!/bin/bash
rclone mount dropbox:Musiques /opt/impro-manager/music \
  --daemon \
  --vfs-cache-mode writes \
  --vfs-cache-max-age 24h \
  --vfs-cache-max-size 2G \
  --allow-other \
  --log-file /var/log/rclone-music.log
EOF

chmod +x /opt/scripts/mount-dropbox-music.sh

# Créer le service systemd
cat > /etc/systemd/system/rclone-music-mount.service <<'EOF'
[Unit]
Description=Rclone mount for Dropbox music
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/opt/scripts/mount-dropbox-music.sh
ExecStop=/bin/fusermount -u /opt/impro-manager/music
Restart=on-failure
User=root

[Install]
WantedBy=multi-user.target
EOF

# Activer et démarrer
systemctl enable rclone-music-mount
systemctl start rclone-music-mount

# Vérifier
systemctl status rclone-music-mount
ls /opt/impro-manager/music
```

---

## Étape 6 : Tests finaux

```bash
# Vérifier que tout fonctionne
curl -u julien:DevAccess2025 https://zimprobagnais.srv759970.hstgr.cloud/api/health

# Vérifier les musiques
ls /opt/impro-manager/music

# Tester l'accès aux musiques via l'API
curl -u julien:DevAccess2025 https://zimprobagnais.srv759970.hstgr.cloud/api/music | jq '.[:3]'

# Logs
docker logs impro-manager --tail=50
journalctl -u docker-autostart -n 20
journalctl -u rclone-music-mount -n 20
```

---

## Résumé des URLs

- **Application** : https://zimprobagnais.srv759970.hstgr.cloud
- **API Health** : https://zimprobagnais.srv759970.hstgr.cloud/api/health
- **Bibliothèque** : https://zimprobagnais.srv759970.hstgr.cloud/api/music

**Credentials** : julien / DevAccess2025

---

## Dépannage

### L'application ne démarre pas

```bash
docker logs impro-manager
```

### Les musiques ne sont pas accessibles

```bash
systemctl status rclone-music-mount
ls /opt/impro-manager/music
journalctl -u rclone-music-mount -n 50
```

### Nginx 502 Bad Gateway

```bash
# Vérifier que le conteneur tourne
docker ps | grep impro-manager

# Vérifier le port
curl http://localhost:8504/api/health

# Logs nginx
tail -f /var/log/nginx/error.log
```

### Auto-start ne fonctionne pas

```bash
journalctl -u docker-autostart -f
systemctl status docker-autostart
```

---

## Commandes de maintenance

```bash
# Redémarrer l'application
cd /opt/impro-manager && docker-compose restart

# Voir les logs
docker logs impro-manager -f

# Arrêter (auto-start le relancera au prochain accès)
cd /opt/impro-manager && docker-compose stop

# Mettre à jour l'application
cd /opt/impro-manager
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

**Version** : 1.0 - 2025-10-18
