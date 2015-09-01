"use strict"

const csp = require('js-csp')
const postsReader = require('./postsReader')
const pagesReader = require('./pagesReader')

const concat = function(ch) {
  return csp.operations.reduce(function(acc, item) { return acc.concat(item) }, [], ch)
}

const index = function() {
  let postsCh = concat(postsReader.postsMetaIndex())
  let pagesCh = concat(pagesReader.pagesMetaIndex())
  return csp.go(function* () {
    let posts = yield csp.take(postsCh)

    // most recent posts first
    posts.sort(function(a, b) {
      return a.date.valueOf() < b.date.valueOf()
    })

    let pages = yield csp.take(pagesCh)
    return {posts, pages}
  })
}

module.exports = {index}
