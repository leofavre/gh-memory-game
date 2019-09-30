const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const qs = require('querystring');

dotenv.config();

const {
  SERVER_HOST = 'localhost',
  SERVER_PORT = 3123,
  OAUTH_HOST = 'github.com',
  OAUTH_PORT = 443,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET
} = process.env;

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/authenticate/:code', (req, res, next) => {
  axios
    .post(`https://${OAUTH_HOST}:${OAUTH_PORT}/login/oauth/access_token?${
      qs.stringify({
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        code: req.params.code
      })
    }`)
    .then(({ data }) => {
      res.json({ token: qs.parse(data).access_token });
    })
    .catch(next);
});

app.get('/login', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?${
    qs.stringify({
      client_id: OAUTH_CLIENT_ID,
      scope: 'user:email'
    })
  }`);
});

app.get('/oauth', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.use(express.static('public'));

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Listening on ${SERVER_HOST}:${SERVER_PORT}`);
});
