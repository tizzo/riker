'use strict';

var should = require('should');
var sinon = require('sinon');
var Riker = require('..');
var Parameter = Riker.Parameter;
var yargs = require('yargs');

describe('Parameter', function() {
  it('should configure yargs based on input', function() {
    var param = new Parameter();
    var spy = sinon.spy(yargs);
    var parameter = new Parameter('some-param');
    parameter
      .defaults('awesome')
      .require(true)
      .describe('Does stuff')
      .choices(['awesome', 'sauce'])
      .alias('other-option')
      .type(String)
      .applyYargs(yargs);
    //spy.withArgs('awesome').calledOnce;
  });
});
