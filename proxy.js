const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

dotenvExpand(dotenv.config())

const express = require("express");
var cors = require('cors')
const app = express();
app.use(cors());
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/detect-hate-speech', createProxyMiddleware({ 
    target: process.env.HATE_SPEECH_DETECTION_URL, //original url
    headers: {
        'token': process.env.HATE_SPEECH_API_KEY
    },
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));
app.listen(process.env.HATE_SPEECH_PROXY_LOCAL_PORT);
