'use strict';

var os = require('os');
var path = require('path');
var yargs = require('yargs');
var wordwrap = require('wordwrap');
var windowsize = require('window-size');

var _yargs = Symbol('_yargs');
var _command = Symbol('_command');
var _inputStream = Symbol('_inputStream');
var _outputStream = Symbol('_outputStream');
var _errorStream = Symbol('_errorStream');


class Riker {
  /**
   * @param {Object} options - An object containing configuration options.
   * @param {Array} options.subCommands - An array containing subCommands to run.
   */
  constructor(options) {
    options = options || {};
    this.subCommands = options.subCommands || {};
    this[_yargs] = options.yars || yargs;
    this[_command] = false;
    this.enableHelp = options.enableHelp !== false ? true : false;
  }

  initialize() {
    if (this.enableHelp) {
      var Help = require('./commands');
      this.addSubCommand('help', Help);
    }
  }

  get command() {
    return this[_command] || path.basename(process.argv[1]);
  }

  get args() {
    return this[_yargs].argv['_'];
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
    return stream;
  }



  addSubCommand(name, command) {
    this.subCommands[name] = command;
  }

  subCommandExists(commandName) {
    return this.subCommands[commandName] !== undefined;
  }

  runSubCommand(commandName, args, done) {
    var command = this.getInstantiatedSubCommand(commandName, args);
    command.run(done);
  }

  /**
   * Get an instantiated subcommnad.
   *
   * @param {String} commandName - The name of the subcommand.
   * @returns {Object} - An instantiated command object.
   */
  getInstantiatedSubCommand(commandName, args) {
    if (typeof this.subCommands[commandName] === 'function') {
      var args = this.args;
      args.shift();
      var options = {
        args,
        command: this.command,
      };
      return new this.subCommands[commandName](options);
    }
    return this.subCommands[commandName];
  }

  run(done) {
    done = done || function() {};
    var args = yargs.argv._;
    var firstArg = args.shift();
    if ((!firstArg || firstArg === 'help') && this.enableHelp) {
      this.handleHelp();
    }
    else if (this.subCommandExists(firstArg)) {
      this.runSubCommand(firstArg, args, done);
    }
  }

  handleHelp() {
    var commandName = this.args[1];
    if (!commandName) {
      this.displayAllHelp();
    }
    else if (!this.subCommands[commandName]) {
      console.error(`ERROR: \`${commandName}\` is not a registered command.${os.EOL}`);
      this.displayAllHelp();
    }
    else {
      var executor = this.subCommands[commandName];
      if (executor.options) {
        this.yargs = executor.options(this.yargs);
      }
      if (executor.help) {
        console.log(executor.help, os.EOL);
      }
      else if (executor.shortDescription) {
        console.log(executor.shortDescription, os.EOL);
      }
      this[_yargs].showHelp();
    }
  }

  buildSpaces(number) {
    var output = '';
    for (var i = 0; i < number; i++) {
      output += ' ';
    }
    return output;
  }

  buildAllCommandHelp(done) {
    var output = [];
    for (let name in this.subCommands) {
      if (this.subCommands.hasOwnProperty(name)) {
        let command = this.subCommands[name];
        var element = {
          name: name,
          description: command.shortDescription ? command.shortDescription : '',
        };
        output.push(element);
      }
    }
    if (done) {
      done(null, output);
    }
  }

  displayAllHelp() {
    var self = this;
    this.buildAllCommandHelp(function(error, output) {
      if (error) throw error;
      var spaces = 30;
      console.log(`usage: ${self.command} [subcommand] [--arguments]`);
      console.log('');
      console.log('The available subcommands are:');
      output = output.map(function(element) {
        var name = element.name;
        var output = '    ' + name + self.buildSpaces(spaces - name.length);
        var wrap = wordwrap(output.length, windowsize.width);
        var description = wrap(element.description);
        output += description.substring(output.length);
        return output;
      });
      console.log(output.join(os.EOL));
      console.log('');
      console.log(`For more specific help see '${self.command} help <subcommand>'`);
    });
  }

}

module.exports = Riker;
