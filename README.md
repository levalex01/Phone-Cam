
# 📸 PhoneCam – Diffusez la caméra de votre téléphone vers votre PC en WebRTC

[![Docker Pulls](https://img.shields.io/docker/pulls/levalex01/phonecam)](https://hub.docker.com/r/levalex01/phonecam)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/levalex01/Phone-Cam)


**PhoneCam** transforme votre téléphone en **caméra haute qualité** pour votre PC via **WebRTC**.  
Parfait pour photographier vos pièces de monnaie, timbres, objets de collection… ou pour toute application nécessitant un **zoom précis** et des **captures nettes**.

---

## ✨ Fonctionnalités

- 🔴 **Diffusion vidéo en direct** depuis la caméra arrière du téléphone (1080p/720p/480p)  
- 🔍 **Zoom optique** et réglage de la torche (si supporté par l’appareil)  
- 🖼 **Zoom / Pan fluide** côté PC avec molette + glisser  
- 📷 **Capture PNG haute résolution** du flux vidéo  
- 📱 **PWA installable** (plein écran, icône sur écran d’accueil)  
- 🔒 **HTTPS** pour l’accès caméra sécurisé  

---

## 🚀 Lancer avec Docker

### 1. Préparer vos certificats HTTPS
Pour que la caméra fonctionne sur téléphone, un certificat valide est requis.  
Placez `cert.pem` et `key.pem` dans un dossier `certs/` sur votre machine.  
Vous pouvez les générer avec [mkcert](https://github.com/FiloSottile/mkcert) ou OpenSSL.

### 2. Lancer le container
```bash
docker run -p 3000:3000 -p 8443:8443 \
  -v $(pwd)/certs:/app/certs \
  levalex01/phonecam:latest
```

---

## 🌐 Utilisation

1. **Depuis votre PC (viewer)**  
   👉 `http://<IP-PC>:3000/viewer.html?room=coins`

2. **Depuis votre téléphone (caméra)**  
   👉 `https://<IP-PC>:8443/phone.html?room=coins`

> Remplacez `<IP-PC>` par l’adresse IP locale de la machine qui exécute Docker.  
> Le paramètre `room` doit être identique sur les deux appareils.

---

## ⚙️ Options de configuration

- **room** : identifiant unique du salon WebRTC (`?room=monflux`)  
- **Résolution vidéo** : choix entre 1080p, 720p, 480p  
- **Zoom optique** : via API `applyConstraints` (si supporté)  
- **Torche** : activation/désactivation si l’appareil le permet  

---

## 📦 Déploiement
L’image est disponible sur Docker Hub :  
```bash
docker pull levalex01/phonecam:latest
```

---

## 📜 Licence
MIT – libre à usage personnel ou professionnel.  
Créé pour la capture et l’inspection d’objets avec précision.

---

## 💡 Astuces
- Installez-la comme **PWA** sur votre téléphone pour un accès rapide.  
- Utilisez un **trépied** ou un support pour des photos encore plus nettes.  
- Changez le `room` pour avoir plusieurs flux simultanés.

---

## 📬 Contact
Pour toute question, suggestion ou contribution : ouvrez une **issue** ou envoyez un message via Docker Hub.
