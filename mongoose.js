const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

const exerciseSchema = new mongoose.Schema({
    description: String,
    duration: Number,
    date: String,
    user: {
      type: mongoose.Schema.ObjectId, 
      ref: 'User'
    }
  })
  
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0,
    },
    log: [{type: mongoose.Schema.ObjectId, ref: 'Exercise'}]
  })

  let User = mongoose.model('User', userSchema);
  let Exercise = mongoose.model('Exercise', exerciseSchema);

async function createNewUser(username) {
    const newUser = new User({
        username: username,
        count: 0,
        log: [],
    });

    try {
        const result = await newUser.save();
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
    }

    
  }







  exports.User = User;
  exports.Exercise = Exercise;
  exports.createNewUser = createNewUser;