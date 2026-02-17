const request = require('supertest');
const app = require('../app');

const registerUser = async (payload) => {
  const res = await request(app).post('/api/auth/register').send(payload);
  return res.body.accessToken;
};

describe('PDF routes', () => {
  it('returns bilty and invoice PDFs', async () => {
    const adminToken = await registerUser({
      name: 'Admin',
      email: 'admin@example.com',
      phone: '7777777777',
      password: 'password123',
      role: 'admin',
      companyName: 'Admin Co',
    });
    const driverToken = await registerUser({
      name: 'Driver',
      email: 'driver@example.com',
      phone: '6666666666',
      password: 'password123',
      role: 'driver',
      companyName: 'Driver Co',
    });
    const customerToken = await registerUser({
      name: 'Customer',
      email: 'customer2@example.com',
      phone: '5555555555',
      password: 'password123',
      role: 'customer',
      companyName: 'Customer Co',
    });

    const truckRes = await request(app)
      .post('/api/truck/post')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({
        vehicleNumber: 'MH12AB1234',
        capacity: 12,
        vehicleType: '10-Wheeler',
        currentLocation: 'Pune',
      });
    expect(truckRes.status).toBe(201);

    const loadRes = await request(app)
      .post('/api/load/post')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        material: 'Cement',
        requiredCapacity: 10,
        from: 'Delhi',
        to: 'Mumbai',
        consignorName: 'Consignor',
        consigneeName: 'Consignee',
      });
    expect(loadRes.status).toBe(201);

    const bookingRes = await request(app)
      .post('/api/booking/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ loadId: loadRes.body._id, truckId: truckRes.body._id });
    expect(bookingRes.status).toBe(201);

    const biltyRes = await request(app)
      .get(`/api/booking/${bookingRes.body.booking._id}/bilty`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(biltyRes.status).toBe(200);
    expect(biltyRes.headers['content-type']).toContain('application/pdf');

    const invoiceRes = await request(app)
      .get(`/api/booking/${bookingRes.body.booking._id}/invoice`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(invoiceRes.status).toBe(200);
    expect(invoiceRes.headers['content-type']).toContain('application/pdf');
  });
});
