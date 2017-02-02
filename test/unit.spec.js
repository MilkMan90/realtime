process.env.NODE_ENV = 'test';

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
