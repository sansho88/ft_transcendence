# Projet Transcendence

## Description

Transcendence est un projet final de l'école 42. Il s'agit de créer une version en ligne et multijoueur du jeu Pong, similaire à l'original de 1972. Le jeu inclut également un chatroom, un système de matchmaking, des duels, une liste d'amis et un système de blocage.

## Technologies utilisées

- Backend: NestJS, PostgreSQL
- Frontend: Next.js / React
- Conteneurisation: Docker Compose

## Services

- Backend (API REST + Websocket socket-io)
- Frontend
- Base de données (PostgreSQL)

## Installation

1. Clonez le dépôt:

```bash
git clone [url-du-dépôt]
```

2. Naviguez vers le répertoire du projet et lancez Docker Compose:

```bash
cd [nom-du-répertoire]
docker-compose up --build
```

## Utilisation

Ouvrez votre navigateur et accédez à `http://localhost:3000`.

## Fonctionnalités

- Jeu Pong multijoueur
- Chatroom
- Système de matchmaking
- Liste d'amis
- Système de blocage 
- Commandes admin channel ban-mute-kick

## Note

 - Le login 42 ne fonctionnera que si vous renseignez votre propre clef API 42 dans le fichier docker/.env/.env_42
