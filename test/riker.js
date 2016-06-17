'use strict';
var Riker = require('..');
var should = require('should');

describe('Riker', function() {
  it('should instantiate', function(done) {
    var commandCollection = {
      run: function(cb) {
        cb();
      },
      addSubCommand: function() {}
    };
    var riker = new Riker();
    riker.commandCollection.should.be.instanceOf(Riker.CommandCollection);
    var riker = new Riker({commandCollection, enableHelp: false});
    riker.run(done)
  });
});

