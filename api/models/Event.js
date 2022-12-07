const mongoose = require('mongoose');

module.exports.eventSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  parentCalendar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar',
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['arrangement', 'reminder', 'task', 'holiday'],
    default: 'task',
  },
  description: String,
  inviteLink: String,
  color: {
    type: String,
    default: '#008000',
  },
  sharedParticipants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  startEvent: {
    type: Date,
    require: true,
  },
  endEvent: {
    type: Date,
    require: true,
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  isPerformed: {
    type: Boolean,
    default: false,
  },
});
