"use strict"

const csp = require('js-csp')
const path = require('path')
const fileWriter = require('./fileWriter')

const POSTS_PATH = path.join(__dirname, '..', 'public')

const write = function *(postsCh, index, templates, errorCh) {
  let writeCh = fileWriter.writer(errorCh)
  let post = null  
  while(post = yield csp.take(postsCh), post !== csp.CLOSED) {
    let html = templates[post.template]({index, post}) 
    yield csp.put(writeCh, {path: path.join(POSTS_PATH, post.url, 'index.html'),
                            content: html})
  }
}

module.exports = {write}
