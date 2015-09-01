"use strict"

const csp = require('js-csp')
const path = require('path')
const rimraf = require('rimraf')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')

const cleanPublic = function(errorCh) {
  let ch = csp.chan()
  rimraf(path.join(PUBLIC_DIR, '*'), function(err) {
    if (err) {
      csp.putAsync(errorCh, err)
    }
    else {
      csp.putAsync(ch, true)
    }
    ch.close()
  })
  return ch
}

const cleanUp = function* (errorCh) {
  yield csp.take(cleanPublic(errorCh))
}

module.exports = {cleanUp}
