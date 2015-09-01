"use strict"

const marked = require('marked')
const yaml   = require('js-yaml')
const csp    = require('js-csp')
const fileReader = require('./fileReader')

const parseText = function(text) {
  let split = text.split(/---\r?\n/)
  let parsed = yaml.safeLoad(split[1])
  parsed.content = split.slice(2).join('').trim()
  return parsed
}

const compileMarkdownMeta = function(path) {
  return csp.go(function* () {
    let text = yield csp.take(fileReader.read(path))
    let parsed = parseText(text)
    delete parsed.content
    return parsed
  })
}

const compileMarkdown = function (path) {
  return csp.go(function*() {
    let text = yield csp.take(fileReader.read(path))
    let parsed = parseText(text)
    parsed.content = marked(parsed.content)
    return parsed
  })
}

module.exports = {compileMarkdownMeta, compileMarkdown}
