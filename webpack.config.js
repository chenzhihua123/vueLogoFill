/**
 * Created by chenzhihua on 2018-12-25.
 */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    entry:{
        app:'./src/main.js'
    },
    ///输出目录
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].js'
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'index.html', ///生成文件
            title:'vue demo', ///文件标题
            template:'./index.html', ///模板文件
        }),
        new UglifyJsPlugin({
            test: /\.js($|\?)/i,
            sourceMap: false,
            uglifyOptions:{
                compress:true
            }

        }),
        new VueLoaderPlugin()
    ],
    ///模块处理规则定制
    module:{
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test:/\.scss$/,
                loaders:'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    }

    //...
}

if(process.env.NODE_ENV==='development'){
    console.log("开发环境全局变量设置");
    new webpack.LoaderOptionsPlugin({
        minimize: true
    })
}
if (process.env.NODE_ENV === 'production') {

    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),

    ])
}
