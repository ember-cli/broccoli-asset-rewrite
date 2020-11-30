const fs = require("fs");
const { expect } = require("chai");
const {
  createBuilder,
  createTempDir,
  fromDir,
} = require("broccoli-test-helper");
const AssetRewrite = require("..");

describe("broccoli-asset-rev", function () {
  it("uses the provided assetMap to replace strings", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "foo/bar/widget.js": "blahzorz-1.js",
        "images/sample.png": "images/fingerprinted-sample.png",
        "fonts/Fiz/Light/Fiz-Light.eot":
          "fonts/Fiz/Light/fingerprinted-Fiz-Light.eot",
        "fonts/Fiz/Light/Fiz-Light.woff":
          "fonts/Fiz/Light/fingerprinted-Fiz-Light.woff",
        "fonts/Fiz/Light/Fiz-Light.ttf":
          "fonts/Fiz/Light/fingerprinted-Fiz-Light.ttf",
        "fonts/Fiz/Light/Fiz-Light.svg":
          "fonts/Fiz/Light/fingerprinted-Fiz-Light.svg",
        "fonts/Fiz/Medium/Fiz-Medium.eot":
          "fonts/Fiz/Medium/fingerprinted-Fiz-Medium.eot",
        "fonts/Fiz/Medium/Fiz-Medium.woff":
          "fonts/Fiz/Medium/fingerprinted-Fiz-Medium.woff",
        "fonts/Fiz/Medium/Fiz-Medium.ttf":
          "fonts/Fiz/Medium/fingerprinted-Fiz-Medium.ttf",
        "fonts/Fiz/Medium/Fiz-Medium.svg":
          "fonts/Fiz/Medium/fingerprinted-Fiz-Medium.svg",
      },
    });
    const output = createBuilder(subject);

    input.write({
      "encoded-meta-tag.html": `<meta name="ember-sample/config/environment" content="%7B%22modulePrefix%22%3A%22ember-sample%22%2C%22environment%22%3A%22development%22%2C%22baseURL%22%3A%22/%22%2C%22locationType%22%3A%22auto%22%2C%22marked%22%3A%7B%22js%22%3A%22/foo/bar/widget.js%22%2C%22highlights%22%3Afalse%7D%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%7D%2C%22APP%22%3A%7B%22name%22%3A%22ember-sample%22%2C%22version%22%3A%220.0.0.bb29331f%22%7D%2C%22contentSecurityPolicyHeader%22%3A%22Content-Security-Policy-Report-Only%22%2C%22contentSecurityPolicy%22%3A%7B%22default-src%22%3A%22%27none%27%22%2C%22script-src%22%3A%22%27self%27%20%27unsafe-eval%27%22%2C%22font-src%22%3A%22%27self%27%22%2C%22connect-src%22%3A%22%27self%27%22%2C%22img-src%22%3A%22%27self%27%22%2C%22style-src%22%3A%22%27self%27%22%2C%22media-src%22%3A%22%27self%27%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D" />`,
      "fonts.css": `@font-face {
        font-family: Fiz;
        font-weight: 100;
        font-style: normal;
        src: url('fonts/Fiz/Light/Fiz-Light.eot');
        src: url('fonts/Fiz/Light/Fiz-Light.eot?#iefix') format('embedded-opentype'), url('fonts/Fiz/Light/Fiz-Light.woff') format('woff'), url('fonts/Fiz/Light/Fiz-Light.ttf') format('truetype'), url('fonts/Fiz/Light/Fiz-Light.svg#Fiz') format('svg');
      }
      
      @font-face {
        font-family: Fiz;
        font-weight: 200;
        font-style: normal;
        src: url('fonts/Fiz/Medium/Fiz-Medium.eot?#iefix');
        src: url('fonts/Fiz/Medium/Fiz-Medium.eot?#iefix') format('embedded-opentype'), url('fonts/Fiz/Medium/Fiz-Medium.woff') format('woff'), url('fonts/Fiz/Medium/Fiz-Medium.ttf') format('truetype'), url('fonts/Fiz/Medium/Fiz-Medium.svg#Fiz') format('svg');
      }
      `,
      "quoted-script-tag.html": `<script src="foo/bar/widget.js"></script>`,
      "unquoted-script-tag.html": `<script src=foo/bar/widget.js></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(images/sample.png)}`,
    });
    await output.build();

    expect(output.changes()).to.deep.equal({
      "encoded-meta-tag.html": "create",
      "fonts.css": "create",
      "quoted-script-tag.html": "create",
      "unquoted-script-tag.html": "create",
      "unquoted-url-in-styles.css": "create",
    });
    expect(output.read()).to.deep.equal({
      "encoded-meta-tag.html": `<meta name="ember-sample/config/environment" content="%7B%22modulePrefix%22%3A%22ember-sample%22%2C%22environment%22%3A%22development%22%2C%22baseURL%22%3A%22/%22%2C%22locationType%22%3A%22auto%22%2C%22marked%22%3A%7B%22js%22%3A%22/foo/bar/widget.js%22%2C%22highlights%22%3Afalse%7D%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%7D%2C%22APP%22%3A%7B%22name%22%3A%22ember-sample%22%2C%22version%22%3A%220.0.0.bb29331f%22%7D%2C%22contentSecurityPolicyHeader%22%3A%22Content-Security-Policy-Report-Only%22%2C%22contentSecurityPolicy%22%3A%7B%22default-src%22%3A%22%27none%27%22%2C%22script-src%22%3A%22%27self%27%20%27unsafe-eval%27%22%2C%22font-src%22%3A%22%27self%27%22%2C%22connect-src%22%3A%22%27self%27%22%2C%22img-src%22%3A%22%27self%27%22%2C%22style-src%22%3A%22%27self%27%22%2C%22media-src%22%3A%22%27self%27%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D" />`,
      "fonts.css": `@font-face {
        font-family: Fiz;
        font-weight: 100;
        font-style: normal;
        src: url('fonts/Fiz/Light/fingerprinted-Fiz-Light.eot');
        src: url('fonts/Fiz/Light/fingerprinted-Fiz-Light.eot?#iefix') format('embedded-opentype'), url('fonts/Fiz/Light/fingerprinted-Fiz-Light.woff') format('woff'), url('fonts/Fiz/Light/fingerprinted-Fiz-Light.ttf') format('truetype'), url('fonts/Fiz/Light/fingerprinted-Fiz-Light.svg#Fiz') format('svg');
      }
      
      @font-face {
        font-family: Fiz;
        font-weight: 200;
        font-style: normal;
        src: url('fonts/Fiz/Medium/fingerprinted-Fiz-Medium.eot?#iefix');
        src: url('fonts/Fiz/Medium/fingerprinted-Fiz-Medium.eot?#iefix') format('embedded-opentype'), url('fonts/Fiz/Medium/fingerprinted-Fiz-Medium.woff') format('woff'), url('fonts/Fiz/Medium/fingerprinted-Fiz-Medium.ttf') format('truetype'), url('fonts/Fiz/Medium/fingerprinted-Fiz-Medium.svg#Fiz') format('svg');
      }
      `,
      "quoted-script-tag.html": `<script src="blahzorz-1.js"></script>`,
      "unquoted-script-tag.html": `<script src=blahzorz-1.js></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(images/fingerprinted-sample.png)}`,
    });
  });

  it("ignore option tell filter what files should not be processed", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "foo/bar/widget.js": "blahzorz-1.js",
        "images/sample.png": "images/fingerprinted-sample.png",
      },
      ignore: ["ignore-this-file.html"],
    });
    const output = createBuilder(subject);

    input.write({
      "ignore-this-file": `<script src="foo/bar/widget.js"></script>`,
      "quoted-script-tag.html": `<script src="foo/bar/widget.js"></script>`,
      "unquoted-script-tag.html": `<script src=foo/bar/widget.js></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(images/fingerprinted-sample.png)}`,
    });

    await output.build();

    expect(output.changes()).to.deep.equal({
      "ignore-this-file": "create",
      "quoted-script-tag.html": "create",
      "unquoted-script-tag.html": "create",
      "unquoted-url-in-styles.css": "create"
    });
    expect(output.read()).to.deep.equal({
      "ignore-this-file": `<script src="foo/bar/widget.js"></script>`,
      "quoted-script-tag.html": `<script src="blahzorz-1.js"></script>`,
      "unquoted-script-tag.html": `<script src=blahzorz-1.js></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(images/fingerprinted-sample.png)}`,
    });
  });

  it("rewrites relative urls", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "foo/bar/widget.js": "blahzorz-1.js",
        "images/sample.png": "images/fingerprinted-sample.png",
        "assets/images/foobar.png": "assets/images/foobar-fingerprint.png",
        "assets/images/baz.png": "assets/images/baz-fingerprint.png",
      },
    });
    const output = createBuilder(subject);
    input.write({
      assets: {
        "url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url('images/foobar.png')}

        .sample-img2{width:50px;height:50px;background-image:url('./images/baz.png')}
        `,
      },
      "quoted-script-tag.html": `<script src="foo/bar/widget.js"></script>`,
      "unquoted-script-tag.html": `<script src=foo/bar/widget.js></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(images/sample.png)}

      .sample-img2{width:50px;height:50px;background-image:url(./images/sample.png)}
      `,
    });

    await output.build();

    expect(output.changes()).to.deep.equal({
      "assets/": "mkdir",
      "assets/url-in-styles.css": "create",
      "quoted-script-tag.html": "create",
      "unquoted-script-tag.html": "create",
      "unquoted-url-in-styles.css": "create",
    });
    expect(output.read()).to.deep.equal({
      assets: {
        "url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url('images/foobar-fingerprint.png')}

        .sample-img2{width:50px;height:50px;background-image:url('./images/baz-fingerprint.png')}
        `,
      },
      "quoted-script-tag.html": `<script src="blahzorz-1.js"></script>`,
      "unquoted-script-tag.html": `<script src=blahzorz-1.js></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(images/fingerprinted-sample.png)}

      .sample-img2{width:50px;height:50px;background-image:url(./images/fingerprinted-sample.png)}
      `,
    });
  });

  it("rewrites relative urls with prepend", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "foo/bar/widget.js": "blahzorz-1.js",
        "dont/fingerprint/me.js": "dont/fingerprint/me.js",
        "images/sample.png": "images/fingerprinted-sample.png",
        "assets/images/foobar.png": "assets/images/foobar-fingerprint.png",
        "img/saturation.png": "assets/img/saturation-fingerprint.png",
      },
      prepend: "https://cloudfront.net/",
    });
    const output = createBuilder(subject);
    input.write({
      assets: {
        "no-fingerprint.html": `<script src="dont/fingerprint/me.js"></script>`,
        "url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url('images/foobar.png')}

        .sample-img2{width:50px;height:50px;background-image:url('../img/saturation.png')}
        `,
      },
      "quoted-script-tag.html": `<script src="foo/bar/widget.js"></script>`,
      "unquoted-script-tag.html": `<script src=foo/bar/widget.js></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(images/sample.png)}`,
    });

    await output.build();
    expect(output.changes()).to.deep.equal({
      "assets/": "mkdir",
      "assets/no-fingerprint.html": "create",
      "assets/url-in-styles.css": "create",
      "quoted-script-tag.html": "create",
      "unquoted-script-tag.html": "create",
      "unquoted-url-in-styles.css": "create"
    });
    expect(output.read()).to.deep.equal({
      assets: {
        "no-fingerprint.html": `<script src="https://cloudfront.net/dont/fingerprint/me.js"></script>`,
        "url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url('https://cloudfront.net/assets/images/foobar-fingerprint.png')}

        .sample-img2{width:50px;height:50px;background-image:url('https://cloudfront.net/assets/img/saturation-fingerprint.png')}
        `,
      },
      "quoted-script-tag.html": `<script src="https://cloudfront.net/blahzorz-1.js"></script>`,
      "unquoted-script-tag.html": `<script src=https://cloudfront.net/blahzorz-1.js></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(https://cloudfront.net/images/fingerprinted-sample.png)}`,
    });
  });

  it("replaces the correct match for the file extension", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "fonts/roboto-regular.eot": "fonts/roboto-regular-f1.eot",
        "fonts/roboto-regular.woff": "fonts/roboto-regular-f3.woff",
        "fonts/roboto-regular.ttf": "fonts/roboto-regular-f4.ttf",
        "fonts/roboto-regular.svg": "fonts/roboto-regular-f5.svg",
        "fonts/roboto-regular.woff2": "fonts/roboto-regular-f2.woff2",
      },
    });
    const output = createBuilder(subject);
    input.write({
      "styles.css": `@font-face {
        font-family: 'RobotoRegular';
        src: url('fonts/roboto-regular.eot');
        src: url('fonts/roboto-regular.eot?#iefix') format('embedded-opentype'),
          url('fonts/roboto-regular.woff2') format('woff2'),
          url('fonts/roboto-regular.woff') format('woff'),
          url('fonts/roboto-regular.ttf') format('truetype'),
          url('fonts/roboto-regular.svg#robotoregular') format('svg');
        font-weight: normal;
        font-style: normal;
      }
      `,
    });

    await output.build();
    expect(output.changes()).to.deep.equal({
      "styles.css": "create"
    });
    expect(output.read()).to.deep.equal({
      "styles.css": `@font-face {
        font-family: 'RobotoRegular';
        src: url('fonts/roboto-regular-f1.eot');
        src: url('fonts/roboto-regular-f1.eot?#iefix') format('embedded-opentype'),
          url('fonts/roboto-regular-f2.woff2') format('woff2'),
          url('fonts/roboto-regular-f3.woff') format('woff'),
          url('fonts/roboto-regular-f4.ttf') format('truetype'),
          url('fonts/roboto-regular-f5.svg#robotoregular') format('svg');
        font-weight: normal;
        font-style: normal;
      }
      `,
    });
  });

  it("replaces source map URLs", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "the.map": "the-other-map",
        "http://absolute.com/source.map": "http://cdn.absolute.com/other-map",
      },
      replaceExtensions: ["js"],
    });
    const output = createBuilder(subject);
    input.write({
      "abs.js": `(function x(){return 42})//# sourceMappingURL=http://absolute.com/source.map`,
      "sample.js": `(function x(){return 42})//# sourceMappingURL=the.map`,
    });
    await output.build();
    expect(output.changes()).to.deep.equal({
      "abs.js": "create",
      "sample.js": "create",
    });
    expect(output.read()).to.deep.equal({
      "abs.js": `(function x(){return 42})//# sourceMappingURL=http://cdn.absolute.com/other-map`,
      "sample.js": `(function x(){return 42})//# sourceMappingURL=the-other-map`,
    });
  });

  it("replaces source map URLs with prepend", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      replaceExtensions: ["js"],
      assetMap: {
        "the.map": "the-other-map",
        "http://absolute.com/source.map": "http://cdn.absolute.com/other-map",
      },
      prepend: "https://cloudfront.net/",
    });
    const output = createBuilder(subject);
    input.write({
      "abs.js": `(function x(){return 42})//# sourceMappingURL=http://absolute.com/source.map`,
      "sample.js": `(function x(){return 42})//# sourceMappingURL=the.map`,
    });

    await output.build();
    expect(output.changes()).to.deep.equal({
      "abs.js": "create",
      "sample.js": "create"
    });
    expect(output.read()).to.deep.equal({
      "abs.js": `(function x(){return 42})//# sourceMappingURL=http://cdn.absolute.com/other-map`,
      "sample.js": `(function x(){return 42})//# sourceMappingURL=https://cloudfront.net/the-other-map`,
    });
  });

  it("maintains fragments", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "images/defs.svg": "images/fingerprinted-defs.svg",
      },
    });
    const output = createBuilder(subject);
    input.write({
      "svg-tag.html": `<svg><use xlink:href="/images/defs.svg#plus"></use></svg>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(/images/defs.svg#plus)}`,
    });

    await output.build();
    expect(output.changes()).to.deep.equal({
      "svg-tag.html": "create",
      "unquoted-url-in-styles.css": "create"
    });
    expect(output.read()).to.deep.equal({
      "svg-tag.html": `<svg><use xlink:href="/images/fingerprinted-defs.svg#plus"></use></svg>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(/images/fingerprinted-defs.svg#plus)}`,
    });
  });

  it("maintains fragments with prepend", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "images/defs.svg": "images/fingerprinted-defs.svg",
      },
      prepend: "https://cloudfront.net/",
    });
    const output = createBuilder(subject);
    input.write({
      "svg-tag.html": `<svg><use xlink:href="/images/defs.svg#plus"></use></svg>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(/images/defs.svg#plus)}`,
    });

    await output.build();
    expect(output.changes()).to.deep.equal({
      "svg-tag.html": "create",
      "unquoted-url-in-styles.css": "create"
    });
    expect(output.read()).to.deep.equal({
      "svg-tag.html": `<svg><use xlink:href="https://cloudfront.net/images/fingerprinted-defs.svg#plus"></use></svg>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(https://cloudfront.net/images/fingerprinted-defs.svg#plus)}`,
    });
  });

  it("replaces absolute URLs with prepend", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "my-image.png": "my-image-fingerprinted.png",
        "dont/fingerprint/me.js": "dont/fingerprint/me.js",
      },
      prepend: "https://cloudfront.net/",
    });
    const output = createBuilder(subject);
    input.write({
      "img-tag.html": `<img src="/my-image.png">`,
      "no-fingerprint.html": `<script src="dont/fingerprint/me.js"></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(/my-image.png)}`,
    });

    await output.build();
    expect(output.changes()).to.deep.equal({
      "img-tag.html": "create",
      "no-fingerprint.html": "create",
      "unquoted-url-in-styles.css": "create",
    });
    expect(output.read()).to.deep.equal({
      "img-tag.html": `<img src="https://cloudfront.net/my-image-fingerprinted.png">`,
      "no-fingerprint.html": `<script src="https://cloudfront.net/dont/fingerprint/me.js"></script>`,
      "unquoted-url-in-styles.css": `.sample-img{width:50px;height:50px;background-image:url(https://cloudfront.net/my-image-fingerprinted.png)}`,
    });
  });

  it("handles URLs with query parameters in them", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "foo/bar/widget.js": "foo/bar/fingerprinted-widget.js",
        "script-tag-with-query-parameters.html":
          "script-tag-with-query-parameters.html",
      },
    });
    const output = createBuilder(subject);
    input.write({
      "script-tag-with-query-parameters.html": `<script src="foo/bar/widget.js?hello=world"></script>
      <script src="foo/bar/widget.js?hello=world&amp;foo=bar"></script>
      <script src=foo/bar/widget.js?hello=world></script>
      <script src=foo/bar/widget.js?hello=world async></script>
      `,
    });
    await output.build();
    expect(output.changes()).to.deep.equal({
      "script-tag-with-query-parameters.html": "create"
    });
    expect(output.read()).to.deep.equal({
      "script-tag-with-query-parameters.html": `<script src="foo/bar/fingerprinted-widget.js?hello=world"></script>
      <script src="foo/bar/fingerprinted-widget.js?hello=world&amp;foo=bar"></script>
      <script src=foo/bar/fingerprinted-widget.js?hello=world></script>
      <script src=foo/bar/fingerprinted-widget.js?hello=world async></script>
      `,
    });
  });

  it("handles JavaScript files in a reasonable amount of time", async function () {
    this.timeout(500);
    let fixturesPath = `${__dirname}/fixtures`;
    let fixtures = fromDir(fixturesPath);
    const input = await createTempDir();
    input.write(fixtures.read("js-perf/input"));

    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        assetMap: JSON.parse(
          fs.readFileSync(`${fixturesPath}/js-perf/asset-map.json`)
        ),
        replaceExtensions: ["js"],
      },
    });
    const output = createBuilder(subject);
    await output.build();
    expect(output.changes()).to.deep.equal({
      "test-support.js": "create"
    });
    expect(output.read()).to.deep.equal(fixtures.read("js-perf/output"));
  });

  it("ignores JavaScript comments with URLs", async function () {
    const input = await createTempDir();
    const subject = new AssetRewrite(input.path(), {
      assetMap: {
        "the.map": "the-other-map",
        "app.js": "http://cdn.absolute.com/app.js",
      },
      prepend: "/",
    });
    const output = createBuilder(subject);
    input.write({
      "snippet.js": `/**
      here's some code.

      it does things.

      for example:

      \`\`\`app/app.js
      do not rewrite this snippet
      \`\`\`
      */
      (function x() { return true; })
      `,
    });

    await output.build();
    expect(output.changes()).to.deep.equal({
      "snippet.js": "create"
    });
    expect(output.read()).to.deep.equal({
      "snippet.js": `/**
      here's some code.

      it does things.

      for example:

      \`\`\`app/app.js
      do not rewrite this snippet
      \`\`\`
      */
      (function x() { return true; })
      `,
    });
  });

  it('can optionally use caching', async function() {
    this.timeout(500);
    let fixturesPath = `${__dirname}/fixtures`;
    let fixtures = fromDir(fixturesPath);
    const input = await createTempDir();
    input.write(fixtures.read("js-perf/input"));

    const subject = new AssetRewrite(input.path(), {
      assetMap: JSON.parse(
        fs.readFileSync(`${fixturesPath}/js-perf/asset-map.json`)
      ),
      replaceExtensions: ["js"],
      enableCaching: true
    });
    const output = createBuilder(subject);

    await output.build();
    let expectedTestSupportOutput = fs.readFileSync(`${fixturesPath}/js-perf/output/test-support.js`).toString();
    const run1ProcessedCount = subject._debugProcessedCount;
    expect(run1ProcessedCount).to.equal(1);
    expect(output.changes()).to.deep.equal({
      "test-support.js": "create"
    });
    expect(output.read()).to.deep.equal({
      'test-support.js': expectedTestSupportOutput
    });

    await output.build();
    const run2ProcessedCount = subject._debugProcessedCount - run1ProcessedCount;
    expect(output.changes()).to.deep.equal({});
    expect(output.read()).to.deep.equal({
      'test-support.js': expectedTestSupportOutput
    });
    
    expect(run2ProcessedCount).to.equal(0);
  });
});
