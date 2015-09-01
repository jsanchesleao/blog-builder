"use strict"

const fs  = require('fs')
const csp = require('js-csp')

const read = function(path) {
  var chan = csp.chan()
  fs.readFile(path, {encoding: 'utf-8'}, function(err, data) {
    if (err) {
      console.log('Error reading file: ', err)
      csp.close()
    }
    else {
      csp.putAsync(chan, data)
    }
  });
  return chan
}

module.exports = {read}
