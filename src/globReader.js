"use strict"

var Glob = require('glob').Glob
var csp  = require('js-csp')

let files = function(pattern) {
  let ch = csp.chan(csp.buffers.fixed(1000))
  let glob = new Glob(pattern)

  glob.on('end', function() {
    ch.close()
  })

  glob.on('match', function(match) {
    csp.putAsync(ch, match)
  })

  glob.on('error', function(err) {
    console.log('error on glob', err)
    ch.close()
  })

  return ch;
};

let fileList = function(pattern) {
  return csp.operations.reduce(function(fs, f) {
    return fs.concat(f)
  }, [], files(pattern))
}

module.exports = {files, fileList}
