const path = require("path");
const { glob } = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = (env) => {
  // entry names

  let entries = glob.sync(__dirname + "/src/pages/**/*.js", { withFileTypes: true })
    .map((e) => e.name.match(/(.*)\.(.+)$/)[1]);

  // create value of webpack's entry option

  function createEntry(entryNames) {
    function createPaths(entryName) {
      const jsPath = `./src/pages/${entryName}/${entryName}.js`;
      const scssPath = `./src/pages/${entryName}/${entryName}.scss`;

      return [jsPath, scssPath]
    }

    const entry = {};

    for (let entryName of entryNames) {
      entry[entryName] = createPaths(entryName);
    }

    return entry;
  }

  // create HTMLWebpackPlugin instance for every entry

  const pages = entries.map((entry) => {
    return new HtmlWebpackPlugin({
      filename: path.resolve(__dirname + `/dist/${entry}.html`),
      template: `src/pages/${entry}/${entry}.pug`,
      chunks: [entry],
    })
  })

  const isProd = env.production;

  const jsFilename = isProd ? "[name].[fullhash].bundle.js" : "[name].bundle.js";
  const assetsFilename = isProd ? "[hash][ext][query]" : "[name][ext]";

  const mode = isProd ? "production" : "development";

  const entry = createEntry(entries);

  const output = {
    filename: jsFilename,
    path: path.resolve(__dirname + "/dist/scripts"),
  };

  const devtool = !isProd ? "eval-source-map" : false;

  const module = {
    rules: [
      {
        test: /\.pug$/i,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: isProd,
            },
          },
          'pug-html-loader'
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: !isProd,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: !isProd,
              postcssOptions: {
                plugins: isProd ? ["autoprefixer"] : [],
              }
            }
          },
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: `../assets/images/${assetsFilename}`,
        },
        use: isProd ? ['image-webpack-loader'] : [],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `../assets/fonts/${assetsFilename}`,
        }
      },
    ],
  };
  if (isProd) {
    module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { "useBuiltIns": "usage", "corejs": "3.31" }],
          ]
        }
      }
    })
  }

  const plugins = [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "dist")],
      dry: true,
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    new FaviconsWebpackPlugin({
      logo: "./src/assets/favicons/favicon.png",
      outputPath: path.resolve(__dirname + "/dist/assets/favicons"),
      prefix: '../assets/favicons/',
      inject: true,
      favicons: {
        icons: {
          yandex: false
        }
      }
    }),
    new MiniCssExtractPlugin({
      filename: "../styles/[name].[fullhash].bundle.css",
    }),
  ];

  plugins.push(...pages);

  const optimization = { minimizer: ["..."] };
  if (isProd) optimization.minimizer.push(new CssMinimizerPlugin());

  return {
    mode,
    entry,
    output,
    devtool,
    module,
    plugins,
    optimization,
  }

};