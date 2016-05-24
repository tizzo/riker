# Riker

Riker is an opinionated node.js cli library for handling the business of writing that makes it optimizes for composability,
testability, and unixy best practices. It is is designed to

## Beliefs

1. All code should be easily testable and tested, even command line scripts
2. Dependency injection is a Good Idea™
3. Configuration should be
4. Streams are the one true Node.js abstraction

## Why do we need yet another new CLI library?

Command line commands should be:

1. 100% Testable
2. Dependency injected
3. Stream oriented
4. Composable
5. Configurable via files, environment variables, and command line options (and in that order)

## But why is it called "Riker"?

Because the only thing that should ever come after "[commander](http://npmjs.com/package/commander)" is "Riker".

![William T. Riker](http://media.boingboing.net/wp-content/uploads/2015/05/Riker.jpg)

## Architecture

  - Riker
    - Main entry point
    - Provides helpers for things like loading a directory of commands
  - CommandCollection
    - Is a collection of subcommands
    - Resolves command aliases
  - Command
    -
  - ShellCommand
    - A class for wrapping another command

## Usage

### Creating a custom command.

```` javascript
var Riker = require('riker');
var Command = Riker.Command;

class Cat extends Command {
  constructor() {
    super();
    this.shortDescription = 'Sends any input to standard out';
    this.help = 'This ';
  }
  configure(options) {
    this.someOption = options.someOption;
  }
  run(done) {
    this.input.pipe(this.output);
    if (done) {
      this.input.on('end', done);
    }
  }
}
````

### Accepting

```` javascript
class Cat extends Command {
  constructor() {
    super();
  }
}
````

### Creating a custom command with config parameters.

```` javascript
var Riker = require('riker');
var Command = Riker.Command;

class Cat extends Command {
  constructor() {
    super();
    this.shortDescription = '';
    this.help = 'Help placeholder';
    var parameter = this.addParameter('server.port');
    parameter
      .type(Number) // Defines the type - this will cast the type if necessary to ensure numbers, strings, etc are handled appropriately.
      // Mappings
      .default(80) // Provides a default value for this parameter.
      .required() // Marks this parameter required, incompatible with `default`.
      .describe('') // Provide help text related to this option, wrapped behavior from yargs.
      .alias('p') // An alias for this command, wrapped behavior from yargs.
    this.addParameter('protocol')
      .alias('P')
      .describe('Whether to listen use TLS.')
      .default('http')
      .choices(['http', 'https']) // Provide a set of allowable options.
  }
  configure(options) {
    this.someOption = options.someOption;
  }
  run(done) {
    this.input.pipe(this.output);
    if (done) {
      this.input.on('end', done);
    }
  }
}
````

### Defining a cli script
```` javascript
#! /usr/bin/env node
var path = require('path');
var Riker = require('riker');
var riker = new Riker();
var Commands = riker.scanDirectory(path.resolve(path.join('.', 'cli-commands'));
riker.run();
````

### Writing a unit test

Unit testing our class by mocking input using through2 and should.
```` javascript
describe('Cat', function() {
  it('should stream anything input to the output', function() {
    var Cat = require('./Cat');
    var through2 = require('through2');
    var should = require('should');
    var history = [];
    var input = through2();
    var output = through2(function(data, enc, cb) {
      history.push(data);
      cb(data);
    })
    var cat = new Cat({input, output})
    output.on('end', function() {
      history.length.should.equal(2);
      history[0].should.equal('one');
      history[1].should.equal('two');
      done()l
    });
    input.write('one');
    input.write('two');
    input.write(null);
  });
}
````


```` javascript
var Riker = require('riker');
var Cat = require('./Cat');
var Command = Riker.Command;

var command = new Command();

var riker = new Riker();
riker.addSubCommand('bar', new Foo());
var baz = new Command();
baz.shortDescription = 'This is baz.';
baz.help = 'Baz knows about stuff…';
baz.addSubCommand('bingo', new Foo());
riker.addSubCommand('baz', baz);
riker.addSubCommand('help', new Riker.commands.Help());
riker.run(function() {
  //console.log('command line run done');
});


````
