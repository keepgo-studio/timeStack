const path = require("path");

console.log(__dirname);

const common_config = {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /(?<!\.scoped).css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scoped\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: false
            }
          }
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: 'source-map'
}

module.exports = [
  Object.assign({}, common_config, {
    target: 'electron-renderer',
    entry: {
      "timer" : './src/frontend/renderer/timer.renderer.js'
    },
    output: {
      filename: "[name]-bundle.js",
      path: path.resolve(__dirname, "dist")
    }
  }),
  Object.assign({}, common_config, {
    target: 'electron-renderer',
    entry: {
      "dashboard" : './src/frontend/renderer/dashboard.renderer.js'
    },
    output: {
      filename: "[name]-bundle.js",
      path: path.resolve(__dirname, "dist")
    }
  }),
  Object.assign({}, common_config, {
    target: 'node',
    entry: {
      "memo-editor" : './src/frontend/renderer/memo-editor.renderer.js'
    },
    output: {
      filename: "[name]-bundle.js",
      path: path.resolve(__dirname, "dist")
    }
  }),
]