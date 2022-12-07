const ApiError = require('../utils/ApiError');

const { User } = require('../models');

const getAllUsers = async () => {
  const users = await User.find()
    .select('id login email avatar fullName');
  if (!users) {
    throw ApiError.NothingFoundError();
  }
  return users;
};

const getUser = async (id) => {
  const user = await User.findById(id)
    .select('id login email avatar fullName createdAt')
    .populate({
      path: 'calendars',
      select: 'name description events participants isPublic',
      match: { isPublic: true },
    });
  if (!user) {
    throw ApiError.NothingFoundError();
  }
  return user;
};

const updateUser = async (data, id) => {
  const user = await User.findById(id);
  if (data.email && user.email !== data.email) {
    const candidate = await User.findOne().where('email').equals(data.email);
    if (candidate) {
      throw ApiError.BadRequestError(
        `User with email ${data.email} is already registered`,
      );
    }
  }
  if (data.login && data.login !== user.login) {
    const candidate = await User.findOne().where('login').equals(data.login);
    if (candidate) {
      throw ApiError.BadRequestError(
        `User with login ${data.login} is already registered`,
      );
    }
  }

  user.email = data.email || user.email;
  user.login = data.login || user.login;
  user.fullName = data.fullName || user.full_name;
  user.avatar = data.avatar || user.avatar;
  await user.save();
  return user;
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
};
