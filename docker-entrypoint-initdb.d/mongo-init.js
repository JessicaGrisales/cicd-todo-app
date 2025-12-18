// On se positionne sur la base de l'application dès le début [cite: 68]
db = db.getSiblingDB("db_todoapp");

// 1. Utilisateur 
db.createUser({
  user: "app_backend",
  pwd: "password_123", 
  roles: [
    { role: "readWrite", db: "db_todoapp" }, 
    { role: "dbAdmin", db: "db_todoapp" }   
  ]
});

// 2. Utilisateur
db.createUser({
  user: "admin_app",
  pwd: "password_admin_123",
  roles: [
    { role: "userAdmin", db: "db_todoapp" },
    { role: "dbStats", db: "db_todoapp" }    
  ]
});

// 3. Utilisateur 
db = db.getSiblingDB("admin"); 
db.createUser({
  user: "backup_user",
  pwd: "password_backup_123",
  roles: [
    { role: "readAnyDatabase", db: "admin" }, 
    { role: "backup", db: "admin" }            
  ]
});