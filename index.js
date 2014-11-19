var Filter = require('broccoli-filter');

function AssetRewrite(inputTree, options) {
  if (!(this instanceof AssetRewrite)) {
    return new AssetRewrite(inputTree, options);
  }

  options = options || {};

  this.inputTree = inputTree;
  this.assetMap = options.assetMap || {};
  this.extensions = options.replaceExtensions || ['html', 'css'];
  this.prepend = options.prepend || '';
  this.description = options.description;
  this.ignore = options.ignore || []; // files to ignore
}

AssetRewrite.prototype = Object.create(Filter.prototype);
AssetRewrite.prototype.constructor = AssetRewrite;

AssetRewrite.prototype.processAndCacheFile = function (srcDir, destDir, relativePath) {
  this._cache = {};

  return Filter.prototype.processAndCacheFile.apply(this, arguments);
}

/**
 * Checks that file is not being ignored and destination doesn't already have a file
 * @param relativePath
 * @returns {boolean}
 */
AssetRewrite.prototype.canProcessFile = function(relativePath) {
  if (this.inverseAssetMap == null) {
    var inverseAssetMap = {};
    var assetMap = this.assetMap;
    Object.keys(assetMap).forEach(function(key){
      var value = assetMap[key];
      inverseAssetMap[value] = key;
    }, this);
    this.inverseAssetMap = inverseAssetMap;
  }
  // relativePath can be an unfingerprinted file name or a fingerprinted file name
  // check that neither of these variations are being ignored
  if (this.ignore.indexOf(relativePath) !== -1 || this.ignore.indexOf(this.inverseAssetMap[relativePath]) !== -1) {
    return false;
  }
  return Filter.prototype.canProcessFile.apply(this, arguments);
}

AssetRewrite.prototype.processString = function (string) {
  var newString = string;

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

  for (var key in this.assetMap) {
    if (this.assetMap.hasOwnProperty(key)) {
      var re = new RegExp('["\'\\(=]{1}\\s*([^"\'\\(\\)=]*' + escapeRegExp(key) + '[^"\'\\(\\)\\\\>=]*)\\s*[\\\\]*\\s*["\'\\)> ]{1}', 'g');
      var match = null;

      while (match = re.exec(newString)) {
        var replaceString = '';

        if (this.prepend && this.prepend !== '') {
          replaceString = this.prepend + this.assetMap[key];
        } else {
          replaceString = match[1].replace(key, this.assetMap[key]);
        }

        newString = newString.replace(new RegExp(escapeRegExp(match[1]), 'g'), replaceString);
      }
    }
  }

  return newString;
};

function escapeRegExp(string) {
  return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
}

module.exports = AssetRewrite;
