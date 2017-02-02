process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server/server.js');

chai.use(chaiHttp);

describe('API Routes', function() {

});

describe('GET /api/poll/:pollid', function() {
  it('should return a poll', function(done) {
    chai.request(server)
    .get('/api/poll/0')
    .end(function(err, res) {
      res.should.have.status(200);
      res.body.should.be.eql({});
    done();
    });
  });
});

describe('POST /api/newpoll', function() {
  it('should create a new poll', function(done) {
    const pollData = {
      title: 'test',
      options: [
        {
          id: 0,
          text: 1
        },
        {
          id: 1,
          text: 2
        },
        {
          id: 2,
          text: 3
        },
        {
          id: 3,
          text: 4
        }
      ]
    };
    chai.request(server)
    .post('/api/newpoll')
    .send(pollData)
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('object');
    res.body.pollID.should.be.eql(0);
    done();
    });
  });
});
