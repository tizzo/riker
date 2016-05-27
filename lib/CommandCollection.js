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

    this.enableHelp = options.enableHelp !== false ? true : false;
    if (this.enableHelp) {
      var Help = require('./commands').Help;
      var help = new Help();
      var helpCommand = new Help();
      helpCommand.commandCollection = this;
      this.addSubCommand('help', helpCommand);
      this.defaultCommand = 'help';
    }
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
    // Set the command path for context in help messages, etc..
    // TODO: How do we provide better context to the commands, provide a
    // light weight DiC, etc.
    //command.command = `${this.command} foo`;
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
    console.log('here it is', this.subcommandName);
    this.runSubCommand(this.subcommandName, done);
  }

}

module.exports = CommandCollection;
