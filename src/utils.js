"use strict"

const compose2 = function(f, g) {
  return function(x) {
    return f(g(x))
  }
}

const identity = function(x) {
  return x
}

const compose = function() {
  let args = Array.prototype.slice.call(arguments)
  return args.reduce(compose2, identity, args)
}

module.exports = {identity, compose}
