'use strict';
var Riker = require('..');
var should = require('should');

describe('Riker', function() {
  it('should instantiate', function(done) {
    var commandCollection = {
      run: function(conf, cb) {
        cb();
      },
      initialize: () => {},
      addSubCommand: () => {},
      getParsedOptions: () => {},
      configure: (conf, done) => { done(); },
    };
    var riker = new Riker();
    riker.commandCollection.should.be.instanceOf(Riker.CommandCollection);
    var riker = new Riker({commandCollection, enableHelp: false});
    riker.run(done)
  });
});

