# webpack-zip-files-plugin
Webpack Zip Multiple Files &amp; Folders or  create archives of emitted files.

# Installation
```
npm install --save-dev webpack-archive-plugin
```
Fill free to use `yarn`

# Usage
`webpack.config.js`

```
const ZipFilesPlugin = require('webpack-zip-files-plugin');

module.exports = {
  // ... Configurations
  output: {
    path: __dirname + '/dist',
  },
  plugins: [
    // ... Other Plugins
    new ZipFilesPlugin({
      entries: [
        { src: path.join(__dirname, './server/locales'), dist: 'server/locales' },
        { src: path.join(__dirname, './server/public'), dist: 'server/public' },
        { src: path.join(__dirname, './server/views'), dist: 'server/views' },
        { src: path.join(__dirname, './server/bundle.js'), dist: 'server/bundle.js' },
        { src: path.join(__dirname, './package.json'), dist: 'package.json' },
        { src: path.join(__dirname, './config.js'), dist: 'config.js' },
      ],
      output: path.join(__dirname, './dist/file_name_without_ext'),
      format: 'tar',
    }),
  ],
}
```

Will create archive in the same directory as `output.path` (`__dirname` in the example), `${output.path}.tar.gz` containing all entries that mentioned.

If there is no `entries` property, the plugin will create all compiled assets.

# Options
You can pass options when constructing new plugin like the example above.

- `entries`: `Array` -> Array of entry ({src: 'source directory or file', dist: 'Ouput directory or file'})
- `output`: `String` -> `directory/filename_without_ext`
- `format`: `String` -> E
- `ext`: `String` -> A different extension to use instead of `tar.gz` or `zip` (without leading .)

# License
MIT License.
Please refer to `LICENSE` file.
