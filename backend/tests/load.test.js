const request = require('supertest');
const app = require('../app');

const registerUser = async (payload) => {
  const res = await request(app).post('/api/auth/register').send(payload);
  return res.body.accessToken;
};

describe('Load routes', () => {
  it('allows customer to post a load', async () => {
    const token = await registerUser({
      name: 'Customer',
      email: 'customer@example.com',
      phone: '8888888888',
      password: 'password123',
      role: 'customer',
      companyName: 'Customer Co',
    });

    const loadRes = await request(app)
      .post('/api/load/post')
      .set('Authorization', `Bearer ${token}`)
      .send({
        material: 'Steel',
        requiredCapacity: 10,
        from: 'Delhi',
        to: 'Mumbai',
        consignorName: 'Consignor',
        consigneeName: 'Consignee',
      });

    expect(loadRes.status).toBe(201);
    expect(loadRes.body.material).toBe('Steel');
  });
});
