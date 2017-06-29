'use strict';

const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

function WebpackZipFilesPlugin(options) {
  options = options || {};
  if (typeof options === 'string') {
    this.options = { output: options };
  } else {
    this.options = options;
  }
}

WebpackZipFilesPlugin.prototype.apply = function (compiler) {
  const options = this.options;

  compiler.plugin('after-emit', function (compiler, callback) {
    // Set output location
    const output = options.output ?
      options.output : compiler.options.output.path;

    // Create archive stream
    let archive;
    let zip = true;
    let tar = true;
    if (options.format) {
      if (typeof options.format === 'string') {
        zip = (options.format === 'zip');
        tar = (options.format === 'tar');
      } else if (Array.isArray(options.format)) {
        // Support later
        zip = (options.format.indexOf('zip') != -1);
        tar = (options.format.indexOf('tar') != -1);
      }
    }
    if (zip) {
      const ext = options.ext || 'zip'
      archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });
      archive.pipe(fs.createWriteStream(`${output}.${ext}`));
    } else if (tar) {
      const ext = options.ext || 'tar.gz'
      archive = archiver('tar', {
        gzip: true,
        gzipOptions: {
          level: 1
        }
      });
      archive.pipe(fs.createWriteStream(`${output}.${ext}`));
    }

    if (options.entries) {
      for (let e of options.entries) {
        if (!e.src)
          throw new Error(`${e} has no src property.`);
        let fObj = fs.statSync(e.src);
        if (fObj.isFile()) {
          archive.file(e.src, { name: e.dist || path.basename(e.src) });
        } else {
          if (!e.dist)
            throw new Error(`${e} has no dist property.`);
          archive.directory(e.src, e.dist);
        }
      }
    } else {
      for (let asset in compiler.assets) {
        if (compiler.assets.hasOwnProperty(asset)) {
          archive.append(fs.createReadStream(compiler.assets[asset].existsAt), { name: asset });
        }
      }
    }
    archive.finalize();

    callback();
  });
}

module.exports = WebpackZipFilesPlugin;
