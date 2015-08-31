var parser = require('./parser');
var handlebars = require('handlebars');
require('handlebars-intl').registerWith(handlebars);
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var contentDir = path.join(__dirname, '..', 'content');
var compileDir = path.join(__dirname, '..', 'public');

var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var dateformat = require('dateformat');

var postsPattern = path.join(contentDir, 'posts', '**/*.md');
var templatesPattern = path.join(contentDir, 'templates', '**/*.hbt');
var compiledPostsDir = path.join(compileDir, 'posts');
var templates = {};
var intlData = {
  locales: 'en-US'
};

var postName = function(parsedPost) {
  var name = dateformat(parsedPost.date, 'dd-mm-yyyy') + '_' + parsedPost.title;
  return name.substr(0, 60).toLowerCase().replace(/[^\w\d]/g, '_');
};

var buildPost = function(filename) {
  var file = fs.readFileSync(filename, {encoding: 'utf-8'})
  var parsed = parser(file)
  var post   = templates[parsed.template](parsed, {data: {intl: intlData}});
  var name   = postName(parsed);
  mkdirp.sync(path.join(compiledPostsDir, name));
  fs.writeFileSync(path.join(compiledPostsDir, name, 'index.html'), post);

  delete parsed.content;
  delete parsed.template;
  parsed.filename = name;

  return parsed;
};

var buildAboutMe = function() {
  var parsed = parser(
    fs.readFileSync(
      path.join(contentDir, 'pages', 'about.md'), 
      {encoding: 'utf8'}));

  var page = templates['page.hbt'](parsed, {data: {intl: intlData}});
  var name = parsed.name.toLowerCase().replace(/[^\w\d]/g, '_').trim();

  mkdirp.sync(path.join(compileDir, name));
  fs.writeFileSync(path.join(compileDir, name, 'index.html'), page);

  delete parsed.content;
  delete parsed.template;

  return parsed;
};

glob(templatesPattern, function(err, filenames) {
  filenames.forEach(function(filename) {
    templates[path.basename(filename)] = handlebars.compile(fs.readFileSync(filename, {encoding: 'utf8'}));
  });

  rimraf.sync(compiledPostsDir);
  mkdirp.sync(compiledPostsDir);

  glob(postsPattern, function(err, filenames) {
    var posts = [];
    filenames.forEach(function(filename) {
      posts.push(buildPost(filename));
    });

    var pages = [];

    pages.push(buildAboutMe());

    // most recent posts first
    posts.sort(function(a, b) {
      return a.date.valueOf() < b.date.valueOf();
    });

    fs.writeFileSync(path.join(compiledPostsDir, '..', 'index.html'), templates['index.hbt']({
      posts: posts,
      pages: pages
    }, {
    data: {
      intl: intlData
      }
    }));
  });
});

