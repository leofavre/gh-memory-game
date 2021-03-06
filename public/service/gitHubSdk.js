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

export const gitHubSdk = {
  self: {
    get () {
      return makeRequest(`${baseUrl}user`, getAuth());
    }
  },
  user: {
    get (login) {
      return makeRequest(`${baseUrl}users/${login}`, getAuth());
    }
  },
  userFollowers: {
    get (login) {
      return makeRequest(`${baseUrl}users/${login}/followers`, getAuth());
    }
  },
  userFollowing: {
    get (login) {
      return makeRequest(`${baseUrl}users/${login}/following`, getAuth());
    }
  },
  userEvents: {
    get (login) {
      return makeRequest(`${baseUrl}users/${login}/events`, getAuth());
    }
  },
  userReceivedEvents: {
    get (login) {
      return makeRequest(`${baseUrl}users/${login}/received_events`, getAuth());
    }
  }
};
