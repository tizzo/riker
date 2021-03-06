'use strict';

var wordwrap = require('wordwrap');
var windowsize = require('window-size');
var os = require('os');

var CommandBase = require('../CommandBase');

var _command = Symbol('_command');

class Help extends CommandBase {

  constructor() {
    super();
  }

  get shortDescription() {
    return 'Displays help for specific subcommands.';
  }

  get help() {
    var output = '';
    // Handle someone typing `command help help`
    if (this.args[0] == 'help') {
      output += `Usage: ${this.command} help <subcommand> ${os.EOL}`;
    }
    output += this.shortDescription;
    return output;
  }

  showHelp() {
    return this.help;
  }

  run(done) {
    var command = this.commandCollection;
    var commandFound = true;
    if (this.args.length > 0) {
      for (let arg of this.args) {
        if (command.subCommandExists(arg)) {
          command = command.getSubCommand(arg);
          command.initialize();
        }
        else {
          this.error.writeLine(`Provided subcommand \`${arg}\` is NOT a supported command.`);
          commandFound = false;
          break;
        }
      }
    }
    if (commandFound && typeof command.showHelp === 'function') {
      this.output.writeLine(command.showHelp());
    }
  }

}

module.exports = Help;
