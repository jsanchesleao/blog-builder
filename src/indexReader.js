"use strict"

const csp = require('js-csp')
const postsReader = require('./postsReader')
const pagesReader = require('./pagesReader')

const concat = function(ch) {
  return csp.operations.reduce(function(acc, item) { return acc.concat(item) }, [], ch)
}

const index = function() {
  let postsCh = concat(postsReader.postsIndex())
  let pagesCh = concat(pagesReader.pagesIndex())
  return csp.go(function* () {
    let posts = yield csp.take(postsCh)
    let pages = yield csp.take(pagesCh)
    return {posts, pages}
  })
}

module.exports = {index}
