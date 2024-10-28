const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const Image = require('@11ty/eleventy-img');
const path = require("node:path");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
        "dd LLL yyyy"
    );
  });

  eleventyConfig.addAsyncShortcode("image", async (srcFilePath, alt, className = "", widths = [400, 800, 1600],sizes = "100vh") => {
    // Make the image relative to the input directory
    let inputFilePath = path.join(eleventyConfig.dir.input, srcFilePath);
    let fileExtension = inputFilePath.slice(inputFilePath.lastIndexOf("."));
    let formats = ["avif", "webp", "svg", "jpeg"];

    if (fileExtension === ".png") {
      formats = ["avif", "webp", "svg"];
    }

    let metadata = await Image(inputFilePath, {
      widths: widths,
      formats: formats,
      outputDir: "./_site/optimized/",
      urlPath: "/optimized/",
      svgShortCiruit: "size",
      // svgCompressionSize: "br",
    });

    let imageAttributes = {
      alt,
      sizes,
      class: className,
      loading: "lazy",
      decoding: "async"
    }

    return Image.generateHTML(metadata, imageAttributes)
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
    "./node_modules/@splidejs/splide/dist/js/splide.min.js": "./static/js/splide.js",
    "./node_modules/@splidejs/splide-extension-intersection/dist/js/splide-extension-intersection.js": "./static/js/splide-extension-intersection.js",
    "./src/static/js/app.js": "./static/js/app.js",
  });

  // Copy Image Folder to /_site
  // eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
