const { validationResult } = require('express-validator');

const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const calendarService = require('../services/calendar.service');
const ApiError = require('../utils/ApiError');
const mailService = require('../services/mail.service');

const createCalendar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequestError('validation error', errors.array()));
    }
    const { name, description, isPublic } = req.body;
    const calendar = await calendarService.createCalendar(req.user.id, {
      author: req.user.id,
      name,
      description,
      isPublic,
      inviteLink: `${process.env.CLIENT_URL}/acceptInvite/calendar/${uuid.v4()}`,
    });
    return res.status(201).json(calendar);
  } catch (err) {
    next(err);
  }
};

const updateCalendar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequestError('validation error', errors.array()));
    }
    const {
      name, description, isHidden, isPublic,
    } = req.body;
    const calendar = await calendarService.updateCalendar(
      req.user.id,
      req.params.id,
      name,
      description,
      isHidden,
      isPublic,
    );

    return res.status(201).json(calendar);
  } catch (err) {
    next(err);
  }
};

const getAllCalendars = async (req, res, next) => {
  try {
    const result = await calendarService.getAllCalendars(req.user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getCalendar = async (req, res, next) => {
  try {
    const result = await calendarService.getCalendarById(
      req.params.id,
      req.user.id,
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getMainCalendar = async (req, res, next) => {
  try {
    const result = await calendarService.getMainCalendar(
      req.user.id,
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteCalendar = async (req, res, next) => {
  try {
    const { id } = req.params;
    await calendarService.deleteCalendar(req.user.id, id);
    res.status(204).json({ message: 'Calendar deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const deleteParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    await calendarService.deleteParticipant(req.user.id, id);
    res.status(204).json({ message: 'Calendar deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const sendInvite = async (req, res, next) => {
  try {
    const token = jwt.sign(
      { from: req.user.id, calendar: req.params.id, to: req.body.participant },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: '7d',
      },
    );
    await mailService.sendInviteCalendar(
      req.body.participant.email,
      token,
      req.user.fullName,
      req.params.id,
    );
    res.status(200).json({ message: 'Invite sent successfully' });
  } catch (err) {
    next(err);
  }
};

const acceptInvite = async (req, res, next) => {
  try {
    const { key } = req.params;
    const link = `${process.env.CLIENT_URL}/acceptInvite/calendar/${key}`;
    const calendar = await calendarService.addParticipant(req.user.id, link);
    res.status(201).json(calendar);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMainCalendar,
  createCalendar,
  updateCalendar,
  getAllCalendars,
  getCalendar,
  deleteCalendar,
  deleteParticipant,
  sendInvite,
  acceptInvite,
};
