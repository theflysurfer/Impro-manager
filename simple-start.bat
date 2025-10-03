@echo off
echo 🎭 Démarrage rapide d'Impro Manager...
echo.

echo 🔧 Installation des dépendances serveur...
call npm install

echo.
echo 🚀 Lancement du serveur...
echo.
echo ✅ Application disponible sur:
echo    http://localhost:3000
echo.
echo 📱 Interfaces:
echo    🎬 Mode MC: http://localhost:3000/mc
echo    🎵 Mode Son: http://localhost:3000/sound
echo.

start http://localhost:3000

node server/app.js

pause