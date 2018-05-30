'use strict';

const should = require('should');
const sinon = require('sinon');
const Riker = require('..');
const CommandCollection = Riker.CommandCollection;
const Command = Riker.Command;
const yargs = require('yargs');

describe('CommandCollection', function() {
  it('should display help if an unknown command is specified', (done) => {
    const history = [];
    const options = {
      args: ['def'],
      subCommands: {
        foo: 'bar',
      },
      errorStream: {
        write: (data) => history.push({stream: 'error', data}),
        end: () => {},
      },
      outputStream: {
        write: (data) => history.push({stream: 'error', data}),
        end: () => {},
      }
    };
    const collection = new CommandCollection(options);
    should.not.exist(collection.getSubCommand('def', []));
    collection.run(() => {
      history[0].stream.should.equal('error');
      history[0].data.should.containEql('Invalid sub-command specified');
      history[0].data.should.containEql('def');
      done();
    });

  });
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
 
