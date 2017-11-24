var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin')
var config = require("./config")
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var webpackConfig = {
    plugins: [
        //压缩js代码
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: config.utils_paths.src('index.html'),
            favicon: config.utils_paths.src('static/favicon.ico'),
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            },
            projectPath: `http://${config.server_host}:${config.server_port}/`
        }),
        new ExtractTextPlugin(`[name].[hash].css`), //css 分离打包
        //配合UglifyJsPlugin，否则会提示warning
        new webpack.DefinePlugin(config.globals),//实现全代码替换字段
    ],
    entry: {
        "main": config.utils_paths.src('main.js'),
        //入口文件的作用是进行页面的初始化，比如一些事件绑定，初始数据加载都是放在这里的。每个页面都可以有一个入口文件
    },
    output: {
        path: config.utils_paths.dist(""),
        filename: '[name].[hash].js',
        publicPath: config.compiler_public_path
    },
    resolve: {
      modules: [config.utils_paths.src(""), "node_modules"],
        extensions: ['.js', '.jsx', '.json']
    },
    devServer: {
        hot: true,
        inline: true,
        port: config.server_port,
    },
    devtool: config.devtool,
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            // query: {//这些在。babelrc中已经添加
            //     presets: ['es2015', "react", 'stage-0'],
            //     plugins: ['transform-decorators-legacy'] //使可以用@的修饰符号 来把redux connect 到view上面
            // }
        }, {
            test: /\.[s]?css$/,
            loaders: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: `css-loader?sourceMap&modules&localIdentName=[name]__[local]_[hash:base64:5]!postcss-loader!sass-loader`
                }) //注意sass-loader依赖node-sass所以必须装node-sass
        }]
    },
    // postcss: [cssnano]
}
if (config.dev) {} else {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }))
}

module.exports = webpackConfig
