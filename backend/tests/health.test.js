const request = require("supertest");
const app = require("../server");

describe("GET /", () => {
  it("should return 200 and wellness message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "Fleetiva backend running");
  });
});
