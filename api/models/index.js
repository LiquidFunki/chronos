const mongoose = require('mongoose');
const { calendarSchema } = require('./Calendar');
const { eventSchema } = require('./Event');
const { tokenSchema } = require('./Token');
const { userSchema } = require('./User');

const InitDB = async () => {
  await mongoose.connect(process.env.DB_URI).then(() => { console.log('DB connection === OK'); });
};

module.exports.Calendar = mongoose.model('Calendar', calendarSchema, 'calendar');
module.exports.Event = mongoose.model('Event', eventSchema, 'event');
module.exports.Token = mongoose.model('Token', tokenSchema, 'token');
module.exports.User = mongoose.model('User', userSchema, 'user');
module.exports.InitDB = InitDB;
