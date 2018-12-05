const dotenv = require('dotenv-extended');
const getenv = require('getenv');

dotenv.config({ path: './.env.local' });
dotenv.load();

const overrideEnvVars = config => {
  const backendUrl = getenv.string('REACT_APP_CYPRESS_backendUrl', '');
  const username = getenv.string('REACT_APP_CYPRESS_username', '');
  const password = getenv.string('REACT_APP_CYPRESS_password', '');
  const deleteUsername = getenv.string('REACT_APP_CYPRESS_deleteUsername', '');
  const deletePassword = getenv.string('REACT_APP_CYPRESS_deletePassword', '');
  if (backendUrl !== '') config.env.backendUrl = backendUrl;
  if (username !== '') config.env.username = username;
  if (password !== '') config.env.password = password;
  if (deleteUsername !== '') config.env.deleteUsername = deleteUsername;
  if (deletePassword !== '') config.env.deletePassword = deletePassword;
  return config;
};

module.exports = (on, config) => {
  return overrideEnvVars(config);
};
