"use strict"

const csp = require('js-csp')
const fs  = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

const writeFile = function(filepath, content, ch, errorCh) {

  mkdirp(path.dirname(filepath), function(dirErr) {
    if (dirErr && errorCh) {
      csp.putAsync(errorCh, dirErr)
      ch.close()
      return
    }
    fs.writeFile(filepath, content, function(err) {
      if (err) {
        if (errorCh) csp.putAsync(errorCh, err)
        ch.close()
      }
    })
  })
}

const writer = function(errorCh) {
  let ch = csp.chan()
  csp.go(function* () {
    while(true) {
      let request = yield csp.take(ch)
      if (request === csp.CLOSED) {
        return
      }
      console.log('writing ', request.path)
      writeFile(request.path, request.content, ch, errorCh)
    }
  })
  return ch
}

module.exports = {writer}
