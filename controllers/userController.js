const mongoose = require('mongoose');
const { User, Thought } = require('../models');

module.exports = {
  getAllUsers(req, res) {
    User.find()
      .populate('thoughts')
      .populate('friends')
      .then((users) => res.json(users))
      .catch((err) => {
        console.error(`[ERROR]: Failed to fetch users - ${err.message}`);
        res.status(500).json({ message: 'An error occurred while fetching users', error: err.message });
      });
  },
  getUserById(req, res) {
    // Validate the userId format
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    User.findById(req.params.userId)
      .populate({
        path: 'thoughts',
        select: 'thoughtText', // Include only the thoughtText field
      })
      .populate('friends', 'username') // Populate friends with their usernames
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        console.log('Fetched User:', user); // Debug log
        // Ensure friendCount is calculated safely
        user.friendCount = user.friends?.length || 0;
        res.json(user);
      })
      .catch((err) => {
        console.error(`[ERROR]: Failed to fetch user - ${err.message}`);
        res.status(500).json({
          message: 'An error occurred while fetching the user',
          error: err.message,
        });
      });
  },
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.error(`[ERROR]: Failed to create user - ${err.message}`);
        res.status(500).json({ message: 'An error occurred while creating the user', error: err.message });
      });
  },
  updateUser(req, res) {
    User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(`[ERROR]: Failed to update user - ${err.message}`);
        res.status(500).json({ message: 'An error occurred while updating the user', error: err.message });
      });
  },
  deleteUser(req, res) {
    User.findByIdAndDelete(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => res.json({ message: 'User and associated thoughts deleted' }))
      .catch((err) => {
        console.error(`[ERROR]: Failed to delete user - ${err.message}`);
        res.status(500).json({ message: 'An error occurred while deleting the user', error: err.message });
      });
  },
  addFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .populate('friends', 'username') // Populate friends with their usernames
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(`[ERROR]: Failed to add friend - ${err.message}`);
        res.status(500).json({ message: 'An error occurred while adding the friend', error: err.message });
      });
  },
  removeFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(`[ERROR]: Failed to remove friend - ${err.message}`);
        res.status(500).json({ message: 'An error occurred while removing the friend', error: err.message });
      });
  },
};
