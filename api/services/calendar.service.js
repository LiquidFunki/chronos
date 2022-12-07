const { HolidayAPI } = require('holidayapi');
const mongoose = require('mongoose');

const eventService = require('./event.service');
const ApiError = require('../utils/ApiError');
const holidayDto = require('../utils/holidayDto');

const { Calendar, User, Event } = require('../models');

const createCalendar = async (userId, calendar) => await Calendar.create(calendar)
  .then(async (docCalendar) => {
    await User.findByIdAndUpdate(
      userId,
      { $push: { calendars: docCalendar.id } },
      { new: true, useFindAndModify: false },
    );
    return docCalendar;
  });

const addParticipant = async (userId, link) => {
  const participant = await User.findById(userId);
  if (!participant) {
    throw ApiError.BadRequestError('User is not authorized');
  }
  const candidate = await Calendar.findOne().where('inviteLink').equals(link);
  if (!candidate) {
    throw ApiError.BadRequestError('Wrong link');
  }
  if (candidate.participants.includes(userId)) {
    throw ApiError.BadRequestError('You have already accepted this invitation');
  }
  if (candidate.author.toString() === userId) {
    throw ApiError.BadRequestError('You are already an author');
  }
  const calendar = await Calendar.findByIdAndUpdate(
    candidate.id,
    {
      $push: { participants: userId },
      type: 'shared',
    },
    { new: true, useFindAndModify: false },
  );
  return calendar;
};

const makeDefaultCalendar = async (user, country, language) => {
  const mainCalendar = await createCalendar(user.id, {
    isPublic: false,
    author: user.id,
    name: 'Main calendar',
    type: 'main',
    description:
      'This is the main calendar that displays your national holidays',
  });
  const holidayApi = new HolidayAPI({ key: process.env.HOLIDAY_API_KEY });
  const holidayArr = await holidayApi
    .holidays({
      country,
      language,
      year: '2021',
    })
    .then((response) => holidayDto(response.holidays, user.id));
  holidayArr.forEach((element) => {
    eventService.createEvent(mainCalendar.id, {
      ...element,
      parentCalendar: mainCalendar.id,
      description: 'National holiday',
    });
  });
};

const getCalendarById = async (id, userId) => {
  const calendar = await Calendar.findById(id)
    .populate('events')
    .populate({ path: 'author', select: 'login fullName avatar id' })
    .populate({ path: 'participants', select: 'login fullName avatar id' });
  if (!calendar || (!calendar.isPublic && calendar.author.id !== userId)) {
    return null;
  }
  return calendar;
};

const getMainCalendar = async (userId) => {
  const calendar = await Calendar.findOne()
    .where('author')
    .equals(userId)
    .where('type')
    .equals('main')
    .populate('events')
    .populate({ path: 'author', select: 'login fullName avatar id' })
    .populate({ path: 'participants', select: 'login fullName avatar id' });
  if (!calendar || (!calendar.isPublic && calendar.author.id !== userId)) {
    return null;
  }
  return calendar;
};

const getAllCalendars = async (userId) => {
  const calendar = await Calendar.find({
    $or: [
      { author: mongoose.Types.ObjectId(userId) },
      { participants: mongoose.Types.ObjectId(userId) },
    ],
  });
  return calendar;
};

const updateCalendar = async (
  userId,
  calendarId,
  name,
  description,
  isHidden,
  isPublic,
) => {
  const calendar = await Calendar.findById(calendarId);
  if (!calendar) {
    throw ApiError.BadRequestError('no such calendar found', errors.array());
  }
  if (calendar.author.toString() !== userId) {
    throw ApiError.ForbiddenError();
  }
  calendar.name = name || calendar.name;
  calendar.description = description || calendar.description;
  calendar.isHidden = isHidden;
  calendar.isPublic = isPublic;
  await calendar.save();
  return calendar;
};

const deleteCalendar = async (userId, calendarId) => {
  const calendar = await Calendar.findById(calendarId);
  if (!calendar) {
    throw ApiError.BadRequestError('Calendar does not exist');
  }
  if (calendar.author.toString() !== userId) {
    throw ApiError.ForbiddenError();
  }
  await Event.deleteMany({ parentCalendar: calendar.id });
  calendar.delete();
};

const deleteParticipant = async (userId, calendarId) => {
  const calendar = await Calendar.findById(calendarId);
  if (!calendar) {
    throw ApiError.BadRequestError('Calendar does not exist');
  }
  calendar.participants = calendar.participants.filter(
    (participant) => participant.toString() !== userId,
  );
  await calendar.save();
};

module.exports = {
  makeDefaultCalendar,
  getMainCalendar,
  getCalendarById,
  getAllCalendars,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  addParticipant,
  deleteParticipant,
};
