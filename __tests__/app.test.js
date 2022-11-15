const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");
const { response } = require("../app.js");
const { string } = require("pg-format");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("3 api/categories", () => {
  test("GET:200 recieves an array with api/categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        // (_body error)           {body: {categories}} 
        expect(response.body).toHaveLength(4);
        response.body.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  
});

describe('Error handling', () => {
  test('GET 404 not found', () => {
    return request(app)
    .get("/api/categ")
    .expect(404)
    .then((response)=>{
      expect(response.body.msg).toBe(`Not found`)
    })
  });
});