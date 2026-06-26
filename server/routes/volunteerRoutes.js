const express = require('express');
const router = express.Router();
const {
  registerVolunteer,
  getVolunteers,
  updateAvailability,
  getMyVolunteerProfile
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', protect, getVolunteers);
router.post('/register', protect, registerVolunteer);
router.get('/me', protect, requireRole('volunteer', 'admin'), getMyVolunteerProfile);
router.put('/availability', protect, requireRole('volunteer', 'admin'), updateAvailability);

module.exports = router;