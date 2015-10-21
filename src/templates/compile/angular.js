
var dependencies = it.dependencies || []
var paths = []
var variables = []
for (var i = 0, len = dependencies.length; i < len; i++) {
  var item = dependencies[i]
  paths.push(`'${item.path}'`)
  variables.push(item.name)
}

// {{
angular.module('et.template').factory('${it.moduleId}', [${paths.join(',')}, function(${variables.join(',')}) {
  ${this.compile_template(it)}
  return function(option) {
    return new ${it.templateName}(option)
  }
}]);
// }}
