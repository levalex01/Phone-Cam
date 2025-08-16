# Étape 1 : Use the official Node.js image as the base image
FROM node:22-slim

# Étape 2 : créer un dossier de travail
WORKDIR /app

# Étape 3 : copier les fichiers package.json + package-lock.json
COPY package*.json ./

# Étape 4 : installer les dépendances
RUN npm install --production

# Étape 5 : copier le reste du code
COPY . .

# Étape 6 : exposer les ports (HTTP + HTTPS)
EXPOSE 3000 8443

# Étape 7 : lancer l'application
CMD ["npm", "start"]
