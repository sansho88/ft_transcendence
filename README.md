# Projet Transcendence (10/23 -- WIP)
![image](https://github.com/BenJ3D/ft_transcendence/assets/49345674/a9d1f99b-7592-4733-93cc-d65a53631824)

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
git clone https://github.com/BenJ3D/ft_transcendence.git
```

2. Naviguez vers le répertoire du projet et lancez Docker Compose:

```bash
cd ft_transcendence
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
