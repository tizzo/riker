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
    this.run = this.run.bind(this);
  }

  initialize() {
    super.initialize();
    if (this.subcommandName) {
      this.getSubCommand(this.subcommandName).initialize();
    }
  }

  get help() {
    return this.displayAllHelp();
  }

  get subcommandName() {
    return this.args[0];
  }

  isValidCommand(command) {
    if (command.run && typeof command.run === 'function') {
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
    command.initialize();
    command.configure(this.config, function(error) {
      if (error) {
        if (done) {
          return done(error);
        }
        else {
          throw error;
        }
      }
      command.run(done);
    });
  }

  /**
   * @param {String} commandName - The name of the subcommand.
   */
  getSubCommand(commandName, args) {
    // TODO: FIX HANDING OF MISSING PLUGINS
    var subcommand = this.subCommands[commandName];
    subcommand.command = `${this.command} ${commandName}`;
    return subcommand;
  }

  run(done) {
    // Protect against other
    done = done || function() {};
    // TODO: We should be able to tidy this up but here we ensure that a command collection
    // responds appropriately with subcommand options when invoked with `command help` or
    // `command` and still provides the subcommand's help when run with `command help sub-command`.
    if (this.subCommandExists(this.subcommandName) && (this.subcommandName !== 'help' || (this.subcommandName === 'help' && this.args.length !== 1))) {
      return this.runSubCommand(this.subcommandName, done);
    }
    if (this.subcommandName) {
      this.error.writeLine(`Invalid sub-command specified \`${this.subcommandName}\``);
      this.error.writeLine();
    }
    this.error.writeLine(this.help);
    if (typeof done === 'function') {
      done(new Error(`The subcommand ${this.subcommand} does not exist.`));
    }
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
