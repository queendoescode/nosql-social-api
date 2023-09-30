const { User } = require('../models');

module.exports = {

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error({ message: err });
      return res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId });

      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const userId = req.params.userId;

      const filter = { // Filter: This selects the document we want to update
        _id: userId
      };

      const update = { // Update: Describes the change we want to make
        username: req.body.username,
        email: req.body.email
      };

      const options = { // Options: `new` means return the updated document
        new: true
      };

      const user = await User.findOneAndUpdate(filter, update, options);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      const user = await User.deleteOne({_id: userId});
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) { },

  async removeFriend(req, res) { },
};
