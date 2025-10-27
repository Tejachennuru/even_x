const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.get('/schedule/stage', eventController.getStageSchedule);

module.exports = router;