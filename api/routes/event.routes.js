const { Router } = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post(
  '/:calendarId',
  authMiddleware,
  body('name').trim().isLength({ min: 3, max: 30 }),
  eventController.createEvent,
);
router.patch('/:id', authMiddleware, eventController.updateEvent);
router.get('/today', authMiddleware, eventController.getTodayEvents);
router.get('/calendar/:calendarId', authMiddleware, eventController.getAllEvents);
router.get('/:id', authMiddleware, eventController.getEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);
router.post('/invite/:id', authMiddleware, eventController.sendInvite);
router.get('/acceptInvite/:key', authMiddleware, eventController.acceptInvite);

module.exports = router;
