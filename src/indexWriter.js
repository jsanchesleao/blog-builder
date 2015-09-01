"use strict"

const csp = require('js-csp')
const fileWriter = require('./fileWriter')
const path = require('path')

const INDEX_PATH = path.join(__dirname, '..', 'public', 'index.html')

const write = function* (index, templates, errorCh) {
  let writeCh = fileWriter.writer(errorCh)
  let html = templates['index.hbt'](index)

  yield csp.put(writeCh, {path: INDEX_PATH, content: html})
}

module.exports = {write}
