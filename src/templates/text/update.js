
// {{
var _tmp = ${it.valueString}
if (_last[${it.valueId}] !== _tmp) {
  _last[${it.valueId}] = _tmp
  @.text(_this, ${it.id}, _tmp)
}
// }}
