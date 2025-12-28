# Projet Todo App (Migration DevOps & MongoDB)

## 1. Description du projet

Ce projet consiste en la migration technique d'une application de gestion de tâches (Todo App) d'une architecture SQL vers une architecture NoSQL performante. L'objectif principal était de conteneuriser l'application et de transformer la logique métier pour exploiter la flexibilité de MongoDB tout en assurant la sécurité des accès et la persistance des données.

## 2. Technologies utilisées

- Backend : Node.js avec le framework Express.

- Base de données : MongoDB (Version 8.0.6) via le driver Mongoose.

- Infrastructure : Docker et Docker Compose pour l'orchestration des containers.

- Sécurité : JSON Web Token (JWT) pour les sessions et Bcrypt pour le hashage des mots de passe.

### Fonctionnement de l'application

Le fonctionnement du projet s'articule autour d'une architecture client-serveur stricte, divisée en deux volets : l'architecture technique et le scénario d'utilisation.

1.  **Architecture Technique (Flux de données)**
    L'interaction entre les différentes couches du système suit ce schéma :

    - Client (Frontend) : Envoie des requêtes HTTP standard (GET, POST, PUT, DELETE) pour interagir avec l'API. Chaque requête sécurisée inclut le jeton d'authentification dans son en-tête.

    - Serveur (Express.js) : Il reçoit la requête, vérifie systématiquement l'identité de l'émetteur via le Token JWT, et dirige la demande vers le contrôleur approprié.

    - Base de données (MongoDB) : Les données sont stockées de manière persistante dans deux collections principales : users et todos. La relation est relationnelle au niveau logique : chaque tâche est liée dynamiquement à un utilisateur via son \_id.

2.  **Scénario d'Utilisation (Cycle de vie)**
    Du point de vue de l'utilisateur, l'application permet la gestion complète de deux entités :

    - Gestion du Compte (User) :

      - Inscription : Création d'un nouveau document dans la collection users avec hashage du mot de passe.

      - Connexion : Authentification et réception du Token JWT pour la session.

      - Administration : L'utilisateur connecté peut modifier ses informations ou supprimer son compte (ce qui entraîne le nettoyage de ses données).

    - Gestion des Tâches (Todos) :

      - CRUD : Une fois identifié, l'utilisateur peut Créer, Lire, Mettre à jour et Supprimer des tâches.

      - Isolation : Le système garantit que chaque utilisateur n'accède qu'à ses propres tâches. Même si deux utilisateurs sont connectés en même temps, le filtrage par user_id assure une étanchéité totale des données.

## 3. Instructions pour un environnement local

**Prérequis**

Docker Desktop installé et démarré.

Git pour la récupération des sources.

**Installation et Lancement**

1. Cloner le dépôt :

```bash
git clone https://github.com/JessicaGrisales/cicd-todo-app.git
cd cicd-todo-app
```

2. Configuration (.env) : Assurez-vous que le fichier .env à la racine contient la chaîne de connexion adaptée au réseau Docker :

```bash
MONGODB_URL="mongodb://root:admin@localhost:27017/db_todoapp?authSource=admin"
```

3. Démarrer l'application : Exécutez la commande suivante pour construire et lancer les conteneurs :

```bash
docker-compose up --build
```

4. Accès :

- Application Web: http://localhost:5173/

```bash
Depuis le répertoire frontend

npm run dev
```

- API Backend: http://localhost:3000/

```bash
Depuis le répertoire backend

git npm run start
```

## 4. Indications concernant les permissions (Point 2.1)

La sécurité et la gestion des droits d'accès ont été implémentées à trois niveaux :

1.  **Sécurité Base de Données (Infrastructure) :**

    - Le conteneur MongoDB est protégé par un utilisateur root avec mot de passe.

    - L'application Node.js s'authentifie obligatoirement via la base admin (authSource=admin) pour établir la connexion.

2.  **Sécurité Applicative (Authentification) :**

    - L'accès aux routes protégées nécessite un Token JWT valide.

    - Le contrôleur d'authentification vérifie systématiquement la correspondance des mots de passe hachés via bcrypt.

3.  **Sécurité des Données (Isolation) :**

    - Le cloisonnement des données est strict : chaque requête de lecture, modification ou suppression de tâche (todo) inclut l'ID de l'utilisateur connecté (user_id).

    - Cela garantit qu'un utilisateur ne peut jamais accéder aux tâches d'un autre, même en connaissant l'ID d'une tâche.

## 5. Indications pour le Backup de la base de données (Point 2.2)

Une stratégie de sauvegarde et de restauration a été mise en place en utilisant les volumes Docker pour garantir la persistance des archives sur la machine hôte.

- Volume de Backup : Un "Bind Mount" a été configuré dans docker-compose.yml (./data/mongo:/backupdb), permettant de récupérer les fichiers de sauvegarde directement dans le dossier data/mongo de votre projet Windows/Linux.

**Commande de Sauvegarde (Backup)**

Cette commande crée une archive compressée (.gz) de la base db_todoapp :

```bash
docker exec mongo mongodump --db db_todoapp --username root --password admin --authenticationDatabase admin --gzip --archive=/backupdb/backup_todoapp.gz
```

Le fichier généré sera disponible dans le dossier local cicd-todo-app/data/mongo/.

**Commande de Restauration (Restore)**
Cette commande écrase les données actuelles par celles de la sauvegarde (option --drop) :

```bash
docker exec mongo mongorestore --username root --password admin --authenticationDatabase admin --gzip --archive=/backupdb/backup_todoapp.gz --drop
```

## 6. Usage de l'IA dans ce projet
