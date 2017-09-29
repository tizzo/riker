'use strict';

var _type = Symbol('_type');

class Parameter {

  constructor(name) {
    this.name = name;
    this.yargsFields = [
      'alias',
      'array',
      'choices',
      'defaults',
      'demand',
      'describe',
      'require',
      'type',
    ];
    this.types = [
      'boolean',
      'number',
      'string',
    ];
    this.default = this.defaults;
    this.required = this.require;
    this.demand = this.require;
    this.options = {};
  }

  defaults(value) {
    this.options.defaults = value;
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

  array() {
    this.options.array = true;
    return this;
  }

  type(type) {
    if (this.types.indexOf(type) === -1) {
      throw new Error(`${type} is an unsupported type. Only support ${this.types.join(', ')}`);
    }
    this[_type] = type;
    return this;
  }

  applyYargs(yargs) {
    for (let field of this.yargsFields) {
      if (this.options.hasOwnProperty(field)) {
        yargs[field](this.name, this.options[field]);
      }
    }
    this.applyType(yargs)
  }

  applyType(yargs) {
    if (this[_type]) {
      yargs[this[_type]](this.name);
    }
  }

}

module.exports = Parameter;
