const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");
const { response } = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe(" api/categories", () => {
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
  test("GET 200 - Returns an array of review objects with '`owner` which is the `username` from the users table`title`,`review_id`, `category`,`review_img_url`,`created_at`,`votes` ,`designer`,`comment_count` which is the total count of all the comments with this review_id", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body).not.toHaveLength(0);
        response.body.forEach((review) => {
          let dateVal = 0;
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
          const checkDate = Date.parse(review.created_at) > dateVal;
          dateVal = Date.parse(review.created_at);

          expect(checkDate).toBe(true);
        });
      });
  });
  test("GET 200 - api/reviews/:review_id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          review_id: 2,
          title: `Jenga`,
          review_body: "Fiddly fun for all the family",
          designer: `Leslie Scott`,
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 5,
          category: `dexterity`,
          owner: `philippaclaire9`,
          created_at: new Date(1610964101251).toString(),
        });
      });
  });
  test("GET: 200 /api/reviews/:review_id/comments", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([
          {
            comment_id: 6,
            body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
            votes: 10,
            author: "philippaclaire9",
            review_id: 3,
            created_at: new Date(1616874588110).toString(),
          },
          {
            comment_id: 3,
            body: "I didn't know dogs could play games",
            votes: 10,
            author: "philippaclaire9",
            review_id: 3,
            created_at: new Date(1610964588110).toString(),
          },
          {
            comment_id: 2,
            body: "My dog loved this game too!",
            votes: 13,
            author: "mallionaire",
            review_id: 3,
            created_at: new Date(1610964545410).toString(),
          },
        ]);
      });
  });
});

describe("Error handling", () => {
  test("GET 404 not found", () => {
    return request(app)
      .get("/api/categ")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(`Not found`);
      });
  });
  test("GET: 400 - Error handling for api/reviews/:wrong_id (invalid query)", () => {
    return request(app)
      .get("/api/reviews/34567")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid id");
      });
  });
  test("GET: 400 - Error handling for api/reviews/invalid_id (invalid query)", () => {
    return request(app)
      .get("/api/reviews/gnmsf")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Not a valid id");
      });
  });
  test("GET: 400 - Error handling for api/reviews/wrong_id/comments (invalid query)", () => {
    return request(app)
      .get("/api/reviews/5563/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid id");
      });
  });
  test("GET: 400 - Error handling for api/not a number/comments (invalid query)", () => {
    return request(app)
      .get("/api/reviews/shlmnth/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Not a valid id");
      });
  });
});
