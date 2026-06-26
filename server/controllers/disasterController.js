const Disaster = require('../models/Disaster');
const Notification = require('../models/Notification');

const createDisaster = async (req, res) => {
  try {
    const { title, description, type, severity, location, affectedPeople } = req.body;
    const images = req.files ? req.files.map(f => f.path) : [];

    const disaster = await Disaster.create({
      title,
      description,
      type,
      severity,
      location: JSON.parse(location),
      affectedPeople,
      images,
      reportedBy: req.user._id
    });

    await disaster.populate('reportedBy', 'name email');
    res.status(201).json(disaster);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDisasters = async (req, res) => {
  try {
    const { status, severity, type, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (type) query.type = type;
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Disaster.countDocuments(query);
    const disasters = await Disaster.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ disasters, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDisasterById = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedVolunteers');

    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });
    res.json(disaster);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDisasterStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });

    disaster.status = status;
    disaster.updates.push({
      message: message || `Status updated to ${status}`,
      updatedBy: req.user._id
    });

    await disaster.save();
    res.json(disaster);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id);
    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });
    await disaster.deleteOne();
    res.json({ message: 'Disaster removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(disasters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDisaster,
  getDisasters,
  getDisasterById,
  updateDisasterStatus,
  deleteDisaster,
  getMyDisasters
};