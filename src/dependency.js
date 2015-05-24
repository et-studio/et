'use strict';

(function(global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    define('_et', function(require, module, exports) {
      module.exports = factory();
    });
  } else {
    global._et = factory();
  }
})(window, function factory() {
  var LOOP = function LOOP() {};

  var _util = {
    extend: function extend() {
      var len = arguments.length;
      if (len <= 1) {
        return arguments[0];
      } else {
        var re = arguments[0] || {};
        for (var i = 1; i < len; i++) {
          var item = arguments[i];
          for (var key in item) {
            re[key] = item[key];
          }
        }
        return re;
      }
    },
    createElement: function createElement(tag, attributes) {
      var re, key;
      re = document.createElement(tag);
      if (attributes) {
        for (key in attributes) {
          this.setAttribute(re, key, attributes[key]);
        }
      }
      return re;
    },
    createTextNode: function createTextNode(text) {
      return document.createTextNode(text);
    },
    createComment: function createComment(text) {
      return document.createComment(text);
    },
    remove: function remove(element, isKeeyData) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      if (!isKeeyData) {
        element.removeEventListener();
      }
    },
    text: function text(element, _text) {
      element.textContent = _text;
    },
    setAttribute: function setAttribute(element, attrName, attrValue) {
      element.setAttribute(attrName, attrValue);
    },
    removeAttribute: function removeAttribute(element, attrName) {
      element.removeAttribute(attrName);
    },
    appendChild: function appendChild(elementA, elementB) {
      elementA.appendChild(elementB);
    },
    before: function before(elementA, elementB) {
      if (elementA.parentNode) {
        elementA.parentNode.insertBefore(elementB, elementA);
      }
    },
    append: function append(elementA, elementB) {
      elementA.appendChild(elementB);
    },
    after: function after(elementA, elementB) {
      if (elementA.parentNode) {
        elementA.parentNode.insertBefore(elementB, elementA.nextSibling);
      }
    }
  };
  var _prototype = {
    isET: true,
    init: function init(options) {
      this.options = options || {};
      this.rootIds = []; //记录root的id，有排序的作用
      this.root = {}; // 记录是root的节点对象，如果那个节点被移除应该从这里移除
      this.doms = {}; // 记录所有的节点对象
      this.last = {}; // 记录上一次判断是什么值，用于差异更新
      this.createElements();
    },
    get: function get() {
      // 每次进行 get 都会进行 dom 组合  应该少用
      var ids, i, len, id, re, root, dom;

      re = document.createDocumentFragment();
      root = this.root;

      for (i = 0, len = ids.length; i < len; i++) {
        id = ids[i];
        dom = root[id];
        if (dom && dom.isET) {
          _util.appendChild(re, dom.get());
        } else if (dom) {
          _util.appendChild(re, dom);
        }
      }
      return re;
    },
    create: function create() {},
    update: function update() {},
    remove: function remove() {
      // 从页面中移除掉，不进行事件解绑，相当于 jQuery 中的 detach
      var list = this.roots;
      for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        if (item && item.isET) {
          item.remove();
        } else if (item) {
          // 移除节点对象
          _util.remove(item, true);
        }
      }
      return this;
    },
    destroy: function destroy() {
      // 销毁对象，解绑所有事件，相当于 jQuery 中的 remove
      var list = this.roots;
      for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        if (item && item.isET) {
          item.destroy();
        } else if (item) {
          // 销毁节点对象
          _util.remove(item, false);
        }
      }
      // 销毁所有的属性
      for (var key in this) {
        if (typeof this[key] !== 'function') {
          if (typeof this[key].destroy === 'function') {
            this[key].destroy();
          }
          // 设置所有对象为 null
          this[key] = null;
        } else {
          // 设置所有函数为空函数
          this[key] = LOOP;
        }
      }
      return this;
    }
  };

  return {
    _util: _util,
    _prototype: _prototype
  };
});
