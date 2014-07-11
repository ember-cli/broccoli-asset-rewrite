var fs       = require('fs');
var path     = require('path');
var assert   = require('assert');
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

var rewrite  = require('..');

var builder;

function confirmOutput(actualPath, expectedPath) {
  var actualFiles = walkSync(actualPath);
  var expectedFiles = walkSync(expectedPath);

  assert.deepEqual(actualFiles, expectedFiles, 'files output should be the same as those input');

  expectedFiles.forEach(function(relativePath) {
    if (relativePath.slice(-1) === '/') { return; }

    var actual   = fs.readFileSync(path.join(actualPath, relativePath), { encoding: 'utf8'});
    var expected = fs.readFileSync(path.join(expectedPath, relativePath), { encoding: 'utf8' });

    assert.equal(actual, expected, relativePath + ': does not match expected output');
  });
}

describe('broccoli-asset-rev', function() {
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('uses the provided assetMap to replace strings', function(){
    var sourcePath = 'tests/fixtures/basic';
    var tree = rewrite(sourcePath + '/input', {
      assetMap: {
        'foo/bar/widget.js': 'blahzorz-1.js',
        'images/sample.png': 'images/fingerprinted-sample.png',
      }
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(graph) {
      confirmOutput(graph.directory, sourcePath + '/output');
    });
  })
});
