const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const qs = require('querystring');

dotenv.config();

const {
  HOST = 'localhost',
  PORT = 3123,
  OAUTH_HOST,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET
} = process.env;

const BASE_URL = `https://${OAUTH_HOST}`;

app.get('/request-token', (req, res, next) => {
  const params = {
    client_id: OAUTH_CLIENT_ID,
    client_secret: OAUTH_CLIENT_SECRET,
    code: req.query.code
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

app.get('/authorize', (req, res, next) => {
  const params = qs.stringify({
    client_id: OAUTH_CLIENT_ID,
    scope: 'user:email'
  });

  res.redirect(`${BASE_URL}/login/oauth/authorize?${params}`);
});

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
