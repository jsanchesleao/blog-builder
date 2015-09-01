"use strict"

const csp = require('js-csp')
const path = require('path')
const fileWriter = require('./fileWriter')

const PAGES_PATH = path.join(__dirname, '..', 'public')

const pagePath = function(page) {
  let name = page.name.toLowerCase().replace(/[^\w\d]/g, '_').trim();
  return path.join(PAGES_PATH, name, 'index.html')
}

const write = function* (pagesCh, index, templates, errorCh) {
  let writeCh = fileWriter.writer(errorCh)
  let page = null  
  while(page = yield csp.take(pagesCh), page !== csp.CLOSED) {
    let html = templates[page.template]({index, page})
    yield csp.put(writeCh, {path: pagePath(page),
                            content: html})  
  }
}

module.exports = {write}
