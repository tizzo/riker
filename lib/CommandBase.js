'use strict';

var path = require('path');
var os = require('os');
var yargs = require('yargs');

var Parameter = require('./Parameter');

var _args = Symbol('_args');
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
    this.parameters = [];
    this[_yargs] = options.yars || yargs;
    this[_args] = options.args || null;
    this[_inputStream] = options.inputStream || null;
    this[_outputStream] = options.outputStream || null;
    this[_errorStream] = options.errorStream || null;
    this[_process] = options.process || null;
    this[_command] = options.command || null;
    this[_executable] = options.executable || function() {
      throw new Error('Cannot run the Command class without setting a function to run');
    };
  }

  /**
   * Receive a configuration object and perform any necessary tasks.
   *
   * @param {Oject} config - A config hash.
   * @param {Function} done - The callback to call if all necessary actions are complete.
   */
  configure(config, done) {
    this.config = config;
    done();
  }

  addParameter(name) {
    var parameter = new Parameter(name);
    this.parameters.push(parameter);
    return parameter;
  }

  initialize() {
    for (let parameter of this.parameters) {
      parameter.applyYargs(this.yargs);
    }
  }

  getParsedOptions() {
    this.yargs.strict(true);
    return this.yargs.argv;
  }

  get command() {
    return this[_command] || path.basename(process.argv[1]);
  }

  set command(command) {
    this[_command] = command;
  }

  get process() {
    return this[_process] || process;
  }

  get args() {
    return this[_args] || this[_yargs].argv._;
  }

  set args(args) {
    this[_args] = args;
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
