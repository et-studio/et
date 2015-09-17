
'use strict'
import _ from './util'

export default {

  attributes_remove(it) {
    var re = ''

    var attrs = arguments[1] || []
    if (attrs.length === 1) {
      re = re + `
  @.removeAttribute(_elements, ${it.id}, '${_.translateMarks(attrs[0])}')
`
    } else if (attrs.length > 1) {
      var exclusions = attrs.map((item) => {
        return `'${_.translateMarks(item)}'`
      })
      re = re + `
  @.removeAttributes(_elements, ${it.id}, ${exclusions.join(',')})
`
    }

    return re
  },
  attributes_update(it) {
    var re = ''

    var attrs = arguments[1] || []
    _.each(attrs, (attr) => {
      if (attr.isErratic) {
        if (attr.isProperty) {
          re = re + `
      var _tmp = ${attr.valueString}
      if (@.getProperty(_elements, ${it.id}, '${_.translateMarks(attr.key)}') !== _tmp) {
        @.setProperty(_elements, ${it.id}, '${_.translateMarks(attr.key)}', _tmp)
      }
`
        } else {
          re = re + `
      var _tmp = ${attr.valueString}
      if (_last[${attr.valueId}] !== _tmp) {
        _last[${attr.valueId}] = _tmp
        @.setAttribute(_elements, ${it.id}, '${_.translateMarks(attr.key)}', _tmp)
      }
`
        }
      } else {
        if (attr.isProperty) {
          re = re + `
      @.setProperty(_elements, ${it.id}, '${_.translateMarks(attr.key)}', '${_.translateMarks(attr.value)}')
`
        } else {
          re = re + `
      @.setAttribute(_elements, ${it.id}, '${_.translateMarks(attr.key)}', '${_.translateMarks(attr.value)}')
`
        }
      }
    })

    return re
  },
  element_append(it) {
    var re = ''
    if (it.parentId) {
      re = re + `
  @.append(_elements, ${it.parentId}, ${it.id})
`
    }
    if (it.isRoot) {
      re = re + `
  @.setRoot(this, ${it.id})
`
    }

    return re
  },
  element_create(it) {
    var re = ''

    var nullString = 'null'
    var attributesString = nullString
    var propertiesString = nullString

    if (!_.isEmpty(it.attributes)) {
      attributesString = JSON.stringify(it.attributes, null, '  ')
    }
    if (!_.isEmpty(it.properties)) {
      propertiesString = JSON.stringify(it.properties, null, '  ')
    }

    if (propertiesString !== nullString) {
      re = re + `
  @.createElement(_elements, ${it.id}, '${_.translateMarks(it.nodeName)}', ${attributesString}, ${propertiesString})
`
    } else if (attributesString !== nullString) {
      re = re + `
  @.createElement(_elements, ${it.id}, '${_.translateMarks(it.nodeName)}', ${attributesString})
`
    } else {
      re = re + `
  @.createElement(_elements, ${it.id}, '${_.translateMarks(it.nodeName)}')
`
    }

    if (it.modelKey) {
      re = re + `
  @.bind(this, ${it.id}, 'change keyup', function (e) {
`
      if (it.modelType === 'model') {
        re = re + `
      _scope.set('${_.translateMarks(it.modelKey)}', e.target.value)
`
      } else if (it.modelType === 'object') {
        re = re + `
      _scope${it.modelKey} = e.target.value
`
      } else {
        re = re + `
      _scope.trigger('et-model', '${_.translateMarks(it.modelKey)}', e.target.value, e)
`
      }
      re = re + `
  })
`
    }

    return re
  },
  element_remove(it) {
    var re = ''

    re = re + `
@.remove(_elements, ${it.id})
`
    if (it.isRoot) {
      re = re + `
  @.removeRoot(this, ${it.id})
`
    }

    return re
  },
  element_update(it) {
    var re = ''

    if (it.erraticAttributes.length || it.expressions.length) {
      re = re + `
  ${this.attributes_update(it, it.erraticAttributes)}
`

      _.each(it.expressions, (items) => {
        _.each(items, (item, i) => {
          var condition = ''
          if (item.tag !== 'else') {
            condition = `(${item.condition})`
          }
          re = re + `
      ${item.tag} ${condition} {
        if (_last[${item.valueId}] !== ${i}) {
          _last[${item.valueId}] = ${i}
          ${this.attributes_update(it, item.residentAttributes)}
          ${this.attributes_remove(it, item.exclusions)}
        }
        ${this.attributes_update(it, item.erraticAttributes)}
      }
`
        })
      })
    }

    return re
  },
  for_append(it) {
    var re = ''

    if (it.parentId) {
      re = re + `
  @.append(_elements, ${it.parentId}, ${it.lineId})
`
    }
    if (it.isRoot) {
      re = re + `
  @.setRoot(this, ${it.id}, 0)
  @.setRoot(this, ${it.lineId})
`
    }

    return re
  },
  for_create(it) {
    var re = ''

    re = re + `
@.createFragment(_elements, ${it.id})
@.createLine(_elements, ${it.lineId})
`

    return re
  },
  for_remove(it) {
    var re = ''

    re = re + `
var _len = _last[${it.valueId}]
for (var _i = 0; _i < _len; _i++) {
  @.remove(_elements, '${it.id}_' + _i)
}
`
    if (it.isRoot) {
      re = re + `
  @.setRoot(this, ${it.id}, _last[${it.valueId}] = 0)
`
    }

    return re
  },
  for_update(it) {
    var re = ''

    re = re + `
var _lastLength = _last[${it.valueId}] || 0
var _list = ${it.expression} || []

var _index = 0
var _len = _last[${it.valueId}] = _list.length
for (; _index < _len; _index++) {
  var ${it.indexName} = _index
  var ${it.itemName} = _list[_index]

  var _template = @.getTemplate(_elements, '${it.id}_' + _index, ${it.templateName}, this.options)
  if (_index >= _lastLength) {
    @.append(_elements, ${it.id}, '${it.id}_' + _index)
  }
  _template.update(${it.args.join(', ')})
}
for (; _index < _lastLength; _index++) {
  @.remove(_elements, '${it.id}_' + _index)
}
@.before(_elements, ${it.lineId}, ${it.id})
`

    if (it.isRoot) {
      re = re + `
  @.setRoot(this, ${it.id}, _len)
`
    }

    return re
  },
  format_amd(it) {
    var re = ''

    var ids = it.moduleIds.map((item) => {
      return `'${item}'`
    })
    re = re + `
;define('${it.moduleId}', [${ids.join(',')}], function([${it.moduleIds.join(',')}]){
  var module = {}
  ${it.content}
  return module.exports
})
`

    return re
  },
  format_cmd(it) {
    var re = ''

    re = re + `
;define(function(require, exports, module){
  ${it.content}
})
`

    return re
  },
  format_global(it) {
    var re = ''

    re = re + `
;(function(global){
  var module = {}
  var exports = {}
  function require (key) {
    return global[key]
  }

  ${it.content}
  global.${it.moduleId} = module.exports
})(window)
`

    return re
  },
  format_tp(it) {
    var re = ''

    var declares = it.methods.map((method) => {
      return `var _tp_${method} = _dep.tp_${method}`
    })
    re = re + `
${it.header}

${declares.join('\n')}

${it.body}
`

    return re
  },
  html_create(it) {
    var re = ''

    re = re + `
@.html(_elements, ${it.parentId}, '${_.translateMarks(it.expression)}')
`

    return re
  },
  html_update(it) {
    var re = ''

    re = re + `
var _tmp = ${it.valueString}
if (_last[${it.valueId}] !== _tmp) {
  _last[${it.valueId}] = _tmp
  @.html(_elements, ${it.parentId}, _tmp)
}
`

    return re
  },
  if_append(it) {
    var re = ''

    if (it.parentId) {
      re = re + `
  @.append(_elements, ${it.parentId}, ${it.lineId})
`
    }
    if (it.isRoot) {
      re = re + `
  @.setRoot(this, ${it.lineId})
`
    }

    return re
  },
  if_create(it) {
    var re = ''

    re = re + `
@.createLine(_elements, ${it.lineId})
@.createFragment(_elements, ${it.id})
`

    return re
  },
  if_remove(it) {
    var re = ''

    re = re + `
switch (_last[${it.valueId}]) {
`
    _.each(it.expressions, (expression, i) => {
      if (expression.removeList.length) {
        re = re + `
      case ${i}:
        ${expression.removeList.join('\n')}
        break
`
      }
    })
    re = re + `
}
_last[${it.valueId}] = -1
@.remove(_elements, ${id.lindId})
`
    if (it.isRoot) {
      re = re + `
  @.removeRoot(this, ${it.lindId})
`
    }

    return re
  },
  if_update(it) {
    var re = ''

    _.each(it.expressions, (expression, i) => {
      var condition = ''
      if (expression.tag !== 'else') {
        condition = `(${expression.condition})`
      }
      re = re + `
  ${expression.tag} ${condition} {
    if (_last[${it.valueId}] !== ${i}) {
      _last[${it.valueId}] = ${i}

      ${expression.removeList.join('\n')}
      ${expression.appendList.join('\n')}
`
      if (expression.endIndex > expression.startIndex) {
        re = re + `
        @.after(_elements, ${it.lineId}, ${it.id})
`
      }
      re = re + `
    }
    ${expression.updateList.join('\n')}
  }
`
    })

    return re
  },
  import_append(it) {
    var re = ''
    if (it.isRoot) {
      re = re + `
  @.setRoot(this, ${it.id})
`
    } else {
      re = re + `
  @.append(_elements, ${it.parentId}, ${it.id})
`
    }

    return re
  },
  import_create(it) {
    var re = ''
    re = re + `
@.getTemplate(_elements, ${it.id}, ${it.templateName}, this.options)
`

    return re
  },
  import_remove(it) {
    var re = ''

    re = re + `
@.remove(_elements, ${it.id})
`
    if (it.isRoot) {
      re = re + `
  @.removeRoot(this, ${it.id})
`
    }

    return re
  },
  import_update(it) {
    var re = ''

    re = re + `
_this.doms[${it.id}].update(${it.args.join(', ')})
`

    return re
  },
  require(it) {
    var re = ''

    re = re + `
var ${it.name} = require('${it.path}')
`

    return re
  },
  template(it) {
    var re = ''

    re = re + `
'use strict'

var _dep = require('${it.dependency}')
var _prototype = _dep.template
var _extend = _dep.extend

${it.requires.join('\n')}
`

    _.each(it.newDoms, (dom) => {
      re = re + `
  function ${dom.templateName} (options) {
    this.init(options)
  }
`
    })

    _.each(it.newDoms, (dom) => {
      if (dom.createList.length || dom.updateList.length) {
        re = re + `
    _extend(${dom.templateName}.prototype, _prototype, {
      create: function create () {
        var _elements = this.elements
`
        if (it.modelType === 'model' || it.modelType === 'object') {
          re = re + `
          var _scope = this.options.scope
`
        } else {
          re = re + `
          var _scope = this
`
        }

        re = re + `
        ${dom.createList.join('\n')}
        ${dom.appendList.join('\n')}
      }${dom.updateList.length ? ',' : ''}
`

        if (dom.updateList.length) {
          re = re + `
        update: function update (${dom.args.join(', ')}) {
          var _elements = this.elements
          var _last = this.last

          ${dom.updateList.join('\n')}
        }
`
        }

        re = re + `
    })
`
      }
    })

    re = re + `
module.exports = exports['default'] = ${it.templateName}
`

    return re
  },
  text_append(it) {
    var re = ''
    if (it.parentId) {
      re = re + `
  @.append(_elements, ${it.parentId}, ${it.id})
`
    }
    if (it.isRoot) {
      re = re + `
  @.setRoot(this, ${it.id})
`
    }

    return re
  },
  text_create(it) {
    var re = ''

    re = re + `
@.createText(_elements, ${it.id}, '${_.translateMarks(it.text)}')
`

    return re
  },
  text_remove(it) {
    var re = ''

    re = re + `
@.remove(_elements, ${it.id})
`
    if (it.isRoot) {
      re = re + `
  @.removeRoot(this, ${it.id})
`
    }

    return re
  },
  text_update(it) {
    var re = ''

    re = re + `
var _tmp = ${it.valueString}
if (_last[${it.valueId}] !== _tmp) {
  _last[${it.valueId}] = _tmp
  @.text(_elements, ${it.id}, _tmp)
}
`

    return re
  }

}
