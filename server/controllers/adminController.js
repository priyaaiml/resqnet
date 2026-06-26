const User = require('../models/User');
const Disaster = require('../models/Disaster');
const Volunteer = require('../models/Volunteer');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVolunteers = await Volunteer.countDocuments();
    const totalDisasters = await Disaster.countDocuments();
    const activeDisasters = await Disaster.countDocuments({ status: 'in-progress' });
    const resolvedDisasters = await Disaster.countDocuments({ status: 'resolved' });
    const criticalDisasters = await Disaster.countDocuments({ severity: 'critical' });

    const recentDisasters = await Disaster.find()
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const disastersByType = await Disaster.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const disastersBySeverity = await Disaster.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    const monthlyDisasters = await Disaster.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    res.json({
      totalUsers,
      totalVolunteers,
      totalDisasters,
      activeDisasters,
      resolvedDisasters,
      criticalDisasters,
      recentDisasters,
      disastersByType,
      disastersBySeverity,
      monthlyDisasters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const disaster = await Disaster.findById(req.params.disasterId);
    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });

    if (!disaster.assignedVolunteers.includes(volunteerId)) {
      disaster.assignedVolunteers.push(volunteerId);
      await disaster.save();
    }

    await Volunteer.findByIdAndUpdate(volunteerId, {
      $addToSet: { assignedDisasters: disaster._id },
      availability: 'busy'
    });

    res.json({ message: 'Volunteer assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  assignVolunteer
};