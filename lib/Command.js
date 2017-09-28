'use strict';
var path = require('path');
var util = require('util');
var fs = require('fs');
var os = require('os');

var Riker = require('./Riker');
var CommandBase = require('./CommandBase');

class Command extends CommandBase {

  /**
   * @param {Object} options - A javascript object containing options.
   * @param {Object} options.yargs - The yargs object to use for parsing.
   */
  constructor(options) {
    options = options || {};
    super(options);
  }

  initialize() {
    return super.initialize();
  }

  showHelp() {
    var yargsHelp = '';
    this.yargs.showHelp(function(output) {
      yargsHelp = output;
    });
    return [this.help, '', yargsHelp].join(os.EOL);
  }

  get log() {
    var logger = this[_logger];
  }

  set executable(executable) {
    this[_executable] = executable;
  }

  get executable() {
    return this[_executable];
  }

  get cliArgs() {
    return this[_yargs](this.process.argv).argv;
  }

  run(done) {
    var args = this.args;
    var executable = this.executable;
    if (this.subcommands[args[0]]) {
      var executable = this.subcommands[args[0]];
    }
    // If we don't have an executable, default to help?
    executable.run(function() {
      if (done) {
        done();
      }
    });
  }

  processCommand(done) {
  }

}

module.exports = Command;
