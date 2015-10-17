var Filter = require('broccoli-filter');
var path = require('path');

function normalize(str) {
  return str.replace(/[\\\/]+/g, '/');
}

function relative(a, b) {
  if (/\./.test(path.basename(a))) {
    a = path.dirname(a);
  }

  var relativePath = path.relative(a, b);
  // path.relative might have added back \-s on windows
  relativePath = normalize(relativePath);
  return relativePath.charAt(0) !== '.' ? './' + relativePath : relativePath;
}

function AssetRewrite(inputNode, options) {
  if (!(this instanceof AssetRewrite)) {
    return new AssetRewrite(inputNode, options);
  }

  options = options || {};

  Filter.call(this, inputNode, {
    extensions: options.replaceExtensions || ['html', 'css'],
    // We should drop support for `description` in the next major release
    annotation: options.description || options.annotation
  });

  this.assetMap = options.assetMap || {};
  this.prepend = options.prepend || '';
  this.ignore = options.ignore || []; // files to ignore

  this.assetMapKeys = null;
}

AssetRewrite.prototype = Object.create(Filter.prototype);
AssetRewrite.prototype.constructor = AssetRewrite;

/**
 * Checks that file is not being ignored and destination doesn't already have a file
 * @param relativePath
 * @returns {boolean}
 */

AssetRewrite.prototype.canProcessFile = function(relativePath) {
  if (!this.inverseAssetMap) {
    var inverseAssetMap = {};
    var assetMap = this.assetMap;

    Object.keys(assetMap).forEach(function(key) {
      var value = assetMap[key];
      inverseAssetMap[value] = key;
    }, this);

    this.inverseAssetMap = inverseAssetMap;
  }

  /*
   * relativePath can be fingerprinted or not.
   * Check that neither of these variations are being ignored
   */

  if (this.ignore.indexOf(relativePath) !== -1 || this.ignore.indexOf(this.inverseAssetMap[relativePath]) !== -1) {
    return false;
  }

  return Filter.prototype.canProcessFile.apply(this, arguments);
}

AssetRewrite.prototype.processString = function (string, relativePath) {
  var prepend = this.prepend;
  var absMap = this.assetMap;
  var absKeys = this.getAssetMapKeys();

  var relMap = {};
  var relKeys = absKeys.map(function(path) {
    var relPath = relative(relativePath, path).replace(/^\.\//, "");

    var relReplacement = relative(relativePath, absMap[path]).replace(/^\.\//, "");
    if (prepend && prepend !== '') {
      relReplacement = absMap[path];
    }

    relMap[relPath] = relReplacement;

    return relPath
  });

  var assetGroup = '(' + absKeys.concat(relKeys).map(function(p) { return escapeRegExp(p); }).join('|') + ')';

  /*
   * Replace all of the assets with their new fingerprint name
   *
   * Uses a regular expression to find assets in html tags, css backgrounds, handlebars pre-compiled templates, etc.
   *
   * ["\'\\(=]{1} - Match one of "'(= exactly one time
   * \\s* - Any amount of white space
   * ( - Starts the first pattern match
   * [^"\'\\(\\)=]* - Do not match any of ^"'()= 0 or more times
   * /([.*+?^=!:${}()|\[\]\/\\])/g - Replace .*+?^=!:${}()|[]/\ in filenames with an escaped version for an exact name match
   * [^"\'\\(\\)\\\\>=]* - Do not match any of ^"'()\>= 0 or more times - Explicitly add \ here because of handlebars compilation
   * ) - End first pattern match
   * \\s* - Any amount of white space
   * [\\\\]* - Allow any amount of \ - For handlebars compilation (includes \\\)
   * \\s* - Any amount of white space
   * ["\'\\)> ]{1} - Match one of "'( > exactly one time
   */
  var assetRE = new RegExp('["\'\\(=]{1}\\s*([^"\'\\(\\)=]*' + assetGroup + '[^"\'\\(\\)\\\\>=]*)\\s*[\\\\]*\\s*["\'\\)> ]{1}', 'g');

  var sourceMapRE = new RegExp('sourceMappingURL=(' + assetGroup + ')');

  /*
   * This is to ignore matches that should not be changed
   * Any URL encoded match that would be ignored above will be ignored by this: "'()=\
   */
  var ignoreLibraryCode = new RegExp('(%22|%27|%5C|%28|%29|%3D)[^"\'\\(\\)=]*' + assetGroup);

  /*
   * This is to detect protocol-relative and absolute URLs.
   * These URLs will not have anything prepended.
   */
  var fullURL = new RegExp('^([a-z][a-z0-9+\\-\\.]*)?://', 'i');

  var replacer = function(wholeMatch, found, assetPath) {
    if (ignoreLibraryCode.exec(found)) {
      return wholeMatch;
    }

    var replacement = absMap[assetPath] || relMap[assetPath];
    if (prepend && prepend !== '' && !fullURL.exec(found)) {
      replacement = prepend + replacement;
    }

    return wholeMatch.replace(assetPath, replacement);
  };

  return string.replace(assetRE, replacer).replace(sourceMapRE, replacer);
};

AssetRewrite.prototype.getAssetMapKeys = function () {
  var keys = Object.keys(this.assetMap);

  keys.sort(function (a, b) {
    if (a.length < b.length) {
      return 1;
    }

    if (a.length > b.length) {
      return -1;
    }

    return 0;
  });

  return keys;
};

function escapeRegExp(string) {
  return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
}

module.exports = AssetRewrite;
