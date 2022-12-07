export const usersToSelect = (users) => users
  .map((user) => ({ value: user.login, label: user.login }));
