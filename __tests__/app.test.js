const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");
const { response } = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("3 api/categories", () => {
  test("GET:200 recieves an array with api/categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const hasProperties = true;
        // array length more than 0 check
        // forEach expect match objects
        if (response.body.length === 0) {
          hasProperties = false;
        }
        response.body.forEach((element) => {
          if (
            element.hasOwnProperty(`slug`) === false ||
            element.hasOwnProperty(`description`) === false
          ) {
            hasProperties = false
          }
        });
        expect(hasProperties).toBe(true);
      });
  });
});
