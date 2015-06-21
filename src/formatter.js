'use strict';

var _ = require('./util');
var Machine = require('./machine');

// @tableStart: format
var formatTableOptions = {
  states: ['header', 'body', 'methodName', 'methodEnd'],
  symbols: ['function', '_util.', '('],
  table: [
    {
      '0': 'body',
      '1': 'header',
      '2': 'header',
      '-1': 'header'
    },
    {
      '0': 'body',
      '1': 'methodName',
      '2': 'body',
      '-1': 'body'
    },
    {
      '0': 'methodName',
      '1': 'methodName',
      '2': 'methodEnd',
      '-1': 'methodName'
    },
    {
      '0': 'body',
      '1': 'body',
      '2': 'body',
      '-1': 'body'
    }
  ]
};
// @tableEnd

var formatterMachine = new Machine(formatTableOptions);

class Formatter {
  format(str) {
    var header = '';
    var methods = [];
    var body = '';

    var tmp = '';
    formatterMachine.each(str, (state, token) => {
      switch (state) {
        case 'header':
          header += token;
          break;
        case 'body':
          body += token;
          break;
        case 'methodName':
          tmp += token;
          break;
        case 'methodEnd':
          methods.push(this.declareUtilMethod(tmp));
          body = body + this.translateUtilMethod(tmp) + token;
          tmp = '';
          break;
      }
    });
    methods = _.uniq(methods);
    return `${header}${methods.join('')}${body}`;
  }
  translateUtilMethod(tmpStr) {
    var re = '';
    _.each(tmpStr, (char) => {
      if (char === '.') {
        re += '_';
      } else {
        re += char;
      }
    });
    return re.trim();
  }
  declareUtilMethod(tmpStr) {
    var methodName = this.translateUtilMethod(tmpStr);
    return `var ${methodName} = ${tmpStr};\n`;
  }
}

module.exports = new Formatter();
