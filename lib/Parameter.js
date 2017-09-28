'use strict';

var _type = Symbol('_type');

class Parameter {

  constructor(name) {
    this.name = name;
    this.yargsFields = [
      'defaults',
      'require',
      'demand',
      'describe',
      'alias',
      'choices',
    ];
    this.default = this.defaults;
    this.required = this.require;
    this.demand = this.require;
    this.options = {};
  }

  defaults(value) {
    this.defaults = value;
    return this;
  }

  require(value) {
    this.options.require = value !== undefined ? value : true;
    this.options.demand = value !== undefined ? value : true;
    return this;
  }

  describe(value) {
    this.options.describe = value;
    return this;
  }

  alias(value) {
    this.options.alias = value;
    return this;
  }

  choices(value) {
    this.options.choices = value;
    return this;
  }

  applyYargs(yargs) {
    for (let field of this.yargsFields) {
      if (this.options.hasOwnProperty(field)) {
        yargs[field](this.name, this.options[field]);
      }
    }
  }

  type(type) {
    this[_type] = type;
    return this;
  }
}

module.exports = Parameter;
