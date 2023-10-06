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
    log: [{type: mongoose.Schema.ObjectId, ref: 'Exercise'}]
  })

  let User = mongoose.model('User', userSchema);
  let Exercise = mongoose.model('Exercise', exerciseSchema);

async function createNewUser(username) {
    const newUser = new User({
        username: username,
        log: [],
    });

    try {
        const result = await newUser.save();
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
    };
  };

  async function getAllUsers() {
    const result = await User.find().select({username: true, _id: true})
    return result;
  }

  async function findUser(id) {
    const result = await User.findById(id);
    return result;
  }


  // Jane Doe - 651f886d405abdc770902204

  async function addExercise(workout) {
    const userId = workout.user.toString();

    try {
        const newWorkout = await workout.save();
        const matchingUser = await findUser(userId);
        matchingUser.log.push(newWorkout);
        const result = await matchingUser.save();
        return result;
    } catch (error) {
        console.error('Error creating exercise:',error);
    }
  }

  async function findExercise(id) {
    const result = await Exercise.findById(id).select({description: true, duration: true, date: true});
    return result;
  }

  async function getUserExercises(userId, from, to, limit) {
    console.log('from:', from, 'to:', to);
    const result = await Exercise
        .find({ 
            user: userId,
            $where: date
             })
        .select({description: true, duration: true, date: true, _id: false})
        .limit(limit)

    return result;
  }




  exports.User = User;
  exports.Exercise = Exercise;
  exports.createNewUser = createNewUser;
  exports.getAllUsers = getAllUsers;
  exports.addExercise = addExercise;
  exports.findExercise = findExercise;
  exports.findUser = findUser;
  exports.getUserExercises = getUserExercises;