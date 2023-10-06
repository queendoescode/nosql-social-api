const { Thought, User } = require('../models');

module.exports = {

  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.error({ message: err });
      return res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      // Note that getters must be enabled so that createdAt
      // will be properly formatted as a date.

      !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought.toJSON({ getters: true }));
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a new thought
  async createThought(req, res) {
    try {
      const userId = req.body.userId;

      const user = await User.findById(userId);

      if (user) {
        const thought = await Thought.create(req.body);

        // Add the thought ID to the user document's thoughts array.

        await User.findOneAndUpdate(
          { 
            _id: userId
          },
          {
            $addToSet: {
              thoughts: thought._id
            }
          }
        );
        
        res.json(thought);
      } else {
        res.status(400).json('This user does not exist.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const thoughtId = req.params.thoughtId;

      const thought = await Thought.findOneAndUpdate(
        { 
          _id: thoughtId
        },
        {
          thoughtText: req.body.thoughtText
        },
        {
          new: true
        }
      );

      if (thought) {
        res.json(thought);
      } else {
        res.status(404).json("There is no thought with that ID");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const thoughtId = req.params.thoughtId;

      const result = await Thought.deleteOne(
        {
          _id: thoughtId
        }
      );

      if (result.deletedCount === 0) {
        res.status(404).json("This thought was not found");
      } else {
        res.json(result);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  async addReaction(req, res) { 
    try {
      const thoughtId = req.params.thoughtId;

      const thought = await Thought.findOneAndUpdate(
        { 
          _id: thoughtId
        },
        {
          $push: {
            reactions: req.body
          }
        },
        {
          new: true
        }
      );

      if (thought) {
        res.json(thought);
      } else {
        res.status(404).json('There is no thought with that ID');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  async removeReaction(req, res) { 
    try {
      const thoughtId = req.params.thoughtId;
      const reactionId = req.params.reactionId;

      // To check whether the reaction ID is valid,
      // we need to fetch the thought before updating.

      const thoughtBeforeUpdate = await Thought.findById(thoughtId);

      if (thoughtBeforeUpdate) {
        // Search the reactions array for a reaction matching the reaction ID.
        const findReaction = thoughtBeforeUpdate.reactions
          .find(reaction => reaction.reactionId.equals(reactionId));

        if (findReaction) {
          const thoughtAfterUpdate = await Thought.findOneAndUpdate(
            { 
              _id: thoughtId
            },
            {
              $pull: {
                reactions: {
                  reactionId: reactionId
                }
              }
            },
            {
              new: true
            }
          );

          res.json(thoughtAfterUpdate);
        } else {
          res.status(404).json('There is no reaction with that ID');
        }
      } else {
        res.status(404).json('There is no thought with that ID');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
