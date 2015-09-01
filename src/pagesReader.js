"use strict"

const contentReader = require('./contentReader')
const path = require('path')

const PAGES_GLOB_PATTERN = path.join(__dirname, '..', 'content', 'pages', '**/*.md')

const pagesIndex = function() {
  return contentReader.metaIndex(PAGES_GLOB_PATTERN)
}

module.exports = {pagesIndex}
