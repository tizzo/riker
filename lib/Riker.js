'use strict';

var CommandCollection = require('./CommandCollection');
var Help = require('./commands').Help;
var ConfigLoader = require('yaml-config-loader');


class Riker {

  /**
   * @param {Object} options - An object containing configuration options.
   */
  constructor(options) {
    options = options || {};
    // TODO: Handle whether this is or isn't a command collection.
    this.commandCollection = options.commandCollection || new CommandCollection();
    this.enableHelp = options.enableHelp !== false ? true : false;
    this.configLoader = options.configLoader || new ConfigLoader();
    if (this.enableHelp) {
      let helpCommand = new Help();
      this.addSubCommand('help', helpCommand);
      this.commandCollection.defaultCommand = 'help';
    }
  }

  addSubCommand(name, command) {
    this.commandCollection.addSubCommand(name, command);
  }

  registerConfigFile(path) {
    this.configLoader.add(path);
  }

  run(done) {
    let self = this;
    this.configLoader.load(function(error, config) {
      self.commandCollection.configure(config, function(error) {
        setImmediate(self.commandCollection.run.bind(null, config, done));
      });
    });
  }

}

module.exports = Riker;
