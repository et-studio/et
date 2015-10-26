'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _basic = require('./basic');

var _basic2 = _interopRequireDefault(_basic);

var _parsersCondition = require('../parsers/condition');

var _parsersCondition2 = _interopRequireDefault(_parsersCondition);

var _parsersValue = require('../parsers/value');

var _parsersValue2 = _interopRequireDefault(_parsersValue);

var NAME_SPACE = 'html';
var NODE_NAME = '#' + NAME_SPACE;

var HtmlNode = (function (_Basic) {
  _inherits(HtmlNode, _Basic);

  function HtmlNode() {
    _classCallCheck(this, HtmlNode);

    _get(Object.getPrototypeOf(HtmlNode.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(HtmlNode, [{
    key: 'parse',
    value: function parse(source) {
      var tmp = _parsersCondition2['default'].parse(source, { expectNodeName: NODE_NAME });

      this.namespace = NAME_SPACE;
      this.nodeName = NODE_NAME;
      var expression = tmp.condition;
      this.expression = expression.slice(1, expression.length - 1);
    }
  }, {
    key: 'assembleWorkerData',
    value: function assembleWorkerData() {
      var it = this._workerData;
      if (it) return it;

      var expression = this.expression;
      it = {
        parentId: this.getParentId(),
        isErratic: _parsersValue2['default'].isErratic(expression),
        expression: this.expression
      };

      if (it.isErratic) {
        it.valueId = this.getRootValueId();
        it.valueString = _parsersValue2['default'].parse(expression);
      }

      this._workerData = it;
      return it;
    }
  }]);

  return HtmlNode;
})(_basic2['default']);

exports['default'] = HtmlNode;
module.exports = exports['default'];