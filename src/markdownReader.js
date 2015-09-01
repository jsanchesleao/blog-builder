"use strict"

const marked = require('marked')
const yaml   = require('js-yaml')
const fs     = require('fs')
const csp    = require('js-csp')

const readFile = function(path) {
  var chan = csp.chan()
  fs.readFile(path, {encoding: 'utf-8'}, function(err, data) {
    if (err) {
      console.log('Error reading file: ', err)
    }
    else {
      csp.putAsync(chan, data)
    }
  });
  return chan
}

const parseText = function(text) {
  let split = text.split(/---\r?\n/)
  let parsed = yaml.safeLoad(split[1])
  parsed.content = split.slice(2).join('').trim()
  return parsed
}

const compileMarkdownMeta = function(path) {
  return csp.go(function* () {
    let text = yield csp.take(readFile(path))
    let parsed = parseText(text)
    delete parsed.content
    return parsed
  })
}

const compileMarkdown = function (path) {
  return csp.go(function*() {
    let text = yield csp.take(readFile(path))
    let parsed = parseText(text)
    parsed.content = marked(parsed.content)
    return parsed
  })
}

module.exports = { readFile, compileMarkdownMeta, compileMarkdown }
