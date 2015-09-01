"use strict"

const csp = require('js-csp')
const path = require('path')
const globReader = require('./globReader')
const markdownReader = require('./markdownReader')

const INDEX_GLOB_PATTERN = path.join(__dirname, '..', 'content', 'posts', '**/*.md')

const metaIndex = function(globPattern) {
  let ch = csp.chan()
  let files = globReader.files(globPattern)
  
  csp.go(function* () {
    while(true) {
      let file = yield csp.take(files)
      if (file !== csp.CLOSED) {
        let compiled = yield markdownReader.compileMarkdownMeta(file)
        yield csp.put(ch, compiled)
      }
      else {
        ch.close()
        return;
      }
    }
  });

  return ch
};

module.exports = {metaIndex}
