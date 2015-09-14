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

var _worker = require('../worker');

var _worker2 = _interopRequireDefault(_worker);

var _parsersCondition = require('../parsers/condition');

var _parsersCondition2 = _interopRequireDefault(_parsersCondition);

var NODE_NAME = '#import';
var PARAMETER_SPLIT = ',';

var ImportNode = (function (_Basic) {
  _inherits(ImportNode, _Basic);

  function ImportNode(source, options) {
    _classCallCheck(this, ImportNode);

    _get(Object.getPrototypeOf(ImportNode.prototype), 'constructor', this).call(this, source, options);
    this.nodeName = NODE_NAME;
  }

  _createClass(ImportNode, [{
    key: 'parse',
    value: function parse(source) {
      var tmp = _parsersCondition2['default'].parse(source, { expectNodeName: NODE_NAME });
      var list = tmp.condition.split(PARAMETER_SPLIT);

      var path = list[0] || '';
      var isSingleQuotation = path[0] === '\'' && path[path.length - 1] === '\'';
      var isDoubleQuotation = path[0] === '"' && path[path.length - 1] === '"';
      if (isSingleQuotation || isDoubleQuotation) {
        path = path.slice(1, path.length - 1);
      }
      this.importPath = path;

      var args = [];
      for (var i = 1, len = list.length; i < len; i++) {
        var str = list[i] || '';
        str = str.trim();
        if (str) args.push(str);
      }
      if (!args.length) args.push('it');
      this.importArgs = args;
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      return this.importPath;
    }
  }, {
    key: 'getArguments',
    value: function getArguments() {
      return this.importArgs;
    }
  }, {
    key: 'assembleWorkerData',
    value: function assembleWorkerData() {
      var it = this._workerData;
      if (it) return it;

      this._workerData = it = {
        id: this.getId(),
        lineId: this.getLineId(),
        parentId: this.getParentId(),
        args: this.getArguments(),
        path: this.getPath(),
        templateName: this.getTemplateName()
      };

      return it;
    }
  }, {
    key: 'deliverRequire',
    value: function deliverRequire() {
      var it = {
        name: this.getTemplateName(),
        path: this.getPath()
      };
      return [_worker2['default'].require(it)];
    }
  }, {
    key: 'deliverCreate',
    value: function deliverCreate() {
      var it = this.assembleWorkerData();
      return [_worker2['default'].import_create(it)];
    }
  }, {
    key: 'deliverAppend',
    value: function deliverAppend() {
      var it = this.assembleWorkerData();
      return [_worker2['default'].import_append(it)];
    }
  }, {
    key: 'deliverUpdate',
    value: function deliverUpdate() {
      var it = this.assembleWorkerData();
      return [_worker2['default'].import_update(it)];
    }
  }, {
    key: 'deliverRemove',
    value: function deliverRemove() {
      var it = this.assembleWorkerData();
      return [_worker2['default'].import_remove(it)];
    }
  }]);

  return ImportNode;
})(_basic2['default']);

exports['default'] = ImportNode;
module.exports = exports['default'];