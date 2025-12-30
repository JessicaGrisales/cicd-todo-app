// On se positionne sur la base de l'application dès le début
db = db.getSiblingDB("db_todoapp");

// 1. Utilisateur
db.createUser({
  user: "app_backend",
  pwd: "backend_123",
  roles: [
    { role: "readWrite", db: "db_todoapp" },
    { role: "dbAdmin", db: "db_todoapp" },
  ],
});

// 2. Utilisateur
db.createUser({
  user: "admin_app",
  pwd: "admin_123",
  roles: [
    { role: "userAdmin", db: "db_todoapp" },
    { role: "dbStats", db: "db_todoapp" },
  ],
});

// 3. Utilisateur
db = db.getSiblingDB("admin");
db.createUser({
  user: "backup_user",
  pwd: "backup_123",
  roles: [
    { role: "readAnyDatabase", db: "admin" },
    { role: "backup", db: "admin" },
  ],
});
