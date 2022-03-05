const request = require('supertest');
const app = require('../build/src/app');

beforeAll(() => {
  console.log('he');
});

describe('Todos API', () => {
  it('POST /api/register ---> Creates a new user', () =>
    request(app)
      .post('/api/register')
      .send({
        email: 'test@email.com',
        fullname: 'test user',
        password: 'password',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            name: 'do the dishes',
            completed: false,
            id: expect.any(Number),

            data: {
              email: 'test@email.com',
              fullname: 'test user',
              password: expect.any(String),
              avatar: expect.any(String),
            },
          }),
        );
      }));
});
