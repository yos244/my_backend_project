const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");
const sorted = require("jest-sorted");
const express = require(`express`);
const { string } = require("pg-format");

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
        expect(response.body).toBeSortedBy(`created_at`, { descending: true });
      });
  });

  test("GET: 200 /api/reviews/:review_id/comments with a review that has no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([]);
      });
  });
});
describe("POST api", () => {
  test("POST: 201 -  POST /api/reviews/:review_id/comments post a body that accepts username and body properties", () => {
    const comment = { username: `bainesface`, body: `I like pizza` };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(comment)
      .expect(201)
      .then((response) => {
        expect(response.body.author).toEqual(`bainesface`);
        expect(response.body.body).toEqual(`I like pizza`);
        expect(response.body.review_id).toBe(1);
      });
  });
  test("POST: 201 -  posts something with unnecesary key returns post without the key", () => {
    const comment = {
      username: `bainesface`,
      body: `I hate pizza`,
      somethingElse: `nothing`,
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(comment)
      .expect(201)
      .then((response) => {
        expect(response.body.author).toEqual(`bainesface`);
        expect(response.body.body).toEqual(`I hate pizza`);
        expect(response.body.review_id).toBe(5);
        expect(response.body.hasOwnProperty(`somethingElse`)).toBe(false);
      });
  });
});

describe("PATCH api", () => {
  test("PATCH: 201 - increments the current review vote by 1", () => {
    const increment = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/6")
      .send(increment)
      .expect(200)
      .then((patch) => {
        expect(patch.body).toMatchObject({
          title: "Occaecat consequat officia in quis commodo.",
          designer: "Ollie Tabooger",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          review_body:
            "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
          category: "social deduction",
          created_at: expect.any(String),
          votes: 9,
        });
      });
  });
});

describe("GET USERS", () => {
  test("/api/users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((users) => {
        expect(users.body).toHaveLength(4);
        users.body.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test('GET:200 - comment count', () => {
    return request(app)
    .get(`/api/reviews/3`)
    .expect(200)
    .then((commentObj)=>{
      expect(commentObj.body.comment_count).toBe(`3`)
    })
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
  test("POST: 400 - Invalid ID (too big)", () => {
    const comment = { username: `philippaclaire9`, body: `No comment` };
    return request(app)
      .post("/api/reviews/6475/comments")
      .send(comment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Invalid id");
      });
  });
  test("POST: 400 ID provided is a string ", () => {
    const comment = { username: `philippaclaire9`, body: `No comment` };
    return request(app)
      .post("/api/reviews/boo/comments")
      .send(comment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Invalid id");
      });
  });
  test("POST: 400 missing body", () => {
    const comment = { username: `philippaclaire9` };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(comment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Invalid id");
      });
  });
  test("POST: 400 username does not exist", () => {
    const comment = { username: `someone`, body: `boo` };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(comment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Invalid username");
      });
  });
  test("PATCH: 400 wrong id", () => {
    const obj = { inc_votes: 5 };
    return request(app)
      .patch("/api/reviews/593854")
      .send(obj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual(`Id does not exist`);
      });
  });
  test("PATCH: 400 wrong input type", () => {
    const obj = { inc_votes: `string` };
    return request(app)
      .patch("/api/reviews/5")
      .send(obj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual(`Invalid data type`);
      });
  });
  test("PATCH: 400 empty object", () => {
    const obj = {};
    return request(app)
      .patch("/api/reviews/5")
      .send(obj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual(`Invalid data type`);
      });
  });
  test("PATCH: 400 object with wrong property", () => {
    const obj = { something: `nothing` };
    return request(app)
      .patch("/api/reviews/5")
      .send(obj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual(`Invalid data type`);
      });
  });
});
