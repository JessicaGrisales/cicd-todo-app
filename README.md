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

## 4. Les permissions en général

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

## 5. Indications concernant les permissions mises en place (Point 2.1)

Pour sécuriser l'accès aux données, j'ai utilisé le fichier mongo-init.js. Ce script s'exécute au démarrage pour créer trois utilisateurs différents, afin de ne pas utiliser le compte "root" pour tout faire. Chacun a un rôle bien précis :

- L'utilisateur pour l'application (app_backend):
  C'est le compte que le serveur Node.js utilise pour se connecter. Je lui ai donné le droit de lire et d'écrire (readWrite) dans la base de données db_todoapp. C'est grâce à lui que l'application peut créer, afficher ou supprimer des tâches et des utilisateurs.

- L'utilisateur pour gérer la base (admin_app) : Cet utilisateur sert uniquement à gérer la base de données des tâches. Il a le rôle userAdmin, ce qui lui permet de gérer les accès sur cette base spécifique, sans toucher au reste du système.

- L'utilisateur pour les sauvegardes (backup_user) : C'est un compte spécial créé dans la base administrative. Je lui ai donné la permission de lire toutes les bases de données (readAnyDatabase). Son seul but est de pouvoir récupérer toutes les données pour faire des copies de sécurité (backups) en cas de problème.

## 6. Indications pour le Backup de la base de données (Point 2.2)

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

## 7. Evaluation des 80%

L'enseigant a spécifié certaines indications à réaliser

**Package.json**
Les dépendances liées à MySQL ont été supprimer du fichier en question (sqlite3, mysql2, sequelize).
Le package-lock.json a été supprimer et réinstaller dans le backend grâche à la commande.

```bash
npm install
```

**user.controller.js**
L'ajout de findById() au lieu de findOne() dans les fonctions deleteCurrentUser, edtUser(), getUser().

**test.api.js**
Remplacement sequelize.sync() par clearDatabase() qui supprime toutes les collections MongoDB avant chaque test

## 8. Usage de l'IA dans ce projet

L'utilisation de l'intelligence artificielle a permis de mieux cerner les attentes du cahier des charges et de s'orienter efficacement dans ce nouvel environnement technique. Elle a aidé à appréhender la logique de fonctionnement de MongoDB et ses différences avec le SQL. L'outil a également servi de support pédagogique en fournissant des exemples concrets, ce qui a facilité la compréhension du contexte et la prise en main de la librairie Mongoose.

## Conclusion

Pour conclure, ce projet a représenté un véritable défi technique. La découverte de Mongoose et son intégration dans le backend constituaient une première pour moi. Si la prise en main a été difficile au début, notamment pour appréhender cette nouvelle logique, cet obstacle m'a permis de progresser significativement dans ma compréhension du développement backend.
