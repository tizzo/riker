'use strict';
var should = require('should');
var Riker = require('..');

var Help = Riker.commands.Help;

describe('Help', function() {
  it('should return help text', function() {
    //console.log(Help);
    var help = new Help();
    //console.log(help.help);
    //help.shortDescription.should.equal('Displays help for specific subcommands.');
  });
  it('should generate help for a set of subcommands', function() {
  });
});
