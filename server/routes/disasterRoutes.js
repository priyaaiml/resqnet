const express = require('express');
const router = express.Router();
const {
  createDisaster,
  getDisasters,
  getDisasterById,
  updateDisasterStatus,
  deleteDisaster,
  getMyDisasters
} = require('../controllers/disasterController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getDisasters);
router.post('/', protect, upload.array('images', 5), createDisaster);
router.get('/my', protect, getMyDisasters);
router.get('/:id', getDisasterById);
router.put('/:id/status', protect, requireRole('admin', 'volunteer'), updateDisasterStatus);
router.delete('/:id', protect, requireRole('admin'), deleteDisaster);

module.exports = router;