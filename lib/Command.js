#! /usr/bin/env node

'use strict';
var path = require('path');
var util = require('util');
var fs = require('fs');
var os = require('os');

var Riker = require('./Riker');

var _process = Symbol('_process');
var _logger = Symbol('_logger');
var _executable = Symbol('_executable');

class Command extends Riker {

  /**
   * @param {Object} options - A javascript object containing options.
   * @param {Object} options.yargs - The yargs object to use for parsing.
   */
  constructor(options) {
    super();
    options = options || {};
    this[_executable] = options.executable || function() {
      throw new Error('Cannot run the Command class without setting a function to run');
    };
    this.initialize();
  }

  get log() {
    var logger = this[_logger];
  }


  decorateStream(stream) {
    if (!stream.writeLine) {
      stream.writeLine = function(data) {
        stream.write(data + os.EOL);
      };
    }
  }

  set executable(executable) {
    this[_executable] = executable;
  }

  get executable() {
    return this[_executable];
  }

  /**
   * Process getter allows the process to be mocked.
   */
  get process() {
    var value = this[_process] || process;
    return process;
  }

  get cliInput() {
    return this[_yargs](this.process.argv).argv;
  }

  /**
   * @param {Array} args - An array of command line args (not inlcuding the params).
   * @param {Object} options - A list of options
   */
  run(done) {
    var args = this.args;
    var executable = this.executable;
    if (this.subcommands[args[0]]) {
      var subcommand = this.subcommands[args[0]];
      if (typeof subcommand === 'function') {
        executable =  new subommcand;
      }
      else {
        executable = subcommand;
      }
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
