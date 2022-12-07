const bcrypt = require('bcryptjs');

const mailService = require('./mail.service');
const calendarService = require('./calendar.service');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const userDto = require('../utils/userDto');

const { User } = require('../models');

const registration = async (
  email,
  login,
  password,
  repeatedPassword,
  fullName,
  country,
  language,
) => {
  if (password !== repeatedPassword) {
    throw ApiError.BadRequestError('Passwords don\'t match');
  }
  const emailCandidate = await User.findOne({ email });
  if (emailCandidate) {
    throw ApiError.BadRequestError(
      `User with email ${email} is already registered`,
    );
  }
  const loginCandidate = await User.findOne({ login });
  if (loginCandidate) {
    throw ApiError.BadRequestError(
      `User with login ${login} is already registered`,
    );
  }
  const hashPassword = await bcrypt.hash(password, 4);
  const user = await User.create({
    email,
    login,
    password: hashPassword,
    fullName,
    avatar: `https://robohash.org/${login}.png`,
  });
  mailService.sendGreeting(email);
  await calendarService.makeDefaultCalendar(user, country, language);

  const tokens = tokenService.generateTokens(userDto(user));
  await tokenService.saveToken(user.id, tokens.refreshToken);

  return {
    ...tokens,
    ...userDto(user),
  };
};

const authorization = async (login, password) => {
  const user = await User.findOne({ login });
  if (!user) {
    throw ApiError.BadRequestError(`Incorrect login`);
  }
  const isEqualsPswd = await bcrypt.compare(password, user.password);
  if (!isEqualsPswd) {
    throw ApiError.BadRequestError(`Incorrect password`);
  }

  const tokens = tokenService.generateTokens(userDto(user));
  await tokenService.saveToken(user.id, tokens.refreshToken);
  return {
    ...tokens,
    ...userDto(user),
  };
};

const refreshToken = async (Token) => {
  if (!Token) {
    throw ApiError.UnauthorizedError();
  }
  const userInfo = tokenService.validateRefreshToken(Token);
  const tokenFromDB = await tokenService.findToken(Token);
  if (!userInfo || !tokenFromDB) {
    throw ApiError.UnauthorizedError();
  }
  const user = await User.findById(userInfo.id);
  const tokens = tokenService.generateTokens(userDto(user));
  await tokenService.saveToken(
    user.id,
    tokens.refreshToken,
  );

  return {
    ...tokens,
    ...userDto(user),
  };
};

const passwordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.BadRequestError(
      `User with email ${email} is not registered`,
    );
  }
  await mailService.sendPswResetMail(email);
};

const passwordConfirm = async (token, password, repeatedPassword) => {
  const userInfo = tokenService.validateAccessToken(token);
  const user = await User.findOne({ email: userInfo.email });
  if (!user) {
    throw ApiError.BadRequest('No user found');
  }
  if (password !== repeatedPassword) {
    throw ApiError.BadRequest('Passwords do not match');
  }
  const hashPassword = await bcrypt.hash(password, 4);
  user.password = hashPassword;
  await user.save();
};

module.exports = {
  registration,
  authorization,
  refreshToken,
  passwordReset,
  passwordConfirm,
};
