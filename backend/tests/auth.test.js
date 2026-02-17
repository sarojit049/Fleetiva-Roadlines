const request = require('supertest');
const app = require('../app');

describe('Auth routes', () => {
  it('registers, logs in, and returns current user', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'user@example.com',
      phone: '9999999999',
      password: 'password123',
      role: 'customer',
      companyName: 'Acme Logistics',
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.accessToken).toBeTruthy();

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBeTruthy();

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('user@example.com');
  });
});
