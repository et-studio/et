'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _machine = require('./machine');

var _machine2 = _interopRequireDefault(_machine);

var _nodesOrigin = require('../nodes/origin');

var _nodesOrigin2 = _interopRequireDefault(_nodesOrigin);

// @tableStart: origin
var originTableOptions = {
  states: ['text', 'headerEnd', 'tailEnd', 'htmlStart', 'htmlHeader', 'htmlTail', 'etStart', 'etHeader', 'etTail', '_str{{', '_str\'', '_str"'],
  symbols: ['</', '<', '>', '[/#', '[#', ']', '{{', '}}', '\\\'', '\'', '\\"', '"', ' ', '\r', '\n'],
  table: [{ '0': 'htmlTail', '1': 'htmlStart', '2': 'headerEnd', '3': 'etTail', '4': 'etStart', '5': 'text', '6': 'text', '7': 'text', '8': 'text', '9': 'text', '10': 'text', '11': 'text', '12': 'text', '13': 'text', '14': 'text', '-1': 'text' }, { '0': 'htmlTail', '1': 'htmlStart', '2': 'headerEnd', '3': 'etTail', '4': 'etStart', '5': 'text', '6': 'text', '7': 'text', '8': 'text', '9': 'text', '10': 'text', '11': 'text', '12': 'text', '13': 'text', '14': 'text', '-1': 'text' }, { '0': 'htmlTail', '1': 'htmlStart', '2': 'headerEnd', '3': 'etTail', '4': 'etStart', '5': 'text', '6': 'text', '7': 'text', '8': 'text', '9': 'text', '10': 'text', '11': 'text', '12': 'text', '13': 'text', '14': 'text', '-1': 'text' }, { '0': 'htmlHeader', '1': 'htmlHeader', '2': 'htmlHeader', '3': 'htmlHeader', '4': 'htmlHeader', '5': 'htmlHeader', '6': 'htmlHeader', '7': 'htmlHeader', '8': 'htmlHeader', '9': 'htmlHeader', '10': 'htmlHeader', '11': 'htmlHeader', '12': 'htmlHeader', '13': 'htmlHeader', '14': 'htmlHeader', '-1': 'htmlHeader' }, { '0': 'htmlHeader', '1': 'htmlHeader', '2': 'headerEnd', '3': 'htmlHeader', '4': 'etStart', '5': 'htmlHeader', '6': '_str{{', '7': 'htmlHeader', '8': 'htmlHeader', '9': '_str\'', '10': 'htmlHeader', '11': '_str"', '12': 'htmlHeader', '13': 'htmlHeader', '14': 'htmlHeader', '-1': 'htmlHeader' }, { '0': 'htmlTail', '1': 'htmlTail', '2': 'tailEnd', '3': 'htmlTail', '4': 'htmlTail', '5': 'htmlTail', '6': 'htmlTail', '7': 'htmlTail', '8': 'htmlTail', '9': 'htmlTail', '10': 'htmlTail', '11': 'htmlTail', '12': 'htmlTail', '13': 'htmlTail', '14': 'htmlTail', '-1': 'htmlTail' }, { '0': 'etHeader', '1': 'etHeader', '2': 'etHeader', '3': 'etHeader', '4': 'etHeader', '5': 'etHeader', '6': 'etHeader', '7': 'etHeader', '8': 'etHeader', '9': 'etHeader', '10': 'etHeader', '11': 'etHeader', '12': 'etHeader', '13': 'etHeader', '14': 'etHeader', '-1': 'etHeader' }, { '0': 'etHeader', '1': 'etHeader', '2': 'etHeader', '3': 'etHeader', '4': 'etHeader', '5': 'headerEnd', '6': '_str{{', '7': 'etHeader', '8': 'etHeader', '9': '_str\'', '10': 'etHeader', '11': '_str"', '12': 'etHeader', '13': 'etHeader', '14': 'etHeader', '-1': 'etHeader' }, { '0': 'etTail', '1': 'etTail', '2': 'etTail', '3': 'etTail', '4': 'etTail', '5': 'tailEnd', '6': 'etTail', '7': 'etTail', '8': 'etTail', '9': 'etTail', '10': 'etTail', '11': 'etTail', '12': 'etTail', '13': 'etTail', '14': 'etTail', '-1': 'etTail' }, { '0': '', '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '_last', '8': '', '9': '', '10': '', '11': '', '12': '', '13': '', '14': '', '-1': '' }, { '0': '', '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '_last', '10': '', '11': '', '12': '', '13': '', '14': '', '-1': '' }, { '0': '', '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '', '10': '', '11': '_last', '12': '', '13': '', '14': '', '-1': '' }]
};
// @tableEnd
var originMachine = new _machine2['default'](originTableOptions);

var OriginParser = (function () {
  function OriginParser() {
    _classCallCheck(this, OriginParser);
  }

  _createClass(OriginParser, [{
    key: 'parse',
    value: function parse(str) {
      var root = new _nodesOrigin2['default']();
      var currentNode = root.createChild();

      var tail = '';
      originMachine.each(str, function (state, token) {
        var backState = null;
        switch (state) {
          case 'text':
          case '_str\'':
          case '_str"':
          case '_str{{':
          case 'htmlHeader':
          case 'etHeader':
            currentNode.addSource(token);
            break;
          case 'htmlStart':
            currentNode = currentNode.createChild(token, { nodeType: 'HTML' });
            break;
          case 'etStart':
            currentNode = currentNode.createChild(token, { nodeType: 'ET' });
            break;
          case 'headerEnd':
            currentNode.closeHeader(token);
            currentNode = currentNode.createChild();
            break;
          case 'htmlTail':
          case 'etTail':
            tail += token;
            break;
          case 'tailEnd':
            currentNode = currentNode.closeNode(tail + token);
            tail = '';
            backState = null;
            if (!currentNode.isHeaderClosed) {
              switch (currentNode.nodeType) {
                case 'HTML':
                  backState = 'htmlHeader';
                  break;
                case 'ET':
                  backState = 'etHeader';
                  break;
              }
            }
            if (!backState) currentNode = currentNode.createChild();
            break;
          default:
            throw new Error('The state: \'' + state + '\' is not defined.');
        }
        return backState;
      });
      currentNode.saveText(tail);
      root.closeAll();
      root.removeEmptyNode();
      return root;
    }
  }]);

  return OriginParser;
})();

exports['default'] = new OriginParser();
module.exports = exports['default'];