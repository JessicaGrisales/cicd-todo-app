# Projet Todo App (Migration DevOps & MongoDB)

## 1. Description du projet

Ce projet consiste en la migration technique d'une application de gestion de tâches (Todo App) d'une architecture SQL vers une architecture NoSQL performante. L'objectif principal était de conteneuriser l'application et de transformer la logique métier pour exploiter la flexibilité de MongoDB tout en assurant la sécurité des accès et la persistance des données.

## 2. Technologies utilisées

- Backend : Node.js avec le framework Express.

- Base de données : MongoDB (Version 8.0.6) via le driver Mongoose.

- Infrastructure : Docker et Docker Compose pour l'orchestration des containers.

- Sécurité : JSON Web Token (JWT) pour les sessions et Bcrypt pour le hashage des mots de passe.
