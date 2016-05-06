'use strict';

var wordwrap = require('wordwrap');
var windowsize = require('window-size');
var os = require('os');

class Help {

  constructor() {
    this.shortDescription = 'Displays help for specific subcommands.';
  }

  get help() {
    var output = '';
    output += `Useage: ${this.command} help <subcommand> ${os.EOL}`;
    output += this.shortDescription;
    return output;
  }

}

module.exports = Help;
