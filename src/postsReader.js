"use strict"

const contentReader = require('./contentReader')
const path = require('path')

const INDEX_GLOB_PATTERN = path.join(__dirname, '..', 'content', 'posts', '**/*.md')

const postsIndex = function() {
  return contentReader.metaIndex(INDEX_GLOB_PATTERN)
}

module.exports = {postsIndex}
