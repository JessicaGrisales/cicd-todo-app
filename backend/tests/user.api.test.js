const request = require('supertest');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { initApp, stopApp } = require('../app');
const { JWT_SECRET } = require('../config/keys');

let app;
let User;

function uniqueEmail(prefix = 'john') {
  return `${prefix}.${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;
}

// Helper: RS256 JWT with { sub } as required by the auth middleware
function generateToken(userId) {
  return jsonwebtoken.sign({ sub: userId }, JWT_SECRET, {
    algorithm: 'RS256',
    expiresIn: '1h'
  });
}

beforeAll(async () => {
  const out = await initApp({ listen: false });
  app = out.app;
  User = app.locals.models.User;
});

afterAll(async () => {
  await stopApp();
});

describe('User Controller', () => {
  // ------------------------------------------------------
  // CREATE USER (no auth)
  // ------------------------------------------------------
  it('POST /api/user → creates a new user', async () => {
    const payload = {
      email: uniqueEmail('create'),
      password: 'password123',
      name: 'John',
      address: '123 Main St',
      zip: 12345,
      location: 'Cityville'
    };

    const res = await request(app).post('/api/user').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(payload.email);

    const dbUser = await User.findOne({ where: { email: payload.email } });
    expect(dbUser).toBeTruthy();
    expect(await bcrypt.compare(payload.password, dbUser.password)).toBe(true);
  });

  // ------------------------------------------------------
  // GET USER (auth required)
  // ------------------------------------------------------
  it('GET /api/user → returns current user using Bearer token', async () => {
    const email = uniqueEmail('get');
    const user = await User.create({
      email,
      password: await bcrypt.hash('password123', 8)
    });

    const token = generateToken(user.id);

    const res = await request(app).get('/api/user').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });

  // ------------------------------------------------------
  // EDIT USER (auth required)
  // ------------------------------------------------------
  it('PATCH /api/user → updates user fields', async () => {
    const email = uniqueEmail('patch');
    const user = await User.create({
      email,
      password: await bcrypt.hash('password123', 8)
    });

    const token = generateToken(user.id);

    const update = {
      name: 'John',
      address: '123 Main St',
      zip: 12345,
      location: 'Cityville'
    };

    const res = await request(app)
      .patch('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send(update);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(update.name);
    expect(res.body.address).toBe(update.address);
    expect(res.body.zip).toBe(update.zip);
    expect(res.body.location).toBe(update.location);

    const dbUser = await User.findByPk(user.id);
    expect(dbUser.name).toBe(update.name);
    expect(dbUser.address).toBe(update.address);
    expect(dbUser.zip).toBe(update.zip);
    expect(dbUser.location).toBe(update.location);
  });

  // ------------------------------------------------------
  // DELETE USER (auth required)
  // ------------------------------------------------------
  it('DELETE /api/user → deletes current user', async () => {
    const email = uniqueEmail('delete');
    const user = await User.create({
      email,
      password: await bcrypt.hash('password123', 8)
    });

    const token = generateToken(user.id);

    const res = await request(app).delete('/api/user').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const dbUser = await User.findByPk(user.id);
    expect(dbUser).toBeNull();
  });

  // ------------------------------------------------------
  // Middleware behavior (optional but useful)
  // ------------------------------------------------------
  it('GET /api/user → 401 without token', async () => {
    const res = await request(app).get('/api/user');
    expect(res.status).toBe(401);
  });

  it('GET /api/user → 403 with invalid token', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(403);
  });
});
