var marked = require('marked');
var yaml   = require('js-yaml');

module.exports = function(text) {
  var split = text.split(/---\r?\n/);

  var parsed = yaml.safeLoad(split[1]);

  parsed.content = marked(split.slice(2).join('').trim());

  return parsed;
};
