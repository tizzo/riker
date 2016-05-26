'use strict';

var yargs = require('yargs');

var CommandCollection = require('./CommandCollection');


class Riker {

  /**
   * @param {Object} options - An object containing configuration options.
   */
  constructor(options) {
    options = options || {};
    // TODO: Handle whether this is or isn't a command collection.
    this.commandCollection = new CommandCollection();
  }

  addSubCommand(name, command) {
    this.commandCollection.addSubCommand(name, command);
  }

  run(done) {
    this.commandCollection.run(done);
  }

  initialize() {
  }

}

module.exports = Riker;
