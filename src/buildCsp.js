"use strict"

const csp = require('js-csp')
const directoryCleaner = require('./directoryCleaner')

const indexReader = require('./indexReader')
const postsReader = require('./postsReader')
const pagesReader = require('./pagesReader')
const templatesReader = require('./templatesReader')

const indexWriter = require('./indexWriter')
const postsWriter = require('./postsWriter')
const pagesWriter = require('./pagesWriter')


let indexCh = indexReader.index()
let templCh = templatesReader.index()  
let errorCh = csp.chan()  

csp.go(function* () {
  let err = yield csp.take(errorCh)
  console.log('ERROR: ', err)
})

csp.go(function* () {
  let index = yield csp.take(indexCh)
  let templates = yield csp.take(templCh)
  yield csp.go(directoryCleaner.cleanUp, [errorCh])

  csp.go(indexWriter.write, [index, templates, errorCh])
  csp.go(postsWriter.write, [postsReader.postsIndex(), index, templates, errorCh])
  csp.go(pagesWriter.write, [pagesReader.pagesIndex(), index, templates, errorCh])
})
