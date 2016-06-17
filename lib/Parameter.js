'use strict';

var _type = Symbol('_type');

class Parameter {

  constructor(name) {
    this.name = name;
    this.yargsFields = [
      'defaults',
      'require',
      'describe',
      'alias',
      'choices',
    ];
  }

  defaults(value) {
    this.defaults = value;
    return this;
  }

  require(value) {
    this.require = value;
    return this;
  }

  describe(value) {
    this.describe = value;
    return this;
  }

  alias(value) {
    this.alias = value;
    return this;
  }

  choices(value) {
    this.choices = value;
    return this;
  }

  applyYargs(yargs) {
    for (let field of this.yargsFields) {
      if (this.hasOwnProperty(field)) {
        yargs[field](this.name, this[field]);
      }
    }
  }

  type(type) {
    this[_type] = type;
    return this;
  }
}

module.exports = Parameter;
