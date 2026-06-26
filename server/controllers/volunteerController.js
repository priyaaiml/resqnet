const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

const registerVolunteer = async (req, res) => {
  try {
    const existing = await Volunteer.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already registered as volunteer' });

    const { skills, bio, location } = req.body;
    const volunteer = await Volunteer.create({
      user: req.user._id,
      skills,
      bio,
      location
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'volunteer' });
    await volunteer.populate('user', 'name email');
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVolunteers = async (req, res) => {
  try {
    const { availability, skills } = req.query;
    const query = {};

    if (availability) query.availability = availability;
    if (skills) query.skills = { $in: skills.split(',') };

    const volunteers = await Volunteer.find(query)
      .populate('user', 'name email location')
      .sort({ createdAt: -1 });

    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOneAndUpdate(
      { user: req.user._id },
      { availability: req.body.availability },
      { new: true }
    ).populate('user', 'name email');

    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyVolunteerProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user._id })
      .populate('user', 'name email')
      .populate('assignedDisasters');

    if (!volunteer) return res.status(404).json({ message: 'Volunteer profile not found' });
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerVolunteer,
  getVolunteers,
  updateAvailability,
  getMyVolunteerProfile
};