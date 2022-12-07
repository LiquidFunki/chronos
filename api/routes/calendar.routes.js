const { Router } = require('express');
const { body } = require('express-validator');
const calendarController = require('../controllers/calendar.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = new Router();

router.post(
  '/',
  authMiddleware,
  body('name').trim().isLength({ min: 3, max: 50 }),
  calendarController.createCalendar,
);
router.patch(
  '/:id',
  authMiddleware,
  body('name').trim().isLength({ min: 3, max: 50 }),
  calendarController.updateCalendar,
);
router.get('/', authMiddleware, calendarController.getAllCalendars);
router.get('/main', authMiddleware, calendarController.getMainCalendar);
router.get('/:id', authMiddleware, calendarController.getCalendar);
router.delete('/:id', authMiddleware, calendarController.deleteCalendar);
router.delete('/participant/:id', authMiddleware, calendarController.deleteParticipant);
router.post('/invite/:id', authMiddleware, calendarController.sendInvite);
router.get('/acceptInvite/:key', authMiddleware, calendarController.acceptInvite);

module.exports = router;
