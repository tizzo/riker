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

    this.enableHelp = options.enableHelp !== false ? true : false;
    if (this.enableHelp) {
      var Help = require('./commands').Help;
      var help = new Help();
      this.addSubCommand('help', new Help());
    }
  }

  get help() {
    return this.displayAllHelp();
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
    command.args = this.args.splice(1);
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
    // NOOOOO, help needs to move back into being a regular command…
    /*
    if ((!firstArg || firstArg === 'help') && this.enableHelp) {
      this.handleHelp(done);
      return;
    }
    else if (this.subCommandExists(firstArg)) {
      this.runSubCommand(firstArg, args, done);
    }
    */
    if (this.subCommandExists(this.args[0])) {
      this.runSubCommand(this.args[0], done);
    }
    else {
      this.printHelp(done);
    }
  }

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


}

module.exports = CommandCollection;
