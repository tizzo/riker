'use strict';

var wordwrap = require('wordwrap');
var windowsize = require('window-size');
var os = require('os');
var path = require('path');

var _command = Symbol('_command');

class Help {

  constructor() {
    this.shortDescription = 'Displays help for specific subcommands.';
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
  run() {}

}

module.exports = Help;
