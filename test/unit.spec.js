process.env.NODE_ENV = 'test';

var express = require('express');
var chai = require('chai');
var should = chai.should();
var getURLParam = require('../src/scripts/helperFunctions.js')


describe('url param function', function() {

    it('should return the correct parameter number', function(done) {
        let result = getURLParam('test', 'http://localhost:3000/?test=1')
        result.should.be.equal('1')
        done()
    })

    it('should return the correct parameter - string', function(done) {
        let result = getURLParam('test2', 'http://localhost:3000/?test2=string')
        result.should.be.equal('string')
        done()
    })

    it('should NOT return the correct parameter - string', function(done) {
        let result = getURLParam('test', 'http://localhost:3000/?test2=string')
        should.not.exist(result)
        done()
    })
});

describe('database tester', function() {
  var db = require('../server/db.js')
  var app = express();

  const database = new db(app);

  it('get initial pool index should return 0', function(done){
    let index = database.getCurrentPollIndex();
    index.should.be.equal(0)
    done();
  })

  it('should successfull add a poll to the database and return a new index', function(done){
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
    let returnedPoll = {
     "data": {
       "options": [
         {
           "id": 0,
           "text": 1
         },
         {
           "id": 1,
           "text": 2
         },
         {
           "id": 2,
           "text": 3
         },
         {
           "id": 3,
           "text": 4
         }
       ],
       "title": "test"
     },
     "pollScores": [
       [],
       [],
       [],
       [],
     ],
     urlExt: 0
    }
    let newPollIndex = database.addPollToDatabase(pollData);
    let newPollDataFromArray = database.getSinglePollFromDatabase(0)
    newPollIndex.should.be.equal(0)
    newPollDataFromArray.should.be.eql(returnedPoll)
    done();
  })

  it('get poll index should return 1', function(done){
    let index = database.getCurrentPollIndex();
    index.should.be.equal(1)
    done();
  })
});
