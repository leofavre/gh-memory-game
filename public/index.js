const STORE_INDEX = 'MemoGameGitHubToken';

const getAuthHeaders = token => ({
  headers: { Authorization: `token ${token}` }
});

(async () => {
  let token = window.localStorage.getItem(STORE_INDEX);
  const [, code] = window.location.href.match(/\?code=(.*)/) || [];

  if (token == null) {
    if (code != null) {
      const authUrl = `http://localhost:3123/authenticate/${code}`;
      ({ token } = await window.fetch(authUrl).then(res => res.json()));

      if (token != null) {
        window.localStorage.setItem(STORE_INDEX, token);
        window.location.href = '/';
      }
    } else {
      document.body.innerHTML = '<a href="/login">Login with GitHub</a>';
    }
    return undefined;
  }

  window
    .fetch('https://api.github.com/user', getAuthHeaders(token))
    .then(res => res.json())
    .then(res => {
      document.body.innerHTML = `<pre>${
        JSON.stringify(res, null, 2)
      }</pre>`;
    });
})();
