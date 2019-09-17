FROM node:10
WORKDIR /app
EXPOSE 4200

# Installation de Angular
RUN npm install -g @angular/cli@latest

# Installation des dépendances
COPY package*.json ./
RUN npm install
COPY . .

# Lancement de l'application
CMD [ "npm", "start" ]
