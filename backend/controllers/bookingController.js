const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const createBooking = asyncHandler(async (req, res) => {
  const { expertId, scheduledAt, durationMinutes, notes } = req.body;

  const expert = await Expert.findById(expertId);
  if (!expert || !expert.active) throw new ApiError(404, 'Expert not found');

  const booking = await Booking.create({
    user: req.user._id,
    expert: expert._id,
    scheduledAt: new Date(scheduledAt),
    durationMinutes: durationMinutes || 30,
    notes,
  });

  res.status(201).json(booking);
});

const listMyBookings = asyncHandler(async (req, res) => {
  const rows = await Booking.find({ user: req.user._id }).populate({ path: 'expert', populate: { path: 'user', select: 'fullName email' } });
  res.json(rows);
});

const listExpertBookings = asyncHandler(async (req, res) => {
  const expert = await Expert.findOne({ user: req.user._id });
  if (!expert) throw new ApiError(404, 'Expert profile not found');

  const rows = await Booking.find({ expert: expert._id }).populate('user', 'fullName email');
  res.json(rows);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  // User can cancel own booking; expert can confirm/complete/cancel for their bookings.
  const isOwner = String(booking.user) === String(req.user._id);
  const expert = await Expert.findOne({ user: req.user._id });
  const isExpertForBooking = expert && String(booking.expert) === String(expert._id);

  if (!isOwner && !isExpertForBooking && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');

  booking.status = status;
  await booking.save();
  res.json(booking);
});

module.exports = { createBooking, listMyBookings, listExpertBookings, updateBookingStatus };
