"use strict"

const contentReader = require('./contentReader')
const path = require('path')
const xducers = require('transducers-js')
const dateformat = require('dateformat')
const utils = require('./utils')

const INDEX_GLOB_PATTERN = path.join(__dirname, '..', 'content', 'posts', '**/*.md')

const postName = function(parsedPost) {
  var name = dateformat(parsedPost.date, 'dd-mm-yyyy') + '_' + parsedPost.title
  return name.substr(0, 60).toLowerCase().replace(/[^\w\d]/g, '_')
}

const filterPublished = xducers.filter(function(post) {
  return post.publish === true
})

const addUrl = xducers.map(function(post) {
  post.url = '/posts/' + postName(post)
  return post
})

const postsMetaIndex = function() {
  return contentReader.metaIndex(INDEX_GLOB_PATTERN, utils.compose(filterPublished, addUrl))
}

const postsIndex = function() {
  return contentReader.contentIndex(INDEX_GLOB_PATTERN, utils.compose(filterPublished, addUrl))
}

module.exports = {postsIndex, postsMetaIndex}
