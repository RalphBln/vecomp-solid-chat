const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

dotenvExpand(dotenv.config())

const express = require("express");
var cors = require('cors')
const app = express();
app.use(cors());
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/detect-hate-speech', createProxyMiddleware({ 
    target: process.env.HATE_SPEECH_DETECTION_ADDRESS, //original url
    pathRewrite: {'^/detect-hate-speech' : process.env.HATE_SPEECH_DETECTION_PATH},
    headers: {
        'token': process.env.HATE_SPEECH_API_KEY
    },
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));
app.use('/generate-counter-speech', createProxyMiddleware({ 
    target: process.env.HATE_SPEECH_MITIGATION_ADDRESS, //original url
    pathRewrite: {'^/generate-counter-speech' : process.env.HATE_SPEECH_MITIGATION_PATH},
    headers: {
        'token': process.env.HATE_SPEECH_API_KEY
    },
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));
app.use('/legal-and-ethical-check', createProxyMiddleware({ 
    target: process.env.LEGAL_AND_ETHICAL_CHECK_ADDRESS, //original url
    pathRewrite: {'^/legal-and-ethical-check' : process.env.LEGAL_AND_ETHICAL_CHECK_PATH},
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));


app.listen(process.env.REACT_APP_PROXY_PORT);
