const mongoose = require('mongoose');
const { Calendar, Event, User } = require('../models');
const ApiError = require('../utils/ApiError');

const createEvent = async (calendarId, event) => {
  const calendar = await Calendar.findById(calendarId);
  if (!calendar) {
    throw ApiError.BadRequestError('no such calendar found');
  }
  const createdEvent = await Event.create(event).then(async (docEvent) => {
    await Calendar.findByIdAndUpdate(
      calendarId,
      { $push: { events: docEvent.id } },
      { new: true, useFindAndModify: false },
    );
    return docEvent;
  });
  return createdEvent;
};

const updateEvent = async (
  authorId,
  eventId,
  name,
  type,
  description,
  color,
  startEvent,
  endEvent,
  isPerformed,
  allDay = false,
) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.BadRequestError('no such event found');
  }
  if (event.type === 'holiday') {
    throw ApiError.BadRequestError('holiday events cannot be changed');
  }
  if (event.author.toString() !== authorId) {
    throw ApiError.ForbiddenError();
  }
  event.name = name || event.name;
  event.description = description || event.description;
  event.type = type || event.type;
  event.color = color || event.color;
  event.startEvent = startEvent || event.startEvent;
  event.endEvent = endEvent || event.endEvent;
  event.isPerformed = isPerformed;
  event.allDay = allDay;
  await event.save();
  return event;
};

const getAllEvents = async (calendarId, userId) => {
  const calendar = await Calendar.findById(calendarId);
  if (calendar.type === 'main') {
    const events = await Event.find({
      $or: [
        { parentCalendar: mongoose.Types.ObjectId(calendar.id) },
        { sharedParticipants: mongoose.Types.ObjectId(userId) },
      ],
    }).populate({ path: 'sharedParticipants', select: 'login fullName avatar id' });

    return events;
  }
  const events = await Event.find().where('parentCalendar').equals(calendarId);
  return events;
};

const getTodayEvents = async (userId) => {
  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const events = await Event.find({
    startEvent: {
      $gte: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate(),
      ),
      $lt: new Date(
        tomorrowDate.getUTCFullYear(),
        tomorrowDate.getUTCMonth(),
        tomorrowDate.getUTCDate(),
      ),
    },
  })
    .where('author')
    .equals(userId)
    .populate({ path: 'parentCalendar', select: 'id name' });
  if (!events) {
    throw ApiError.NothingFoundError('no events found');
  }
  return events;
};

const getEventById = async (id, userId) => {
  const event = await Event.findById(id)
    .populate({
      path: 'sharedParticipants',
      select: 'login fullName avatar id',
    })
    .populate({
      path: 'author',
      select: 'login fullName avatar id',
    });
  if (!event) {
    return null;
  }
  return event;
};

const addParticipant = async (userId, link) => {
  const participant = await User.findById(userId);
  if (!participant) {
    throw ApiError.BadRequestError('User is not authorized');
  }
  const candidate = await Event.findOne().where('inviteLink').equals(link);
  if (!candidate) {
    throw ApiError.BadRequestError('Wrong link');
  }
  if (candidate.sharedParticipants.includes(userId)) {
    throw ApiError.BadRequestError('You have already accepted this invitation');
  }
  if (candidate.author.toString() === userId) {
    throw ApiError.BadRequestError('You are already an author');
  }
  const calendar = await Calendar.findOne()
    .where('author')
    .equals(userId)
    .where('type')
    .equals('main');
  const event = await Event.findByIdAndUpdate(
    candidate.id,
    {
      $push: { sharedParticipants: userId },
    },
    { new: true, useFindAndModify: false },
  );
  await Calendar.findByIdAndUpdate(
    calendar.id,
    { $push: { events: event.id } },
    { new: true, useFindAndModify: false },
  );
  return event;
};

const deleteEvent = async (userId, eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.BadRequestError('Event does not exist');
  }
  if (event.author.toString() !== userId) {
    throw ApiError.ForbiddenError();
  }
  event.delete();
};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
  getTodayEvents,
  getEventById,
  deleteEvent,
  addParticipant,
};
