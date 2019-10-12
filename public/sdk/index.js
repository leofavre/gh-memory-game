import { STORE_INDEX, GITHUB_API_URL } from '../constants/index.js';

const baseUrl = GITHUB_API_URL;

const getAuth = () => {
  const token = window.localStorage.getItem(STORE_INDEX);
  if (!token) { throw new Error('Missing token'); }
  return { headers: { Authorization: `token ${token}` } };
};

const makeRequest = (...args) => window
  .fetch(...args)
  .then(res => {
    if (res.status >= 400) {
      throw new Error(res);
    }
    return res.json();
  });

export const sdk = {
  github: {
    self: {
      get () {
        return makeRequest(`${baseUrl}user`, getAuth());
      }
    },
    followers: {
      get () {
        return makeRequest(`${baseUrl}user/followers`, getAuth());
      }
    },
    following: {
      get () {
        return makeRequest(`${baseUrl}user/following`, getAuth());
      }
    },
    userEvents: {
      get (login) {
        return makeRequest(`${baseUrl}users/${login}/events`, getAuth());
      }
    }
  }
};
