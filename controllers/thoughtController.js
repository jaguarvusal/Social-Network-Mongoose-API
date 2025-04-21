const { Thought, User } = require('../models');

module.exports = {
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getThoughtById(req, res) {
    Thought.findById(req.params.thoughtId)
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'Thought not found' }))
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    const userId = req.body.userId || req.body.userID; // Fallback for case mismatch
    User.findOne({ _id: userId, username: req.body.username }) // Match both userId and username
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return Thought.create({ ...req.body, userId: user._id }) // Create thought
          .then((thought) => {
            return User.findByIdAndUpdate(
              user._id,
              { $push: { thoughts: thought._id } },
              { new: true }
            );
          })
          .then((updatedUser) => res.json(updatedUser))
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true, runValidators: true })
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'Thought not found' }))
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.thoughtId)
      .then((thought) => thought ? res.json({ message: 'Thought deleted' }) : res.status(404).json({ message: 'Thought not found' }))
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'Thought not found' }))
      .catch((err) => res.status(500).json(err));
  },
  removeReaction(req, res) {
    console.log('Thought ID:', req.params.thoughtId); // Debug log
    console.log('Reaction ID:', req.body.reactionId); // Debug log

    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.body.reactionId } } }, // Match reactionId from the body
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          console.log('Thought not found'); // Debug log
          return res.status(404).json({ message: 'Thought not found' });
        }
        console.log('Updated Thought:', thought); // Debug log
        res.json({ message: 'Reaction deleted successfully', thought });
      })
      .catch((err) => {
        console.error(err); // Debug log
        res.status(500).json(err);
      });
  },
};
