'use strict';

var os = require('os');
var wordwrap = require('wordwrap');
var windowsize = require('window-size');

var CommandBase = require('./CommandBase');

class CommandCollection extends CommandBase {

  /**
   * @param {Object} options - An object contianing configuration options.
   * @param {Array} options.subCommands - An array containing subCommands to run.
   */
  constructor(options) {
    super();
    options = options || {};
    this.subCommands = options.subCommands || {};
    this.defaultCommand = options.defaultCommand;
  }

  get help() {
    return this.displayAllHelp();
  }

  get subcommandName() {
    return this.args[0] || this.defaultCommand;
  }

  isValidCommand(command) {
    return true;
    if (!command.run) {
      return true;
    }
  }

  addSubCommand(name, command) {
    if (typeof command === 'function') {
      command = new command();
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
    command.args = this.args.splice(1);
    // TODO: How do we provide better context to the commands, provide a
    // light weight DiC, etc.
    // Set the command path for context in help messages, etc..
    command.command = this.command;
    command.commandCollection = this;
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
    // Protect against other
    done = done || function() {};
    this.runSubCommand(this.subcommandName, done);
  }

  get help() {
    this.displayAllHelp();
    return '';
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
      if (done) done();
    });
  }

  buildAllCommandHelp(done) {
    var output = [];
    var commandNames = Object.keys(this.subCommands);
    commandNames.sort();
    for (let name of commandNames) {
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

  buildSpaces(number) {
    var output = '';
    for (var i = 0; i < number; i++) {
      output += ' ';
    }
    return output;
  }

}

module.exports = CommandCollection;
