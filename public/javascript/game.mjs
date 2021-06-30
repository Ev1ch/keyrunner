const username = sessionStorage.getItem('username');

if (!username) {
  window.location.replace('/login');
}

const loginSocket = io('/login', { query: { username } });

loginSocket.on('USER_EXISTS', () => {
  alert('User with such a name already exists');
  sessionStorage.removeItem('username');
  window.location.replace('/login');
});
