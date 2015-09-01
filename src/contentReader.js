"use strict"

const csp = require('js-csp')
const path = require('path')
const globReader = require('./globReader')
const markdownReader = require('./markdownReader')

const index = function(compileFn) {
  return function(globPattern, transducer) {
    let ch = csp.chan(2, transducer)
    let files = globReader.files(globPattern)
    
    csp.go(function* () {
      while(true) {
        let file = yield csp.take(files)
        if (file !== csp.CLOSED) {
          let compiled = yield csp.take(compileFn(file))
          yield csp.put(ch, compiled)
        }
        else {
          ch.close()
          return
        }
      }
    })

    return ch
  }
}

const metaIndex = index(markdownReader.compileMarkdownMeta) 
const contentIndex = index(markdownReader.compileMarkdown) 

module.exports = {metaIndex, contentIndex}
