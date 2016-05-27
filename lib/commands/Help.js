'use strict';

var wordwrap = require('wordwrap');
var windowsize = require('window-size');
var os = require('os');
var path = require('path');

var CommandBase = require('../CommandBase');

var _command = Symbol('_command');

class Help extends CommandBase {

  constructor() {
    super();
    this.commandCollection = false;
  }

  get shortDescription() {
    if (this.commandCollection) {
      return 'Displays help for specific subcommands.';
    }
  }

  get command() {
    return this[_command] || path.basename(process.argv[1]);
  }

  get help() {
    var output = '';
    output += `Usage: ${this.command} help <subcommand> ${os.EOL}`;
    output += this.shortDescription;
    return output;
  }

  run() {
    this.output.writeLine('HALP!');
  }

  /*
  printHelp(done) {
    this.output.writeLine(this.help);
    if (done) {
      return done;
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
        this.output.writeLine(executor.help);
        this.output.writeLine();
        executor.initialize();
        this.output.writeLine(this.yargs.help());
      }
      else if (executor.shortDescription) {
        this.output.writeLine(executor.shortDescription, os.EOL);
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
  // */

}

module.exports = Help;
