const express = require('express');
const router = express.Router();
const multer = require('multer');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Auth routes
router.post('/login', authController.login);
router.get('/verify', auth, authController.verify);

// Admin event management routes
router.get('/events', auth, eventController.getAllEventsAdmin);
router.post('/events', auth, adminOnly, eventController.createEvent);
router.put('/events/:id', auth, adminOnly, eventController.updateEvent);
router.delete('/events/:id', auth, adminOnly, eventController.deleteEvent);
router.post('/upload', auth, adminOnly, upload.single('image'), eventController.uploadImage);

module.exports = router;