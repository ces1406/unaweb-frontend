const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlPlugin = new HtmlWebpackPlugin({
    template:'./static_files/index.html',
    filename:'../dist/index.html'
})
module.exports={
    mode:'development',
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                use:['babel-loader'],
                exclude:/node_modules/,
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/,
                use: ['file-loader']
              }
        ]
    },
    plugins:[HtmlPlugin],
}