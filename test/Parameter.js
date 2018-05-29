'use strict';

const should = require('should');
const sinon = require('sinon');
const Riker = require('..');
const Parameter = Riker.Parameter;
const yargs = require('yargs');

describe('Parameter', function() {
  it('should configure yargs based on input', function() {
    const param = new Parameter();
    const spy = sinon.spy(yargs);
    const parameter = new Parameter('some-param');
    parameter
      .defaults('awesome')
      .require(true)
      .describe('Does stuff')
      .choices(['awesome', 'sauce'])
      .alias('other-option')
      .type('string')
      .applyYargs(yargs);
    //spy.withArgs('awesome').calledOnce;
    // TODO: Lot's of assertions.
  });
  describe('array()', () => {
    it('should set the type to be an array', (done) => {
      const parameter = new Parameter('some-param');
      parameter.array();
      parameter.applyYargs({array: (param) => {
        param.should.equal('some-param');
        done();
      }});
    });
  });
  describe('type()', () => {
    it('should throw if an invalid type is specified', () => {
      const parameter = new Parameter('some-param');
      should.throws(() => parameter.type('invalid type'));
    });
  });
});
