// data/users.js
const users = {};

module.exports = {
  initUser: (id) => {
    if (!users[id]) {
      users[id] = {
        filters: {},
      };
    }
  },
  set: (id, key, value) => {
    if (!users[id]) module.exports.initUser(id);
    users[id].filters[key] = value;
  },
  getFilters: (id) => users[id]?.filters || {},
  getAllUsers: () => Object.keys(users),
};