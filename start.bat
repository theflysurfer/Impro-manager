@echo off
echo 🎭 Démarrage d'Impro Manager...
echo.

echo Installation des dépendances serveur...
call npm install

echo.
echo Installation des dépendances client...
cd client
call npm install
cd ..

echo.
echo 🚀 Lancement de l'application...
echo.
echo Serveur: http://localhost:3000
echo Interface MC: http://localhost:3000/mc
echo Interface Son: http://localhost:3000/sound
echo.

start http://localhost:3000
call npm run dev

pause