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
var _process = Symbol('_process');
var _logger = Symbol('_logger');
var _executable = Symbol('_executable');


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
    this[_executable] = options.executable || function() {
      throw new Error('Cannot run the Command class without setting a function to run');
    };
    this.enableHelp = options.enableHelp !== false ? true : false;
    if (this.enableHelp) {
      var Help = require('./commands').Help;
      var help = new Help();
      this.addSubCommand('help', new Help());
    }
  }

  initialize() {
    
  }

  get command() {
    return this[_command] || path.basename(process.argv[1]);
  }

  get args() {
    return this[_yargs].argv['_'];
  }
  
  get yargs() {
    return this[_yargs];
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


  isValidCommand(command) {
    return true;
    if (!command.run) {
      return true;
    }
  }

  addSubCommand(name, command) {
    if (typeof command === 'function') {
      var args = this.args;
      args.shift();
      var options = {
        args,
        command: this.command,
      };
      command = new command(options);
    }
    if (!this.isValidCommand(command)) {
      throw new Error('Command must be an object with a run method.');
    }
    this.subCommands[name] = command;
  }

  subCommandExists(commandName) {
    return this.subCommands[commandName] !== undefined;
  }

  runSubCommand(commandName, args, done) {
    var command = this.getSubCommand(commandName, args);
    command.run(done);
  }

  /**
   * @param {String} commandName - The name of the subcommand.
   */
  getSubCommand(commandName, args) {
    // TODO: FIX HANDING OF MISSING PLUGINS
    return this.subCommands[commandName];
  }

  run(done) {
    done = done || function() {};
    var args = yargs.argv._;
    var firstArg = args.shift();
    if ((!firstArg || firstArg === 'help') && this.enableHelp) {
      this.handleHelp(done);
      return;
    }
    else if (this.subCommandExists(firstArg)) {
      this.runSubCommand(firstArg, args, done);
    }
  }

  handleHelp(done) {
    var commandName = this.args[1];
    if (!commandName) {
      this.displayAllHelp(done);
    }
    else if (!this.subCommands[commandName]) {
      console.error(`ERROR: \`${commandName}\` is not a registered command.${os.EOL}`);
      this.displayAllHelp(done);
    }
    else {
      var executor = this.subCommands[commandName];
      if (executor.options) {
        this.yargs = executor.options(this.yargs);
      }
      if (executor.help) {
        this.error.writeLine(executor.help);
        this.error.writeLine();
        executor.initialize();
        this.error.writeLine(this.yargs.help());
      }
      else if (executor.shortDescription) {
        this.error.writeLine(executor.shortDescription, os.EOL);
      }
      done();
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

  displayAllHelp(done) {
    var self = this;
    this.buildAllCommandHelp(function(error, output) {
      if (error) throw error;
      var spaces = 30;
      self.output.writeLine(`usage: ${self.command} [subcommand] [--arguments]`);
      self.output.writeLine('');
      self.output.writeLine('The available subcommands are:');
      output = output.map(function(element) {
        var name = element.name;
        var output = '    ' + name + self.buildSpaces(spaces - name.length);
        var wrap = wordwrap(output.length, windowsize.width);
        var description = wrap(element.description);
        output += description.substring(output.length);
        return output;
      });
      self.output.writeLine(output.join(os.EOL));
      self.output.writeLine('');
      self.output.writeLine(`For more specific help see '${self.command} help <subcommand>'`);
      done();
    });
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

module.exports = Riker;
