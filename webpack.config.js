const path = require('path')
const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlPlugin = new HtmlWebpackPlugin({
    template:'./static_files/index.html',
    filename:'../dist/index.html'
})
module.exports={
    mode:'development',
    output: {
      filename: "app.js",
      hashFunction: "sha256",
      path: path.resolve(__dirname, "dist")
    },
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