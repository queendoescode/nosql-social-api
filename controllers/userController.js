const { User, Thought } = require('../models');

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
      const user = await User.findOne({ _id: req.params.userId })
        .populate(['thoughts', 'friends']);

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
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'No user with that ID' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId);

      if (user) {
        // In order to delete all thoughts created by this user,
        // we will search for thoughts with username property 
        // matching the user's username.

        await Thought.deleteMany(
          {
            username: user.username
          }
        );

        const result = await User.deleteOne({_id: userId});
        res.json(result);
      } else {
        res.status(404).json('No such user exists');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) { 
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      const user = await User.findOneAndUpdate(
        { 
          _id: userId
        },
        {
          $addToSet: {
            friends: friendId
          }
        },
        {
          new: true
        }
      );

      if (user) {
        res.json(user);
      } else {
        res.status(404).json('There is no user with that ID');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeFriend(req, res) { 
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      const user = await User.findOneAndUpdate(
        { 
          _id: userId
        },
        {
          $pull: {
            friends: friendId
          }
        },
        {
          new: true
        }
      );

      if (user) {
        res.json(user);
      } else {
        res.status(404).json('There is no user with that ID');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
