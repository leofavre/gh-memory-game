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
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET
} = process.env;

const BASE_URL = `https://${OAUTH_HOST}`;

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', BASE_URL);
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/authenticate/:code', (req, res, next) => {
  const params = {
    client_id: OAUTH_CLIENT_ID,
    client_secret: OAUTH_CLIENT_SECRET,
    code: req.params.code
  };

  axios({
    method: 'post',
    url: `${BASE_URL}/login/oauth/access_token`,
    params
  })
    .then(({ data }) => {
      res.json({ token: qs.parse(data).access_token });
    })
    .catch(next);
});

app.get('/auth', (req, res, next) => {
  const params = qs.stringify({
    client_id: OAUTH_CLIENT_ID,
    scope: 'user:email'
  });

  res
    .redirect(`${BASE_URL}/login/oauth/authorize?${params}`)
    .catch(next);
});

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Listening on ${SERVER_HOST}:${SERVER_PORT}`);
});
