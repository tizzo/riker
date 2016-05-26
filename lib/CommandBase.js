'use strict';

var path = require('path');
var os = require('os');
var yargs = require('yargs');

var _yargs = Symbol('_yargs');
var _command = Symbol('_command');
var _inputStream = Symbol('_inputStream');
var _outputStream = Symbol('_outputStream');
var _errorStream = Symbol('_errorStream');
var _process = Symbol('_process');
var _logger = Symbol('_logger');
var _command = Symbol('_command');
var _executable = Symbol('_executable');
var _yargs = Symbol('_yargs');

class CommandBase {

  constructor(options) {
    options = options || {};
    this[_yargs] = options.yars || yargs;
    this[_executable] = options.executable || function() {
      throw new Error('Cannot run the Command class without setting a function to run');
    };
  }

  initialize() {
  }

  get command() {
    return this[_command] || path.basename(process.argv[1]);
  }

  get args() {
    return this[_yargs].argv['_'];
  }

  // TODO: Decide whether to hide the internal yargs.
  get yargs() {
    return this[_yargs];
  }

  set yargs(yargs) {
    this[_yargs] = yargs;
  }

  get input() {
    var stream = this[_inputStream] || process.stdin;
    this.decorateStream(stream);
    return stream;
  }

  get output() {
    var stream = this[_outputStream] || process.stdout;
    this.decorateStream(stream);
    return stream;
  }

  get error() {
    var stream = this[_errorStream] || process.stderr;
    this.decorateStream(stream);
    return stream;
  }

  decorateStream(stream) {
    if (!stream.writeLine) {
      stream.writeLine = function(data) {
        data = data || '';
        stream.write(data + os.EOL);
      };
    }
  }

}

module.exports = CommandBase;
