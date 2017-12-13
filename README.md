# Riker

Riker is an opinionated node.js cli library for handling the business of writing that makes it optimizes for composability,
testability, and unixy best practices. It is is designed to allow authors to create fluent interfaces with subcommands
that are all classes where the commands themselves are unit testable.

## Beliefs

1. All code should be easily testable and tested, even command line scripts.
2. Dependency injection is a Good Idea™.
3. Configuration should be injecteable inheritable.
4. Configuration should be specifiable in configuration files, environment variables, and command like arguments. In that order.
5. Streams are the one true Node.js abstraction
6. Composable

## But why is it called "Riker"?

Because the only thing that should ever come after "[commander](http://npmjs.com/package/commander)" is "Riker".

![William T. Riker](https://howardtyson.com/files/riker.jpg)

## Architecture

  - Riker
    - Main entry point
    - Provides helpers for things like loading a directory of commands
  - CommandCollection
    - Is a collection of subcommands
    - Resolves command aliases and loads child commands
    - Child commands can, themselves, be command collections
  - Command
    - Is an individual command

## Usage

### Creating a custom command.

```` javascript
const Riker = require('riker');
const Command = Riker.Command;

class Cat extends Command {
  constructor() {
    super();
    this.shortDescription = 'Sends any input to standard out';
    this.help = 'This command streams input coming to standard in and pipes it to standard out.';
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
### Creating a custom command with config parameters.

```` javascript
const Riker = require('riker');
const Command = Riker.Command;

class Cat extends Command {
  constructor() {
    super();
    this.shortDescription = '';
    this.help = 'Help placeholder';
    const parameter = this.addParameter('server.port');
    parameter
      .type(Number) // Defines the type - this will cast the type if necessary to ensure numbers, strings, etc are handled appropriately.
      // Mappings
      .default(80) // Provides a default value for this parameter.
      .required() // Marks this parameter required, incompatible with `default`.
      .describe('Specify the port.') // Provide help text related to this option, wrapped behavior from yargs.
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

### Writing a unit test

Unit testing our class by mocking input using through2 and should.
```` javascript
describe('Cat', function() {
  it('should stream anything input to the output', function() {
    const Cat = require('./Cat');
    const through2 = require('through2');
    const should = require('should');
    const history = [];
    const input = through2();
    const output = through2(function(data, enc, cb) {
      history.push(data);
      cb(data);
    })
    const cat = new Cat({input, output})
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

# Creating a set of subcommands in a command collection

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
