"use strict"

const fileReader = require('./fileReader')
const globReader = require('./globReader')
const csp        = require('js-csp')
const handlebars = require('handlebars')
const path       = require('path')

const TEMPLATES_GLOB_PATTERN = path.join(__dirname, '..', 'content', 'templates', '**/*.hbt')
require('handlebars-intl').registerWith(handlebars);

const INTL_DATA = {
  locales: 'en-US'
}

const intl = function(template) {
  return function(context) {
    return template(context, {data: {intl: INTL_DATA}})
  }
}

const templateName = function(filepath) {
  return path.basename(filepath)
}

const compileTemplate = function(filepath) {
  let fileCh = fileReader.read(filepath)
  return csp.go(function* () {
    let file = yield csp.take(fileCh)
    return {
      name: templateName(filepath),
      template: handlebars.compile(file)
    }
  })
}

const index = function() {
  let files = globReader.files(TEMPLATES_GLOB_PATTERN)
  let templates = {}
  let ch = csp.chan()
  csp.go(function* () {
    while(true) {
      let file = yield csp.take(files)
      if (file !== csp.CLOSED) {
        let compiled = yield csp.take(compileTemplate(file))
        templates[compiled.name] = intl(compiled.template)
      }
      else {
        yield csp.put(ch, templates)
        ch.close()
        return
      }
    }
  })
  return ch
}

module.exports = {index}
