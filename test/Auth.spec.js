const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('request');
const server = require('../build/src/app').default;

chai.should();
chai.use(chaiHttp);
describe('Auth Api', () => {
  describe('base route for api', () => {
    it('it should get api base route', (done) => {
      chai
        .request(server)
        .get('/api')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have.a('object');
          response.body.should.have.property('message');
          response.body.should.have
            .property('message')
            .eq('Welcome to my world. Hello World');
          done();
        });
    });
  });

  describe('auth actions', () => {
    it('it should post to register route', () => {
      chai
        .request(server)
        .post('/api/register')
        .send({
          fullname: 'test',
          email: 'tester@emai.com',
          password: 'password',
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.have.a('object');
          response.body.should.have.property('status');
          response.body.should.have.property('message');
          response.body.should.have.property('data');
          response.body.should.have.property('status').eq('success');
          response.body.should.have
            .property('message')
            .eq('User Registration Successfull');
          response.body.should.have.property('data').to.eql(Object);
          done();
        });
    });

    it('it should post to login route', () => {
      chai
        .request(server)
        .post('/api/register')
        .send({
          email: 'tester@emai.com',
          password: 'password',
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.have.a('object');
          response.body.should.have.property('status');
          response.body.should.have.property('token');
          response.body.should.have.property('data');
          response.body.should.have.property('status').eq('success');
          response.body.should.have.property('token').to.eql(String);
          response.body.should.have.property('data').to.eql(Object);
          done();
        });
    });
  });
});
