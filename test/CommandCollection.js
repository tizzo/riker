'use strict';

const should = require('should');
const sinon = require('sinon');
const Riker = require('..');
const CommandCollection = Riker.CommandCollection;
const Command = Riker.Command;
const yargs = require('yargs');

describe('CommandCollection', function() {
  describe('initialization', () => {
    it('should populate subcommands', () => {
      const options = {
        subCommands: {
          foo: 'bar',
        }
      };
      const collection = new CommandCollection(options);
      collection.subCommands.foo.should.equal('bar');
    });
  });
  describe('initialize', () => {
    it ('should initialize its subcommand', (done) => {
      const command = new Command();
      command.initialize = done;
      const options = {
        args: ['foo'],
        subCommands: {
          foo: command,
        },
      };
      const collection = new CommandCollection(options);
      collection.initialize()
    });
  });
});
 
