"use strict"

const csp = require('js-csp'),
      go = csp.go,
      take = csp.take,
      reduce = csp.operations.reduce

const postsReader = require('./postsReader')
const pagesReader = require('./pagesReader')

const concat = function(ch) {
  return reduce(function(acc, item) { return acc.concat(item) }, [], ch)
}

const index = function() {
  let postsCh = concat(postsReader.postsMetaIndex())
  let pagesCh = concat(pagesReader.pagesMetaIndex())
  return go(function* () {
    let posts = yield take(postsCh)

    // most recent posts first
    posts.sort(function(a, b) {
      return a.date.valueOf() < b.date.valueOf()
    })

    let pages = yield take(pagesCh)
    return {posts, pages}
  })
}

module.exports = {index}
