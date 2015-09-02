"use strict"

const csp = require('js-csp'),
      go = csp.go,
      take = csp.take,
      put = csp.put

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

go(function* () {
  let err = yield take(errorCh)
  console.log('ERROR: ', err)
  process.exit(1)
})

go(function* () {
  let index = yield take(indexCh)
  let templates = yield take(templCh)
  yield go(directoryCleaner.cleanUp, [errorCh])

  let tasks = [
    go(indexWriter.write, [index, templates, errorCh]),
    go(postsWriter.write, [postsReader.postsIndex(), index, templates, errorCh]),
    go(pagesWriter.write, [pagesReader.pagesIndex(), index, templates, errorCh])
  ]

  for (let i = 0; i < tasks.length; i++) {
    yield take(tasks[i])
  }

  console.log('Done :)')
})
