# Backend Usage Guide

Go to `backend` folder:

## Project Setup

```sh
npm install
```

## DB connection

The backend use MySQL database, before starting the Node application you need to set a 
environment variable `DB_URL` to connect to a MySQL server in a file `.env`:

```sh
DB_URL="mysql://app_user:app_password@localhost:3306/db_todoapp"
```

## Run and Hot-Reload for Development

```sh
npm run start
```

For testing the frontend a custom route `/test/reset` is necessary to cleanup the DB before each test.
To active such route, start the backend with:

```sh
npm run start:e2e
```
